import React, { useState } from 'react';
import {
  CheckCircle,
  Clock,
  Star,
  Volume2,
  MessageSquare,
  Award,
} from 'lucide-react';
import { PracticeSubmission } from '@yug/shared';
import { useAppData } from '../context/AppDataContext';
import { ReviewSubmissionModal } from '../components/submissions/ReviewSubmissionModal';

export const SubmissionsPage: React.FC = () => {
  const { submissions } = useAppData();
  const [activeTab, setActiveTab] = useState<'pending' | 'reviewed'>('pending');
  const [selectedSubmission, setSelectedSubmission] = useState<PracticeSubmission | null>(null);

  const pendingSubmissions = submissions.filter((s) => s.status === 'pending');
  const reviewedSubmissions = submissions.filter((s) => s.status === 'reviewed');
  const displayList = activeTab === 'pending' ? pendingSubmissions : reviewedSubmissions;

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-gold-dark bg-soft px-2.5 py-0.5 rounded-full border border-line">
              Audio &amp; Video Riyaaz Studio
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-ink mt-1">Practice Submissions &amp; Feedback</h1>
          <p className="text-xs text-muted">
            Listen to homework recordings submitted by students from the mobile app, evaluate their technique, and give personalized guidance.
          </p>
        </div>

        {/* Tab switch */}
        <div className="bg-paper p-1 rounded-xl border border-line flex items-center shadow-xs self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'pending'
                ? 'bg-gold text-white shadow-xs'
                : 'text-muted hover:text-ink'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Needs Review ({pendingSubmissions.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('reviewed')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'reviewed'
                ? 'bg-gold text-white shadow-xs'
                : 'text-muted hover:text-ink'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Evaluated ({reviewedSubmissions.length})</span>
          </button>
        </div>
      </div>

      {/* Submissions List */}
      {displayList.length === 0 ? (
        <div className="bg-paper border border-line rounded-2xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-soft text-gold-dark flex items-center justify-center mx-auto text-xl font-bold">
            🎧
          </div>
          <h3 className="font-extrabold text-lg text-ink">
            {activeTab === 'pending' ? 'No pending practice recordings' : 'No reviewed recordings yet'}
          </h3>
          <p className="text-xs text-muted max-w-sm mx-auto">
            {activeTab === 'pending'
              ? 'Great job! You have cleared all student homework submissions.'
              : 'Recordings that you evaluate will be stored here with your ratings and notes.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {displayList.map((sub) => (
            <div
              key={sub.id}
              className="bg-paper border border-line rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-gold/50 transition-all space-y-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-soft border border-line text-gold-dark text-xs font-bold flex items-center justify-center">
                      {sub.student_name.substring(0, 2).toUpperCase()}
                    </span>
                    <div>
                      <h4 className="font-bold text-sm text-ink">{sub.student_name}</h4>
                      <p className="text-[10px] text-muted">{sub.instrument}</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-muted bg-cream px-2 py-0.5 rounded border border-line">
                    {new Date(sub.submitted_at).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="font-bold text-base text-ink line-clamp-1 mt-2">{sub.title}</h3>

                {sub.notes && (
                  <p className="text-xs text-muted italic bg-cream/40 p-2.5 rounded-xl border border-line/50 mt-2">
                    "{sub.notes}"
                  </p>
                )}

                {/* Inline Audio Player */}
                <div className="mt-3 bg-soft/40 p-2.5 rounded-xl border border-line">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-gold-dark mb-1">
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Practice Recording Track:</span>
                  </div>
                  {sub.audio_video_url.startsWith('blob:') ? (
                    <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-[11px] flex items-center gap-1.5">
                      <span>⚠️</span>
                      <span>Old local browser recording. Please ask student to re-record for cloud sync.</span>
                    </div>
                  ) : (
                    <audio
                      controls
                      src={sub.audio_video_url}
                      preload="metadata"
                      className="w-full h-9 rounded"
                    >
                      Audio playback not supported.
                    </audio>
                  )}
                </div>

                {/* If already reviewed: display feedback & stars */}
                {sub.status === 'reviewed' && (
                  <div className="mt-3 p-3 bg-[#f5f8f3] rounded-xl border border-[#dce8d5] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-accentgreen flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" /> Teacher Feedback
                      </span>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3.5 h-3.5 ${
                              star <= (sub.rating || 0)
                                ? 'fill-gold text-gold'
                                : 'text-line'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-ink/80 leading-normal">{sub.feedback_notes}</p>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-line/70 flex items-center justify-between">
                <span className="text-[11px] text-muted">
                  {sub.status === 'pending' ? 'Status: Pending Feedback' : 'Status: Reviewed & Sent'}
                </span>

                <button
                  onClick={() => setSelectedSubmission(sub)}
                  className="px-4 py-2 bg-gold hover:bg-gold-dark text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{sub.status === 'pending' ? 'Review & Grade' : 'Edit Feedback'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {selectedSubmission && (
        <ReviewSubmissionModal
          submission={selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
        />
      )}
    </div>
  );
};
