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
} from 'lucide-react';
import { INSTRUMENT_LIST } from '@yug/shared';
import { useAppData } from '../context/AppDataContext';

interface StudentsPageProps {
  onOpenStudentModal: () => void;
}

export const StudentsPage: React.FC<StudentsPageProps> = ({ onOpenStudentModal }) => {
  const { students, deleteStudent } = useAppData();
  const [searchQuery, setSearchQuery] = useState('');
  const [instrumentFilter, setInstrumentFilter] = useState<string>('all');
  const [feeFilter, setFeeFilter] = useState<string>('all');

  const filteredStudents = students.filter((student) => {
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
          <h1 className="text-2xl font-extrabold text-ink mt-1">Students Directory</h1>
          <p className="text-xs text-muted">
            Manage student registrations, instrument batches, skill levels and tuition status.
          </p>
        </div>

        <button
          onClick={onOpenStudentModal}
          className="px-4 py-2.5 bg-gold hover:bg-gold-dark text-white rounded-xl text-xs font-bold transition-all shadow flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Enroll New Student</span>
        </button>
      </div>

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

      {/* Students Table / Grid */}
      {filteredStudents.length === 0 ? (
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
                {filteredStudents.map((student) => {
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
                            <div className="text-[10px] text-muted">
                              Joined {student.join_date}
                            </div>
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
                      <td className="px-4 py-4 font-medium text-ink max-w-xs">
                        {student.batch_name}
                      </td>

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
  );
};
