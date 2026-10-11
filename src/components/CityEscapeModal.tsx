import React, { useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import {
  X,
  MapPin,
  Clock,
  Compass,
  Coffee,
  Car,
  Calendar,
  CheckCircle2,
  MessageCircle,
  Phone,
  ShieldCheck,
  Navigation,
} from 'lucide-react';

export const CityEscapeModal: React.FC = () => {
  const { activeCityEscape, setActiveCityEscape, getWhatsAppUrl, siteConfig, openBookingModal } = useContent();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveCityEscape(null);
      }
    };
    if (activeCityEscape) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [activeCityEscape, setActiveCityEscape]);

  if (!activeCityEscape) return null;

  const handleWhatsAppEnquiry = () => {
    const msg = `Hi RS Tours & Travels, I would like to plan the Bengaluru City Escape to "${activeCityEscape.title}" (${activeCityEscape.distanceFromBlr}, ${activeCityEscape.duration}). Please share cab tariff, suggested itinerary, and doorstep pickup details.`;
    window.open(getWhatsAppUrl(msg), '_blank');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="city-escape-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header Photo & Identity */}
        <div className="relative h-60 sm:h-72 overflow-hidden shrink-0">
          <img
            src={activeCityEscape.image || '/images/hero_cinematic_landscape.jpg'}
            alt={activeCityEscape.title}
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.src = '/images/hero_cinematic_landscape.jpg';
            }}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={() => setActiveCityEscape(null)}
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors border border-white/20"
            aria-label="Close escape details"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Overlay details */}
          <div className="absolute bottom-4 left-5 right-5 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-[#DFB257] bg-black/60 px-2.5 py-0.5 rounded border border-[#C9962E]/40 backdrop-blur-sm">
                {activeCityEscape.category}
              </span>
              {activeCityEscape.badge && (
                <span className="text-[11px] uppercase tracking-wider font-semibold text-emerald-300 bg-emerald-950/70 px-2.5 py-0.5 rounded border border-emerald-500/30">
                  {activeCityEscape.badge}
                </span>
              )}
            </div>
            <h2 id="city-escape-modal-title" className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {activeCityEscape.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 font-light mt-0.5 line-clamp-1">
              {activeCityEscape.tagline}
            </p>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6">
          
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F7F3EA] p-3.5 rounded-xl border border-slate-200/80 text-xs text-[#073B35]">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-[#C9962E] shrink-0" />
              <div>
                <span className="text-[10px] text-slate-500 block uppercase tracking-wider">Distance</span>
                <span className="font-semibold">{activeCityEscape.distanceFromBlr}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#C9962E] shrink-0" />
              <div>
                <span className="text-[10px] text-slate-500 block uppercase tracking-wider">Drive Time</span>
                <span className="font-semibold">{activeCityEscape.driveTime}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#C9962E] shrink-0" />
              <div>
                <span className="text-[10px] text-slate-500 block uppercase tracking-wider">Ideal Duration</span>
                <span className="font-semibold">{activeCityEscape.duration}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#C9962E] shrink-0" />
              <div>
                <span className="text-[10px] text-slate-500 block uppercase tracking-wider">Best Season</span>
                <span className="font-semibold">{activeCityEscape.bestTimeToVisit}</span>
              </div>
            </div>
          </div>

          {/* Overview */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Escape Experience
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed font-light">
              {activeCityEscape.overview}
            </p>
          </div>

          {/* Route & BLR Traffic Tips */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#073B35] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[#073B35] block">Highway / Route from BLR</span>
                <span className="text-slate-600">{activeCityEscape.highwayRoute}</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-[#C9962E] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[#073B35] block">Recommended Start Time</span>
                <span className="text-slate-600">{activeCityEscape.bestTimeToStart}</span>
              </div>
            </div>
            {activeCityEscape.recommendedBreakfastStop && (
              <div className="sm:col-span-2 flex items-start gap-2.5 pt-2 border-t border-slate-200/70">
                <Coffee className="w-4 h-4 text-[#C9962E] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#073B35] block">Top Highway Breakfast Stop</span>
                  <span className="text-slate-600">{activeCityEscape.recommendedBreakfastStop}</span>
                </div>
              </div>
            )}
          </div>

          {/* Escape Highlights */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              Journey Highlights
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {activeCityEscape.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-100 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-[#C9962E] shrink-0 mt-0.5" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Suggested Itinerary / Schedule */}
          {activeCityEscape.suggestedSchedule && activeCityEscape.suggestedSchedule.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                Suggested Day Plan / Schedule
              </h3>
              <div className="space-y-3 relative pl-6 border-l-2 border-[#C9962E]/30">
                {activeCityEscape.suggestedSchedule.map((step, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-[#073B35] border-2 border-white ring-2 ring-[#C9962E]/40" />
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-semibold text-[#073B35]">{step.title}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-[#C9962E] border border-slate-200 font-medium">
                          {step.time}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-light leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Doorstep Bengaluru Pickup & Vehicle Options */}
          <div className="p-4 rounded-xl bg-[#0B192C] text-white space-y-3">
            <div className="flex items-center gap-2">
              <Car className="w-5 h-5 text-amber-400" />
              <h4 className="text-sm font-semibold text-white">
                Doorstep Pickup Across Bengaluru & Sanitized Fleet
              </h4>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-light">
              Prompt doorstep pickup across Whitefield, Indiranagar, Koramangala, Electronic City, HSR Layout, JP Nagar, Hebbal, Yelahanka, and BLR Airport. Choose from:
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {activeCityEscape.popularVehicles.map((veh, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded text-xs font-medium"
                >
                  {veh}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-emerald-300 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Courteous verified chauffeur • Sanitized AC vehicle • FastTag highway tolls ready</span>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-600 text-center sm:text-left">
            <span className="font-semibold text-slate-900 block">Ready to escape Bengaluru?</span>
            <span>Transparent tariff quotes tailored to your vehicle and travel date.</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => {
                const escapeTitle = activeCityEscape.title;
                setActiveCityEscape(null);
                openBookingModal({
                  destination: escapeTitle,
                  tripType: 'Bengaluru City Escape',
                  message: `Interested in City Escape: ${escapeTitle} (${activeCityEscape.duration}, ${activeCityEscape.distanceFromBlr}).`,
                });
              }}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <span>Book This Ride</span>
            </button>
            <button
              onClick={handleWhatsAppEnquiry}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
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
