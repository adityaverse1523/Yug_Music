-- ========================================================================
-- YUG MUSICAL ACADEMY - Supabase Database Schema
-- Production Schema for Admin Web Panel & Student Mobile App
-- ========================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES / USERS TABLE
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  email text not null,
  role text not null check (role in ('admin', 'teacher', 'student')) default 'student',
  phone text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. STUDENTS TABLE
create table if not exists public.students (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references public.profiles(id) on delete set null,
  name text not null,
  email text not null,
  phone text not null,
  instrument text not null,
  skill_level text not null check (skill_level in ('Beginner', 'Intermediate', 'Advanced')) default 'Beginner',
  batch_name text not null,
  join_date date default current_date not null,
  status text not null check (status in ('active', 'inactive')) default 'active',
  fee_status text not null check (fee_status in ('paid', 'pending', 'overdue')) default 'paid',
  avatar_url text,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. CLASS SCHEDULES TABLE (Teacher can add/schedule classes)
create table if not exists public.class_schedules (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  instrument text not null,
  batch_name text not null,
  teacher_name text not null default 'Prof. Yug',
  class_type text not null check (class_type in ('online', 'offline')) default 'online',
  meeting_link text,
  room_number text,
  date date,
  day_of_week text,
  start_time text not null,
  end_time text not null,
  recurrence text not null check (recurrence in ('once', 'daily', 'weekly', 'custom')) default 'weekly',
  max_students integer default 30,
  description text,
  status text not null check (status in ('scheduled', 'live', 'completed', 'cancelled')) default 'scheduled',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. NOTIFICATIONS TABLE (Admin-only broadcast system)
create table if not exists public.notifications (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  message text not null,
  category text not null check (category in ('announcement', 'class_update', 'practice_reminder', 'urgent')) default 'announcement',
  target_audience text not null check (target_audience in ('all', 'instrument', 'batch', 'individual')) default 'all',
  target_value text,
  sent_by text not null default 'Prof. Yug (Director)',
  priority text not null check (priority in ('normal', 'high', 'urgent')) default 'normal',
  read_by_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. STUDY MATERIALS TABLE (Subject-wise Sheet Music, PDFs, Videos, Audio)
create table if not exists public.study_materials (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  instrument text not null,
  batch_name text,
  category text,
  material_type text not null check (material_type in ('pdf', 'video', 'audio', 'link')) default 'pdf',
  file_url text not null,
  file_size text,
  description text,
  uploaded_by text not null default 'Prof. Yug',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. PRACTICE SUBMISSIONS TABLE (Recordings sent by students for feedback)
create table if not exists public.practice_submissions (
  id uuid default uuid_generate_v4() primary key,
  student_id uuid references public.students(id) on delete cascade,
  student_name text not null,
  student_avatar text,
  instrument text not null,
  title text not null,
  audio_video_url text not null,
  submission_type text not null check (submission_type in ('audio', 'video')) default 'audio',
  notes text,
  submitted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  status text not null check (status in ('pending', 'reviewed')) default 'pending',
  feedback_notes text,
  rating integer check (rating between 1 and 5),
  reviewed_at timestamp with time zone,
  reviewed_by text
);

-- 7. ATTENDANCE TABLE
create table if not exists public.attendance (
  id uuid default uuid_generate_v4() primary key,
  schedule_id uuid references public.class_schedules(id) on delete cascade,
  date date default current_date not null,
  student_id uuid references public.students(id) on delete cascade,
  student_name text not null,
  status text not null check (status in ('present', 'absent', 'late', 'excused')) default 'present',
  remark text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes for performance
create index if not exists idx_students_instrument on public.students(instrument);
create index if not exists idx_students_batch on public.students(batch_name);
create index if not exists idx_schedules_day on public.class_schedules(day_of_week);
create index if not exists idx_schedules_date on public.class_schedules(date);
create index if not exists idx_notifications_created on public.notifications(created_at desc);
create index if not exists idx_submissions_status on public.practice_submissions(status);
create index if not exists idx_materials_instrument on public.study_materials(instrument);
create index if not exists idx_materials_category on public.study_materials(category);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.students enable row level security;
alter table public.class_schedules enable row level security;
alter table public.notifications enable row level security;
alter table public.study_materials enable row level security;
alter table public.practice_submissions enable row level security;
alter table public.attendance enable row level security;

-- Open policies for Academy operation
create policy "Allow public read on schedules" on public.class_schedules for select using (true);
create policy "Allow all write on schedules" on public.class_schedules for all using (true);

create policy "Allow public read on notifications" on public.notifications for select using (true);
create policy "Allow all write on notifications" on public.notifications for all using (true);

create policy "Allow public read on materials" on public.study_materials for select using (true);
create policy "Allow all write on materials" on public.study_materials for all using (true);

create policy "Allow public read on students" on public.students for select using (true);
create policy "Allow all write on students" on public.students for all using (true);

create policy "Allow public read on submissions" on public.practice_submissions for select using (true);
create policy "Allow all write on submissions" on public.practice_submissions for all using (true);

create policy "Allow public read on attendance" on public.attendance for select using (true);
create policy "Allow all write on attendance" on public.attendance for all using (true);

-- Enable Realtime for instant synchronization between Admin & Mobile App
alter publication supabase_realtime add table public.class_schedules;
alter publication supabase_realtime add table public.notifications;
alter publication supabase_realtime add table public.practice_submissions;
alter publication supabase_realtime add table public.study_materials;
alter publication supabase_realtime add table public.attendance;
alter publication supabase_realtime add table public.students;
