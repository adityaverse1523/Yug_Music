import React, { useState } from 'react';
import { Music, Sparkles, Mail, User, Phone, BookOpen, Send, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { INSTRUMENT_LIST, BATCH_NAMES, InstrumentType, SkillLevel } from '@yug/shared';
import { useStudentData } from '../context/StudentContext';

export const AuthScreen: React.FC = () => {
  const { loginWithEmail, applyForAdmission } = useStudentData();
  const [tab, setTab] = useState<'login' | 'apply'>('login');

  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginMessage, setLoginMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  // Application State
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    instrument: InstrumentType;
    batch_name: string;
    skill_level: SkillLevel;
    notes: string;
  }>({
    name: '',
    email: '',
    phone: '',
    instrument: 'Guitar',
    batch_name: BATCH_NAMES[0],
    skill_level: 'Beginner',
    notes: '',
  });
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyMessage, setApplyMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) {
      setLoginMessage({ type: 'error', text: 'Please enter your registered email address.' });
      return;
    }
    setLoginLoading(true);
    setLoginMessage(null);

    const res = await loginWithEmail(loginEmail.trim());
    setLoginLoading(false);

    if (!res.success) {
      setLoginMessage({ type: 'error', text: res.message });
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setApplyMessage({ type: 'error', text: 'Please fill all required fields (Name, Email, Phone).' });
      return;
    }

    setApplyLoading(true);
    setApplyMessage(null);

    const res = await applyForAdmission(formData);
    setApplyLoading(false);

    if (!res.success) {
      setApplyMessage({ type: 'error', text: res.message });
    }
  };

  const quickLogin = (email: string) => {
    setLoginEmail(email);
    loginWithEmail(email);
  };

  return (
    <div className="min-h-full flex flex-col justify-between py-6 px-4">
      {/* Academy Brand Header */}
      <div className="text-center space-y-3 pt-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-gold to-gold-dark shadow-md border border-gold-light/40">
          <Music className="w-8 h-8 text-white" />
        </div>
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-gold-dark bg-soft px-3 py-1 rounded-full border border-line">
            Academy Student Portal
          </span>
          <h1 className="text-2xl font-black text-ink mt-2 tracking-tight">YUG Musical Academy</h1>
          <p className="text-xs text-muted font-serif italic mt-0.5">
            Classical Discipline • Acoustic Soul • Pure Riyaaz
          </p>
        </div>
      </div>

      {/* Main Auth Card */}
      <div className="bg-paper rounded-2xl border border-line p-5 shadow-sm mt-5">
        {/* Tab Switcher */}
        <div className="flex bg-soft rounded-xl p-1 border border-line mb-5">
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setLoginMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              tab === 'login'
                ? 'bg-paper text-ink shadow-xs border border-line/60'
                : 'text-muted hover:text-ink'
            }`}
          >
            Student Login
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('apply');
              setApplyMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              tab === 'apply'
                ? 'bg-gold text-white shadow-xs'
                : 'text-muted hover:text-ink'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Apply / Enroll</span>
          </button>
        </div>

        {/* TAB 1: LOGIN */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-ink uppercase tracking-wider mb-1.5">
                Registered Gmail / Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="Enter your student email..."
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-line rounded-xl text-xs font-semibold focus:outline-none focus:border-gold transition-colors"
                />
              </div>
              <p className="text-[10px] text-muted mt-1.5 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-gold" />
                Sir has registered your email in the Academy database.
              </p>
            </div>

            {loginMessage && (
              <div
                className={`p-3 rounded-xl text-xs font-medium border ${
                  loginMessage.type === 'error'
                    ? 'bg-red-50 text-red-700 border-red-200'
                    : 'bg-green-50 text-green-700 border-green-200'
                }`}
              >
                {loginMessage.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-2.5 bg-gold hover:bg-gold-dark text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <span>{loginLoading ? 'Verifying...' : 'Access My Academy Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Quick Demo Logins */}
            <div className="pt-3 border-t border-line/60">
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-2">
                Quick Test Accounts (Click to try):
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => quickLogin('aarav.sharma@example.com')}
                  className="px-2.5 py-1 bg-soft hover:bg-line border border-line rounded-lg text-[10px] font-semibold text-ink transition-colors cursor-pointer"
                >
                  🎸 Aarav (Guitar)
                </button>
                <button
                  type="button"
                  onClick={() => quickLogin('ananya.v@example.com')}
                  className="px-2.5 py-1 bg-soft hover:bg-line border border-line rounded-lg text-[10px] font-semibold text-ink transition-colors cursor-pointer"
                >
                  🎤 Ananya (Vocal)
                </button>
                <button
                  type="button"
                  onClick={() => quickLogin('rohan.piano@example.com')}
                  className="px-2.5 py-1 bg-soft hover:bg-line border border-line rounded-lg text-[10px] font-semibold text-ink transition-colors cursor-pointer"
                >
                  🎹 Rohan (Piano)
                </button>
              </div>
            </div>
          </form>
        )}

        {/* TAB 2: APPLY FOR ADMISSION / ENROLL */}
        {tab === 'apply' && (
          <form onSubmit={handleApply} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-bold text-ink uppercase tracking-wider mb-1">
                Student Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-muted absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-line rounded-xl text-xs font-semibold focus:outline-none focus:border-gold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-ink uppercase tracking-wider mb-1">
                  Gmail / Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-muted absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="student@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-line rounded-xl text-xs font-semibold focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-ink uppercase tracking-wider mb-1">
                  WhatsApp / Phone *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-muted absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-line rounded-xl text-xs font-semibold focus:outline-none focus:border-gold"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-ink uppercase tracking-wider mb-1">
                  Instrument *
                </label>
                <select
                  value={formData.instrument}
                  onChange={(e) => setFormData({ ...formData, instrument: e.target.value as InstrumentType })}
                  className="w-full px-2.5 py-2 bg-white border border-line rounded-xl text-xs font-semibold focus:outline-none focus:border-gold"
                >
                  {INSTRUMENT_LIST.map((inst) => (
                    <option key={inst.name} value={inst.name}>
                      {inst.icon} {inst.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-ink uppercase tracking-wider mb-1">
                  Skill Level
                </label>
                <select
                  value={formData.skill_level}
                  onChange={(e) => setFormData({ ...formData, skill_level: e.target.value as SkillLevel })}
                  className="w-full px-2.5 py-2 bg-white border border-line rounded-xl text-xs font-semibold focus:outline-none focus:border-gold"
                >
                  <option value="Beginner">Beginner (No prior experience)</option>
                  <option value="Intermediate">Intermediate (Basic chords/swars)</option>
                  <option value="Advanced">Advanced (Grade prep)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-ink uppercase tracking-wider mb-1">
                Preferred Batch / Timing
              </label>
              <select
                value={formData.batch_name}
                onChange={(e) => setFormData({ ...formData, batch_name: e.target.value })}
                className="w-full px-2.5 py-2 bg-white border border-line rounded-xl text-xs font-semibold focus:outline-none focus:border-gold"
              >
                {BATCH_NAMES.map((batch) => (
                  <option key={batch} value={batch}>
                    {batch}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-ink uppercase tracking-wider mb-1">
                Note to Prof. Yug (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Mention if you own an instrument, your goals, or preferred practice time..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full p-2.5 bg-white border border-line rounded-xl text-xs font-medium focus:outline-none focus:border-gold"
              />
            </div>

            {applyMessage && (
              <div
                className={`p-3 rounded-xl text-xs font-medium border ${
                  applyMessage.type === 'error'
                    ? 'bg-red-50 text-red-700 border-red-200'
                    : 'bg-green-50 text-green-700 border-green-200'
                }`}
              >
                {applyMessage.text}
              </div>
            )}

            <button
              type="submit"
              disabled={applyLoading}
              className="w-full py-2.5 bg-gold hover:bg-gold-dark text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{applyLoading ? 'Submitting Application...' : 'Submit Application to Sir'}</span>
            </button>
          </form>
        )}
      </div>

      {/* Footer Info */}
      <div className="text-center pt-4 pb-1">
        <p className="text-[11px] text-muted font-medium">
          Need help? Contact Academy Director: <span className="text-ink font-bold">+91 98765 43210</span>
        </p>
      </div>
    </div>
  );
};
