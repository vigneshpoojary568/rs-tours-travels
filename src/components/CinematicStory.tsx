import React from 'react';
import { GENERATED_ASSETS } from '../data/defaultContent';
import { ArrowRight, Compass } from 'lucide-react';
import { useContent } from '../context/ContentContext';

export const CinematicStory: React.FC = () => {
  const { openBookingModal } = useContent();

  return (
    <section className="relative min-h-[540px] sm:min-h-[600px] flex items-center justify-center overflow-hidden bg-[#0A192F]">
      {/* Background Image: Winding road through lush green mountains */}
      <div className="absolute inset-0 z-0">
        <img
          src={GENERATED_ASSETS.cinematicRoad || '/images/cinematic_winding_road.jpg'}
          alt="A winding road through lush green mountains beside a sparkling river"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.src = '/images/cinematic_winding_road.jpg';
          }}
          className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
        />
        {/* Scrim Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B192C]/90 via-[#0B192C]/60 to-[#0B192C]/90" />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/60 backdrop-blur-md border border-amber-400/40 mb-6 text-amber-300 text-xs font-bold tracking-[0.25em] uppercase">
          <Compass className="w-3.5 h-3.5" />
          <span>The Call of Nature</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-white font-bold tracking-tight leading-tight mb-6 text-balance">
          Leave the Routine.
          <span className="block italic text-amber-400 font-normal mt-1">Find the Journey.</span>
        </h2>

        <p className="text-lg sm:text-2xl text-slate-200 font-light max-w-xl mx-auto leading-relaxed mb-10 text-balance font-serif italic">
          “Some places are visited. Some places become memories.”
        </p>

        <button
          onClick={() => openBookingModal()}
          className="inline-flex items-center gap-3 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm tracking-wider uppercase rounded-xl shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
        >
          <span>Start Your Journey</span>
          <ArrowRight className="w-4 h-4 text-slate-950" />
        </button>
      </div>
    </section>
  );
};
