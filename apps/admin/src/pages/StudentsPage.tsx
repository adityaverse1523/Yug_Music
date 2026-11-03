import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Phone,
  Mail,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  Sparkles,
  Check,
  X,
  Calendar,
  Award,
  BookOpen,
} from 'lucide-react';
import { INSTRUMENT_LIST, ACADEMY_CONFIG } from '@yug/shared';
import { useAppData } from '../context/AppDataContext';

interface StudentsPageProps {
  onOpenStudentModal: () => void;
}

export const StudentsPage: React.FC<StudentsPageProps> = ({ onOpenStudentModal }) => {
  const { students, updateStudent, deleteStudent, sendNotification } = useAppData();
  const [activeTab, setActiveTab] = useState<'enrolled' | 'applications'>('enrolled');
  const [searchQuery, setSearchQuery] = useState('');
  const [instrumentFilter, setInstrumentFilter] = useState<string>('all');
  const [feeFilter, setFeeFilter] = useState<string>('all');
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Split into Enrolled (Active) vs Pending Applications
  const pendingApplications = students.filter(
    (s) => s.status === 'pending' || (s.status === 'inactive' && Boolean(s.notes?.includes('[APPLICATION')))
  );

  const enrolledStudents = students.filter(
    (s) => s.status === 'active' || (!s.status && !s.notes?.includes('[APPLICATION'))
  );

  const filteredEnrolled = enrolledStudents.filter((student) => {
    if (instrumentFilter !== 'all' && student.instrument !== instrumentFilter) return false;
    if (feeFilter !== 'all' && student.fee_status !== feeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = student.name.toLowerCase().includes(q);
      const matchEmail = student.email.toLowerCase().includes(q);
      const matchPhone = student.phone.toLowerCase().includes(q);
      const matchBatch = student.batch_name.toLowerCase().includes(q);
      return matchName || matchEmail || matchPhone || matchBatch;
    }
    return true;
  });

  // Action: Accept Student Application
  const handleAcceptApplication = async (student: (typeof students)[0]) => {
    try {
      await updateStudent(student.id, {
        status: 'active',
        join_date: new Date().toISOString().split('T')[0],
        notes: student.notes ? student.notes.replace('[APPLICATION] ', '').replace('[APPLICATION_PENDING] ', '') : 'Enrolled via Mobile Application',
      });

      // Send a broadcast announcement / welcome notification for real-time celebration
      await sendNotification({
        title: `Welcome ${student.name} to YUG Musical Academy!`,
        message: `Admission approved for ${student.instrument} (${student.batch_name}). All study materials and live class links are now active!`,
        category: 'announcement',
        target_audience: 'all',
        priority: 'high',
        sent_by: `${ACADEMY_CONFIG.directorName} (${ACADEMY_CONFIG.directorTitle})`,
      });

      setActionSuccessMessage(`✓ ${student.name}'s application accepted! Access has been unlocked on their mobile app in real-time.`);
      setTimeout(() => setActionSuccessMessage(null), 5000);
    } catch (e) {
      console.error('Failed to accept application:', e);
    }
  };

  // Action: Decline Application
  const handleDeclineApplication = async (studentId: string, name: string) => {
    if (confirm(`Are you sure you want to decline the admission application for "${name}"?`)) {
      await deleteStudent(studentId);
      setActionSuccessMessage(`Application for ${name} removed.`);
      setTimeout(() => setActionSuccessMessage(null), 4000);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-gold-dark bg-soft px-2.5 py-0.5 rounded-full border border-line">
              Academy Registry
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-ink mt-1">Students &amp; Admissions</h1>
          <p className="text-xs text-muted">
            Manage enrolled students, review self-service mobile applications, and assign batches.
          </p>
        </div>

        <button
          onClick={onOpenStudentModal}
          className="px-4 py-2.5 bg-gold hover:bg-gold-dark text-white rounded-xl text-xs font-bold transition-all shadow flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Enroll New Student (Direct)</span>
        </button>
      </div>

      {/* Success Notification Alert */}
      {actionSuccessMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs font-bold flex items-center justify-between shadow-2xs animate-in fade-in">
          <span>{actionSuccessMessage}</span>
          <button onClick={() => setActionSuccessMessage(null)} className="cursor-pointer text-emerald-600 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Primary Section Switcher Tabs */}
      <div className="flex border-b border-line gap-2">
        <button
          onClick={() => setActiveTab('enrolled')}
          className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'enrolled'
              ? 'border-gold text-ink font-extrabold'
              : 'border-transparent text-muted hover:text-ink'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Enrolled Students</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-soft text-ink border border-line">
            {enrolledStudents.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('applications')}
          className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'applications'
              ? 'border-gold text-ink font-extrabold'
              : 'border-transparent text-muted hover:text-ink'
          }`}
        >
          <Sparkles className="w-4 h-4 text-gold" />
          <span>Admission Applications</span>
          {pendingApplications.length > 0 ? (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-white animate-pulse">
              {pendingApplications.length} Pending
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-soft text-muted border border-line">
              0
            </span>
          )}
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: ENROLLED STUDENTS DIRECTORY */}
      {/* ============================================================== */}
      {activeTab === 'enrolled' && (
        <div className="space-y-4">
          {/* Search and Filters Bar */}
          <div className="bg-paper p-4 rounded-xl border border-line flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-muted absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search by student name, phone or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-line rounded-lg text-xs font-medium focus:outline-none focus:border-gold"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <select
                value={instrumentFilter}
                onChange={(e) => setInstrumentFilter(e.target.value)}
                className="text-xs font-semibold px-3 py-2 bg-white border border-line rounded-lg focus:outline-none focus:border-gold"
              >
                <option value="all">All Instruments</option>
                {INSTRUMENT_LIST.map((i) => (
                  <option key={i.name} value={i.name}>
                    {i.icon} {i.name}
                  </option>
                ))}
              </select>

              <select
                value={feeFilter}
                onChange={(e) => setFeeFilter(e.target.value)}
                className="text-xs font-semibold px-3 py-2 bg-white border border-line rounded-lg focus:outline-none focus:border-gold"
              >
                <option value="all">All Fee Statuses</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>

          {/* Students Table */}
          {filteredEnrolled.length === 0 ? (
            <div className="bg-paper border border-line rounded-2xl p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-soft text-gold-dark flex items-center justify-center mx-auto text-xl font-bold">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-ink">No students match your criteria</h3>
              <p className="text-xs text-muted max-w-sm mx-auto">
                Try adjusting your search query or filters, or enroll a new student to the academy.
              </p>
            </div>
          ) : (
            <div className="bg-paper border border-line rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-soft/70 border-b border-line text-ink font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-5 py-3.5">Student Profile</th>
                      <th className="px-4 py-3.5">Instrument &amp; Level</th>
                      <th className="px-4 py-3.5">Assigned Batch</th>
                      <th className="px-4 py-3.5">Contact Details</th>
                      <th className="px-4 py-3.5">Fee Status</th>
                      <th className="px-4 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {filteredEnrolled.map((student) => {
                      const inst = INSTRUMENT_LIST.find((i) => i.name === student.instrument);

                      return (
                        <tr key={student.id} className="hover:bg-cream/40 transition-colors">
                          {/* Name & ID */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-soft border border-line flex items-center justify-center font-bold text-gold-dark text-xs shrink-0">
                                {student.name.substring(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-bold text-sm text-ink">{student.name}</div>
                                <div className="text-[10px] text-muted">Joined {student.join_date}</div>
                              </div>
                            </div>
                          </td>

                          {/* Instrument & Level */}
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1.5 font-semibold text-ink">
                              <span>{inst?.icon || '🎵'}</span>
                              <span>{student.instrument}</span>
                            </div>
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-soft text-muted inline-block mt-1 border border-line">
                              {student.skill_level}
                            </span>
                          </td>

                          {/* Batch */}
                          <td className="px-4 py-4 font-medium text-ink max-w-xs">{student.batch_name}</td>

                          {/* Contact */}
                          <td className="px-4 py-4 space-y-1 text-muted">
                            <div className="flex items-center gap-1.5">
                              <Mail className="w-3.5 h-3.5 text-gold-dark" />
                              <span>{student.email}</span>
                            </div>
                            {student.phone && (
                              <div className="flex items-center gap-1.5">
                                <Phone className="w-3.5 h-3.5 text-gold-dark" />
                                <span>{student.phone}</span>
                              </div>
                            )}
                          </td>

                          {/* Fee Status */}
                          <td className="px-4 py-4">
                            {student.fee_status === 'paid' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#eef3eb] text-accentgreen border border-[#d3e2cd]">
                                <CheckCircle className="w-3 h-3" /> Paid
                              </span>
                            )}
                            {student.fee_status === 'pending' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                <Clock className="w-3 h-3" /> Pending
                              </span>
                            )}
                            {student.fee_status === 'overdue' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                                <AlertCircle className="w-3 h-3" /> Overdue
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-4 text-right">
                            <button
                              onClick={() => {
                                if (confirm(`Remove student "${student.name}" from academy?`)) {
                                  deleteStudent(student.id);
                                }
                              }}
                              title="Delete Student"
                              className="p-1.5 text-muted hover:text-red-600 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: ADMISSION APPLICATIONS (SELF-ENROLLMENTS) */}
      {/* ============================================================== */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          <div className="bg-soft/70 border border-line rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-sm text-ink flex items-center gap-2">
                <span>Admission Application Requests</span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  {pendingApplications.length} Pending
                </span>
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Students who applied through the Mobile App. Accepting grants them instant access to live classes, riyaaz audio recording, and course library.
              </p>
            </div>
          </div>

          {pendingApplications.length === 0 ? (
            <div className="bg-paper border border-line rounded-2xl p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-soft text-muted flex items-center justify-center mx-auto text-xl font-bold">
                <CheckCircle className="w-6 h-6 text-accentgreen" />
              </div>
              <h3 className="font-extrabold text-lg text-ink">All caught up!</h3>
              <p className="text-xs text-muted max-w-sm mx-auto">
                No new admission applications waiting for review. When prospective students submit enrollment on the Mobile App, they will appear here in real-time.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingApplications.map((app) => {
                const inst = INSTRUMENT_LIST.find((i) => i.name === app.instrument);

                return (
                  <div
                    key={app.id}
                    className="bg-paper border border-line rounded-2xl p-5 shadow-xs space-y-4 hover:border-gold/60 transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Row: Name, Status & Date */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-soft border border-line flex items-center justify-center font-bold text-gold-dark text-sm shrink-0">
                            {app.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-extrabold text-base text-ink">{app.name}</h4>
                            <div className="text-[10px] text-muted flex items-center gap-1.5 mt-0.5">
                              <Calendar className="w-3 h-3" />
                              <span>Applied on {app.join_date}</span>
                            </div>
                          </div>
                        </div>

                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                          Pending Approval
                        </span>
                      </div>

                      {/* Course & Batch Selection */}
                      <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-line/60 text-xs">
                        <div className="bg-soft/70 p-2.5 rounded-xl border border-line">
                          <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">
                            Requested Instrument
                          </span>
                          <span className="font-bold text-ink flex items-center gap-1 mt-1">
                            <span>{inst?.icon || '🎵'}</span>
                            <span>{app.instrument}</span>
                          </span>
                        </div>

                        <div className="bg-soft/70 p-2.5 rounded-xl border border-line">
                          <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">
                            Skill Level
                          </span>
                          <span className="font-bold text-ink block mt-1">{app.skill_level}</span>
                        </div>
                      </div>

                      <div className="mt-2 bg-soft/70 p-2.5 rounded-xl border border-line text-xs">
                        <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">
                          Preferred Batch
                        </span>
                        <span className="font-bold text-ink block mt-1">{app.batch_name}</span>
                      </div>

                      {/* Contact Info */}
                      <div className="mt-3 space-y-1 text-xs text-muted">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-gold-dark" />
                          <span className="font-mono text-[11px] text-ink">{app.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-gold-dark" />
                          <span className="font-mono text-[11px] text-ink">{app.phone}</span>
                        </div>
                      </div>

                      {/* Student Message/Notes */}
                      {app.notes && (
                        <div className="mt-3 p-3 bg-cream/40 rounded-xl border border-line/70 text-xs space-y-1">
                          <span className="font-bold text-gold-dark text-[10px] uppercase tracking-wider block">
                            Student Note / Goal:
                          </span>
                          <p className="text-ink/80 italic leading-relaxed">
                            "{app.notes.replace('[APPLICATION] ', '').replace('[APPLICATION_PENDING] ', '')}"
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 border-t border-line/60 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleAcceptApplication(app)}
                        className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>Accept &amp; Enroll</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeclineApplication(app.id, app.name)}
                        className="py-2.5 px-3 bg-white hover:bg-red-50 text-red-600 border border-line hover:border-red-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                        title="Decline Application"
                      >
                        <X className="w-4 h-4" />
                        <span>Decline</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
