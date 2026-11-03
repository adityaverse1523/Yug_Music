import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Student,
  ClassSchedule,
  AcademyNotification,
  StudyMaterial,
  PracticeSubmission,
  AttendanceRecord,
  ACADEMY_CONFIG,
} from '@yug/shared';
import {
  supabase,
  isSupabaseConfigured,
  INITIAL_STUDENTS,
  INITIAL_SCHEDULES,
  INITIAL_NOTIFICATIONS,
  INITIAL_MATERIALS,
  INITIAL_SUBMISSIONS,
  INITIAL_ATTENDANCE,
} from '../lib/supabase';

interface AppDataContextType {
  // Data
  students: Student[];
  schedules: ClassSchedule[];
  notifications: AcademyNotification[];
  materials: StudyMaterial[];
  submissions: PracticeSubmission[];
  attendance: AttendanceRecord[];
  
  // State
  loading: boolean;
  isSupabaseLive: boolean;

  // Schedule Actions (Teacher Scheduling)
  addSchedule: (data: Omit<ClassSchedule, 'id' | 'created_at' | 'status'>) => Promise<void>;
  updateSchedule: (id: string, data: Partial<ClassSchedule>) => Promise<void>;
  deleteSchedule: (id: string) => Promise<void>;

  // Notification Actions (Admin Broadcasts)
  sendNotification: (data: Omit<AcademyNotification, 'id' | 'created_at' | 'read_by_count'>) => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;

  // Student Actions
  addStudent: (data: Omit<Student, 'id' | 'join_date' | 'status'>) => Promise<void>;
  updateStudent: (id: string, data: Partial<Student>) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;

  // Material Actions
  addMaterial: (data: Omit<StudyMaterial, 'id' | 'created_at'>) => Promise<void>;
  deleteMaterial: (id: string) => Promise<void>;

  // Practice Review Actions
  reviewSubmission: (id: string, feedback: string, rating: number) => Promise<void>;

