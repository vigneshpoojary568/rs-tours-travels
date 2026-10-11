import React from 'react';
import {
  UserCheck,
  Car,
  Clock,
  Sparkles,
  HeartHandshake,
  ShieldCheck,
  Check,
} from 'lucide-react';

export const WhyRS: React.FC = () => {
  const pillars = [
    {
      title: 'Professional Drivers',
      desc: 'Uniformed, background-verified chauffeurs with extensive experience on winding ghat roads and highway routes.',
      icon: UserCheck,
    },
    {
      title: 'Comfortable & Clean Vehicles',
      desc: 'Thoroughly sanitized, climate-controlled sedans, MPVs, and travellers with ample luggage space for fatigue-free travel.',
      icon: Car,
    },
    {
      title: 'Reliable Service',
      desc: 'Guaranteed on-time doorstep pickups, real-time dispatch tracking, and 24/7 dedicated trip coordinator assistance.',
      icon: Clock,
    },
    {
      title: 'Transparent Pricing',
      desc: 'Clear upfront tariffs with zero surprise surcharges or hidden driver allowances. Complete financial peace of mind.',
      icon: Sparkles,
    },
    {
      title: 'Personalized Travel Experiences',
      desc: 'Tailored itineraries with flexible scenic stops, family-friendly pacing, and handpicked local dining and viewpoint tips.',
      icon: HeartHandshake,
    },
    {
      title: 'Safe & Convenient Booking',
      desc: 'Quick reservation via web or direct WhatsApp with instant confirmation codes and zero complicated prepayment hurdles.',
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="py-24 sm:py-28 bg-[#0B192C] text-white relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-8 h-[1.5px] bg-amber-400" />
            <span className="text-xs uppercase tracking-[0.25em] text-amber-400 font-bold">
              The RS Commitment
            </span>
            <span className="w-8 h-[1.5px] bg-amber-400" />
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Why Choose Us?
          </h2>

          <p className="text-slate-300 text-base sm:text-lg font-light leading-relaxed">
            We don’t treat your holiday like a checklist of tourist spots. We design comfortable journeys where you connect with nature, travel at ease, and bring home stories worth telling.
          </p>
        </div>

        {/* 6 Core Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {pillars.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="group p-7 rounded-2xl bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-400/40 transition-all duration-300 flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 transition-colors group-hover:bg-amber-400 group-hover:text-slate-950">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono text-slate-500">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-white group-hover:text-amber-400 transition-colors mb-2.5">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-300 font-light leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-slate-800 flex items-center gap-1.5 text-xs text-amber-400 font-medium">
                  <Check className="w-3.5 h-3.5" />
                  <span>Guaranteed Standard</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
