import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { CityEscape } from '../types';
import {
  MapPin,
  Clock,
  Compass,
  ArrowRight,
  MessageCircle,
  Car,
  Navigation,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Calendar,
  Phone,
} from 'lucide-react';

const CATEGORIES = [
  'All Escapes',
  'Sunrise & Day Trips',
  'Hill Stations',
  'Heritage & Palaces',
  'Wildlife & Rivers',
] as const;

export const CityEscapes: React.FC = () => {
  const { cityEscapes, setActiveCityEscape, getWhatsAppUrl, siteConfig } = useContent();
  const [selectedCategory, setSelectedCategory] = useState<string>('All Escapes');

  const filteredEscapes = cityEscapes.filter((escape) => {
    if (selectedCategory === 'All Escapes') return true;
    return escape.category === selectedCategory;
  });

  const handleEnquireWhatsApp = (escape: CityEscape, e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `Hi RS Tours & Travels, I would like to plan the Bengaluru City Escape to "${escape.title}" (${escape.distanceFromBlr}, ${escape.duration}). Please share cab tariff, suggested itinerary, and doorstep pickup details.`;
    window.open(getWhatsAppUrl(text), '_blank');
  };

  const handleGeneralBLREnquiry = () => {
    const text = `Hi RS Tours & Travels, I am looking for a weekend getaway / day trip from Bengaluru with doorstep cab pickup. Please share options and tariffs.`;
    window.open(getWhatsAppUrl(text), '_blank');
  };

  return (
    <section id="city-escapes" className="py-24 sm:py-28 bg-[#F7F3EA] text-[#073B35] relative border-b border-[#073B35]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 border-b border-[#073B35]/15 pb-8 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-[2px] bg-[#C9962E]" />
              <span className="text-xs uppercase tracking-[0.22em] text-[#0B5D5A] font-semibold">
                Bengaluru Weekend & Day Drives
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-[#073B35]">
              CITY ESCAPES FROM BENGALURU
            </h2>
            <p className="mt-4 text-slate-600 text-sm sm:text-base font-light leading-relaxed">
              Trade traffic signals, meetings, and weekday haste for floating clouds, mountain coffee trails, and grand palaces. Handcrafted 1-day drives and weekend breaks under 1 to 5 hours from Bengaluru — with private doorstep AC car pickup across every neighborhood in the city.
            </p>
          </div>

          {/* Doorstep Pickup Quick Badge */}
          <div className="lg:text-right shrink-0">
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#073B35]/15 shadow-xs text-xs font-medium text-[#073B35]">
              <MapPin className="w-4 h-4 text-[#C9962E]" />
              <span>Doorstep Pickup Across All Bengaluru Zones</span>
            </div>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            const count =
              cat === 'All Escapes'
                ? cityEscapes.length
                : cityEscapes.filter((e) => e.category === cat).length;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#073B35] text-white shadow-md'
                    : 'bg-white/80 text-slate-700 hover:bg-white hover:text-[#073B35] border border-slate-200'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-[#C9962E] text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Asymmetric Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {filteredEscapes.map((escape, index) => {
            const isMarquee = index === 0 || index === 3;
            const colSpan = isMarquee
              ? 'md:col-span-12 lg:col-span-8'
              : 'md:col-span-6 lg:col-span-4';

            return (
              <div
                key={escape.id}
                onClick={() => setActiveCityEscape(escape)}
                className={`${colSpan} group relative rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-500 border border-slate-200/80 flex flex-col justify-between cursor-pointer`}
              >
                {/* Photo Header */}
                <div className={`relative overflow-hidden ${isMarquee ? 'h-72 sm:h-80' : 'h-60'}`}>
                  <img
                    src={escape.image || '/images/hero_cinematic_landscape.jpg'}
                    alt={escape.title}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = '/images/hero_cinematic_landscape.jpg';
                    }}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-[#DFB257] bg-black/60 px-2.5 py-1 rounded border border-[#C9962E]/40 backdrop-blur-sm">
                      {escape.category}
                    </span>

                    {escape.badge && (
                      <span className="text-[10px] font-semibold text-emerald-200 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-500/30 backdrop-blur-sm">
                        {escape.badge}
                      </span>
                    )}
                  </div>

                  {/* Bottom Image Overlay Details */}
                  <div className="absolute bottom-4 left-4 right-4 text-white z-10">
                    <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-[#DFB257] transition-colors">
                      {escape.title}
                    </h3>
                    <p className="text-xs text-slate-200 font-light mt-0.5 line-clamp-1">
                      {escape.tagline}
                    </p>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  {/* Micro-Metrics Bar */}
                  <div className="grid grid-cols-2 gap-2 bg-[#F7F3EA] p-2.5 rounded-xl border border-slate-200/60 text-xs">
                    <div className="flex items-center gap-2">
                      <Navigation className="w-3.5 h-3.5 text-[#C9962E] shrink-0" />
                      <span className="font-semibold text-[#073B35] truncate">{escape.distanceFromBlr}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#C9962E] shrink-0" />
                      <span className="text-slate-600 truncate">{escape.driveTime} drive</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#073B35] shrink-0" />
                      <span className="text-slate-700 truncate">{escape.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#073B35] shrink-0" />
                      <span className="text-slate-600 truncate">{escape.highwayRoute.split('(')[0]}</span>
                    </div>
                  </div>

                  {/* Overview excerpt */}
                  <p className="text-xs text-slate-600 leading-relaxed font-light line-clamp-2">
                    {escape.overview}
                  </p>

                  {/* Highlights Bullet Tags */}
                  <div className="space-y-1.5 pt-1">
                    {escape.highlights.slice(0, 3).map((hl, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#C9962E] shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{hl}</span>
                      </div>
                    ))}
                  </div>

                  {/* Best Vehicles Available */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5 text-[#073B35]" />
                      <span>Fleet:</span>
                      <span className="text-[#073B35] font-medium truncate max-w-[170px]">
                        {escape.popularVehicles.join(', ')}
                      </span>
                    </div>
                    <span className="text-emerald-700 font-medium">Doorstep BLR Cab</span>
                  </div>

                  {/* Bottom Action Buttons */}
                  <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setActiveCityEscape(escape)}
                      className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-[#073B35] text-[#073B35] hover:text-white transition-colors text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>View Plan</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleEnquireWhatsApp(escape, e)}
                      className="px-3 py-2 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white transition-colors text-xs font-medium flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-white" />
                      <span>WhatsApp</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bengaluru Traveler Banner: Doorstep Pickup Across the City */}
        <div className="mt-16 bg-[#073B35] rounded-2xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-[#0B5D5A]/40 blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-[2px] bg-[#DFB257]" />
                <span className="text-xs uppercase tracking-widest text-[#DFB257] font-semibold">
                  Bengaluru Door-to-Door Outstation Service
                </span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Pick Up From Anywhere in Bengaluru. Return In Peace.
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-light">
                No need to negotiate early morning rides to pickup points. Our polite chauffeurs arrive at your doorstep, whether you are in Whitefield, Koramangala, Indiranagar, Electronic City, HSR Layout, Hebbal, Yelahanka, JP Nagar, RR Nagar, or near BLR Airport.
              </p>
              
              {/* Pickup neighborhood tags */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {[
                  'Whitefield',
                  'Indiranagar',
                  'Koramangala',
                  'Electronic City',
                  'HSR Layout',
                  'JP Nagar',
                  'Jayanagar',
                  'Hebbal',
                  'Yelahanka',
                  'Malleshwaram',
                  'Bellandur',
                  'Marathahalli',
                  'BLR Airport (KIA)',
                ].map((zone) => (
                  <span
                    key={zone}
                    className="px-2.5 py-0.5 rounded-full bg-white/10 text-slate-200 text-[11px] font-medium border border-white/15"
                  >
                    {zone}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Action Box */}
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-xl border border-white/20 shrink-0 space-y-3 lg:max-w-xs w-full text-center sm:text-left">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
                <ShieldCheck className="w-4 h-4" />
                <span>Sanitized AC Fleet & Courteous Drivers</span>
              </div>
              <p className="text-xs text-slate-200 font-light leading-relaxed">
                Choose from Swift Dzire (Sedan), Innova Crysta (SUV), Ertiga (MPV), or Tempo Traveller.
              </p>
              <div className="pt-1 flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleGeneralBLREnquiry}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white font-medium text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Plan BLR Escape</span>
                </button>
                <a
                  href={`tel:${siteConfig.phone.replace(/[^0-9+]/g, '')}`}
                  className="px-4 py-2.5 rounded-lg bg-white/20 hover:bg-white/30 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <Phone className="w-3.5 h-3.5 text-[#DFB257]" />
                  <span>Call Desk</span>
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
