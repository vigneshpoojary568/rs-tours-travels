import React from 'react';
import { useContent } from '../context/ContentContext';
import { X, Clock, MapPin, Check, MessageCircle, CalendarCheck, ShieldCheck } from 'lucide-react';

export const PackageDetailModal: React.FC = () => {
  const { activePackage, setActivePackage, getWhatsAppUrl, openBookingModal } = useContent();

  if (!activePackage) return null;

  const handleEnquireWhatsApp = () => {
    const text = `Hi RS Tours & Travels, I am interested in the "${activePackage.title}" package (${activePackage.destination}, ${activePackage.duration}). Please share customized itinerary details and date availability.`;
    window.open(getWhatsAppUrl(text), '_blank');
  };

  const handleBookNow = () => {
    const pkg = activePackage;
    setActivePackage(null);
    openBookingModal({
      destination: pkg.destination,
      tripType: 'Tour Package',
      message: `Booking request for "${pkg.title}" (${pkg.duration}). Custom itinerary & quote request.`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#0B192C]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header Image & Close */}
        <div className="relative h-64 sm:h-72 overflow-hidden shrink-0 bg-slate-900">
          <img
            src={activePackage.image || '/images/hero_luxury_travel_panoramic.jpg'}
            alt={activePackage.title}
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.src = '/images/hero_luxury_travel_panoramic.jpg';
            }}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C] via-[#0B192C]/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={() => setActivePackage(null)}
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors border border-white/20 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badge & Info on Image */}
          <div className="absolute bottom-5 left-6 right-6 text-white">
            <span className="text-xs uppercase tracking-widest font-bold text-amber-300 bg-black/60 px-2.5 py-1 rounded-md backdrop-blur-sm border border-white/10">
              {activePackage.category} PACKAGE
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold mt-2 text-white">
              {activePackage.title}
            </h2>
            <div className="flex items-center gap-4 text-xs mt-2 text-slate-200">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{activePackage.destination}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{activePackage.duration}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-700">
          
          {/* Service & Inclusions Note */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-700 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-[#0B192C] font-bold uppercase tracking-wider block">
                  All-Inclusive Tour Service
                </span>
                <span className="text-xs text-slate-600">
                  {activePackage.priceNote || 'Dedicated sanitized vehicle, chauffeur, fuel, toll taxes & parking included'}
                </span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Transparent Custom Quote
              </span>
            </div>
          </div>

          {/* Overview */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-[#0B192C] font-bold mb-2">
              Itinerary Overview
            </h3>
            <p className="text-sm sm:text-base font-light leading-relaxed text-slate-600">
              {activePackage.overview}
            </p>
          </div>

          {/* Day by Day Outline */}
          {activePackage.itinerarySummary && activePackage.itinerarySummary.length > 0 && (
            <div>
              <h3 className="text-xs uppercase tracking-widest text-[#0B192C] font-bold mb-3">
                Daily Journey Plan
              </h3>
              <div className="space-y-3">
                {activePackage.itinerarySummary.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-[#0B192C] bg-white px-2 py-0.5 rounded border border-slate-200">
                        {item.day}
                      </span>
                      <span className="font-serif font-bold text-sm text-[#0B192C]">
                        {item.title}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-light leading-relaxed pl-1">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Inclusions */}
          {activePackage.inclusions && activePackage.inclusions.length > 0 && (
            <div>
              <h3 className="text-xs uppercase tracking-widest text-[#0B192C] font-bold mb-3">
                Package Inclusions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activePackage.inclusions.map((inc, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{inc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Transparent Travel Assurance */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-slate-900 block">
                Customized & Transparent Itineraries:
              </span>
              <span className="text-slate-600 font-light">
                Every tour package is tailored to your schedule, group size, and vehicle preferences with zero surprise surcharges or hidden driver allowances.
              </span>
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => setActivePackage(null)}
            className="text-xs font-medium text-slate-500 hover:text-slate-800 order-2 sm:order-1 cursor-pointer"
          >
            ← Back to Packages
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto order-1 sm:order-2">
            <button
              onClick={handleBookNow}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition-all cursor-pointer"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Book This Package</span>
            </button>

            <button
              onClick={handleEnquireWhatsApp}
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
