import React from 'react';
import {
  Calendar,
  Video,
  MapPin,
  Clock,
  Mic,
  Star,
  ExternalLink,
  BellRing,
  ChevronRight,
  Award,
} from 'lucide-react';
import { useStudentData } from '../context/StudentContext';
import { MobileTab } from '../components/layout/BottomNav';
import { sanitizeExternalUrl, ACADEMY_CONFIG } from '@yug/shared';

interface HomeScreenProps {
  onNavigateTab: (tab: MobileTab) => void;
  onOpenNotifications: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateTab,
  onOpenNotifications,
}) => {
  const { currentStudent, schedules, notifications, mySubmissions } = useStudentData();

  if (!currentStudent) return null;

  // Find next class for this student
  const nextClass = schedules.find(
    (s) => s.batch_name === currentStudent.batch_name || s.instrument === currentStudent.instrument
  ) || schedules[0];

  // Latest reviewed submission
  const latestReviewed = mySubmissions.find((s) => s.status === 'reviewed');

  // Latest notification
  const latestNotif = notifications[0];

  return (
    <div className="space-y-4 pb-20">
      {/* Student Welcome Header Card */}
      <div className="bg-paper border border-line rounded-2xl p-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-soft border border-line flex items-center justify-center font-bold text-gold-dark text-sm">
              {currentStudent.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-[11px] text-muted font-bold uppercase tracking-wider">
                Namaste 🙏
              </p>
              <h2 className="font-extrabold text-base text-ink leading-tight">
                {currentStudent.name}
              </h2>
              <span className="text-[10px] text-gold-dark font-semibold">
                {currentStudent.instrument} • {currentStudent.skill_level}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#eef3eb] text-accentgreen border border-[#d3e2cd] inline-block">
              {currentStudent.fee_status === 'paid' ? 'Active Term' : 'Fee Pending'}
            </span>
          </div>
        </div>
      </div>

      {/* Broadcast Alert Banner if available */}
      {latestNotif && (
        <div
          onClick={onOpenNotifications}
          className="bg-cream border border-line rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-xs cursor-pointer active:scale-[0.99] transition-transform"
        >
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gold/15 text-gold-dark flex items-center justify-center shrink-0 mt-0.5">
              <BellRing className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-gold-dark">
                  Academy Notice
                </span>
                <span className="text-[9px] text-muted">
                  {new Date(latestNotif.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="font-bold text-xs text-ink line-clamp-1">{latestNotif.title}</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-muted shrink-0" />
        </div>
      )}

      {/* Upcoming Class Card */}
      {nextClass && (
        <div className="bg-paper border border-line rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-line">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-ink">
              <Calendar className="w-4 h-4 text-gold-dark" />
              <span>Next Upcoming Class</span>
            </div>
            <button
              onClick={() => onNavigateTab('classes')}
              className="text-[11px] font-bold text-gold-dark hover:underline"
            >
              Full Schedule
            </button>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-ink">{nextClass.title}</h3>
              <span className="text-[10px] font-bold bg-soft px-2 py-0.5 rounded text-gold-dark border border-line">
                {nextClass.instrument}
              </span>
            </div>
            <p className="text-xs text-muted mt-0.5">{nextClass.batch_name}</p>

            <div className="mt-2.5 p-2.5 bg-cream/50 rounded-xl border border-line/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-ink font-semibold">
                <Clock className="w-3.5 h-3.5 text-gold-dark" />
                <span>
                  {nextClass.day_of_week || nextClass.date} • {nextClass.start_time}
                </span>
              </div>

              {nextClass.class_type === 'online' ? (
                <span className="flex items-center gap-1 text-[11px] text-accentgreen font-bold">
                  <Video className="w-3.5 h-3.5" /> Online
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] text-gold-dark font-bold">
                  <MapPin className="w-3.5 h-3.5" /> {nextClass.room_number || 'Studio'}
                </span>
              )}
            </div>
          </div>

          {nextClass.class_type === 'online' && nextClass.meeting_link && (
            <a
              href={sanitizeExternalUrl(nextClass.meeting_link)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 bg-accentgreen hover:bg-[#52604a] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
            >
              <span>Join Live Class (Google Meet)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      )}

      {/* Quick Riyaaz CTA */}
      <div className="bg-gradient-to-r from-soft to-[#f7eedf] border border-line rounded-2xl p-4 shadow-xs flex items-center justify-between gap-3">
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-gold-dark">
            Daily Music Sadhana
          </span>
          <h3 className="font-extrabold text-sm text-ink">Ready for today's riyaaz?</h3>
          <p className="text-xs text-muted">
            Record your practice track &amp; send it to {ACADEMY_CONFIG.directorName} for feedback.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('riyaaz')}
          className="w-12 h-12 rounded-full bg-gold hover:bg-gold-dark text-white flex items-center justify-center shrink-0 shadow-sm transition-transform active:scale-95 cursor-pointer"
        >
          <Mic className="w-5 h-5" />
        </button>
      </div>

      {/* Latest Teacher Feedback Review */}
      {latestReviewed && (
        <div className="bg-paper border border-line rounded-2xl p-4 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-ink flex items-center gap-1.5">
              <Award className="w-4 h-4 text-gold-dark" />
              <span>Sir's Latest Review</span>
            </span>

            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-3.5 h-3.5 ${
                    star <= (latestReviewed.rating || 0)
                      ? 'fill-gold text-gold'
                      : 'text-line'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="p-3 bg-cream/40 rounded-xl border border-line/60 space-y-1 text-xs">
            <p className="font-bold text-ink">{latestReviewed.title}</p>
            <p className="text-muted italic">"{latestReviewed.feedback_notes}"</p>
            <p className="text-[10px] text-gold-dark font-semibold pt-1">
              Reviewed by {ACADEMY_CONFIG.directorName}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

