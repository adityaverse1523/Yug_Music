# ♫ YUG Musical Academy — Monorepo Platform

Production deployment ready for Vercel & PWA Mobile App.

Complete digital ecosystem for **YUG Musical Academy**, featuring:
1. **Teacher & Admin Web Panel** (`apps/admin`): For the Music Professor to schedule classes, dispatch student mobile notifications, track attendance, upload study materials, and review practice recordings.
2. **Student Mobile App** (`apps/mobile`): Cross-platform mobile app (React Native / Expo) for students.
3. **Shared Packages** (`packages/shared`): Unified data models, types, constants, and color theme tokens.
4. **Supabase Backend** (`packages/supabase`): Ready-to-execute SQL migrations (`schema.sql`) and sample initial data (`seed.sql`).

---

## 🎨 Theme Palette (Strict Acoustic Brand Consistency)
- **Canvas Cream**: `#fbf7ef`
- **Card Paper**: `#fffdf9`
- **Deep Ink**: `#302b25`
- **Muted Text**: `#746d63`
- **Rich Gold**: `#b58a4b`
- **Bronze Gold**: `#8c6836`
- **Border Line**: `#e9e0d2`
- **Soft Warm**: `#f3ecdf`
- **Olive Accent**: `#64745b`

---

## 🚀 Quick Start (Admin Web Panel)

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Admin Panel
```bash
npm run dev:admin
```
The Admin Panel will launch at `http://localhost:3000`.

*Note: The app comes with an interactive offline storage mode pre-loaded with sample academy data. You can add classes, dispatch notifications, enroll students, and review audio right away without configuring any API keys!*

---

## ⚡ Connecting Supabase (Production Cloud Database)

1. Create a project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** in your Supabase dashboard.
3. Copy the contents of [`packages/supabase/schema.sql`](./packages/supabase/schema.sql) and click **Run**.
4. (Optional) Run [`packages/supabase/seed.sql`](./packages/supabase/seed.sql) to populate initial sample batches, students, and schedules.
5. In `apps/admin/.env`, set your project credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
6. The Admin Panel header will automatically switch to **"Supabase Live"** with real-time cloud persistence.

---

## 📱 Core Features Built for the Music Professor

### 1. Teacher Class Scheduling (`SchedulePage`)
- **Self-Scheduling**: The professor can add any class session with a customized Title, Instrument (Guitar, Piano, Vocals, Drums, etc.), Batch, and Agenda.
- **Online & In-Studio Support**: Supports online live sessions with Google Meet/Zoom links (and 1-click student copy link) or physical studio rooms.
- **Recurrence**: Supports Weekly recurring schedules, Daily riyaaz, or One-off masterclasses.

### 2. Admin Broadcast Notifications (`NotificationsPage`)
- **Strict Push Authority**: Only the admin can dispatch notifications.
- **Audience Targeting**: Broadcast to *All Students*, or target by *Specific Instrument* (e.g. Guitar students only) or *Specific Batch* (e.g. Morning Riyaaz only).
- **Priority System**: Normal, High, or Urgent alert banners sent directly to students' mobile app notification feeds.

### 3. Student Practice Studio (`SubmissionsPage`)
- Listen to audio homework recordings submitted by students.
- Provide personalized teacher feedback notes and award 1-to-5 star ratings.

### 4. Registry & Library
- **Student Directory**: Track skill levels (Beginner, Intermediate, Advanced) and tuition/fee status.
- **Study Materials**: Distribute sheet music (PDFs), guided audio tracks (Alankars, Tanpura), and video tutorials.
- **Attendance Register**: Mark daily/weekly batch attendance with 1-click status (Present, Late, Absent).

