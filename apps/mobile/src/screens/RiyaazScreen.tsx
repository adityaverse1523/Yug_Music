import React, { useState } from 'react';
import { Mic, ListMusic, Star, Volume2, Award, Clock } from 'lucide-react';
import { ACADEMY_CONFIG } from '@yug/shared';
import { useStudentData } from '../context/StudentContext';
import { VoiceRecorder } from '../components/recorder/VoiceRecorder';

export const RiyaazScreen: React.FC = () => {
  const { mySubmissions } = useStudentData();
  const [activeSubTab, setActiveSubTab] = useState<'record' | 'history'>('record');

  return (
    <div className="space-y-4 pb-20">
      {/* Top Toggle */}
      <div className="bg-paper p-1 rounded-xl border border-line flex items-center shadow-xs">
        <button
          onClick={() => setActiveSubTab('record')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'record'
              ? 'bg-gold text-white shadow-xs'
              : 'text-muted hover:text-ink'
          }`}
        >
          <Mic className="w-3.5 h-3.5" />
          <span>Record Riyaaz</span>
        </button>

        <button
          onClick={() => setActiveSubTab('history')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'history'
              ? 'bg-gold text-white shadow-xs'
              : 'text-muted hover:text-ink'
          }`}
        >
          <ListMusic className="w-3.5 h-3.5" />
          <span>My History ({mySubmissions.length})</span>
        </button>
      </div>

      {activeSubTab === 'record' ? (
        <VoiceRecorder onSubmitted={() => setActiveSubTab('history')} />
      ) : (
        <div className="space-y-3">
          <div className="px-1 flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-ink">Previous Practice Submissions</h3>
            <span className="text-[11px] text-muted font-semibold">
              {mySubmissions.length} Sessions
            </span>
          </div>

          {mySubmissions.length === 0 ? (
            <div className="bg-paper border border-line rounded-2xl p-10 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-soft text-gold-dark flex items-center justify-center mx-auto font-bold text-lg">
                🎙️
              </div>
              <p className="text-sm font-bold text-ink">No recordings submitted yet</p>
              <p className="text-xs text-muted max-w-xs mx-auto">
                Record your first riyaaz track to receive guidance and rating from {ACADEMY_CONFIG.directorName}.
              </p>
              <button
                onClick={() => setActiveSubTab('record')}
                className="mt-2 px-4 py-2 bg-gold hover:bg-gold-dark text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                Start Recording
              </button>
            </div>
          ) : (
            mySubmissions.map((sub) => (
              <div
                key={sub.id}
                className="bg-paper border border-line rounded-2xl p-4 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-soft text-gold-dark px-2 py-0.5 rounded-full border border-line">
                    {sub.instrument}
                  </span>

                  <span className="text-[10px] text-muted font-mono">
                    {new Date(sub.submitted_at).toLocaleDateString()}
                  </span>
                </div>

                <div>
                  <h4 className="font-extrabold text-sm text-ink">{sub.title}</h4>
                  {sub.notes && (
                    <p className="text-xs text-muted italic mt-1 bg-cream/40 p-2 rounded-lg border border-line/40">
                      "{sub.notes}"
                    </p>
                  )}
                </div>

                {/* Audio playback */}
                <div className="bg-soft/40 p-2 rounded-xl border border-line">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-gold-dark mb-1">
                    <Volume2 className="w-3 h-3" />
                    <span>My Audio Recording:</span>
                  </div>
                  <audio controls src={sub.audio_video_url} className="w-full h-8 rounded" />
                </div>

                {/* Teacher's Review status */}
                {sub.status === 'reviewed' ? (
                  <div className="p-3 bg-[#f5f8f3] rounded-xl border border-[#dce8d5] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-accentgreen flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" /> {ACADEMY_CONFIG.directorName}'s Feedback
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
                    <p className="text-xs text-ink/80 leading-relaxed font-medium">
                      "{sub.feedback_notes}"
                    </p>
                  </div>
                ) : (
                  <div className="p-2.5 bg-amber-50/70 rounded-xl border border-amber-200/60 flex items-center gap-2 text-xs text-amber-800">
                    <Clock className="w-4 h-4 shrink-0" />
                    <span>Submitted to Sir — Awaiting Review &amp; Rating</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

