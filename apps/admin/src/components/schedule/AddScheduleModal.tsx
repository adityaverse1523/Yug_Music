import React, { useState } from 'react';
import { X, Video, MapPin } from 'lucide-react';
import { INSTRUMENT_LIST, BATCH_NAMES, DAYS_OF_WEEK } from '@yug/shared';
import { InstrumentType, ClassType, RecurrenceType } from '@yug/shared';
import { useAppData } from '../../context/AppDataContext';

interface AddScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddScheduleModal: React.FC<AddScheduleModalProps> = ({ isOpen, onClose }) => {
  const { addSchedule } = useAppData();

  const [title, setTitle] = useState('');
  const [instrument, setInstrument] = useState<InstrumentType>('Guitar');
  const [batchName, setBatchName] = useState(BATCH_NAMES[1]);
  const [teacherName, setTeacherName] = useState('Prof. Yug');
  const [classType, setClassType] = useState<ClassType>('online');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/yug-live-');
  const [roomNumber, setRoomNumber] = useState('Studio Room 1');
  const [dayOfWeek, setDayOfWeek] = useState(DAYS_OF_WEEK[0]);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('17:00');
  const [endTime, setEndTime] = useState('18:00');
  const [recurrence, setRecurrence] = useState<RecurrenceType>('weekly');
  const [maxStudents, setMaxStudents] = useState(25);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    try {
      await addSchedule({
        title,
        instrument,
        batch_name: batchName,
        teacher_name: teacherName,
        class_type: classType,
        meeting_link: classType === 'online' ? meetingLink : undefined,
        room_number: classType === 'offline' ? roomNumber : undefined,
        day_of_week: recurrence === 'weekly' ? dayOfWeek : undefined,
        date: recurrence === 'once' ? date : undefined,
        start_time: startTime,
        end_time: endTime,
        recurrence,
        max_students: Number(maxStudents),
        description,
      });
      onClose();
      // Reset form
      setTitle('');
      setDescription('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-ink/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-paper border border-line rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-soft border-b border-line flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gold/20 text-gold-dark flex items-center justify-center font-bold">
              📅
            </div>
            <div>
              <h3 className="font-extrabold text-base text-ink">Schedule Music Class</h3>
              <p className="text-xs text-muted">Create a new live online or in-studio session</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-line/50 flex items-center justify-center text-muted hover:text-ink transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Class Title & Teacher */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                Class Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Acoustic Guitar Rhythms & Transitions"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-line rounded-lg text-sm focus:outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                Instructor
              </label>
              <input
                type="text"
                required
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-line rounded-lg text-sm focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          {/* Instrument & Batch */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                Instrument
              </label>
              <select
                value={instrument}
                onChange={(e) => setInstrument(e.target.value as InstrumentType)}
                className="w-full px-3.5 py-2.5 bg-white border border-line rounded-lg text-sm focus:outline-none focus:border-gold"
              >
                {INSTRUMENT_LIST.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.icon} {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                Batch Name
              </label>
              <select
                value={batchName}
                onChange={(e) => setBatchName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-line rounded-lg text-sm focus:outline-none focus:border-gold"
              >
                {BATCH_NAMES.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mode: Online vs Offline Studio */}
          <div>
            <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
              Delivery Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setClassType('online')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-xs font-bold cursor-pointer transition-all ${
                  classType === 'online'
                    ? 'bg-soft border-gold text-gold-dark ring-1 ring-gold'
                    : 'bg-white border-line text-muted hover:bg-cream'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>Online Live Class</span>
              </button>
              <button
                type="button"
                onClick={() => setClassType('offline')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-xs font-bold cursor-pointer transition-all ${
                  classType === 'offline'
                    ? 'bg-soft border-gold text-gold-dark ring-1 ring-gold'
                    : 'bg-white border-line text-muted hover:bg-cream'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>In-Studio (Offline)</span>
              </button>
            </div>
          </div>

          {/* Online Link or Offline Room */}
          {classType === 'online' ? (
            <div>
              <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                Meeting URL (Google Meet / Zoom)
              </label>
              <input
                type="url"
                required
                placeholder="https://meet.google.com/xyz-abcd-efg"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-line rounded-lg text-sm focus:outline-none focus:border-gold font-mono text-xs"
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                Studio Room / Venue
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Studio Room 2 - Acoustic Hall"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-line rounded-lg text-sm focus:outline-none focus:border-gold"
              />
            </div>
          )}

          {/* Recurrence & Day */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                Recurrence
              </label>
              <select
                value={recurrence}
                onChange={(e) => setRecurrence(e.target.value as RecurrenceType)}
                className="w-full px-3.5 py-2.5 bg-white border border-line rounded-lg text-sm focus:outline-none focus:border-gold"
              >
                <option value="weekly">Weekly Recurring</option>
                <option value="daily">Daily Riyaaz</option>
                <option value="once">One-time Masterclass</option>
              </select>
            </div>

            {recurrence === 'weekly' && (
              <div>
                <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                  Day of Week
                </label>
                <select
                  value={dayOfWeek}
                  onChange={(e) => setDayOfWeek(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-line rounded-lg text-sm focus:outline-none focus:border-gold"
                >
                  {DAYS_OF_WEEK.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {recurrence === 'once' && (
              <div>
                <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                  Specific Date
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-line rounded-lg text-sm focus:outline-none focus:border-gold"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                Max Capacity
              </label>
              <input
                type="number"
                min="1"
                max="500"
                value={maxStudents}
                onChange={(e) => setMaxStudents(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-white border border-line rounded-lg text-sm focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          {/* Timings */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                Start Time
              </label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-line rounded-lg text-sm focus:outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                End Time
              </label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-line rounded-lg text-sm focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          {/* Description / Lesson Agenda */}
          <div>
            <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
              Class Agenda &amp; Preparation Notes
            </label>
            <textarea
              rows={2}
              placeholder="What should students keep ready? (e.g. Keep acoustic guitar in standard tuning, practice Lesson 4 chord charts)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-line rounded-lg text-sm focus:outline-none focus:border-gold"
            />
          </div>

          {/* Submit Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-line">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-muted hover:text-ink cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-gold hover:bg-gold-dark text-white rounded-lg text-xs font-bold shadow transition-colors cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Saving Schedule...' : 'Save & Schedule Class'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
