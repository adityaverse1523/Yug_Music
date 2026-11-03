-- ========================================================================
-- YUG MUSICAL ACADEMY - Initial Seed Data
-- ========================================================================

-- Insert Sample Students
insert into public.students (id, name, email, phone, instrument, skill_level, batch_name, join_date, status, fee_status, notes)
values
  ('11111111-1111-1111-1111-111111111111', 'Aarav Sharma', 'aarav.sharma@example.com', '+91 98765 43210', 'Guitar', 'Beginner', 'Acoustic Guitar - Beginners', '2026-01-15', 'active', 'paid', 'Quick learner, practicing fingerstyle & basic open chords'),
  ('22222222-2222-2222-2222-222222222222', 'Ananya Verma', 'ananya.v@example.com', '+91 98765 43211', 'Singing / Vocal', 'Intermediate', 'Morning Riyaaz (Vocal & Harmonium)', '2026-01-20', 'active', 'paid', 'Classical Raag Bhairav & breathing control'),
  ('33333333-3333-3333-3333-333333333333', 'Rohan Mehta', 'rohan.piano@example.com', '+91 98765 43212', 'Piano', 'Advanced', 'Classical Piano & Keyboard', '2025-11-10', 'active', 'paid', 'Prepping for Trinity Grade 5 examination'),
  ('44444444-4444-4444-4444-444444444444', 'Isha Patel', 'isha.p@example.com', '+91 98765 43213', 'Keyboard', 'Beginner', 'Classical Piano & Keyboard', '2026-02-01', 'active', 'pending', 'Learning major and minor scales and lead sheet notation'),
  ('55555555-5555-5555-5555-555555555555', 'Kabir Das', 'kabir.drums@example.com', '+91 98765 43214', 'Drums', 'Intermediate', 'Rhythm & Percussion (Drums & Tabla)', '2026-02-10', 'active', 'paid', 'Working on 4/4 syncopated groove & tempo control');

-- Insert Sample Class Schedules
insert into public.class_schedules (id, title, instrument, batch_name, teacher_name, class_type, meeting_link, room_number, day_of_week, start_time, end_time, recurrence, max_students, description, status)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Acoustic Guitar Foundations', 'Guitar', 'Acoustic Guitar - Beginners', 'Prof. Yug', 'online', 'https://meet.google.com/yug-guit-001', null, 'Monday', '17:00', '18:00', 'weekly', 25, 'Chords transitions (C, G, Em, D) and basic 4/4 rhythm strumming pattern.', 'scheduled'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Morning Raag Sadhana & Swar Practice', 'Singing / Vocal', 'Morning Riyaaz (Vocal & Harmonium)', 'Prof. Yug', 'online', 'https://meet.google.com/yug-riya-002', null, 'Tuesday', '07:30', '08:30', 'weekly', 20, 'Daily vocal warmups, omkar, sargam alankars and pitch stability.', 'scheduled'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Piano Chords & Arpeggios', 'Piano', 'Classical Piano & Keyboard', 'Prof. Yug', 'offline', null, 'Studio Room 1', 'Wednesday', '18:30', '19:45', 'weekly', 15, 'Left-hand bass patterns & dynamic finger independence on acoustic piano.', 'scheduled'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Drum Kit Grooves & Rudiments', 'Drums', 'Rhythm & Percussion (Drums & Tabla)', 'Prof. Yug', 'offline', null, 'Soundproof Room 3', 'Saturday', '16:00', '17:30', 'weekly', 10, 'Snare drum single/double stroke roll, hi-hat pedal synchronization.', 'scheduled');

