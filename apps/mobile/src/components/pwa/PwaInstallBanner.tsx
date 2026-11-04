import React, { useState } from 'react';
import { Download, Share2, PlusSquare, X, Smartphone, Sparkles } from 'lucide-react';
import { usePwaInstall } from '../../pwa/usePwaInstall';

export const PwaInstallBanner: React.FC = () => {
  const { canInstall, isInstalled, isIos, hasNativePrompt, promptInstall } = usePwaInstall();
  const [isDismissed, setIsDismissed] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  if (isInstalled || !canInstall || isDismissed) {
    return null;
  }

  const handleInstallClick = () => {
    if (hasNativePrompt) {
      promptInstall();
    } else if (isIos) {
      setShowIosGuide(true);
    }
  };

  return (
    <>
      <div className="bg-gradient-to-r from-soft to-[#f5ebd7] border border-line rounded-2xl p-3.5 shadow-xs mb-3 flex items-center justify-between gap-3 animate-in fade-in">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gold text-white flex items-center justify-center shrink-0 shadow-xs">
            <Smartphone className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xs text-ink truncate">Install YUG Music App</span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 bg-gold/20 text-gold-dark rounded-full">
                PWA
              </span>
            </div>
            <p className="text-[10px] text-muted truncate">
              {isIos ? 'Add to your iPhone Home Screen' : 'Fast one-click install on your phone'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleInstallClick}
            className="px-3 py-1.5 bg-gold hover:bg-gold-dark text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install</span>
          </button>

          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="p-1 text-muted hover:text-ink cursor-pointer"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* iOS Step-by-Step Instructions Modal */}
      {showIosGuide && (
        <div className="fixed inset-0 bg-ink/60 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-paper border border-line rounded-2xl p-5 max-w-sm w-full shadow-2xl space-y-4 animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold" />
                <h3 className="font-extrabold text-sm text-ink">Install on iPhone / iPad</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowIosGuide(false)}
                className="text-muted hover:text-ink cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-ink/90">
              <div className="flex items-start gap-3 bg-soft p-3 rounded-xl border border-line">
                <span className="w-6 h-6 rounded-full bg-gold text-white font-bold text-xs flex items-center justify-center shrink-0">
                  1
                </span>
                <p>
                  Safari browser ke bottom bar me <strong className="text-ink">Share</strong> icon (
                  <Share2 className="w-3.5 h-3.5 inline text-gold-dark mx-0.5" />) par tap karein.
                </p>
              </div>

              <div className="flex items-start gap-3 bg-soft p-3 rounded-xl border border-line">
                <span className="w-6 h-6 rounded-full bg-gold text-white font-bold text-xs flex items-center justify-center shrink-0">
                  2
                </span>
                <p>
                  Niche scroll karke <strong className="text-ink">'Add to Home Screen'</strong> (
                  <PlusSquare className="w-3.5 h-3.5 inline text-gold-dark mx-0.5" />) select karein.
                </p>
              </div>

              <div className="flex items-start gap-3 bg-soft p-3 rounded-xl border border-line">
                <span className="w-6 h-6 rounded-full bg-gold text-white font-bold text-xs flex items-center justify-center shrink-0">
                  3
                </span>
                <p>
                  Top right me <strong className="text-ink">'Add'</strong> par click karein. YUG Music
                  aapke iPhone par native app ki tarah save ho jayega!
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowIosGuide(false)}
              className="w-full py-2 bg-gold hover:bg-gold-dark text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              Samajh Gaya! (Done)
            </button>
          </div>
        </div>
      )}
    </>
  );
};

