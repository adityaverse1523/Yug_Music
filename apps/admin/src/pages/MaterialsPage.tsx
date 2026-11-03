import React, { useState } from 'react';
import {
  FolderOpen,
  FolderPlus,
  FileText,
  Video,
  Headphones,
  Link2,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { INSTRUMENT_LIST, MaterialType } from '@yug/shared';
import { useAppData } from '../context/AppDataContext';

interface MaterialsPageProps {
  onOpenMaterialModal: () => void;
}

export const MaterialsPage: React.FC<MaterialsPageProps> = ({ onOpenMaterialModal }) => {
  const { materials, deleteMaterial } = useAppData();
  const [selectedInstrument, setSelectedInstrument] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredMaterials = materials.filter((item) => {
    if (selectedInstrument !== 'all' && item.instrument !== selectedInstrument) return false;
    if (selectedType !== 'all' && item.material_type !== selectedType) return false;
    return true;
  });

  const getTypeIcon = (type: MaterialType) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-700" />;
      case 'video':
        return <Video className="w-5 h-5 text-blue-700" />;
      case 'audio':
        return <Headphones className="w-5 h-5 text-accentgreen" />;
      default:
        return <Link2 className="w-5 h-5 text-gold-dark" />;
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-gold-dark bg-soft px-2.5 py-0.5 rounded-full border border-line">
              Academy Curriculum &amp; Library
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-ink mt-1">Study Materials &amp; PDFs</h1>
          <p className="text-xs text-muted">
            Upload sheet music, chord diagrams, guided audio tracks, and recorded tutorial videos.
          </p>
        </div>

        <button
          onClick={onOpenMaterialModal}
          className="px-4 py-2.5 bg-gold hover:bg-gold-dark text-white rounded-xl text-xs font-bold transition-all shadow flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <FolderPlus className="w-4 h-4" />
          <span>+ Upload Material</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-paper p-4 rounded-xl border border-line flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedInstrument('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
              selectedInstrument === 'all'
                ? 'bg-gold text-white'
                : 'bg-soft text-muted hover:text-ink'
            }`}
          >
            All Instruments ({materials.length})
          </button>
          {INSTRUMENT_LIST.map((i) => {
            const count = materials.filter((m) => m.instrument === i.name).length;
            if (count === 0) return null;
            return (
              <button
                key={i.name}
                onClick={() => setSelectedInstrument(i.name)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  selectedInstrument === i.name
                    ? 'bg-gold text-white'
                    : 'bg-soft text-muted hover:text-ink'
                }`}
              >
                <span>{i.icon}</span>
                <span>{i.name}</span>
                <span className="text-[10px] opacity-75">({count})</span>
              </button>
            );
          })}
        </div>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="text-xs font-semibold px-3 py-2 bg-white border border-line rounded-lg focus:outline-none focus:border-gold"
        >
          <option value="all">All Formats</option>
          <option value="pdf">PDF Documents</option>
          <option value="audio">Audio Guides</option>
          <option value="video">Video Lessons</option>
        </select>
      </div>

      {/* Materials Grid */}
      {filteredMaterials.length === 0 ? (
        <div className="bg-paper border border-line rounded-2xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-soft text-gold-dark flex items-center justify-center mx-auto text-xl font-bold">
            <FolderOpen className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-lg text-ink">No materials uploaded yet</h3>
          <p className="text-xs text-muted max-w-sm mx-auto">
            Upload PDF notes or audio guides to share with students for their practice.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMaterials.map((item) => (
            <div
              key={item.id}
              className="bg-paper border border-line rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-gold/50 transition-all space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-soft border border-line flex items-center justify-center">
                    {getTypeIcon(item.material_type)}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-cream px-2.5 py-0.5 rounded-full border border-line text-muted">
                    {item.instrument}
                  </span>
                </div>

                <h3 className="font-bold text-base text-ink line-clamp-1">{item.title}</h3>
                {item.batch_name && (
                  <p className="text-xs text-gold-dark font-medium mt-0.5">{item.batch_name}</p>
                )}

                {item.description && (
                  <p className="text-xs text-muted mt-2 line-clamp-2">{item.description}</p>
                )}
              </div>

              <div className="pt-3 border-t border-line/70 flex items-center justify-between text-xs">
                <span className="text-[11px] text-muted font-mono">{item.file_size || 'Cloud File'}</span>

                <div className="flex items-center gap-1.5">
                  <a
                    href={item.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 bg-soft hover:bg-gold hover:text-white rounded-lg text-gold-dark transition-colors border border-line cursor-pointer flex items-center gap-1"
                    title="Open Resource"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-bold">Open</span>
                  </a>

                  <button
                    onClick={() => {
                      if (confirm(`Delete material "${item.title}"?`)) {
                        deleteMaterial(item.id);
                      }
                    }}
                    title="Delete File"
                    className="p-1.5 text-muted hover:text-red-600 rounded-lg hover:bg-cream transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
