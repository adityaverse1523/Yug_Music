import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  BellRing,
  Users,
  FolderOpen,
  Headphones,
  CheckCheck,
  ExternalLink,
} from 'lucide-react';

export type AdminTab =
  | 'dashboard'
  | 'schedule'
  | 'notifications'
  | 'students'
  | 'materials'
  | 'submissions'
  | 'attendance';

interface SidebarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  pendingReviewsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  pendingReviewsCount,
}) => {
  const navItems = [
    {
      id: 'dashboard' as AdminTab,
      label: 'Dashboard Overview',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'schedule' as AdminTab,
      label: 'Class Schedule',
      icon: CalendarDays,
      badge: 'Manage',
    },
    {
      id: 'notifications' as AdminTab,
      label: 'Broadcast Alerts',
      icon: BellRing,
      badge: 'Admin Only',
    },
    {
      id: 'students' as AdminTab,
      label: 'Students Directory',
      icon: Users,
      badge: null,
    },
    {
      id: 'materials' as AdminTab,
      label: 'Study PDFs & Videos',
      icon: FolderOpen,
      badge: null,
    },
    {
      id: 'submissions' as AdminTab,
      label: 'Practice Reviews',
      icon: Headphones,
      badge: pendingReviewsCount > 0 ? `${pendingReviewsCount} New` : null,
      highlight: pendingReviewsCount > 0,
    },
    {
      id: 'attendance' as AdminTab,
      label: 'Attendance Tracker',
      icon: CheckCheck,
      badge: null,
    },
  ];

  return (
    <aside className="w-64 bg-paper border-r border-line flex flex-col justify-between shrink-0 min-h-[calc(100vh-61px)]">
      <div className="p-4 space-y-1.5">
        <div className="px-3 py-2 text-[11px] font-bold tracking-wider text-muted uppercase">
          Management
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-soft text-gold-dark border border-line font-bold shadow-sm'
                  : 'text-muted hover:bg-cream hover:text-ink'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-gold-dark' : 'text-muted'
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    item.highlight
                      ? 'bg-gold text-white animate-pulse'
                      : isActive
                      ? 'bg-paper text-gold-dark border border-line'
                      : 'bg-soft text-muted'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Academy Details Footer */}
      <div className="p-4 border-t border-line bg-cream/50 space-y-3">
        <div className="p-3 bg-paper rounded-xl border border-line">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-ink">Yug Musical Academy</span>
            <span className="text-[10px] text-accentgreen bg-[#eef3eb] px-1.5 py-0.5 rounded font-bold">
              Active Term
            </span>
          </div>
          <p className="text-[11px] text-muted mt-1 leading-normal">
            Classes in Guitar, Piano, Vocals, Drums &amp; Keyboard.
          </p>
        </div>

        <a
          href="/index.html"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 text-xs font-bold text-gold-dark hover:text-gold transition-colors py-1"
        >
          <span>View Public Demo Page</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </aside>
  );
};

