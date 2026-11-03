import React from 'react';
import { User, CheckCircle2, Clock, Mail, Phone, Calendar, Award, ShieldCheck, LogOut } from 'lucide-react';
import { useStudentData } from '../context/StudentContext';

export const ProfileScreen: React.FC = () => {
  const { currentStudent, myAttendance, logout } = useStudentData();

  if (!currentStudent) return null;

  const totalClasses = myAttendance.length;
  const presentCount = myAttendance.filter((a) => a.status === 'present').length;
  const attendanceRate = totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 100;

  return (
    <div className="space-y-4 pb-20">
      {/* Student ID Card */}
      <div className="bg-paper border border-line rounded-2xl p-5 shadow-xs text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-soft border-2 border-gold/40 flex items-center justify-center font-extrabold text-gold-dark text-xl mx-auto shadow-sm">
          {currentStudent.name.substring(0, 2).toUpperCase()}
        </div>

        <div>
          <h2 className="font-extrabold text-lg text-ink">{currentStudent.name}</h2>
          <p className="text-xs text-gold-dark font-bold mt-0.5">
            {currentStudent.instrument} Student • {currentStudent.skill_level}
          </p>
          <span className="text-[10px] text-muted block mt-0.5 font-mono">
            ID: {currentStudent.id.substring(0, 8)}
          </span>
        </div>

        <div className="pt-2 flex items-center justify-center gap-2">
          <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-[#eef3eb] text-accentgreen border border-[#d3e2cd] flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Fee Status: {currentStudent.fee_status.toUpperCase()}</span>
          </span>

          <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-soft text-gold-dark border border-line flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            <span>Enrolled Student</span>
          </span>
        </div>
      </div>

      {/* Academy Details */}
      <div className="bg-paper border border-line rounded-2xl p-4 shadow-xs space-y-3">
        <h3 className="font-extrabold text-xs uppercase tracking-wider text-muted">
          Batch &amp; Academy Info
        </h3>

        <div className="space-y-2.5 text-xs">
          <div className="flex items-center justify-between py-1 border-b border-line/60">
            <span className="text-muted">Assigned Batch:</span>
            <span className="font-bold text-ink max-w-[200px] text-right truncate">
              {currentStudent.batch_name}
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-line/60">
            <span className="text-muted">Joined Date:</span>
            <span className="font-bold text-ink">{currentStudent.join_date}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-line/60">
            <span className="text-muted">Registered Email:</span>
            <span className="font-bold text-ink">{currentStudent.email}</span>
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="text-muted">Phone Number:</span>
            <span className="font-bold text-ink">{currentStudent.phone}</span>
          </div>
        </div>
      </div>

      {/* Attendance Stats */}
      <div className="bg-paper border border-line rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-xs uppercase tracking-wider text-muted">
            Attendance Record
          </h3>
          <span className="text-xs font-extrabold text-accentgreen">
            {attendanceRate}% Present
          </span>
        </div>

        <div className="w-full bg-soft rounded-full h-2.5 overflow-hidden border border-line">
          <div
            className="bg-accentgreen h-full rounded-full transition-all"
            style={{ width: `${attendanceRate}%` }}
          />
        </div>

        {currentStudent.notes && (
          <div className="p-3 bg-cream/40 rounded-xl border border-line/60 space-y-1 text-xs">
            <span className="font-bold text-gold-dark text-[11px]">Teacher's Assessment Note:</span>
            <p className="text-muted italic">"{currentStudent.notes}"</p>
          </div>
        )}
      </div>

      {/* Sign Out / Switch Account */}
      <div className="pt-2">
        <button
          type="button"
          onClick={logout}
          className="w-full py-2.5 bg-paper hover:bg-red-50 border border-line hover:border-red-200 rounded-xl text-xs font-bold text-red-600 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out / Switch Student</span>
        </button>
      </div>
    </div>
  );
};
