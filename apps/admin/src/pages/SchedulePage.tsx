import React, { useState } from 'react';
import {
  CalendarDays,
  Plus,
  Video,
  MapPin,
  Clock,
  Users,
  Copy,
  Trash2,
  ExternalLink,
  Check,
  Filter,
} from 'lucide-react';
import { INSTRUMENT_LIST, sanitizeExternalUrl } from '@yug/shared';
import { useAppData } from '../context/AppDataContext';

interface SchedulePageProps {
  onOpenScheduleModal: () => void;
}

export const SchedulePage: React.FC<SchedulePageProps> = ({ onOpenScheduleModal }) => {
  const { schedules, deleteSchedule } = useAppData();
  const [selectedInstrument, setSelectedInstrument] = useState<string>('all');
  const [selectedFormat, setSelectedFormat] = useState<'all' | 'online' | 'offline'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredSchedules = schedules.filter((item) => {
    if (selectedInstrument !== 'all' && item.instrument !== selectedInstrument) return false;
    if (selectedFormat !== 'all' && item.class_type !== selectedFormat) return false;
    return true;
  });

  const handleCopyLink = (id: string, link?: string) => {
    if (!link) return;
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-gold-dark bg-soft px-2.5 py-0.5 rounded-full border border-line">
              Teacher Timetable Management
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-ink mt-1">Class Schedules &amp; Batches</h1>
          <p className="text-xs text-muted">
            Teacher can add, schedule, and organize weekly recurring or one-time music sessions.
          </p>
        </div>

        <button
          onClick={onOpenScheduleModal}
          className="px-4 py-2.5 bg-gold hover:bg-gold-dark text-white rounded-xl text-xs font-bold transition-all shadow flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Schedule New Class</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-paper p-4 rounded-xl border border-line flex flex-wrap items-center justify-between gap-3 shadow-xs">
        {/* Instrument Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 max-w-full">
          <button
            onClick={() => setSelectedInstrument('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
              selectedInstrument === 'all'
                ? 'bg-gold text-white'
                : 'bg-soft text-muted hover:text-ink'
            }`}
          >
            All Instruments ({schedules.length})
          </button>
          {INSTRUMENT_LIST.map((inst) => {
            const count = schedules.filter((s) => s.instrument === inst.name).length;
            if (count === 0) return null;
            return (
              <button
                key={inst.name}
                onClick={() => setSelectedInstrument(inst.name)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  selectedInstrument === inst.name
                    ? 'bg-gold text-white'
                    : 'bg-soft text-muted hover:text-ink'
                }`}
              >
                <span>{inst.icon}</span>
                <span>{inst.name}</span>
                <span className="text-[10px] opacity-75">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Format Filter */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-muted font-bold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Format:
          </span>
          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value as any)}
            className="text-xs font-semibold px-2.5 py-1.5 bg-white border border-line rounded-lg focus:outline-none focus:border-gold"
          >
            <option value="all">All Formats</option>
            <option value="online">Online Live Classes</option>
            <option value="offline">In-Studio (Offline)</option>
          </select>
        </div>
      </div>

      {/* Schedules Cards Grid */}
      {filteredSchedules.length === 0 ? (
        <div className="bg-paper border border-line rounded-2xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-soft text-gold-dark flex items-center justify-center mx-auto text-xl font-bold">
            📅
          </div>
          <h3 className="font-extrabold text-lg text-ink">No scheduled classes found</h3>
          <p className="text-xs text-muted max-w-sm mx-auto">
            You can schedule regular batches, weekly riyaaz sessions, or masterclasses with live links.
          </p>
          <button
            onClick={onOpenScheduleModal}
            className="px-4 py-2 bg-gold hover:bg-gold-dark text-white rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule First Class</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSchedules.map((schedule) => {
            const isCopied = copiedId === schedule.id;

            return (
              <div
                key={schedule.id}
                className="bg-paper border border-line rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-gold/60 transition-all space-y-4"
              >
                {/* Card Top: Instrument & Recurrence */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-soft text-gold-dark border border-line flex items-center gap-1">
                      <span>{INSTRUMENT_LIST.find((i) => i.name === schedule.instrument)?.icon || '🎵'}</span>
                      <span>{schedule.instrument}</span>
                    </span>

                    <span className="text-[10px] font-semibold text-muted bg-cream px-2 py-0.5 rounded border border-line capitalize">
                      {schedule.recurrence}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-ink line-clamp-1">{schedule.title}</h3>
                  <p className="text-xs text-gold-dark font-medium mt-0.5">{schedule.batch_name}</p>

                  {/* Timing & Venue */}
                  <div className="mt-3 p-3 bg-cream/50 rounded-xl border border-line/60 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-ink font-semibold">
                      <Clock className="w-3.5 h-3.5 text-gold-dark" />
                      <span>
                        {schedule.day_of_week || schedule.date} • {schedule.start_time} - {schedule.end_time}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-muted">
                      {schedule.class_type === 'online' ? (
                        <span className="flex items-center gap-1 text-accentgreen font-semibold">
                          <Video className="w-3.5 h-3.5" /> Online (500+ Capacity)
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-ink font-medium">
                          <MapPin className="w-3.5 h-3.5 text-gold-dark" />
                          {schedule.room_number || 'Main Studio'}
                        </span>
                      )}

                      <span className="flex items-center gap-1 text-[11px]">
                        <Users className="w-3 h-3" /> Max {schedule.max_students || 30}
                      </span>
                    </div>
                  </div>

                  {/* Description / Agenda */}
                  {schedule.description && (
                    <p className="text-xs text-muted line-clamp-2 mt-2 italic">
                      "{schedule.description}"
                    </p>
                  )}
                </div>

                {/* Card Bottom Actions */}
                <div className="pt-3 border-t border-line/70 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {schedule.class_type === 'online' && schedule.meeting_link && (
                      <>
                        <a
                          href={sanitizeExternalUrl(schedule.meeting_link)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-accentgreen hover:bg-[#52604a] text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                        >
                          <span>Start Class</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>

                        <button
                          onClick={() => handleCopyLink(schedule.id, schedule.meeting_link)}
                          title="Copy Meeting Link for Students"
                          className="p-1.5 bg-soft hover:bg-line/60 text-ink rounded-lg transition-colors border border-line cursor-pointer"
                        >
                          {isCopied ? (
                            <Check className="w-3.5 h-3.5 text-accentgreen" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-muted" />
                          )}
                        </button>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      if (confirm(`Cancel and delete "${schedule.title}"?`)) {
                        deleteSchedule(schedule.id);
                      }
                    }}
                    title="Delete Class"
                    className="p-1.5 text-muted hover:text-red-600 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
