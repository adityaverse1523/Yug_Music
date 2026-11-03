import React from 'react';
import {
  Users,
  CalendarDays,
  BellRing,
  Headphones,
  Video,
  MapPin,
  Clock,
  ArrowRight,
  ExternalLink,
  CheckCircle,
  UserPlus,
  FolderPlus,
  Sparkles,
} from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { AdminTab } from '../components/layout/Sidebar';

interface DashboardPageProps {
  onNavigate: (tab: AdminTab) => void;
  onOpenScheduleModal: () => void;
  onOpenNotificationModal: () => void;
  onOpenStudentModal: () => void;
  onOpenMaterialModal: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  onOpenScheduleModal,
  onOpenNotificationModal,
  onOpenStudentModal,
  onOpenMaterialModal,
}) => {
  const { students, schedules, notifications, submissions, materials } = useAppData();

  const pendingSubmissions = submissions.filter((s) => s.status === 'pending');
  const pendingApplications = students.filter(
    (s) => s.status === 'pending' || (s.status === 'inactive' && Boolean(s.notes?.includes('[APPLICATION')))
  );
  const activeStudents = students.filter(
    (s) => s.status === 'active' || (!s.status && !s.notes?.includes('[APPLICATION'))
  );

  const statCards = [
    {
      label: 'Active Students',
      value: activeStudents.length,
      icon: Users,
      actionText: 'View Directory',
      tab: 'students' as AdminTab,
      bg: 'bg-paper',
    },
    {
      label: 'Scheduled Classes',
      value: schedules.length,
      icon: CalendarDays,
      actionText: 'Manage Timetable',
      tab: 'schedule' as AdminTab,
      bg: 'bg-paper',
    },
    {
      label: 'Pending Reviews',
      value: pendingSubmissions.length,
      icon: Headphones,
      actionText: 'Review Riyaaz',
      tab: 'submissions' as AdminTab,
      bg: pendingSubmissions.length > 0 ? 'bg-soft' : 'bg-paper',
      highlight: pendingSubmissions.length > 0,
    },
    {
      label: 'Broadcasts Sent',
      value: notifications.length,
      icon: BellRing,
      actionText: 'Send New Alert',
      tab: 'notifications' as AdminTab,
      bg: 'bg-paper',
    },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-paper border border-line rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-gold-dark bg-soft px-2.5 py-0.5 rounded-full border border-line">
              Academy Control Center
            </span>
            <span className="text-xs text-muted font-medium">• Namaste, Prof. Yug</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-ink tracking-tight">
            Musical Academy Dashboard
          </h1>
          <p className="text-sm text-muted max-w-2xl">
            Schedule your live classes, broadcast notifications directly to student phones, review student practice recordings, and manage academy curriculum.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenScheduleModal}
            className="px-4 py-2 bg-gold hover:bg-gold-dark text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <CalendarDays className="w-4 h-4" />
            <span>Schedule Class</span>
          </button>
          <button
            onClick={onOpenNotificationModal}
            className="px-4 py-2 bg-soft hover:bg-[#eae0ce] text-ink border border-line rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
          >
            <BellRing className="w-4 h-4 text-gold-dark" />
            <span>Send Notice</span>
          </button>
          <button
            onClick={onOpenStudentModal}
            className="px-3.5 py-2 bg-white hover:bg-cream text-ink border border-line rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5 text-gold-dark" />
            <span>Enroll Student</span>
          </button>
          <button
            onClick={onOpenMaterialModal}
            className="px-3.5 py-2 bg-white hover:bg-cream text-ink border border-line rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <FolderPlus className="w-3.5 h-3.5 text-gold-dark" />
            <span>Upload Material ({materials.length})</span>
          </button>
        </div>
      </div>

      {/* Pending Admission Applications Banner */}
      {pendingApplications.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0 animate-pulse">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-amber-900">
                {pendingApplications.length} New Admission Application{pendingApplications.length > 1 ? 's' : ''} Received!
              </h4>
              <p className="text-xs text-amber-700">
                Prospective student{pendingApplications.length > 1 ? 's have' : ' has'} applied via the mobile app and {pendingApplications.length > 1 ? 'are' : 'is'} awaiting your review.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('students')}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer shadow-xs self-start sm:self-auto"
          >
            Review &amp; Enroll →
          </button>
        </div>
      )}

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`${card.bg} border border-line rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-gold/50 transition-all`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted">
                    {card.label}
                  </p>
                  <h3 className="text-3xl font-extrabold text-ink mt-1">{card.value}</h3>
                </div>
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    card.highlight ? 'bg-gold text-white' : 'bg-soft text-gold-dark border border-line'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <button
                onClick={() => onNavigate(card.tab)}
                className="mt-4 pt-3 border-t border-line/60 flex items-center justify-between text-xs font-bold text-gold-dark hover:text-gold transition-colors cursor-pointer"
              >
                <span>{card.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Middle Grid: Upcoming Classes & Pending Student Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Classes */}
        <div className="bg-paper border border-line rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-line mb-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-gold-dark" />
                <h3 className="font-extrabold text-base text-ink">Upcoming Classes</h3>
              </div>
              <button
                onClick={() => onNavigate('schedule')}
                className="text-xs font-bold text-gold-dark hover:underline cursor-pointer"
              >
                View Full Timetable
              </button>
            </div>

            <div className="space-y-3">
              {schedules.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl border border-line bg-cream/40 hover:bg-cream transition-colors flex items-center justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-ink truncate">{item.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider bg-soft text-gold-dark border border-line">
                        {item.instrument}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted flex-wrap">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {item.day_of_week || item.date} • {item.start_time} - {item.end_time}
                      </span>
                      {item.class_type === 'online' ? (
                        <span className="flex items-center gap-1 text-accentgreen font-semibold">
                          <Video className="w-3.5 h-3.5" /> Online
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-gold-dark font-semibold">
                          <MapPin className="w-3.5 h-3.5" /> {item.room_number || 'Studio'}
                        </span>
                      )}
                    </div>
                  </div>

                  {item.class_type === 'online' && item.meeting_link && (
                    <a
                      href={item.meeting_link}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-accentgreen hover:bg-[#52604a] text-white rounded-lg text-xs font-bold shrink-0 transition-colors flex items-center gap-1"
                    >
                      <span>Join</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-line text-center">
            <button
              onClick={onOpenScheduleModal}
              className="text-xs font-bold text-gold-dark hover:text-gold transition-colors cursor-pointer"
            >
              + Add &amp; Schedule Another Session
            </button>
          </div>
        </div>

        {/* Practice Submissions Awaiting Teacher Review */}
        <div className="bg-paper border border-line rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-line mb-4">
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-gold-dark" />
                <h3 className="font-extrabold text-base text-ink">Student Practice Reviews</h3>
              </div>
              <button
                onClick={() => onNavigate('submissions')}
                className="text-xs font-bold text-gold-dark hover:underline cursor-pointer"
              >
                All Submissions
              </button>
            </div>

            {pendingSubmissions.length === 0 ? (
              <div className="py-10 text-center space-y-2">
                <CheckCircle className="w-8 h-8 text-accentgreen mx-auto" />
                <p className="text-sm font-bold text-ink">All recordings reviewed!</p>
                <p className="text-xs text-muted">
                  New student audio/video recordings will appear here for your feedback.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingSubmissions.slice(0, 3).map((sub) => (
                  <div
                    key={sub.id}
                    className="p-3.5 rounded-xl border border-line bg-soft/40 hover:bg-soft transition-colors flex items-center justify-between gap-3"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-ink truncate">
                          {sub.student_name}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider bg-paper text-ink border border-line">
                          {sub.instrument}
                        </span>
                      </div>
                      <p className="text-xs text-muted truncate">{sub.title}</p>
                    </div>

                    <button
                      onClick={() => onNavigate('submissions')}
                      className="px-3.5 py-1.5 bg-gold hover:bg-gold-dark text-white rounded-lg text-xs font-bold shrink-0 transition-colors cursor-pointer"
                    >
                      Listen &amp; Review
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-line flex items-center justify-between text-xs text-muted">
            <span>Student Mobile App integration ready</span>
            <span className="font-bold text-ink">{submissions.length} Total Submissions</span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Admin Broadcast Notices */}
      <div className="bg-paper border border-line rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-line mb-4">
          <div className="flex items-center gap-2">
            <BellRing className="w-4 h-4 text-gold-dark" />
            <h3 className="font-extrabold text-base text-ink">Recent Academy Broadcasts</h3>
            <span className="text-[10px] bg-soft border border-line px-2 py-0.5 rounded-full text-muted font-bold">
              Admin Exclusive
            </span>
          </div>
          <button
            onClick={() => onNavigate('notifications')}
            className="text-xs font-bold text-gold-dark hover:underline cursor-pointer"
          >
            Notification Center
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {notifications.slice(0, 3).map((notif) => (
            <div
              key={notif.id}
              className="p-4 rounded-xl border border-line bg-cream/30 space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span
                    className={`text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full ${
                      notif.priority === 'urgent'
                        ? 'bg-red-100 text-red-700 border border-red-200'
                        : notif.priority === 'high'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-soft text-muted border border-line'
                    }`}
                  >
                    {notif.category.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] text-muted">
                    {new Date(notif.created_at).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-ink line-clamp-1">{notif.title}</h4>
                <p className="text-xs text-muted line-clamp-2 mt-1">{notif.message}</p>
              </div>

              <div className="text-[10px] font-semibold text-muted pt-2 border-t border-line/60">
                Audience: <span className="text-ink font-bold capitalize">{notif.target_audience}</span>
                {notif.target_value && ` (${notif.target_value})`}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
