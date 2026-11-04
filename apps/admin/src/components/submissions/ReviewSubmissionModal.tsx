import React, { useState } from 'react';
import { X, Star, CheckCircle, MessageSquare, Volume2 } from 'lucide-react';
import { PracticeSubmission } from '@yug/shared';
import { useAppData } from '../../context/AppDataContext';

interface ReviewSubmissionModalProps {
  submission: PracticeSubmission | null;
  onClose: () => void;
}

export const ReviewSubmissionModal: React.FC<ReviewSubmissionModalProps> = ({
  submission,
  onClose,
}) => {
  const { reviewSubmission } = useAppData();

  const [feedback, setFeedback] = useState(submission?.feedback_notes || '');
  const [rating, setRating] = useState(submission?.rating || 5);
  const [submitting, setSubmitting] = useState(false);

  if (!submission) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setSubmitting(true);
    try {
      await reviewSubmission(submission.id, feedback, rating);
      onClose();
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
              🎧
            </div>
            <div>
              <h3 className="font-extrabold text-base text-ink">Review Practice Submission</h3>
              <p className="text-xs text-muted">
                {submission.student_name} • {submission.instrument}
              </p>
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
          {/* Submission Info Card */}
          <div className="p-3.5 bg-cream rounded-xl border border-line space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-ink">{submission.title}</span>
              <span className="text-[10px] bg-paper border border-line px-2 py-0.5 rounded font-mono text-muted">
                {new Date(submission.submitted_at).toLocaleDateString()}
              </span>
            </div>

            {submission.notes && (
              <p className="text-xs text-muted italic bg-paper p-2.5 rounded-lg border border-line/60">
                "{submission.notes}"
              </p>
            )}

            {/* Audio / Video Player */}
            <div className="pt-1">
              <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-gold-dark" />
                Practice Recording Playback:
              </label>
              {submission.audio_video_url.startsWith('blob:') ? (
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-[11px] flex items-center gap-1.5">
                  <span>⚠️</span>
                  <span>Old local browser recording. Please ask student to re-record for cloud sync.</span>
                </div>
              ) : (
                <audio
                  controls
                  src={submission.audio_video_url}
                  preload="metadata"
                  className="w-full h-10 rounded-lg"
                >
                  Your browser does not support audio element.
                </audio>
              )}
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">
              Performance Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 text-2xl transition-transform hover:scale-110 cursor-pointer"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= rating
                        ? 'fill-gold text-gold'
                        : 'text-line hover:text-gold/50'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-muted ml-2">
                {rating === 5 ? '🌟 Outstanding' : rating === 4 ? '👍 Very Good' : rating === 3 ? '👌 Satisfactory' : '⚠️ Needs Riyaaz'}
              </span>
            </div>
          </div>

          {/* Teacher's Feedback */}
          <div>
            <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-gold-dark" />
              Teacher's Guidance &amp; Feedback *
            </label>
            <textarea
              rows={4}
              required
              placeholder="e.g. Great rhythm keeping! Pay attention to keeping your thumb behind the neck during the chord transitions to avoid fret buzz..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
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
              className="px-5 py-2.5 bg-gold hover:bg-gold-dark text-white rounded-lg text-xs font-bold shadow transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{submitting ? 'Submitting...' : 'Save & Send Feedback'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
