import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { INSTRUMENT_LIST, BATCH_NAMES, InstrumentType, SkillLevel, FeeStatus, sanitizeText } from '@yug/shared';
import { useAppData } from '../../context/AppDataContext';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({ isOpen, onClose }) => {
  const { addStudent } = useAppData();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [instrument, setInstrument] = useState<InstrumentType>('Guitar');
  const [skillLevel, setSkillLevel] = useState<SkillLevel>('Beginner');
  const [batchName, setBatchName] = useState(BATCH_NAMES[1]);
  const [feeStatus, setFeeStatus] = useState<FeeStatus>('paid');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setSubmitting(true);
    try {
      await addStudent({
        name: sanitizeText(name),
        email: sanitizeText(email).toLowerCase(),
        phone: sanitizeText(phone),
        instrument,
        skill_level: skillLevel,
        batch_name: batchName,
        fee_status: feeStatus,
        notes: sanitizeText(notes),
      });
      onClose();
      // Reset
      setName('');
      setEmail('');
      setPhone('');
      setNotes('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-ink/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-paper border border-line rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in duration-200">
        <div className="px-6 py-4 bg-soft border-b border-line flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gold/20 text-gold-dark flex items-center justify-center font-bold">
              <UserPlus className="w-4 h-4 text-gold-dark" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-ink">Enroll New Student</h3>
              <p className="text-xs text-muted">Register student profile &amp; assign instrument batch</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-line/50 flex items-center justify-center text-muted hover:text-ink transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Rahul Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-line rounded-lg text-sm focus:outline-none focus:border-gold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="student@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-line rounded-lg text-sm focus:outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+91 98765 00000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-line rounded-lg text-sm focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                Instrument
              </label>
              <select
                value={instrument}
                onChange={(e) => setInstrument(e.target.value as InstrumentType)}
                className="w-full px-3.5 py-2.5 bg-white border border-line rounded-lg text-sm focus:outline-none focus:border-gold"
              >
                {INSTRUMENT_LIST.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.icon} {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                Skill Level
              </label>
              <select
                value={skillLevel}
                onChange={(e) => setSkillLevel(e.target.value as SkillLevel)}
                className="w-full px-3.5 py-2.5 bg-white border border-line rounded-lg text-sm focus:outline-none focus:border-gold"
              >
                <option value="Beginner">Beginner (Foundations)</option>
                <option value="Intermediate">Intermediate (Repertoire &amp; Scales)</option>
                <option value="Advanced">Advanced (Concert &amp; Theory)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                Assigned Batch
              </label>
              <select
                value={batchName}
                onChange={(e) => setBatchName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-line rounded-lg text-sm focus:outline-none focus:border-gold"
              >
                {BATCH_NAMES.map((batch) => (
                  <option key={batch} value={batch}>
                    {batch}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                Fee Status
              </label>
              <select
                value={feeStatus}
                onChange={(e) => setFeeStatus(e.target.value as FeeStatus)}
                className="w-full px-3.5 py-2.5 bg-white border border-line rounded-lg text-sm focus:outline-none focus:border-gold"
              >
                <option value="paid">Paid (Up to date)</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
              Teacher's Private Notes
            </label>
            <textarea
              rows={2}
              placeholder="Notes on goals, musical background, preferred styles, etc."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-line rounded-lg text-sm focus:outline-none focus:border-gold"
            />
          </div>

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
              className="px-5 py-2.5 bg-gold hover:bg-gold-dark text-white rounded-lg text-xs font-bold shadow transition-colors cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Enrolling...' : 'Enroll Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

