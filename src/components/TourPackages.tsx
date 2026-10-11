import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { TourPackage } from '../types';
import { Clock, MapPin, Check, Eye, MessageCircle, ArrowRight, CalendarCheck } from 'lucide-react';

const PACKAGE_FILTERS = [
  'ALL',
  'FAMILY',
  'COUPLES',
  'ADVENTURE',
  'GROUP',
  'PILGRIMAGE',
  'WEEKEND',
  'PREMIUM',
] as const;

export const TourPackages: React.FC = () => {
  const { packages, setActivePackage, getWhatsAppUrl, openBookingModal } = useContent();
  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  const filteredPackages = packages
    .filter((pkg) => pkg.enabled !== false)
    .filter((pkg) => activeFilter === 'ALL' || pkg.category === activeFilter);

  const getPackageWhatsAppText = (pkg: TourPackage) => {
    return `Hi RS Tours & Travels, I would like to enquire about the "${pkg.title}" (${pkg.destination}, ${pkg.duration}). Please share customized package itinerary details and availability.`;
  };

  const handleBookPackage = (pkg: TourPackage) => {
    openBookingModal({
      destination: pkg.destination,
      tripType: 'Tour Package',
      message: `Enquiring for package: ${pkg.title} (${pkg.duration}). Custom itinerary & quote request.`,
    });
  };

  return (
    <section id="packages" className="py-24 sm:py-28 bg-slate-100 text-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-8 h-[2px] bg-amber-500" />
            <span className="text-xs uppercase tracking-[0.22em] text-slate-600 font-bold">
              Curated Itineraries
            </span>
            <span className="w-8 h-[2px] bg-amber-500" />
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#0B192C] mb-4">
            Handcrafted Tour Packages
          </h2>

          <p className="text-slate-600 text-base sm:text-lg font-light leading-relaxed">
            Every itinerary is transparent, flexible, and completely tailored to your pace. Enjoy scenic mountain roads, clean accommodations, and attentive chauffeur assistance.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-center gap-1.5 flex-wrap mb-12">
          {PACKAGE_FILTERS.map((f) => {
            const isActive = activeFilter === f;
            return (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#0B192C] text-white shadow-md'
                    : 'bg-white text-slate-700 hover:bg-slate-200 hover:text-slate-950 border border-slate-200'
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>

        {/* Packages Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 flex flex-col justify-between"
            >
              {/* Card Image Banner */}
              <div className="relative h-60 overflow-hidden bg-slate-100">
                <img
                  src={pkg.image || '/images/hero_luxury_travel_panoramic.jpg'}
                  alt={pkg.title}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = '/images/hero_luxury_travel_panoramic.jpg';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C]/90 via-[#0B192C]/30 to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 bg-[#0B192C]/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10">
                    {pkg.category}
                  </span>
                  {pkg.featured && (
                    <span className="text-[11px] font-bold text-slate-950 bg-amber-400 px-2.5 py-1 rounded-md shadow-sm">
                      Recommended
                    </span>
                  )}
                </div>

                {/* Duration & Destination */}
                <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-white text-xs">
                  <div className="flex items-center gap-1.5 text-white/95">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-semibold">{pkg.destination}</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-300 bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded">
                    <Clock className="w-3 h-3" />
                    <span>{pkg.duration}</span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#0B192C] group-hover:text-amber-700 transition-colors mb-2 leading-snug">
                    {pkg.title}
                  </h3>

                  <p className="text-slate-600 text-xs sm:text-sm font-light leading-relaxed mb-4 line-clamp-2">
                    {pkg.overview}
                  </p>

                  {/* Highlights / Inclusions */}
                  <div className="space-y-1.5 mb-6 border-t border-slate-100 pt-3">
                    {pkg.highlights.slice(0, 3).map((hl, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="font-light">{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setActivePackage(pkg)}
                    className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Details</span>
                  </button>

                  <button
                    onClick={() => handleBookPackage(pkg)}
                    className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-all shadow-sm cursor-pointer"
                  >
                    <CalendarCheck className="w-3.5 h-3.5" />
                    <span>Book Package</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Tour Planning Banner */}
        <div className="mt-16 bg-[#0B192C] rounded-2xl p-8 sm:p-10 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 text-white">
          <div className="max-w-2xl">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold mb-2 text-white">
              Want a 100% Customized Route?
            </h3>
            <p className="text-slate-300 text-sm sm:text-base font-light">
              Don’t see your exact destination or duration? Share your preferred travel dates, number of people, and places you wish to explore. We’ll design a custom itinerary with transparent quotes.
            </p>
          </div>

          <button
            onClick={() => openBookingModal()}
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl shadow transition-all hover:scale-[1.02] shrink-0 cursor-pointer"
          >
            <span>Request Custom Plan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
