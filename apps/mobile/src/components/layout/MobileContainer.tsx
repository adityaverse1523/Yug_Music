import React, { useState } from 'react';
import { Smartphone, Monitor } from 'lucide-react';

export const MobileContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [deviceFrame, setDeviceFrame] = useState(true);

  return (
    <div className="min-h-screen bg-[#1c1815] flex flex-col items-center justify-start sm:py-6 px-0 sm:px-4">
      {/* Top Desktop Helper Switcher */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-md pb-3 text-xs text-[#b8a994]">
        <div className="flex items-center gap-1.5 font-bold">
          <span className="w-2 h-2 rounded-full bg-accentgreen animate-pulse" />
          <span>Student Mobile App Preview</span>
        </div>

        <button
          onClick={() => setDeviceFrame(!deviceFrame)}
          className="flex items-center gap-1 text-[11px] font-bold bg-[#2e2721] hover:bg-[#3d342d] px-2.5 py-1 rounded-lg text-cream transition-colors cursor-pointer"
        >
          {deviceFrame ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
          <span>{deviceFrame ? 'Expand Full' : 'Phone Frame'}</span>
        </button>
      </div>

      {/* Mobile Screen Shell */}
      <div
        className={`w-full max-w-md min-h-screen sm:min-h-[844px] bg-cream text-ink flex flex-col transition-all overflow-hidden ${
          deviceFrame
            ? 'sm:rounded-[40px] sm:border-[8px] sm:border-[#2f2721] sm:shadow-2xl sm:ring-1 sm:ring-white/10'
            : 'max-w-xl'
        }`}
      >
        {/* Simulated iOS Status Bar on Desktop */}
        <div className="hidden sm:flex items-center justify-between px-6 pt-3 pb-1 text-[11px] font-bold text-ink/70">
          <span>9:41</span>
          <div className="w-20 h-4 bg-[#2f2721] rounded-full mx-auto" />
          <div className="flex items-center gap-1.5 text-[10px]">
            <span>5G</span>
            <span>100%</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

