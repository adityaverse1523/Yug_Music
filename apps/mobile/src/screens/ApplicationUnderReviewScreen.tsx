import React, { useState } from 'react';
import { Clock, ShieldAlert, Sparkles, RefreshCw, LogOut, CheckCircle2, Music, Phone, Mail, Award } from 'lucide-react';
import { ACADEMY_CONFIG } from '@yug/shared';
import { useStudentData } from '../context/StudentContext';

export const ApplicationUnderReviewScreen: React.FC = () => {
  const { currentStudent, logout, refreshStudentStatus } = useStudentData();
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!currentStudent) return null;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshStudentStatus();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <div className="min-h-full flex flex-col justify-between py-6 px-4">
      {/* Academy Brand Header */}
      <div className="text-center space-y-2 pt-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-gold to-gold-dark shadow-md border border-gold-light/40">
          <Music className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-ink tracking-tight">YUG Musical Academy</h1>
          <p className="text-xs text-muted font-serif italic">Admissions & Student Registry</p>
        </div>
      </div>

      {/* Main Status Parchment */}
      <div className="bg-paper rounded-2xl border border-line p-5 shadow-sm space-y-4 my-auto">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Under Review by Sir
          </span>
          <span className="text-[10px] font-semibold text-muted">Application Pending</span>
        </div>

        <div className="border-b border-line/60 pb-3">
          <h2 className="text-lg font-black text-ink">Namaste, {currentStudent.name}! 🙏</h2>
          <p className="text-xs text-muted mt-1 leading-relaxed">
            Aapki admission application <strong className="text-ink">{ACADEMY_CONFIG.directorName}</strong> ke paas review ke liye chali gayi hai. Jaise hi Sir Admin panel se approve karenge, aapka course, live classes, riyaaz aur library access <strong className="text-gold-dark">automatically unlock</strong> ho jayega!
          </p>
        </div>

        {/* Application Summary Box */}
        <div className="bg-soft/70 rounded-xl p-3.5 border border-line space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted font-medium">Applied Instrument:</span>
            <span className="font-bold text-ink flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-gold" />
              {currentStudent.instrument}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted font-medium">Preferred Batch:</span>
            <span className="font-bold text-ink">{currentStudent.batch_name}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted font-medium">Skill Level:</span>
            <span className="font-semibold text-ink">{currentStudent.skill_level}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted font-medium">Registered Email:</span>
            <span className="font-mono text-[11px] text-ink">{currentStudent.email}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted font-medium">WhatsApp / Phone:</span>
            <span className="font-mono text-[11px] text-ink">{currentStudent.phone}</span>
          </div>
        </div>

        {/* Realtime Live Pulse Notice */}
        <div className="p-3 bg-gold/10 rounded-xl border border-gold/30 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-gold-dark flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-ink font-medium leading-relaxed">
            <strong>Real-time Supabase Sync Active:</strong> Aapko screen band ya reload karne ki zaroorat nahi hai. Sir ke "Accept" dabate hi ye screen turant live dashboard me badal jayegi!
          </p>
        </div>

        {/* Refresh Button */}
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="w-full py-2.5 bg-paper hover:bg-soft border border-line rounded-xl text-xs font-bold text-ink transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-muted ${isRefreshing ? 'animate-spin text-gold' : ''}`} />
          <span>{isRefreshing ? 'Checking Status with Server...' : 'Check Approval Status'}</span>
        </button>
      </div>

      {/* Footer & Switch Account */}
      <div className="text-center pt-2 space-y-2">
        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-red-600 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign In with another Email / Student ID</span>
        </button>
        <p className="text-[10px] text-muted">
          Need urgent approval? Call Academy: <span className="font-bold text-ink">{ACADEMY_CONFIG.contactPhone}</span>
        </p>
      </div>
    </div>
  );
};

