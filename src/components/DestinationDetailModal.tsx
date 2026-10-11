import React from 'react';
import { useContent } from '../context/ContentContext';
import { X, MapPin, Sparkles, MessageCircle, CalendarCheck } from 'lucide-react';

export const DestinationDetailModal: React.FC = () => {
  const { activeDestination, setActiveDestination, getWhatsAppUrl, openBookingModal } = useContent();

  if (!activeDestination) return null;

  const handleEnquire = () => {
    const text = `Hi RS Tours & Travels, I am planning to visit "${activeDestination.name}" (${activeDestination.location}). Please share customized tour itineraries and cab options.`;
    window.open(getWhatsAppUrl(text), '_blank');
  };

  const handleBookRide = () => {
    const dest = activeDestination;
    setActiveDestination(null);
    openBookingModal({
      destination: dest.name,
      message: `Planning a trip to ${dest.name} (${dest.location}). Ideal season: ${dest.bestSeason}.`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#0B192C]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header Image */}
        <div className="relative h-64 sm:h-72 overflow-hidden shrink-0 bg-slate-900">
          <img
            src={activeDestination.image || '/images/hero_luxury_travel_panoramic.jpg'}
            alt={activeDestination.name}
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.src = '/images/hero_luxury_travel_panoramic.jpg';
            }}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C] via-[#0B192C]/30 to-transparent" />

          {/* Close button */}
          <button
            onClick={() => setActiveDestination(null)}
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors border border-white/20 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Information banner */}
          <div className="absolute bottom-5 left-6 right-6 text-white">
            <span className="text-xs uppercase tracking-widest font-bold text-amber-300 bg-black/60 px-2.5 py-1 rounded-md backdrop-blur-xs border border-white/10">
              {activeDestination.category}
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold mt-2 text-white">
              {activeDestination.name}
            </h2>
            <div className="flex items-center gap-4 text-xs mt-2 text-slate-200">
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{activeDestination.location}</span>
              </div>
              <div>
                <span>Best Season: </span>
                <span className="text-amber-300 font-semibold">{activeDestination.bestSeason}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-700">
          <div>
            <h3 className="text-xs uppercase tracking-widest text-[#0B192C] font-bold mb-2">
              Destination Overview
            </h3>
            <p className="text-sm sm:text-base font-light leading-relaxed text-slate-600">
              {activeDestination.description}
            </p>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-widest text-[#0B192C] font-bold mb-3">
              Key Highlights & Experiences
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {activeDestination.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span className="font-medium text-slate-800">{h}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 text-xs flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 block">Recommended For:</span>
              <span className="text-slate-600 font-light">{activeDestination.idealFor}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => setActiveDestination(null)}
            className="text-xs font-medium text-slate-500 hover:text-slate-800 order-2 sm:order-1 cursor-pointer"
          >
            ← Back to Destinations
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto order-1 sm:order-2">
            <button
              onClick={handleBookRide}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition-all cursor-pointer"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Book Ride Here</span>
            </button>

            <button
              onClick={handleEnquire}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#20BD5A] text-slate-950 font-bold text-xs rounded-xl shadow transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-slate-950/20" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
