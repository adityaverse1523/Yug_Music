import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Student,
  ClassSchedule,
  AcademyNotification,
  StudyMaterial,
  PracticeSubmission,
  AttendanceRecord,
  DEFAULT_STUDY_MATERIALS,
} from '@yug/shared';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Pre-seeded Demo Students
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
];

interface StudentContextType {
  currentStudent: Student;
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
  const [currentStudent, setCurrentStudent] = useState<Student>(DEMO_STUDENTS[0]);

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
      .channel('schema-db-changes')
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
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, []);

  // Listen to cross-tab storage changes (Admin panel updates sync immediately!)
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'yug_schedules_v1' && e.newValue) setSchedules(JSON.parse(e.newValue));
      if (e.key === 'yug_notifications_v1' && e.newValue) setNotifications(JSON.parse(e.newValue));
      if (e.key === 'yug_materials_v1' && e.newValue) setMaterials(JSON.parse(e.newValue));
      if (e.key === 'yug_submissions_v1' && e.newValue) setAllSubmissions(JSON.parse(e.newValue));
      if (e.key === 'yug_attendance_v1' && e.newValue) setAllAttendance(JSON.parse(e.newValue));
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const switchStudent = (studentId: string) => {
    const found = DEMO_STUDENTS.find((s) => s.id === studentId);
    if (found) setCurrentStudent(found);
  };

  const markNotifAsRead = (id: string) => {
    setReadNotifs((prev) => new Set(prev).add(id));
  };

  // Student Submits Audio Riyaaz
  const submitPractice = async (title: string, audioBlobUrl: string, notes?: string) => {
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
    if (notif.target_audience === 'all') return true;
    if (notif.target_audience === 'instrument' && notif.target_value === currentStudent.instrument) return true;
    if (notif.target_audience === 'batch' && notif.target_value === currentStudent.batch_name) return true;
    return false;
  });

  const mySubmissions = allSubmissions.filter((sub) => sub.student_id === currentStudent.id);
  const myAttendance = allAttendance.filter((att) => att.student_id === currentStudent.id);

  return (
    <StudentContext.Provider
      value={{
        currentStudent,
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
