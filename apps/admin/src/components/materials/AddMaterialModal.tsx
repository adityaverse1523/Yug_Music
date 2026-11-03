import React, { useState } from 'react';
import { X, FolderPlus } from 'lucide-react';
import { INSTRUMENT_LIST, BATCH_NAMES, InstrumentType, MaterialType, ACADEMY_CONFIG, sanitizeExternalUrl, sanitizeText } from '@yug/shared';
import { useAppData } from '../../context/AppDataContext';

interface AddMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddMaterialModal: React.FC<AddMaterialModalProps> = ({ isOpen, onClose }) => {
  const { addMaterial } = useAppData();

  const [title, setTitle] = useState('');
  const [instrument, setInstrument] = useState<InstrumentType>('Guitar');
  const [batchName, setBatchName] = useState(BATCH_NAMES[0]);
  const [materialType, setMaterialType] = useState<MaterialType>('pdf');
  const [fileUrl, setFileUrl] = useState('');
  const [fileSize, setFileSize] = useState('2.5 MB');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !fileUrl.trim()) return;

    setSubmitting(true);
    try {
      await addMaterial({
        title: sanitizeText(title),
        instrument,
        batch_name: batchName,
        material_type: materialType,
        file_url: sanitizeExternalUrl(fileUrl),
        file_size: sanitizeText(fileSize),
        description: sanitizeText(description),
        uploaded_by: ACADEMY_CONFIG.directorName,
      });
      onClose();
      // Reset
      setTitle('');
      setFileUrl('');
      setDescription('');
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
              <FolderPlus className="w-4 h-4 text-gold-dark" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-ink">Upload Study Material</h3>
              <p className="text-xs text-muted">Share sheet music, PDF notes, audio or video tutorials</p>
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
              Resource Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Raag Yaman Sheet Music & Notation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-line rounded-lg text-sm focus:outline-none focus:border-gold"
            />
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
                File Type
              </label>
              <select
                value={materialType}
                onChange={(e) => setMaterialType(e.target.value as MaterialType)}
                className="w-full px-3.5 py-2.5 bg-white border border-line rounded-lg text-sm focus:outline-none focus:border-gold"
              >
                <option value="pdf">📄 PDF Document / Sheet Music</option>
                <option value="audio">🎵 Audio Guide / Tanpura Track</option>
                <option value="video">🎥 Video Demonstration</option>
                <option value="link">🔗 External Web Link</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
              Batch (Optional)
            </label>
            <select
              value={batchName}
              onChange={(e) => setBatchName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-line rounded-lg text-sm focus:outline-none focus:border-gold"
            >
              <option value="">All Batches</option>
              {BATCH_NAMES.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                Resource URL / Storage Link *
              </label>
              <input
                type="url"
                required
                placeholder="https://supabase-storage... or cloud link"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-line rounded-lg text-sm focus:outline-none focus:border-gold font-mono text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                Size / Duration
              </label>
              <input
                type="text"
                placeholder="e.g. 3.2 MB"
                value={fileSize}
                onChange={(e) => setFileSize(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-line rounded-lg text-sm focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
              Description / Practice Instructions
            </label>
            <textarea
              rows={2}
              placeholder="Provide practice notes or how to utilize this document..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              {submitting ? 'Uploading...' : 'Publish Material'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

