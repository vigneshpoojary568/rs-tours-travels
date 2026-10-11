import React from 'react';
import { useContent } from '../context/ContentContext';
import { TravelExperience } from '../types';
import { ArrowUpRight } from 'lucide-react';

export const TravelExperiences: React.FC = () => {
  const { experiences, getWhatsAppUrl, openBookingModal } = useContent();

  const handleExploreCategory = (exp: TravelExperience) => {
    const pkgSection = document.querySelector('#packages');
    if (pkgSection) {
      pkgSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 bg-[#0B192C] text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-6 h-[1.5px] bg-amber-400" />
            <span className="text-xs uppercase tracking-[0.22em] text-amber-400 font-bold">
              Curated Travel Styles
            </span>
            <span className="w-6 h-[1.5px] bg-amber-400" />
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Travel Beyond the Destination
          </h2>

          <p className="text-slate-300 text-base sm:text-lg font-light leading-relaxed">
            Every traveler seeks something unique. Whether you are traveling with family, escaping with your partner, or venturing into the wilderness with friends, your journey is personalized with care.
          </p>
        </div>

        {/* Four Visually Immersive Experience Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {experiences.map((exp, index) => (
            <div
              key={exp.id}
              className="group relative h-[460px] sm:h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col justify-end p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-amber-400/50"
            >
              {/* Full Image Background */}
              <img
                src={exp.image || '/images/hero_luxury_travel_panoramic.jpg'}
                alt={exp.title}
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = '/images/hero_luxury_travel_panoramic.jpg';
                }}
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
              />

              {/* Rich Multi-Stop Gradient Scrim for Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C] via-[#0B192C]/70 to-transparent transition-opacity duration-300 group-hover:opacity-95" />

              {/* Top Accent Index */}
              <div className="absolute top-5 left-5 z-10 flex items-center justify-between w-[calc(100%-2.5rem)]">
                <span className="text-xs font-mono text-amber-300 tracking-widest uppercase bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10">
                  0{index + 1}
                </span>
                <span className="text-[11px] text-white/80 uppercase tracking-widest font-medium">
                  {exp.subtitle}
                </span>
              </div>

              {/* Content Block */}
              <div className="relative z-10">
                <h3 className="font-serif text-2xl font-bold text-white tracking-wide mb-2 group-hover:text-amber-400 transition-colors">
                  {exp.title}
                </h3>

                <p className="text-sm text-slate-200 font-light leading-relaxed mb-5 line-clamp-3">
                  {exp.description}
                </p>

                {/* Highlights tags */}
                <div className="space-y-1 mb-5 border-t border-white/15 pt-3">
                  {exp.highlights.slice(0, 2).map((item, i) => (
                    <div key={i} className="text-xs text-white/90 flex items-center gap-1.5 font-light">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                {/* Explore Button */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleExploreCategory(exp)}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-white/10 hover:bg-amber-500 hover:text-slate-950 text-white text-xs font-bold rounded-lg border border-white/20 hover:border-amber-500 transition-all duration-300 cursor-pointer"
                  >
                    <span>Explore Packages</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => openBookingModal({ tripType: exp.title })}
                    className="p-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg transition-colors cursor-pointer"
                    title={`Book ${exp.title}`}
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
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
