import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { Destination } from '../types';
import { MapPin, ArrowRight, Compass, CalendarCheck } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Mountains',
  'Forests',
  'Waterfalls',
  'Beaches',
  'Heritage',
  'Pilgrimage',
  'Wildlife',
] as const;

export const Destinations: React.FC = () => {
  const { destinations, setActiveDestination, openBookingModal } = useContent();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredDestinations = destinations
    .filter((d) => d.enabled !== false)
    .filter((d) => selectedCategory === 'All' || d.category === selectedCategory);

  return (
    <section id="destinations" className="py-24 sm:py-28 bg-slate-50 text-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-slate-200 pb-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-[2px] bg-amber-500" />
              <span className="text-xs uppercase tracking-[0.22em] text-slate-600 font-bold">
                Popular Destinations
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#0B192C]">
              Places Worth Remembering
            </h2>
          </div>
          <p className="mt-4 md:mt-0 text-slate-600 text-sm sm:text-base font-light max-w-md leading-relaxed">
            From the misty ridges of the Western Ghats to serene coastal roads and ancient heritage palaces, discover curated destinations designed for comfort.
          </p>
        </div>

        {/* Category Filter Tabs (Clean segmented functional controls) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#0B192C] text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-950 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Responsive Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {filteredDestinations.map((dest, index) => {
            const isMarquee = index % 5 === 0;
            const colSpan = isMarquee
              ? 'md:col-span-12 lg:col-span-8'
              : 'md:col-span-6 lg:col-span-4';

            return (
              <div
                key={dest.id}
                className={`${colSpan} group relative rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 flex flex-col justify-between`}
              >
                {/* Image Section */}
                <div className={`relative overflow-hidden ${isMarquee ? 'h-72 sm:h-96' : 'h-64'}`}>
                  <img
                    src={dest.image || '/images/hero_luxury_travel_panoramic.jpg'}
                    alt={dest.name}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = '/images/hero_luxury_travel_panoramic.jpg';
                    }}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />

                  {/* Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C]/90 via-[#0B192C]/30 to-transparent" />

                  {/* Clean Typography Tag */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="text-[11px] uppercase tracking-widest text-amber-300 font-bold bg-[#0B192C]/80 backdrop-blur-md px-3 py-1 rounded-md border border-white/10">
                      {dest.category}
                    </span>
                  </div>

                  {/* Location badge on image */}
                  <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-white">
                    <div className="flex items-center gap-1.5 text-xs text-white/95">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span className="font-medium">{dest.location}</span>
                    </div>
                    <span className="text-[11px] text-amber-300 font-normal">
                      Season: {dest.bestSeason}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#0B192C] group-hover:text-amber-700 transition-colors mb-2.5">
                      {dest.name}
                    </h3>
                    <p className="text-slate-600 text-sm font-light leading-relaxed mb-4">
                      {dest.description}
                    </p>

                    {/* Highlights (quiet metadata with typographic separators) */}
                    <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-slate-500 mb-6 font-normal">
                      {dest.highlights.slice(0, 3).map((hl, i) => (
                        <span key={i} className="inline-flex items-center gap-1">
                          {i > 0 && <span aria-hidden="true">·</span>}
                          <span>{hl}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Controls */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    <button
                      onClick={() => setActiveDestination(dest)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-[#0B192C] transition-colors cursor-pointer"
                    >
                      <span>Explore More</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => openBookingModal({ destination: dest.name })}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors cursor-pointer shadow-sm"
                    >
                      <CalendarCheck className="w-3.5 h-3.5" />
                      <span>Book Ride</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
