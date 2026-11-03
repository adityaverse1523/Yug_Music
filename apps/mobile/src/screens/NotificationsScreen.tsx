import React from 'react';
import { ArrowLeft, BellRing, CheckCheck, Megaphone, Users } from 'lucide-react';
import { useStudentData } from '../context/StudentContext';

interface NotificationsScreenProps {
  onBack: () => void;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ onBack }) => {
  const { notifications, readNotifs, markNotifAsRead } = useStudentData();

  return (
    <div className="space-y-4 pb-20 animate-in fade-in">
      {/* Top Bar with Back */}
      <div className="bg-paper border border-line rounded-2xl p-4 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg hover:bg-soft text-ink transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-base font-extrabold text-ink leading-tight">Academy Notices</h2>
            <p className="text-[11px] text-muted">Broadcasts sent by Prof. Yug</p>
          </div>
        </div>

        <span className="text-[10px] font-bold bg-soft text-gold-dark px-2.5 py-1 rounded-full border border-line">
          {notifications.length} Alerts
        </span>
      </div>

      {notifications.length === 0 ? (
        <div className="bg-paper border border-line rounded-2xl p-12 text-center space-y-2">
          <BellRing className="w-8 h-8 text-muted mx-auto" />
          <p className="text-sm font-bold text-ink">No new announcements</p>
          <p className="text-xs text-muted">Academy notices and class alerts will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => {
            const isUrgent = notif.priority === 'urgent';
            const isHigh = notif.priority === 'high';

            return (
              <div
                key={notif.id}
                onClick={() => markNotifAsRead(notif.id)}
                className={`bg-paper border rounded-2xl p-4 shadow-xs space-y-2.5 transition-all ${
                  isUrgent
                    ? 'border-red-300 ring-1 ring-red-200'
                    : isHigh
                    ? 'border-amber-300'
                    : 'border-line'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      isUrgent
                        ? 'bg-red-100 text-red-700'
                        : isHigh
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-soft text-gold-dark border border-line'
                    }`}
                  >
                    {notif.category.replace('_', ' ')}
                  </span>

                  <span className="text-[10px] text-muted">
                    {new Date(notif.created_at).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="font-extrabold text-sm text-ink">{notif.title}</h3>

                <p className="text-xs text-ink/80 leading-relaxed bg-cream/40 p-2.5 rounded-xl border border-line/60">
                  {notif.message}
                </p>

                <div className="flex items-center justify-between text-[11px] text-muted pt-1">
                  <span>
                    By: <strong>{notif.sent_by}</strong>
                  </span>
                  <span className="capitalize text-[10px] font-semibold text-gold-dark">
                    Audience: {notif.target_audience} {notif.target_value && `(${notif.target_value})`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

