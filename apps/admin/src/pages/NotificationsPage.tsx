import React, { useState } from 'react';
import {
  BellRing,
  Radio,
  Send,
  Users,
  Trash2,
  CheckCircle2,
  Megaphone,
} from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { NotificationCategory } from '@yug/shared';

interface NotificationsPageProps {
  onOpenNotificationModal: () => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({
  onOpenNotificationModal,
}) => {
  const { notifications, deleteNotification } = useAppData();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredNotifications = notifications.filter((notif) => {
    if (selectedCategory !== 'all' && notif.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-gold-dark bg-soft px-2.5 py-0.5 rounded-full border border-line">
              Academy Broadcast Engine
            </span>
            <span className="text-xs text-muted font-bold">• Admin Only Dispatch</span>
          </div>
          <h1 className="text-2xl font-extrabold text-ink mt-1">Student App Notifications</h1>
          <p className="text-xs text-muted">
            All announcements and alerts sent here are delivered directly to students' mobile phones.
          </p>
        </div>

        <button
          onClick={onOpenNotificationModal}
          className="px-4 py-2.5 bg-gold hover:bg-gold-dark text-white rounded-xl text-xs font-bold transition-all shadow flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Radio className="w-4 h-4" />
          <span>+ Dispatch New Broadcast</span>
        </button>
      </div>

      {/* Info Banner on Push Authority */}
      <div className="bg-soft/60 border border-line rounded-2xl p-4 flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-gold/20 text-gold-dark flex items-center justify-center shrink-0 mt-0.5">
          <Megaphone className="w-4 h-4" />
        </div>
        <div className="text-xs space-y-0.5">
          <p className="font-bold text-ink">Strict Push Control Active</p>
          <p className="text-muted">
            Students cannot create public announcements. Only you (Admin/Teacher) have the authority to trigger push feeds, filter by instrument, or send urgent class alerts.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-line">
        {[
          { id: 'all', label: 'All Notices' },
          { id: 'announcement', label: '📢 Announcements' },
          { id: 'class_update', label: '⏰ Class Timing Updates' },
          { id: 'practice_reminder', label: '🎵 Practice Reminders' },
          { id: 'urgent', label: '🚨 Urgent Alerts' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategory(tab.id)}
            className={`px-3 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0 ${
              selectedCategory === tab.id
                ? 'bg-gold text-white shadow-xs'
                : 'text-muted hover:bg-paper hover:text-ink'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notification List */}
      {filteredNotifications.length === 0 ? (
        <div className="bg-paper border border-line rounded-2xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-soft text-gold-dark flex items-center justify-center mx-auto text-xl font-bold">
            <BellRing className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-lg text-ink">No broadcast notifications yet</h3>
          <p className="text-xs text-muted max-w-sm mx-auto">
            Dispatch announcements about exams, holidays, class timing adjustments or special practice exercises.
          </p>
          <button
            onClick={onOpenNotificationModal}
            className="px-4 py-2 bg-gold hover:bg-gold-dark text-white rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Send First Notice</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notif) => {
            const isUrgent = notif.priority === 'urgent';
            const isHigh = notif.priority === 'high';

            return (
              <div
                key={notif.id}
                className="bg-paper border border-line rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-start justify-between gap-4 hover:border-gold/50 transition-all"
              >
                <div className="space-y-2 flex-1">
                  {/* Category & Metadata */}
                  <div className="flex items-center flex-wrap gap-2">
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        isUrgent
                          ? 'bg-red-100 text-red-700 border border-red-200'
                          : isHigh
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-soft text-gold-dark border border-line'
                      }`}
                    >
                      {notif.category.replace('_', ' ')}
                    </span>

                    {/* Target Audience Pill */}
                    <span className="text-[10px] bg-cream border border-line px-2 py-0.5 rounded-full font-bold text-muted flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>Audience: </span>
                      <span className="text-ink font-extrabold capitalize">
                        {notif.target_audience}
                        {notif.target_value && ` (${notif.target_value})`}
                      </span>
                    </span>

                    <span className="text-[11px] text-muted">
                      {new Date(notif.created_at).toLocaleString()}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-ink">{notif.title}</h3>
                  <p className="text-sm text-ink/80 leading-relaxed whitespace-pre-line bg-cream/30 p-3 rounded-xl border border-line/60">
                    {notif.message}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-muted pt-1">
                    <span>
                      Dispatched by: <strong className="text-ink">{notif.sent_by}</strong>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-accentgreen font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Delivered to Student Mobile App
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2 self-end md:self-start">
                  <button
                    onClick={() => {
                      if (confirm(`Retract and delete notification "${notif.title}"?`)) {
                        deleteNotification(notif.id);
                      }
                    }}
                    title="Retract / Delete Notification"
                    className="p-2 text-muted hover:text-red-600 rounded-lg hover:bg-cream transition-colors cursor-pointer"
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
