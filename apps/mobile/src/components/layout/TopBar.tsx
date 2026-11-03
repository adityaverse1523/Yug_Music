import React from 'react';
import { Bell, ChevronDown } from 'lucide-react';
import { useStudentData, DEMO_STUDENTS } from '../../context/StudentContext';

interface TopBarProps {
  onOpenNotifications: () => void;
  unreadCount: number;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenNotifications, unreadCount }) => {
  const { currentStudent, switchStudent } = useStudentData();

  return (
    <header className="bg-paper border-b border-line px-4 py-3 sticky top-0 z-30 flex items-center justify-between shadow-xs">
      {/* Brand */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-soft border border-line flex items-center justify-center text-gold-dark font-extrabold text-base shadow-xs">
          ♫
        </div>
        <div>
          <div className="font-extrabold text-xs tracking-wider text-ink leading-tight">
            YUG ACADEMY
          </div>
          <span className="text-[9px] tracking-widest text-muted font-bold block">
            STUDENT PORTAL
          </span>
        </div>
      </div>

      {/* Student Switcher & Notification Bell */}
      <div className="flex items-center gap-2.5">
        {/* Switch Student selector for demo */}
        {currentStudent && (
          <div className="relative">
            <select
              value={currentStudent.id}
              onChange={(e) => switchStudent(e.target.value)}
              className="text-[11px] font-bold bg-soft text-ink border border-line rounded-full pl-2.5 pr-6 py-1 appearance-none focus:outline-none focus:border-gold cursor-pointer"
            >
              {DEMO_STUDENTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.instrument})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-muted absolute right-2 top-2 pointer-events-none" />
          </div>
        )}

        {/* Notification Bell */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-full hover:bg-soft text-ink transition-colors cursor-pointer"
          aria-label="View Academy Notifications"
        >
          <Bell className="w-4 h-4 text-ink" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-gold rounded-full ring-2 ring-paper animate-pulse" />
          )}
        </button>
      </div>
    </header>
  );
};

