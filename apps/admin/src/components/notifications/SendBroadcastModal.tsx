import React, { useState } from 'react';
import { X, Radio, BellRing, Send } from 'lucide-react';
import { NotificationCategory, TargetAudience } from '@yug/shared';
import { INSTRUMENT_LIST, BATCH_NAMES, ACADEMY_CONFIG, sanitizeText } from '@yug/shared';
import { useAppData } from '../../context/AppDataContext';

interface SendBroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SendBroadcastModal: React.FC<SendBroadcastModalProps> = ({ isOpen, onClose }) => {
  const { sendNotification } = useAppData();

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState<NotificationCategory>('announcement');
  const [targetAudience, setTargetAudience] = useState<TargetAudience>('all');
  const [targetValue, setTargetValue] = useState('');
  const [priority, setPriority] = useState<'normal' | 'high' | 'urgent'>('normal');
  const [sentBy, setSentBy] = useState(`${ACADEMY_CONFIG.directorName} (${ACADEMY_CONFIG.directorTitle})`);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    setSubmitting(true);
    try {
      await sendNotification({
        title: sanitizeText(title),
        message: sanitizeText(message),
        category,
        target_audience: targetAudience,
        target_value: targetAudience === 'all' ? undefined : targetValue,
        sent_by: sanitizeText(sentBy) || ACADEMY_CONFIG.directorName,
        priority,
      });
      onClose();
      // Reset
      setTitle('');
      setMessage('');
      setTargetAudience('all');
      setTargetValue('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-ink/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-paper border border-line rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-soft border-b border-line flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gold/20 text-gold-dark flex items-center justify-center font-bold">
              <Radio className="w-4 h-4 text-gold-dark" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-ink">Broadcast Notification</h3>
                <span className="text-[10px] bg-gold/15 text-gold-dark px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Admin Only
                </span>
              </div>
              <p className="text-xs text-muted">
                Push live updates directly to students' mobile app feed
              </p>
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
          {/* Notification Title */}
          <div>
            <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
              Notice Headline *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Monthly Recital Announcement or Timing Revision"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-line rounded-lg text-sm focus:outline-none focus:border-gold"
            />
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as NotificationCategory)}
                className="w-full px-3.5 py-2.5 bg-white border border-line rounded-lg text-sm focus:outline-none focus:border-gold"
              >
                <option value="announcement">📢 Academy Announcement</option>
                <option value="class_update">⏰ Class Schedule / Timing Update</option>
                <option value="practice_reminder">🎵 Daily Riyaaz / Practice Reminder</option>
                <option value="urgent">🚨 Urgent Academy Notice</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'normal' | 'high' | 'urgent')}
                className="w-full px-3.5 py-2.5 bg-white border border-line rounded-lg text-sm focus:outline-none focus:border-gold"
              >
                <option value="normal">Normal (Standard Feed)</option>
                <option value="high">High (Featured Notification)</option>
                <option value="urgent">Urgent (Push Alert Banner)</option>
              </select>
            </div>
          </div>

          {/* Target Audience Filter */}
          <div>
            <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
              Target Audience
            </label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              <button
                type="button"
                onClick={() => {
                  setTargetAudience('all');
                  setTargetValue('');
                }}
                className={`py-2 px-2 text-xs font-bold rounded-lg border cursor-pointer transition-all ${
                  targetAudience === 'all'
                    ? 'bg-soft border-gold text-gold-dark ring-1 ring-gold'
                    : 'bg-white border-line text-muted hover:bg-cream'
                }`}
              >
                All Students
              </button>
              <button
                type="button"
                onClick={() => {
                  setTargetAudience('instrument');
                  setTargetValue(INSTRUMENT_LIST[0].name);
                }}
                className={`py-2 px-2 text-xs font-bold rounded-lg border cursor-pointer transition-all ${
                  targetAudience === 'instrument'
                    ? 'bg-soft border-gold text-gold-dark ring-1 ring-gold'
                    : 'bg-white border-line text-muted hover:bg-cream'
                }`}
              >
                By Instrument
              </button>
              <button
                type="button"
                onClick={() => {
                  setTargetAudience('batch');
                  setTargetValue(BATCH_NAMES[0]);
                }}
                className={`py-2 px-2 text-xs font-bold rounded-lg border cursor-pointer transition-all ${
                  targetAudience === 'batch'
                    ? 'bg-soft border-gold text-gold-dark ring-1 ring-gold'
                    : 'bg-white border-line text-muted hover:bg-cream'
                }`}
              >
                By Batch
              </button>
            </div>

            {/* Target Value Dropdown if filtered */}
            {targetAudience === 'instrument' && (
              <div className="mt-2">
                <label className="block text-[11px] font-semibold text-muted mb-1">
                  Select Specific Instrument:
                </label>
                <select
                  value={targetValue}
                  onChange={(e) => setTargetValue(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-line rounded-lg text-sm focus:outline-none focus:border-gold"
                >
                  {INSTRUMENT_LIST.map((item) => (
                    <option key={item.name} value={item.name}>
                      {item.icon} {item.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {targetAudience === 'batch' && (
              <div className="mt-2">
                <label className="block text-[11px] font-semibold text-muted mb-1">
                  Select Specific Batch:
                </label>
                <select
                  value={targetValue}
                  onChange={(e) => setTargetValue(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-line rounded-lg text-sm focus:outline-none focus:border-gold"
                >
                  {BATCH_NAMES.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Message Content */}
          <div>
            <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
              Notice Body Message *
            </label>
            <textarea
              rows={4}
              required
              placeholder="Write the detailed announcement for students. Include links, guidelines, or instructions..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-line rounded-lg text-sm focus:outline-none focus:border-gold"
            />
          </div>

          {/* Sender Identity */}
          <div>
            <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
              Dispatched By
            </label>
            <input
              type="text"
              required
              value={sentBy}
              onChange={(e) => setSentBy(e.target.value)}
              className="w-full px-3.5 py-2 bg-white border border-line rounded-lg text-xs font-bold text-ink focus:outline-none focus:border-gold"
            />
          </div>

          {/* Notice info */}
          <div className="p-3 bg-soft/50 rounded-lg border border-line text-xs text-muted flex items-start gap-2">
            <BellRing className="w-4 h-4 text-gold-dark shrink-0 mt-0.5" />
            <span>
              This broadcast will be delivered to students' mobile app notification center and pinned according to priority.
            </span>
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
              className="px-5 py-2.5 bg-gold hover:bg-gold-dark text-white rounded-lg text-xs font-bold shadow transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Broadcasting...' : 'Broadcast Notification'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
