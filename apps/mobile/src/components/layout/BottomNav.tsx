import React from 'react';
import { Home, Calendar, Mic, BookOpen, User } from 'lucide-react';

export type MobileTab = 'home' | 'classes' | 'riyaaz' | 'library' | 'profile';

interface BottomNavProps {
  activeTab: MobileTab;
  onSelectTab: (tab: MobileTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  const tabs = [
    { id: 'home' as MobileTab, label: 'Home', icon: Home },
    { id: 'classes' as MobileTab, label: 'Classes', icon: Calendar },
    { id: 'riyaaz' as MobileTab, label: 'Riyaaz', icon: Mic, highlight: true },
    { id: 'library' as MobileTab, label: 'Library', icon: BookOpen },
    { id: 'profile' as MobileTab, label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-paper border-t border-line px-3 py-2 flex items-center justify-around z-30 shadow-lg safe-area-bottom">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        if (tab.highlight) {
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className="flex flex-col items-center justify-center -mt-5 cursor-pointer transition-transform active:scale-95"
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-colors ${
                  isActive
                    ? 'bg-gold-dark text-white ring-4 ring-soft'
                    : 'bg-gold text-white ring-4 ring-paper'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={`text-[10px] font-extrabold mt-1 tracking-tight ${
                  isActive ? 'text-gold-dark font-black' : 'text-muted'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        }

        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
              isActive ? 'text-gold-dark' : 'text-muted hover:text-ink'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span
              className={`text-[10px] mt-1 font-semibold ${
                isActive ? 'font-bold text-gold-dark' : 'text-muted'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

