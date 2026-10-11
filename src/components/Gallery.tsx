import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { GalleryPhoto } from '../types';
import { Maximize2, MapPin } from 'lucide-react';

const GALLERY_CATEGORIES = [
  'All',
  'Destinations',
  'Nature',
  'Road Trips',
  'Travellers',
  'Experiences',
] as const;

export const Gallery: React.FC = () => {
  const { gallery, setLightboxPhoto } = useContent();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [displayCount, setDisplayCount] = useState<number>(8);

  const filteredPhotos =
    activeCategory === 'All'
      ? gallery
      : gallery.filter((p) => p.category === activeCategory);

  const visiblePhotos = filteredPhotos.slice(0, displayCount);

  return (
    <section id="gallery" className="py-24 sm:py-28 bg-slate-50 text-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-slate-200 pb-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-[2px] bg-amber-500" />
              <span className="text-xs uppercase tracking-[0.25em] text-slate-600 font-bold">
                Visual Journal
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#0B192C]">
              Moments Captured Along the Way
            </h2>
          </div>

          <p className="mt-4 md:mt-0 text-slate-600 text-sm font-light max-w-sm">
            A photographic journal of misty ghat routes, river corridors, and authentic journeys.
          </p>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none no-scrollbar">
          {GALLERY_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-[#0B192C] text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry / Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {visiblePhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setLightboxPhoto(photo)}
              className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 aspect-[4/3] cursor-pointer bg-slate-200 border border-slate-200"
            >
              <img
                src={photo.image}
                alt={photo.title}
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = '/images/hero_luxury_travel_panoramic.jpg';
                }}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white" />

              <div className="absolute bottom-3 left-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between text-white">
                <div>
                  <h4 className="font-serif font-bold text-sm leading-snug">
                    {photo.title}
                  </h4>
                  <div className="flex items-center gap-1 text-[11px] text-amber-300 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    <span>{photo.location}</span>
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-white/20 backdrop-blur-md">
                  <Maximize2 className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {filteredPhotos.length > displayCount && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setDisplayCount((prev) => prev + 4)}
              className="px-6 py-2.5 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-lg border border-slate-300 transition-colors shadow-sm cursor-pointer"
            >
              Load More Photographs
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
