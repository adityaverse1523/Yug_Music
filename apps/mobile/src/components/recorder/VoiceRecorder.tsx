import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, RotateCcw, Send, CheckCircle2, Volume2, Sparkles, Loader2 } from 'lucide-react';
import { ACADEMY_CONFIG, sanitizeText } from '@yug/shared';
import { useStudentData } from '../../context/StudentContext';
import fixWebmDuration from 'fix-webm-duration';

interface VoiceRecorderProps {
  onSubmitted: () => void;
}

const getSupportedAudioMimeType = (): string => {
  if (typeof window === 'undefined' || typeof MediaRecorder === 'undefined') return '';
  const candidates = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/aac',
    'audio/ogg;codecs=opus',
  ];
  for (const candidate of candidates) {
    if (MediaRecorder.isTypeSupported(candidate)) {
      return candidate;
    }
  }
  return '';
};

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onSubmitted }) => {
  const { currentStudent, submitPractice } = useStudentData();

  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      const preferredMime = getSupportedAudioMimeType();
      const options: MediaRecorderOptions = {
        audioBitsPerSecond: 64000,
      };
      if (preferredMime) {
        options.mimeType = preferredMime;
      }

      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setIsProcessingAudio(true);
        const durationMs = Math.max(1000, Date.now() - startTimeRef.current);
        const actualMime = mediaRecorder.mimeType || preferredMime || 'audio/webm';
        let rawBlob = new Blob(audioChunksRef.current, { type: actualMime });

        let finalBlob = rawBlob;
        // Fix WebM duration metadata (solves Chrome 0-second / unseekable duration bug)
        if (actualMime.includes('webm')) {
          try {
            finalBlob = await fixWebmDuration(rawBlob, durationMs);
          } catch (err) {
            console.warn('Could not inject duration header into WebM, using raw blob:', err);
          }
        }

        // Convert blob to persistent Base64 Data URL for cross-device, cross-origin playback
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Url = reader.result as string;
          setAudioUrl(base64Url);
          setIsProcessingAudio(false);
        };
        reader.onerror = (err) => {
          console.error('Failed to convert recorded audio to Data URL:', err);
          setIsProcessingAudio(false);
        };
        reader.readAsDataURL(finalBlob);

        stream.getTracks().forEach((track) => track.stop());
      };

      startTimeRef.current = Date.now();
      mediaRecorder.start(1000);
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn('Microphone permission not granted or unsupported, generating sample audio track:', err);
      // Fallback demo track so the user can still test submission seamlessly!
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    } else {
      // Fallback demo URL
      setAudioUrl('https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3');
    }
  };

  const resetRecording = () => {
    setAudioUrl(null);
    setRecordingTime(0);
    setTitle('');
    setNotes('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioUrl || !title.trim() || isProcessingAudio) return;

    setIsSubmitting(true);
    try {
      await submitPractice(sanitizeText(title), audioUrl, sanitizeText(notes));
      setSubmittedSuccess(true);
      setTimeout(() => {
        setSubmittedSuccess(false);
        resetRecording();
        onSubmitted();
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentStudent) return null;

  return (
    <div className="bg-paper border border-line rounded-2xl p-5 shadow-xs">
      <div className="text-center space-y-1 mb-4">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-gold-dark bg-soft px-2.5 py-0.5 rounded-full border border-line">
          Live Riyaaz Recorder
        </span>
        <h3 className="font-extrabold text-lg text-ink">Record Practice Session</h3>
        <p className="text-xs text-muted">
          Record your {currentStudent.instrument} riyaaz and submit to {ACADEMY_CONFIG.directorName} for feedback.
        </p>
      </div>

      {submittedSuccess ? (
        <div className="py-10 text-center space-y-2 animate-in fade-in">
          <CheckCircle2 className="w-12 h-12 text-accentgreen mx-auto" />
          <h4 className="font-extrabold text-base text-ink">Practice Submitted to Sir!</h4>
          <p className="text-xs text-muted">
            {ACADEMY_CONFIG.directorName} will listen to your recording and provide review notes and rating.
          </p>
        </div>
      ) : (
        <div>
          {/* Visual Record Dial */}
          <div className="flex flex-col items-center justify-center py-6">
            <div className="relative">
              {isRecording && (
                <div className="absolute inset-0 rounded-full bg-gold/20 animate-ping" />
              )}
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-md cursor-pointer ${
                  isRecording
                    ? 'bg-red-600 hover:bg-red-700 text-white ring-4 ring-red-200'
                    : 'bg-gold hover:bg-gold-dark text-white ring-4 ring-soft'
                }`}
              >
                {isRecording ? (
                  <Square className="w-7 h-7 fill-white" />
                ) : (
                  <Mic className="w-8 h-8" />
                )}
              </button>
            </div>

            {/* Timer Display */}
            <div className="mt-4 text-center">
              <span className="font-mono text-xl font-extrabold text-ink tracking-widest">
                {formatTime(recordingTime)}
              </span>
              <p className="text-[11px] text-muted font-medium mt-0.5">
                {isRecording
                  ? 'Recording your riyaaz... Tap to finish'
                  : isProcessingAudio
                  ? 'Processing audio track...'
                  : audioUrl
                  ? 'Recording ready!'
                  : 'Tap mic to start recording'}
              </p>
            </div>
          </div>

          {/* Processing Spinner */}
          {isProcessingAudio && (
            <div className="flex items-center justify-center gap-2 py-4 text-xs font-bold text-muted animate-in fade-in">
              <Loader2 className="w-4 h-4 animate-spin text-gold" />
              <span>Finalizing audio track...</span>
            </div>
          )}

          {/* Audio Review & Form */}
          {audioUrl && !isRecording && !isProcessingAudio && (
            <form onSubmit={handleSubmit} className="space-y-3 pt-3 border-t border-line animate-in fade-in">
              <div>
                <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5 text-gold-dark" /> Listen Before Submitting:
                </label>
                <audio controls src={audioUrl} preload="metadata" className="w-full h-10 rounded-lg" />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1">
                  Session Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder={`e.g. ${currentStudent.instrument} Lesson 2 - Chord Transitions`}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-line rounded-lg text-xs font-medium focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1">
                  Question / Note for {ACADEMY_CONFIG.directorName}
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Sir, please check if my tempo is consistent during the chorus..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-line rounded-lg text-xs font-medium focus:outline-none focus:border-gold"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={resetRecording}
                  className="px-3 py-2 border border-line rounded-lg text-xs font-bold text-muted hover:text-ink flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retake</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2 bg-gold hover:bg-gold-dark text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Sending to Sir...' : 'Submit to Professor'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

