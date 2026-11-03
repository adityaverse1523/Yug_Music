export type UserRole = 'admin' | 'teacher' | 'student';

export type InstrumentType =
  | 'Guitar'
  | 'Piano'
  | 'Singing / Vocal'
  | 'Keyboard'
  | 'Drums'
  | 'Flute'
  | 'Violin'
  | 'Harmonium'
  | 'Tabla';

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type FeeStatus = 'paid' | 'pending' | 'overdue';

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  instrument: InstrumentType;
  skill_level: SkillLevel;
  batch_name: string;
  join_date: string;
  status: 'active' | 'inactive';
  fee_status: FeeStatus;
  avatar_url?: string;
  notes?: string;
}

export type ClassType = 'online' | 'offline';
export type RecurrenceType = 'once' | 'daily' | 'weekly' | 'custom';

export interface ClassSchedule {
  id: string;
  title: string;
  instrument: InstrumentType;
  batch_name: string;
  teacher_name: string;
  class_type: ClassType;
  meeting_link?: string;
  room_number?: string;
  date?: string; // YYYY-MM-DD
  day_of_week?: string; // Monday, Tuesday, etc.
  start_time: string; // HH:mm (24hr or 12hr)
  end_time: string;
  recurrence: RecurrenceType;
  max_students?: number;
  description?: string;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  created_at: string;
}

export type NotificationCategory = 'announcement' | 'class_update' | 'practice_reminder' | 'urgent';
export type TargetAudience = 'all' | 'instrument' | 'batch' | 'individual';

export interface AcademyNotification {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  target_audience: TargetAudience;
  target_value?: string; // e.g. "Guitar" or "Morning Riyaaz Batch" or student ID
  sent_by: string;
  created_at: string;
  read_by_count?: number;
  priority: 'normal' | 'high' | 'urgent';
}

export type MaterialType = 'pdf' | 'video' | 'audio' | 'link';

export interface StudyMaterial {
  id: string;
  title: string;
  instrument: InstrumentType;
  batch_name?: string;
  category?: string;
  material_type: MaterialType;
  file_url: string;
  file_size?: string;
  description?: string;
  uploaded_by: string;
  created_at: string;
}

export interface PracticeSubmission {
  id: string;
  student_id: string;
  student_name: string;
  student_avatar?: string;
  instrument: InstrumentType;
  title: string;
  audio_video_url: string;
  submission_type: 'audio' | 'video';
  notes?: string;
  submitted_at: string;
  status: 'pending' | 'reviewed';
  feedback_notes?: string;
  rating?: number; // 1 to 5 stars
  reviewed_at?: string;
  reviewed_by?: string;
}

export interface AttendanceRecord {
  id: string;
  schedule_id: string;
  date: string;
  student_id: string;
  student_name: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  remark?: string;
}

