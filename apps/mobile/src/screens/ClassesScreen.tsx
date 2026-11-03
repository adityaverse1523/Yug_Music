import React from 'react';
import { Calendar, Video, MapPin, Clock, ExternalLink, Copy, Check } from 'lucide-react';
import { useStudentData } from '../context/StudentContext';

export const ClassesScreen: React.FC = () => {
  const { currentStudent, schedules } = useStudentData();
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopyLink = (id: string, link?: string) => {
    if (!link) return;
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4 pb-20">
      <div className="bg-paper border border-line rounded-2xl p-4 shadow-xs">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-gold-dark bg-soft px-2.5 py-0.5 rounded-full border border-line">
          My Academy Timetable
        </span>
        <h2 className="text-lg font-extrabold text-ink mt-1">Class Schedule</h2>
        <p className="text-xs text-muted">
          Your weekly batches and live online sessions with Prof. Yug.
        </p>
      </div>

      <div className="space-y-3">
        {schedules.map((schedule) => {
          const isMyBatch =
            schedule.batch_name === currentStudent.batch_name ||
            schedule.instrument === currentStudent.instrument;

          return (
            <div
              key={schedule.id}
              className={`bg-paper border rounded-2xl p-4 shadow-xs space-y-3 transition-all ${
                isMyBatch ? 'border-gold/60 ring-1 ring-gold/20' : 'border-line opacity-80'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-soft text-gold-dark border border-line">
                  {schedule.instrument}
                </span>

                {isMyBatch ? (
                  <span className="text-[9px] font-extrabold bg-[#eef3eb] text-accentgreen border border-[#d3e2cd] px-2 py-0.5 rounded-full">
                    Enrolled Batch
                  </span>
                ) : (
                  <span className="text-[10px] text-muted capitalize">
                    {schedule.recurrence}
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-extrabold text-sm text-ink">{schedule.title}</h3>
                <p className="text-xs text-gold-dark font-medium mt-0.5">
                  {schedule.batch_name}
                </p>
                <p className="text-[11px] text-muted">
                  Instructor: <strong>{schedule.teacher_name}</strong>
                </p>
              </div>

              <div className="p-2.5 bg-cream/40 rounded-xl border border-line/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-ink">
                  <Clock className="w-3.5 h-3.5 text-gold-dark" />
                  <span>
                    {schedule.day_of_week || schedule.date} • {schedule.start_time} - {schedule.end_time}
                  </span>
                </div>

                {schedule.class_type === 'online' ? (
                  <span className="flex items-center gap-1 text-[11px] text-accentgreen font-bold">
                    <Video className="w-3.5 h-3.5" /> Online
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] text-gold-dark font-bold">
                    <MapPin className="w-3.5 h-3.5" /> {schedule.room_number || 'Studio'}
                  </span>
                )}
              </div>

              {schedule.description && (
                <p className="text-xs text-muted italic bg-cream/30 p-2 rounded-lg border border-line/40">
                  "{schedule.description}"
                </p>
              )}

              {schedule.class_type === 'online' && schedule.meeting_link && (
                <div className="pt-1 flex items-center gap-2">
                  <a
                    href={schedule.meeting_link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2 bg-accentgreen hover:bg-[#52604a] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <span>Join Class Now</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => handleCopyLink(schedule.id, schedule.meeting_link)}
                    title="Copy Meeting Link"
                    className="p-2 bg-soft hover:bg-line/60 border border-line rounded-xl text-ink transition-colors cursor-pointer"
                  >
                    {copiedId === schedule.id ? (
                      <Check className="w-4 h-4 text-accentgreen" />
                    ) : (
                      <Copy className="w-4 h-4 text-muted" />
                    )}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

