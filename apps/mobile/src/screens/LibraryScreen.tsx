import React, { useState } from 'react';
import {
  BookOpen,
  FileText,
  Video,
  Headphones,
  ExternalLink,
  Search,
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  CheckCircle,
} from 'lucide-react';
import { useStudentData } from '../context/StudentContext';
import { ACADEMY_SUBJECTS, MaterialType, StudyMaterial } from '@yug/shared';

export const LibraryScreen: React.FC = () => {
  const { currentStudent, materials } = useStudentData();

  // Find subject corresponding to student's current instrument
  const defaultSubject =
    ACADEMY_SUBJECTS.find((s) => s.instrument === currentStudent.instrument)?.id || 'guitar';

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(defaultSubject);
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  const currentSubjectObj = ACADEMY_SUBJECTS.find((s) => s.id === selectedSubjectId);

  // Toggle category collapse
  const toggleCategory = (catName: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [catName]: !prev[catName],
    }));
  };

  // Filter materials based on Subject, Format, and Search Query
  const subjectMaterials = materials.filter((m) => {
    // Subject filter
    if (selectedSubjectId !== 'all') {
      if (currentSubjectObj && m.instrument !== currentSubjectObj.instrument) {
        // Special case: Piano & Keyboard or Drums & Tabla grouped
        if (selectedSubjectId === 'piano' && (m.instrument === 'Piano' || m.instrument === 'Keyboard')) {
          // match
        } else if (selectedSubjectId === 'percussion' && (m.instrument === 'Drums' || m.instrument === 'Tabla')) {
          // match
        } else {
          return false;
        }
      }
    }

    // Format filter
    if (selectedFormat !== 'all' && m.material_type !== selectedFormat) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = m.title.toLowerCase().includes(q);
      const matchDesc = (m.description || '').toLowerCase().includes(q);
      const matchCat = (m.category || '').toLowerCase().includes(q);
      return matchTitle || matchDesc || matchCat;
    }

    return true;
  });

  // Group materials by category for structured chapter-wise display
  const groupedByCategory = subjectMaterials.reduce<Record<string, StudyMaterial[]>>(
    (acc, item) => {
      const cat = item.category || 'General Practice Materials';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    },
    {}
  );

  const getTypeIcon = (type: MaterialType) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-4 h-4 text-red-700" />;
      case 'audio':
        return <Headphones className="w-4 h-4 text-accentgreen" />;
      case 'video':
        return <Video className="w-4 h-4 text-blue-700" />;
      default:
        return <BookOpen className="w-4 h-4 text-gold-dark" />;
    }
  };

  const getFormatBadge = (type: MaterialType) => {
    switch (type) {
      case 'pdf':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'audio':
        return 'bg-[#eef3eb] text-accentgreen border-[#d3e2cd]';
      case 'video':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-soft text-gold-dark border-line';
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Top Header Card */}
      <div className="bg-paper border border-line rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-gold-dark bg-soft px-2.5 py-0.5 rounded-full border border-line">
              Academy Curriculum Library
            </span>
            <h2 className="text-lg font-extrabold text-ink mt-1">Structured Study Materials</h2>
            <p className="text-xs text-muted">
              Organized subject-wise into theory, sheet music, and guided audio riyaaz stems.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-muted absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search notes, raags, chords, alankars, or tabs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-cream/40 border border-line rounded-xl text-xs font-medium focus:outline-none focus:border-gold"
          />
        </div>
      </div>

      {/* Subject Selector Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted">
            Choose Subject:
          </span>
          {currentSubjectObj && (
            <span className="text-[10px] font-bold text-accentgreen flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              <span>Enrolled: {currentStudent.instrument}</span>
            </span>
          )}
        </div>

        {/* Horizontal Subject Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedSubjectId('all')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              selectedSubjectId === 'all'
                ? 'bg-gold text-white shadow-sm ring-2 ring-gold/20'
                : 'bg-paper text-muted border border-line hover:text-ink'
            }`}
          >
            <span>📚</span>
            <span>All Subjects</span>
          </button>

          {ACADEMY_SUBJECTS.map((subject) => {
            const isSelected = selectedSubjectId === subject.id;
            const isMyInstrument = subject.instrument === currentStudent.instrument;

            return (
              <button
                key={subject.id}
                onClick={() => setSelectedSubjectId(subject.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-gold text-white shadow-sm ring-2 ring-gold/20'
                    : isMyInstrument
                    ? 'bg-soft text-gold-dark border border-gold/50'
                    : 'bg-paper text-muted border border-line hover:text-ink'
                }`}
              >
                <span>{subject.icon}</span>
                <span>{subject.name.split(' ')[0]}</span>
                {isMyInstrument && (
                  <span className="text-[9px] bg-gold/20 text-gold-dark px-1.5 py-0.2 rounded-full font-black">
                    My
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Subject Banner */}
      {currentSubjectObj && selectedSubjectId !== 'all' && (
        <div className="bg-soft/70 border border-line rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-paper border border-line flex items-center justify-center text-xl shadow-xs">
              {currentSubjectObj.icon}
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-ink">{currentSubjectObj.name}</h3>
              <p className="text-[11px] text-muted">{currentSubjectObj.tagline}</p>
            </div>
          </div>

          <span className="text-[10px] font-bold text-gold-dark bg-paper border border-line px-2 py-1 rounded-lg shrink-0">
            {subjectMaterials.length} Files
          </span>
        </div>
      )}

      {/* Format Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All Formats' },
          { id: 'pdf', label: '📄 PDFs / Sheet Music' },
          { id: 'audio', label: '🎵 Audio Riyaaz Loops' },
          { id: 'video', label: '🎥 Video Lessons' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedFormat(tab.id)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all shrink-0 cursor-pointer ${
              selectedFormat === tab.id
                ? 'bg-ink text-white'
                : 'bg-paper text-muted border border-line hover:text-ink'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Structured Category/Module Sections */}
      {Object.keys(groupedByCategory).length === 0 ? (
        <div className="bg-paper border border-line rounded-2xl p-10 text-center space-y-2">
          <BookOpen className="w-8 h-8 text-muted mx-auto" />
          <p className="text-sm font-bold text-ink">No materials found</p>
          <p className="text-xs text-muted max-w-xs mx-auto">
            Try clearing your search query or selecting a different subject.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedByCategory).map(([categoryName, items]) => {
            const isCollapsed = collapsedCategories[categoryName];

            return (
              <div
                key={categoryName}
                className="bg-paper border border-line rounded-2xl overflow-hidden shadow-xs"
              >
                {/* Category Chapter Header */}
                <button
                  type="button"
                  onClick={() => toggleCategory(categoryName)}
                  className="w-full px-4 py-3 bg-cream/50 hover:bg-cream border-b border-line flex items-center justify-between text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-soft text-gold-dark flex items-center justify-center border border-line shrink-0">
                      {isCollapsed ? (
                        <Folder className="w-3.5 h-3.5" />
                      ) : (
                        <FolderOpen className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-xs text-ink truncate">
                        {categoryName}
                      </h4>
                      <span className="text-[10px] text-muted font-medium">
                        {items.length} {items.length === 1 ? 'Resource' : 'Resources'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-bold text-gold-dark">
                      {isCollapsed ? 'Show' : 'Hide'}
                    </span>
                    {isCollapsed ? (
                      <ChevronRight className="w-4 h-4 text-muted" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted" />
                    )}
                  </div>
                </button>

                {/* Items inside this Category */}
                {!isCollapsed && (
                  <div className="p-3 space-y-3 divide-y divide-line/60">
                    {items.map((item, idx) => (
                      <div
                        key={item.id}
                        className={`space-y-2.5 ${idx > 0 ? 'pt-3' : ''}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-soft border border-line flex items-center justify-center shrink-0 mt-0.5">
                              {getTypeIcon(item.material_type)}
                            </div>
                            <div className="min-w-0">
                              <h5 className="font-extrabold text-xs text-ink leading-tight">
                                {item.title}
                              </h5>
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <span
                                  className={`text-[9px] font-extrabold px-2 py-0.2 rounded-full border uppercase tracking-wider ${getFormatBadge(
                                    item.material_type
                                  )}`}
                                >
                                  {item.material_type}
                                </span>
                                <span className="text-[10px] text-muted font-mono">
                                  {item.file_size || 'Cloud File'}
                                </span>
                              </div>
                            </div>
                          </div>

                          <a
                            href={item.file_url}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 bg-soft hover:bg-gold hover:text-white rounded-lg text-gold-dark transition-colors border border-line shrink-0 cursor-pointer"
                            title="Open / Download Document"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>

                        {item.description && (
                          <p className="text-xs text-muted leading-relaxed pl-10 pr-2">
                            {item.description}
                          </p>
                        )}

                        {/* Built-in Audio Practice Player */}
                        {item.material_type === 'audio' && (
                          <div className="pl-10 pr-1 pt-1">
                            <div className="bg-soft/40 p-2 rounded-xl border border-line">
                              <span className="text-[10px] font-bold text-gold-dark block mb-1">
                                In-App Practice Audio:
                              </span>
                              <audio
                                controls
                                src={item.file_url}
                                className="w-full h-8 rounded"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
