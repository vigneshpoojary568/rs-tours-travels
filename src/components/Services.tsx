import React from 'react';
import { useContent } from '../context/ContentContext';
import { ServiceItem } from '../types';
import { ArrowRight, Check, CalendarCheck } from 'lucide-react';

export const Services: React.FC = () => {
  const { services, openBookingModal } = useContent();

  const handleEnquireService = (service: ServiceItem) => {
    openBookingModal({
      tripType: service.title,
      message: `Enquiring about "${service.title}" services. Please share options and quotes.`,
    });
  };

  return (
    <section id="services" className="py-24 sm:py-28 bg-white text-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-slate-200 pb-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-[2px] bg-amber-500" />
              <span className="text-xs uppercase tracking-[0.22em] text-slate-600 font-bold">
                Specialized Services
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#0B192C]">
              Comprehensive Travel Services
            </h2>
          </div>
          <p className="mt-4 md:mt-0 text-slate-600 text-sm sm:text-base font-light max-w-md leading-relaxed">
            Whether you need a full customized vacation itinerary, safe chauffeur transport across ghat roads, or verified boutique homestays, our services are geared for your peace of mind.
          </p>
        </div>

        {/* Services Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services
            .filter((srv) => srv.enabled !== false)
            .map((srv) => (
            <div
              key={srv.id}
              className="group bg-slate-50 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 flex flex-col justify-between"
            >
              {srv.image && (
                <div className="relative h-48 overflow-hidden bg-slate-200">
                  <img
                    src={srv.image || '/images/hero_luxury_travel_panoramic.jpg'}
                    alt={srv.title}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = '/images/hero_luxury_travel_panoramic.jpg';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C]/80 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-4 text-xs font-bold text-amber-300 tracking-wider uppercase bg-[#0B192C]/80 backdrop-blur-xs px-2.5 py-1 rounded-md border border-white/10">
                    {srv.title}
                  </span>
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#0B192C] group-hover:text-amber-700 transition-colors mb-2.5">
                    {srv.title}
                  </h3>

                  <p className="text-slate-600 text-xs sm:text-sm font-light leading-relaxed mb-5">
                    {srv.description}
                  </p>

                  <div className="space-y-2 mb-6 border-t border-slate-200 pt-3">
                    {srv.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <button
                    onClick={() => handleEnquireService(srv)}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-white hover:bg-[#0B192C] hover:text-white text-[#0B192C] text-xs font-bold rounded-lg border border-slate-300 transition-all duration-300 cursor-pointer shadow-sm"
                  >
                    <CalendarCheck className="w-3.5 h-3.5 text-amber-500" />
                    <span>Enquire About {srv.title}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
