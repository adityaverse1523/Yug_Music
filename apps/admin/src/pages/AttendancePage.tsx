import React, { useState } from 'react';
import {
  Clock,
  UserCheck,
  UserX,
} from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { AttendanceRecord } from '@yug/shared';

export const AttendancePage: React.FC = () => {
  const { schedules, students, attendance, markAttendance } = useAppData();
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>(
    schedules[0]?.id || ''
  );
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const currentSchedule = schedules.find((s) => s.id === selectedScheduleId);

  // Filter students relevant to this class's batch or instrument
  const eligibleStudents = students.filter((s) => {
    if (!currentSchedule) return true;
    return s.batch_name === currentSchedule.batch_name || s.instrument === currentSchedule.instrument;
  });

  const getStudentStatus = (studentId: string): AttendanceRecord['status'] => {
    const record = attendance.find(
      (a) =>
        a.schedule_id === selectedScheduleId &&
        a.student_id === studentId &&
        a.date === selectedDate
    );
    return record ? record.status : 'present';
  };

  const handleStatusChange = (
    studentId: string,
    studentName: string,
    status: AttendanceRecord['status']
  ) => {
    markAttendance(selectedScheduleId, studentId, studentName, status);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-gold-dark bg-soft px-2.5 py-0.5 rounded-full border border-line">
              Academy Attendance Register
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-ink mt-1">Class Attendance Tracker</h1>
          <p className="text-xs text-muted">
            Mark daily or weekly attendance for ongoing batches. Records sync with student mobile profile.
          </p>
        </div>
      </div>

      {/* Class & Date Selector Card */}
      <div className="bg-paper p-5 rounded-2xl border border-line shadow-xs grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
            Select Class Batch
          </label>
          <select
            value={selectedScheduleId}
            onChange={(e) => setSelectedScheduleId(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-line rounded-lg text-sm font-semibold focus:outline-none focus:border-gold"
          >
            {schedules.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title} ({s.instrument} • {s.day_of_week || s.date})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
            Attendance Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-line rounded-lg text-sm font-semibold focus:outline-none focus:border-gold"
          />
        </div>
      </div>

      {/* Student Attendance List */}
      <div className="bg-paper border border-line rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 bg-soft/50 border-b border-line flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm text-ink">
              Batch Roll Call: {currentSchedule?.batch_name || 'Enrolled Students'}
            </h3>
            <span className="text-xs text-muted">
              ({eligibleStudents.length} Students)
            </span>
          </div>
          <span className="text-xs text-accentgreen font-bold bg-[#eef3eb] px-2.5 py-1 rounded-lg border border-[#d3e2cd]">
            Date: {selectedDate}
          </span>
        </div>

        {eligibleStudents.length === 0 ? (
          <div className="p-12 text-center text-xs text-muted">
            No students enrolled under this batch yet.
          </div>
        ) : (
          <div className="divide-y divide-line">
            {eligibleStudents.map((student) => {
              const currentStatus = getStudentStatus(student.id);

              return (
                <div
                  key={student.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-cream/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-soft border border-line flex items-center justify-center font-bold text-gold-dark text-xs shrink-0">
                      {student.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-ink">{student.name}</h4>
                      <p className="text-[11px] text-muted">
                        {student.instrument} • {student.skill_level}
                      </p>
                    </div>
                  </div>

                  {/* Attendance Status Buttons */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => handleStatusChange(student.id, student.name, 'present')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        currentStatus === 'present'
                          ? 'bg-accentgreen text-white shadow-xs'
                          : 'bg-soft text-muted hover:bg-cream'
                      }`}
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Present</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStatusChange(student.id, student.name, 'late')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        currentStatus === 'late'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-soft text-muted hover:bg-cream'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Late</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStatusChange(student.id, student.name, 'absent')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        currentStatus === 'absent'
                          ? 'bg-red-600 text-white shadow-xs'
                          : 'bg-soft text-muted hover:bg-cream'
                      }`}
                    >
                      <UserX className="w-3.5 h-3.5" />
                      <span>Absent</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
