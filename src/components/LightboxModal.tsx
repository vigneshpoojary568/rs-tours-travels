import React, { useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import { X, MapPin, Sparkles } from 'lucide-react';

export const LightboxModal: React.FC = () => {
  const { lightboxPhoto, setLightboxPhoto } = useContent();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxPhoto(null);
      }
    };
    if (lightboxPhoto) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxPhoto, setLightboxPhoto]);

  if (!lightboxPhoto) return null;

  return (
    <div
      onClick={() => setLightboxPhoto(null)}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center"
      >
        {/* Close Button */}
        <button
          onClick={() => setLightboxPhoto(null)}
          className="absolute -top-12 right-0 sm:top-2 sm:right-2 z-20 w-10 h-10 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-colors border border-white/20"
          aria-label="Close Lightbox"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image Container */}
        <div className="relative rounded-xl overflow-hidden shadow-2xl max-h-[75vh] w-auto border border-white/15 bg-black">
          <img
            src={lightboxPhoto.image || '/images/hero_cinematic_landscape.jpg'}
            alt={lightboxPhoto.title}
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.src = '/images/hero_cinematic_landscape.jpg';
            }}
            className="max-h-[75vh] w-auto object-contain mx-auto"
          />
        </div>

        {/* Caption Card */}
        <div className="mt-4 bg-[#073B35]/95 backdrop-blur-md border border-[#0B5D5A] p-4 rounded-xl text-white max-w-xl w-full text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#DFB257] bg-white/10 px-2 py-0.5 rounded">
                {lightboxPhoto.category}
              </span>
              <div className="flex items-center gap-1 text-xs text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-[#DFB257]" />
                <span>{lightboxPhoto.location}</span>
              </div>
            </div>
            <h3 className="font-serif text-lg font-bold text-white">
              {lightboxPhoto.title}
            </h3>
            <p className="text-xs text-slate-300 font-light mt-0.5">
              {lightboxPhoto.caption}
            </p>
          </div>

          <div className="shrink-0">
            <span className="text-[11px] text-[#DFB257] flex items-center gap-1 font-light italic font-serif">
              <Sparkles className="w-3.5 h-3.5" />
              RS Travel Journal
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
