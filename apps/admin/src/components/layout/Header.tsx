import React from 'react';
import { Radio, Database, CalendarPlus } from 'lucide-react';
import { ACADEMY_CONFIG } from '@yug/shared';
import { useAppData } from '../../context/AppDataContext';

interface HeaderProps {
  onOpenScheduleModal: () => void;
  onOpenNotificationModal: () => void;
  unreadNotifsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenScheduleModal,
  onOpenNotificationModal,
  unreadNotifsCount,
}) => {
  const { isSupabaseLive } = useAppData();

  return (
    <header className="bg-paper border-b border-line sticky top-0 z-20">
      <div className="px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-soft border border-line flex items-center justify-center text-gold-dark text-xl font-bold shadow-sm">
            ♫
          </div>
          <div>
            <div className="font-extrabold tracking-wide text-ink text-base leading-none">
              YUG MUSICAL ACADEMY
            </div>
            <span className="text-[10px] tracking-[2px] text-muted font-bold block mt-1">
              TEACHER &amp; ADMIN PORTAL
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Supabase Status Pill */}
          <div
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
              isSupabaseLive
                ? 'bg-[#eef3eb] text-accentgreen border-[#d3e2cd]'
                : 'bg-soft text-gold-dark border-line'
            }`}
            title={
              isSupabaseLive
                ? 'Connected to live Supabase Postgres database'
                : 'Running in Local Storage Mode. Configure .env with Supabase credentials for cloud sync.'
            }
          >
            <Database className="w-3.5 h-3.5" />
            <span>{isSupabaseLive ? 'Supabase Live' : 'Local Storage Mode'}</span>
            <span
              className={`w-2 h-2 rounded-full ${
                isSupabaseLive ? 'bg-accentgreen animate-pulse' : 'bg-gold'
              }`}
            />
          </div>

          {/* Quick Schedule Class Button */}
          <button
            onClick={onOpenScheduleModal}
            className="flex items-center gap-1.5 bg-soft hover:bg-[#e9dfcd] text-ink border border-line px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            <CalendarPlus className="w-4 h-4 text-gold-dark" />
            <span className="hidden md:inline">Schedule Class</span>
          </button>

          {/* Quick Send Broadcast Button */}
          <button
            onClick={onOpenNotificationModal}
            className="flex items-center gap-1.5 bg-gold hover:bg-gold-dark text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm cursor-pointer"
          >
            <Radio className="w-4 h-4" />
            <span>Send Notice</span>
            {unreadNotifsCount > 0 && (
              <span className="bg-black/20 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          {/* Teacher Profile Tag */}
          <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-line text-xs">
            <div className="w-8 h-8 rounded-full bg-gold/20 text-gold-dark font-bold flex items-center justify-center border border-gold/30">
              PY
            </div>
            <div>
              <p className="font-bold text-ink leading-tight">{ACADEMY_CONFIG.directorName}</p>
              <p className="text-[11px] text-muted">{ACADEMY_CONFIG.directorTitle}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
