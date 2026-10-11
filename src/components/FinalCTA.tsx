import React from 'react';
import { useContent } from '../context/ContentContext';
import { MessageCircle, ArrowRight, Sun, CalendarCheck } from 'lucide-react';

export const FinalCTA: React.FC = () => {
  const { siteConfig, getWhatsAppUrl, openBookingModal } = useContent();

  return (
    <section className="relative min-h-[500px] sm:min-h-[560px] flex items-center justify-center overflow-hidden bg-[#0B192C]">
      {/* Background Image: Golden-hour mountain landscape */}
      <div className="absolute inset-0 z-0">
        <img
          src={siteConfig.finalCtaImage || '/images/final_cta_golden_hour.jpg'}
          alt="Golden-hour panoramic sunset over mountains and road"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.src = '/images/final_cta_golden_hour.jpg';
          }}
          className="w-full h-full object-cover object-center scale-105"
        />

        {/* Cinematic Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C] via-[#0B192C]/70 to-[#0B192C]/85" />
      </div>

      {/* Gold Border Highlight line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent z-10" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/60 backdrop-blur-md border border-amber-400/40 mb-6 text-amber-300 text-xs font-bold tracking-[0.25em] uppercase">
          <Sun className="w-3.5 h-3.5 text-amber-400" />
          <span>The Next Chapter</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-white font-bold tracking-tight leading-tight mb-5 text-balance">
          {siteConfig.finalCtaHeading || 'Your Next Story is Waiting.'}
        </h2>

        <p className="text-base sm:text-xl text-slate-200 font-light max-w-xl mx-auto leading-relaxed mb-10 text-balance font-serif italic">
          {siteConfig.finalCtaText || '“Pack your curiosity. Choose your destination. Let the journey begin.”'}
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <button
            onClick={() => openBookingModal()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm tracking-wider uppercase rounded-xl shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer whitespace-nowrap"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Book Your Ride</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href={getWhatsAppUrl('Hi RS Tours & Travels, I want to book a trip for upcoming dates.')}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-slate-900/80 hover:bg-slate-900 text-white font-semibold text-sm tracking-wider uppercase rounded-xl border border-slate-700 backdrop-blur-sm transition-all duration-300 hover:border-amber-400 cursor-pointer whitespace-nowrap"
          >
            <MessageCircle className="w-4 h-4 text-[#25D366]" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
};
