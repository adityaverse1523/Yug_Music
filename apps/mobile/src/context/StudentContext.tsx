import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Student,
  ClassSchedule,
  AcademyNotification,
  StudyMaterial,
  PracticeSubmission,
  AttendanceRecord,
  DEFAULT_STUDY_MATERIALS,
  InstrumentType,
  SkillLevel,
} from '@yug/shared';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Pre-seeded Demo Students for fallback & offline testing
export const DEMO_STUDENTS: Student[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+91 98765 43210',
    instrument: 'Guitar',
    skill_level: 'Beginner',
    batch_name: 'Acoustic Guitar - Beginners',
    join_date: '2026-01-15',
    status: 'active',
    fee_status: 'paid',
    notes: 'Quick learner, practicing fingerstyle & basic open chords',
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Ananya Verma',
    email: 'ananya.v@example.com',
    phone: '+91 98765 43211',
    instrument: 'Singing / Vocal',
    skill_level: 'Intermediate',
    batch_name: 'Morning Riyaaz (Vocal & Harmonium)',
    join_date: '2026-01-20',
    status: 'active',
    fee_status: 'paid',
    notes: 'Classical Raag Bhairav & breathing control',
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'Rohan Mehta',
    email: 'rohan.piano@example.com',
    phone: '+91 98765 43212',
    instrument: 'Piano',
    skill_level: 'Advanced',
    batch_name: 'Classical Piano & Keyboard',
    join_date: '2025-11-10',
    status: 'active',
    fee_status: 'paid',
    notes: 'Prepping for Trinity Grade 5 examination',
  },
];

interface StudentContextType {
  currentStudent: Student | null;
  isLoggedIn: boolean;
  loginWithEmail: (email: string) => Promise<{ success: boolean; message: string; student?: Student }>;
  applyForAdmission: (applicationData: {
    name: string;
    email: string;
    phone: string;
    instrument: InstrumentType;
    batch_name: string;
    skill_level: SkillLevel;
    notes?: string;
  }) => Promise<{ success: boolean; message: string; student?: Student }>;
  logout: () => void;
  refreshStudentStatus: () => Promise<void>;
  switchStudent: (studentId: string) => void;
  schedules: ClassSchedule[];
  notifications: AcademyNotification[];
  materials: StudyMaterial[];
  mySubmissions: PracticeSubmission[];
  myAttendance: AttendanceRecord[];
  submitPractice: (title: string, audioBlobUrl: string, notes?: string) => Promise<void>;
  readNotifs: Set<string>;
  markNotifAsRead: (id: string) => void;
  isLiveSupabase: boolean;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Read stored student or null
  const [currentStudent, setCurrentStudent] = useState<Student | null>(() => {
    const saved = localStorage.getItem('yug_current_student');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    // Default to Aarav if no prior state, or null if auth-required
    return DEMO_STUDENTS[0];
  });

  // Read schedules from shared storage or fallback
  const [schedules, setSchedules] = useState<ClassSchedule[]>(() => {
    const saved = localStorage.getItem('yug_schedules_v1');
    return saved ? JSON.parse(saved) : [];
  });

  // Read notifications from shared storage
  const [notifications, setNotifications] = useState<AcademyNotification[]>(() => {
    const saved = localStorage.getItem('yug_notifications_v1');
    return saved ? JSON.parse(saved) : [];
  });

  // Read materials
  const [materials, setMaterials] = useState<StudyMaterial[]>(() => {
    const saved = localStorage.getItem('yug_materials_v1');
    const parsed = saved ? JSON.parse(saved) : [];
    return parsed.length >= DEFAULT_STUDY_MATERIALS.length ? parsed : DEFAULT_STUDY_MATERIALS;
  });

  // Read submissions
  const [allSubmissions, setAllSubmissions] = useState<PracticeSubmission[]>(() => {
    const saved = localStorage.getItem('yug_submissions_v1');
    return saved ? JSON.parse(saved) : [];
  });