  // Attendance Actions
  markAttendance: (scheduleId: string, studentId: string, studentName: string, status: AttendanceRecord['status'], remark?: string) => Promise<void>;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

const STORAGE_KEYS = {
  students: 'yug_students_v1',
  schedules: 'yug_schedules_v1',
  notifications: 'yug_notifications_v1',
  materials: 'yug_materials_v1',
  submissions: 'yug_submissions_v1',
  attendance: 'yug_attendance_v1',
};

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.students);
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [schedules, setSchedules] = useState<ClassSchedule[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.schedules);
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULES;
  });

  const [notifications, setNotifications] = useState<AcademyNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.notifications);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [materials, setMaterials] = useState<StudyMaterial[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.materials);
    return saved ? JSON.parse(saved) : INITIAL_MATERIALS;
  });

  const [submissions, setSubmissions] = useState<PracticeSubmission[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.submissions);
    return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.attendance);
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [loading, setLoading] = useState(false);
  const [isSupabaseLive, setIsSupabaseLive] = useState(isSupabaseConfigured);

  // Sync state to localStorage for offline persistence
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.students, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.schedules, JSON.stringify(schedules));
  }, [schedules]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.notifications, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.materials, JSON.stringify(materials));
  }, [materials]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.submissions, JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.attendance, JSON.stringify(attendance));
  }, [attendance]);

  // Load from Supabase if configured
  useEffect(() => {
    const client = supabase;
    if (!isSupabaseConfigured || !client) return;

    const fetchSupabaseData = async () => {
      setLoading(true);
      try {
        const [
          studentsRes,
          schedulesRes,
          notificationsRes,
          materialsRes,
          submissionsRes,
          attendanceRes,
        ] = await Promise.all([
          client.from('students').select('*'),
          client.from('class_schedules').select('*'),
          client.from('notifications').select('*').order('created_at', { ascending: false }),
          client.from('study_materials').select('*'),
          client.from('practice_submissions').select('*').order('submitted_at', { ascending: false }),
          client.from('attendance').select('*'),
        ]);

        if (studentsRes.data && studentsRes.data.length > 0) setStudents(studentsRes.data);
        if (schedulesRes.data && schedulesRes.data.length > 0) setSchedules(schedulesRes.data);
        if (notificationsRes.data && notificationsRes.data.length > 0) setNotifications(notificationsRes.data);
        if (materialsRes.data && materialsRes.data.length > 0) setMaterials(materialsRes.data);
        if (submissionsRes.data && submissionsRes.data.length > 0) setSubmissions(submissionsRes.data);
        if (attendanceRes.data && attendanceRes.data.length > 0) setAttendance(attendanceRes.data);

        setIsSupabaseLive(true);
      } catch (err) {
        console.warn('Could not fetch from Supabase, using local stored data:', err);
        setIsSupabaseLive(false);
      } finally {
        setLoading(false);
      }
    };

    fetchSupabaseData();

    // Realtime channel for Admin panel
    const channel = client
      .channel('admin-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'practice_submissions' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setSubmissions((prev) => [payload.new as PracticeSubmission, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setSubmissions((prev) => prev.map((s) => (s.id === payload.new.id ? (payload.new as PracticeSubmission) : s)));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'students' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setStudents((prev) => [payload.new as Student, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, []);

  // Class Schedule Actions (Teacher Scheduling)
  const addSchedule = async (data: Omit<ClassSchedule, 'id' | 'created_at' | 'status'>) => {
    const newSchedule: ClassSchedule = {
      ...data,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      status: 'scheduled',
    };

    if (isSupabaseLive && supabase) {
      try {
        const { data: inserted, error } = await supabase.from('class_schedules').insert([newSchedule]).select().single();
        if (error) throw error;
        setSchedules((prev) => [inserted, ...prev]);
        return;
      } catch (e) {
        console.error('Supabase insert schedule failed, saving locally:', e);
      }
    }

    setSchedules((prev) => [newSchedule, ...prev]);
  };

  const updateSchedule = async (id: string, updates: Partial<ClassSchedule>) => {
    if (isSupabaseLive && supabase) {
      try {
        await supabase.from('class_schedules').update(updates).eq('id', id);
      } catch (e) {
        console.error('Supabase update schedule failed:', e);
      }
    }
    setSchedules((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const deleteSchedule = async (id: string) => {
    if (isSupabaseLive && supabase) {
      try {
        await supabase.from('class_schedules').delete().eq('id', id);
      } catch (e) {
        console.error('Supabase delete schedule failed:', e);
      }
    }
    setSchedules((prev) => prev.filter((item) => item.id !== id));
  };

  // Notification Broadcast Actions (Admin Only)
  const sendNotification = async (data: Omit<AcademyNotification, 'id' | 'created_at' | 'read_by_count'>) => {
    const newNotif: AcademyNotification = {
      ...data,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      read_by_count: 0,
    };

    if (isSupabaseLive && supabase) {
      try {
        const { data: inserted, error } = await supabase.from('notifications').insert([newNotif]).select().single();
        if (error) throw error;
        setNotifications((prev) => [inserted, ...prev]);
        return;
      } catch (e) {
        console.error('Supabase insert notification failed, saving locally:', e);
      }
    }

    setNotifications((prev) => [newNotif, ...prev]);
  };

  const deleteNotification = async (id: string) => {
    if (isSupabaseLive && supabase) {
      try {
        await supabase.from('notifications').delete().eq('id', id);
      } catch (e) {
        console.error('Supabase delete notification failed:', e);
      }
    }
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  // Student Actions
  const addStudent = async (data: Omit<Student, 'id' | 'join_date' | 'status'>) => {
    const newStudent: Student = {
      ...data,
      id: crypto.randomUUID(),
      join_date: new Date().toISOString().split('T')[0],
      status: 'active',
    };

    if (isSupabaseLive && supabase) {
      try {
        const { data: inserted, error } = await supabase.from('students').insert([newStudent]).select().single();
        if (error) throw error;
        setStudents((prev) => [inserted, ...prev]);
        return;
      } catch (e) {
        console.error('Supabase insert student failed, saving locally:', e);
      }
    }

    setStudents((prev) => [newStudent, ...prev]);
  };

  const updateStudent = async (id: string, updates: Partial<Student>) => {
    if (isSupabaseLive && supabase) {
      try {
        await supabase.from('students').update(updates).eq('id', id);
      } catch (e) {
        console.error('Supabase update student failed:', e);
      }
    }
    setStudents((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const deleteStudent = async (id: string) => {
    if (isSupabaseLive && supabase) {
      try {
        await supabase.from('students').delete().eq('id', id);
      } catch (e) {
        console.error('Supabase delete student failed:', e);
      }
    }
    setStudents((prev) => prev.filter((item) => item.id !== id));
  };

  // Material Actions
  const addMaterial = async (data: Omit<StudyMaterial, 'id' | 'created_at'>) => {
    const newMaterial: StudyMaterial = {
      ...data,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    };

    if (isSupabaseLive && supabase) {
      try {
        const { data: inserted, error } = await supabase.from('study_materials').insert([newMaterial]).select().single();
        if (error) throw error;
        setMaterials((prev) => [inserted, ...prev]);
        return;
      } catch (e) {
        console.error('Supabase insert material failed, saving locally:', e);
      }
    }

    setMaterials((prev) => [newMaterial, ...prev]);
  };

  const deleteMaterial = async (id: string) => {
    if (isSupabaseLive && supabase) {
      try {
        await supabase.from('study_materials').delete().eq('id', id);
      } catch (e) {
        console.error('Supabase delete material failed:', e);
      }
    }
    setMaterials((prev) => prev.filter((item) => item.id !== id));
  };

  // Practice Submission Review
  const reviewSubmission = async (id: string, feedback_notes: string, rating: number) => {
    const updates = {
      feedback_notes,
      rating,
      status: 'reviewed' as const,
      reviewed_at: new Date().toISOString(),
      reviewed_by: ACADEMY_CONFIG.directorName,
    };

    if (isSupabaseLive && supabase) {
      try {
        await supabase.from('practice_submissions').update(updates).eq('id', id);
      } catch (e) {
        console.error('Supabase review submission failed:', e);
      }
    }

    setSubmissions((prev) => prev.map((sub) => (sub.id === id ? { ...sub, ...updates } : sub)));
  };

  // Attendance
  const markAttendance = async (
    scheduleId: string,
    studentId: string,
    studentName: string,
    status: AttendanceRecord['status'],
    remark?: string
  ) => {
    const today = new Date().toISOString().split('T')[0];
    const existing = attendance.find(
      (a) => a.schedule_id === scheduleId && a.student_id === studentId && a.date === today
    );

    if (existing) {
      const updates = { status, remark };
      if (isSupabaseLive && supabase) {
        try {
          await supabase.from('attendance').update(updates).eq('id', existing.id);
        } catch (e) {
          console.error('Supabase update attendance failed:', e);
        }
      }
      setAttendance((prev) =>
        prev.map((a) => (a.id === existing.id ? { ...a, ...updates } : a))
      );
    } else {
      const newRec: AttendanceRecord = {
        id: crypto.randomUUID(),
        schedule_id: scheduleId,
        date: today,
        student_id: studentId,
        student_name: studentName,
        status,
        remark,
      };

      if (isSupabaseLive && supabase) {
        try {
          await supabase.from('attendance').insert([newRec]);
        } catch (e) {
          console.error('Supabase insert attendance failed:', e);
        }
      }
      setAttendance((prev) => [...prev, newRec]);
    }
  };

  return (
    <AppDataContext.Provider
      value={{
        students,
        schedules,
        notifications,
        materials,
        submissions,
        attendance,
        loading,
        isSupabaseLive,
        addSchedule,
        updateSchedule,
        deleteSchedule,
        sendNotification,
        deleteNotification,
        addStudent,
        updateStudent,
        deleteStudent,
        addMaterial,
        deleteMaterial,
        reviewSubmission,
        markAttendance,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (!context) throw new Error('useAppData must be used within AppDataProvider');
  return context;
};
