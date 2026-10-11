import React from 'react';
import { useContent } from '../context/ContentContext';
import { MessageCircle, Phone, Clock, ShieldCheck, Sparkles, CalendarCheck } from 'lucide-react';

export const WhatsAppConversion: React.FC = () => {
  const { siteConfig, getWhatsAppUrl, openBookingModal } = useContent();

  const prefilledMessage =
    'Hi RS Tours & Travels, I would like to plan a trip. Please share the available packages and cab options.';

  return (
    <section className="py-20 bg-gradient-to-br from-[#0B192C] via-[#0F172A] to-[#0B192C] text-white relative overflow-hidden border-t border-b border-slate-800">
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/60 backdrop-blur-md border border-[#25D366]/40 mb-6 text-[#25D366] text-xs font-bold tracking-widest uppercase">
          <MessageCircle className="w-4 h-4 fill-[#25D366]/20" />
          <span>Direct Travel Desk & Instant Confirmation</span>
        </div>

        {/* Heading */}
        <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-5">
          Ready to Plan Your Next Journey?
        </h2>

        {/* Supporting text */}
        <p className="text-base sm:text-xl text-slate-300 font-light max-w-2xl mx-auto leading-relaxed mb-10">
          Tell us where you want to go. We'll help turn your travel idea into a seamless, unforgettable road adventure.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 mb-12">
          {/* Primary: Chat on WhatsApp */}
          <a
            href={getWhatsAppUrl(prefilledMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#25D366] hover:bg-[#20BD5A] text-slate-950 font-bold text-base rounded-xl shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
            aria-label="Chat on WhatsApp with RS Tours & Travels"
          >
            <MessageCircle className="w-5 h-5 fill-slate-950" />
            <span>Chat on WhatsApp</span>
          </a>

          {/* Book via Planner */}
          <button
            onClick={() => openBookingModal()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-base rounded-xl shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer whitespace-nowrap"
          >
            <CalendarCheck className="w-5 h-5" />
            <span>Open Trip Planner</span>
          </button>

          {/* Call Us Button */}
          <a
            href={`tel:${siteConfig.phone.replace(/[^0-9+]/g, '')}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-slate-800/80 hover:bg-slate-700 text-white font-semibold text-base rounded-xl border border-slate-700 transition-all duration-300 cursor-pointer whitespace-nowrap"
            aria-label={`Call RS Tours & Travels at ${siteConfig.phone}`}
          >
            <Phone className="w-4 h-4 text-amber-400" />
            <span>Call: {siteConfig.phone}</span>
          </a>
        </div>

        {/* Key Quick Promises */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-slate-400 font-light">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Under 10-Minute Response Time</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Zero Advance Upfront Booking Fees</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>100% Customized Route Flexibility</span>
          </div>
        </div>

      </div>
    </section>
  );
};