  // Read attendance
  const [allAttendance, setAllAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('yug_attendance_v1');
    return saved ? JSON.parse(saved) : [];
  });

  const [readNotifs, setReadNotifs] = useState<Set<string>>(new Set());
  const [isLiveSupabase, setIsLiveSupabase] = useState(isSupabaseConfigured);

  // Sync currentStudent to localStorage
  useEffect(() => {
    if (currentStudent) {
      localStorage.setItem('yug_current_student', JSON.stringify(currentStudent));
    } else {
      localStorage.removeItem('yug_current_student');
    }
  }, [currentStudent]);

  // Sync to Supabase if configured + Realtime subscriptions
  useEffect(() => {
    const client = supabase;
    if (!isSupabaseConfigured || !client) return;

    const fetchAllData = async () => {
      try {
        const [schedRes, notifRes, matRes, subRes, attRes] = await Promise.all([
          client.from('class_schedules').select('*'),
          client.from('notifications').select('*').order('created_at', { ascending: false }),
          client.from('study_materials').select('*'),
          client.from('practice_submissions').select('*').order('submitted_at', { ascending: false }),
          client.from('attendance').select('*'),
        ]);

        if (schedRes.data && schedRes.data.length > 0) setSchedules(schedRes.data);
        if (notifRes.data && notifRes.data.length > 0) setNotifications(notifRes.data);
        if (matRes.data && matRes.data.length > 0) setMaterials(matRes.data);
        if (subRes.data && subRes.data.length > 0) setAllSubmissions(subRes.data);
        if (attRes.data && attRes.data.length > 0) setAllAttendance(attRes.data);

        setIsLiveSupabase(true);
      } catch (err) {
        console.warn('Supabase fetch failed on mobile, using local state:', err);
        setIsLiveSupabase(false);
      }
    };

    fetchAllData();

    // Subscribe to realtime changes from Supabase
    const channel = client
      .channel('mobile-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'class_schedules' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setSchedules((prev) => [payload.new as ClassSchedule, ...prev]);
          } else if (payload.eventType === 'DELETE') {
            setSchedules((prev) => prev.filter((s) => s.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            setSchedules((prev) => prev.map((s) => (s.id === payload.new.id ? (payload.new as ClassSchedule) : s)));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setNotifications((prev) => [payload.new as AcademyNotification, ...prev]);
          } else if (payload.eventType === 'DELETE') {
            setNotifications((prev) => prev.filter((n) => n.id !== payload.old.id));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'practice_submissions' },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setAllSubmissions((prev) =>
              prev.map((sub) => (sub.id === payload.new.id ? (payload.new as PracticeSubmission) : sub))
            );
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'students' },
        (payload) => {
          // Listen for student updates, e.g. Sir approves pending application!
          if (payload.eventType === 'UPDATE') {
            const updated = payload.new as Student;
            setCurrentStudent((curr) => {
              if (curr && (curr.id === updated.id || curr.email.toLowerCase() === updated.email.toLowerCase())) {
                return updated;
              }
              return curr;
            });
          }
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, []);

  // Listen to cross-tab storage changes (Admin panel updates sync immediately in demo mode!)
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'yug_schedules_v1' && e.newValue) setSchedules(JSON.parse(e.newValue));
      if (e.key === 'yug_notifications_v1' && e.newValue) setNotifications(JSON.parse(e.newValue));
      if (e.key === 'yug_materials_v1' && e.newValue) setMaterials(JSON.parse(e.newValue));
      if (e.key === 'yug_submissions_v1' && e.newValue) setAllSubmissions(JSON.parse(e.newValue));
      if (e.key === 'yug_attendance_v1' && e.newValue) setAllAttendance(JSON.parse(e.newValue));
      if (e.key === 'yug_students_v1' && e.newValue) {
        try {
          const allStudents: Student[] = JSON.parse(e.newValue);
          setCurrentStudent((curr) => {
            if (!curr) return null;
            const match = allStudents.find((s) => s.id === curr.id || s.email.toLowerCase() === curr.email.toLowerCase());
            return match || curr;
          });
        } catch {}
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Refresh student status on demand
  const refreshStudentStatus = async () => {
    if (!currentStudent) return;
    if (isLiveSupabase && supabase) {
      try {
        const { data } = await supabase
          .from('students')
          .select('*')
          .or(`id.eq.${currentStudent.id},email.ilike.${currentStudent.email}`)
          .maybeSingle();

        if (data) {
          setCurrentStudent(data);
          return;
        }
      } catch (err) {
        console.error('Failed to refresh student status:', err);
      }
    }

    // Local storage fallback
    const saved = localStorage.getItem('yug_students_v1');
    if (saved) {
      try {
        const list: Student[] = JSON.parse(saved);
        const match = list.find((s) => s.id === currentStudent.id || s.email.toLowerCase() === currentStudent.email.toLowerCase());
        if (match) setCurrentStudent(match);
      } catch {}
    }
  };

  // Student Login with Email
  const loginWithEmail = async (email: string): Promise<{ success: boolean; message: string; student?: Student }> => {
    const cleanEmail = email.trim().toLowerCase();

    if (isLiveSupabase && supabase) {
      try {
        const { data, error } = await supabase
          .from('students')
          .select('*')
          .ilike('email', cleanEmail)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setCurrentStudent(data);
          return {
            success: true,
            message: `Welcome back, ${data.name}!`,
            student: data,
          };
        }
      } catch (err: any) {
        console.warn('Supabase login check failed, checking local:', err);
      }
    }

    // Check demo and local students
    const localStudentsJson = localStorage.getItem('yug_students_v1');
    const localList: Student[] = localStudentsJson ? JSON.parse(localStudentsJson) : DEMO_STUDENTS;
    const found = localList.find((s) => s.email.toLowerCase() === cleanEmail);

    if (found) {
      setCurrentStudent(found);
      return {
        success: true,
        message: `Welcome back, ${found.name}!`,
        student: found,
      };
    }

    return {
      success: false,
      message: `No student enrolled with email "${email}". Please apply for admission or ask Sir to register your Gmail.`,
    };
  };

  // Student Self-Admission / Enrollment Application
  const applyForAdmission = async (app: {
    name: string;
    email: string;
    phone: string;
    instrument: InstrumentType;
    batch_name: string;
    skill_level: SkillLevel;
    notes?: string;
  }): Promise<{ success: boolean; message: string; student?: Student }> => {
    const cleanEmail = app.email.trim();

    // Check if email already enrolled
    if (isLiveSupabase && supabase) {
      try {
        const { data: existing } = await supabase
          .from('students')
          .select('*')
          .ilike('email', cleanEmail)
          .maybeSingle();

        if (existing) {
          if (existing.status === 'active') {
            setCurrentStudent(existing);
            return {
              success: true,
              message: `You are already enrolled! Logged in as ${existing.name}.`,
              student: existing,
            };
          } else {
            setCurrentStudent(existing);
            return {
              success: true,
              message: `Your application is already submitted and under review!`,
              student: existing,
            };
          }
        }
      } catch (e) {
        console.warn('Supabase check existing failed:', e);
      }
    }

    const newStudent: Student = {
      id: crypto.randomUUID(),
      name: app.name.trim(),
      email: cleanEmail,
      phone: app.phone.trim(),
      instrument: app.instrument,
      batch_name: app.batch_name,
      skill_level: app.skill_level,
      join_date: new Date().toISOString().split('T')[0],
      status: 'pending',
      fee_status: 'pending',
      notes: app.notes ? `[APPLICATION] ${app.notes.trim()}` : '[APPLICATION] Self-enrollment request',
    };

    if (isLiveSupabase && supabase) {
      try {
        // Try inserting as 'pending'
        const { data: inserted, error } = await supabase.from('students').insert([newStudent]).select().single();
        if (error) {
          // If check constraint rejects 'pending', fallback to 'inactive' with application tag
          if (error.code === '23514') {
            const fallbackStudent = { ...newStudent, status: 'inactive' as const };
            const { data: fallbackInserted, error: fallbackError } = await supabase
              .from('students')
              .insert([fallbackStudent])
              .select()
              .single();
            if (fallbackError) throw fallbackError;
            setCurrentStudent(fallbackInserted || fallbackStudent);
            return {
              success: true,
              message: 'Admission application submitted to Prof. Yug successfully!',
              student: fallbackInserted || fallbackStudent,
            };
          }
          throw error;
        }

        setCurrentStudent(inserted || newStudent);
        return {
          success: true,
          message: 'Admission application submitted to Prof. Yug successfully!',
          student: inserted || newStudent,
        };
      } catch (err: any) {
        console.error('Supabase apply insert failed, saving locally:', err);
      }
    }

    // Save locally
    const saved = localStorage.getItem('yug_students_v1');
    const list: Student[] = saved ? JSON.parse(saved) : [...DEMO_STUDENTS];
    const updated = [newStudent, ...list];
    localStorage.setItem('yug_students_v1', JSON.stringify(updated));

    setCurrentStudent(newStudent);
    return {
      success: true,
      message: 'Admission application submitted to Prof. Yug successfully!',
      student: newStudent,
    };
  };

  const logout = () => {
    setCurrentStudent(null);
  };

  const switchStudent = (studentId: string) => {
    const found = DEMO_STUDENTS.find((s) => s.id === studentId);
    if (found) setCurrentStudent(found);
  };

  const markNotifAsRead = (id: string) => {
    setReadNotifs((prev) => new Set(prev).add(id));
  };

  // Student Submits Audio Riyaaz
  const submitPractice = async (title: string, audioBlobUrl: string, notes?: string) => {
    if (!currentStudent) return;

    const newSubmission: PracticeSubmission = {
      id: crypto.randomUUID(),
      student_id: currentStudent.id,
      student_name: currentStudent.name,
      instrument: currentStudent.instrument,
      title,
      audio_video_url: audioBlobUrl,
      submission_type: 'audio',
      notes,
      submitted_at: new Date().toISOString(),
      status: 'pending',
    };

    if (isLiveSupabase && supabase) {
      try {
        await supabase.from('practice_submissions').insert([newSubmission]);
      } catch (err) {
        console.error('Supabase submission insert failed:', err);
      }
    }

    const updated = [newSubmission, ...allSubmissions];
    setAllSubmissions(updated);
    localStorage.setItem('yug_submissions_v1', JSON.stringify(updated));
  };

  // Filter items specifically relevant to this student
  const studentNotifications = notifications.filter((notif) => {
    if (!currentStudent) return false;
    if (notif.target_audience === 'all') return true;
    if (notif.target_audience === 'instrument' && notif.target_value === currentStudent.instrument) return true;
    if (notif.target_audience === 'batch' && notif.target_value === currentStudent.batch_name) return true;
    return false;
  });

  const mySubmissions = currentStudent
    ? allSubmissions.filter((sub) => sub.student_id === currentStudent.id)
    : [];

  const myAttendance = currentStudent
    ? allAttendance.filter((att) => att.student_id === currentStudent.id)
    : [];

  return (
    <StudentContext.Provider
      value={{
        currentStudent,
        isLoggedIn: Boolean(currentStudent),
        loginWithEmail,
        applyForAdmission,
        logout,
        refreshStudentStatus,
        switchStudent,
        schedules,
        notifications: studentNotifications,
        materials,
        mySubmissions,
        myAttendance,
        submitPractice,
        readNotifs,
        markNotifAsRead,
        isLiveSupabase,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export const useStudentData = () => {
  const context = useContext(StudentContext);
  if (!context) throw new Error('useStudentData must be used within StudentProvider');
  return context;
};