-- Insert Sample Notifications (Admin broadcast)
insert into public.notifications (id, title, message, category, target_audience, target_value, sent_by, priority, read_by_count)
values
  ('10000000-0000-0000-0000-000000000001', 'Monthly Academy Jam & Recital Announced!', 'We are hosting the Monthly Student Recital this coming Sunday at 5:00 PM. All students are invited to perform one piece or join as audience.', 'announcement', 'all', null, 'Prof. Yug (Director)', 'high', 28),
  ('10000000-0000-0000-0000-000000000002', 'New Guitar Fingerpicking Exercise Uploaded', 'Please check the Study Materials section for the tab sheet and video lesson on Travis picking pattern.', 'practice_reminder', 'instrument', 'Guitar', 'Prof. Yug (Director)', 'normal', 14),
  ('10000000-0000-0000-0000-000000000003', 'Morning Riyaaz Timing Adjustment for Tuesday', 'Tuesday morning riyaaz will begin 15 minutes earlier at 7:15 AM due to a special raag demonstration by guest maestro.', 'class_update', 'batch', 'Morning Riyaaz (Vocal & Harmonium)', 'Prof. Yug (Director)', 'urgent', 18);

-- Insert Sample Study Materials (Subject-wise)
insert into public.study_materials (id, title, instrument, batch_name, category, material_type, file_url, file_size, description, uploaded_by)
values
  ('20000000-0000-0000-0000-000000000001', 'Essential Open Chords (C, G, D, Em, Am) & Fingering', 'Guitar', 'Acoustic Guitar - Beginners', 'Chords & Fretboard Diagrams', 'pdf', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '2.4 MB', 'Diagrams with standard fingering numbers, chord transition shortcuts, and thumb placement.', 'Prof. Yug'),
  ('20000000-0000-0000-0000-000000000002', 'Acoustic Strumming Rhythms (4/4 & 3/4 Waltzes)', 'Guitar', 'Acoustic Guitar - Beginners', 'Rhythm & Strumming Patterns', 'pdf', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '1.8 MB', 'Down-Up strumming exercises with accent marks and dynamic control tips.', 'Prof. Yug'),
  ('20000000-0000-0000-0000-000000000003', 'A Minor Pentatonic Scale Lead Tabs & Backing Track', 'Guitar', 'Electric & Lead Guitar - Advanced', 'Scales & Soloing', 'audio', 'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3', '6.4 MB', 'Practice audio track: Box 1 to 5 fretboard runs with backing groove.', 'Prof. Yug'),
  ('20000000-0000-0000-0000-000000000004', 'Morning Vocal Warmups & 10 Core Alankars', 'Singing / Vocal', 'Morning Riyaaz (Vocal & Harmonium)', 'Daily Riyaaz & Warmups', 'audio', 'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3', '8.1 MB', 'Guided 15-minute vocal warm-up audio for swar shuddhi, omkar, and pitch hold.', 'Prof. Yug'),
  ('20000000-0000-0000-0000-000000000005', 'Raag Yaman - Aroha, Avaroha & Chhota Khayal Notation', 'Singing / Vocal', 'Morning Riyaaz (Vocal & Harmonium)', 'Classical Raag Bandishes', 'pdf', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '3.1 MB', 'Full Bhatkhande notation with lyrics for bandish in Teen Taal (16 beats).', 'Prof. Yug'),
  ('20000000-0000-0000-0000-000000000006', 'Piano Scales & Arpeggios Handbook (Grade 1-3)', 'Piano', 'Classical Piano & Keyboard', 'Scales & Arpeggios', 'pdf', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '5.2 MB', 'Standard fingerings for all major and natural/harmonic minor scales across 2 octaves.', 'Prof. Yug');

-- Insert Sample Practice Submissions
insert into public.practice_submissions (id, student_id, student_name, instrument, title, audio_video_url, submission_type, notes, status, feedback_notes, rating, reviewed_at, reviewed_by)
values
  ('30000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Aarav Sharma', 'Guitar', 'Acoustic Chords Change Practice (G to Em)', 'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3', 'audio', 'Sir, getting slight fret buzz when shifting quickly to D chord. Please check my rhythm consistency.', 'pending', null, null, null, null),
  ('30000000-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'Ananya Verma', 'Singing / Vocal', 'Raag Yaman - Aroha & Avaroha Alaap', 'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3', 'audio', 'Practiced with tanpura set at pitch G sharp. Attempted smooth transitions.', 'reviewed', 'Excellent pitch clarity! Keep the Teevra Ma steady on the sustain without shaking. Overall 9/10.', 5, timezone('utc'::text, now()), 'Prof. Yug');
