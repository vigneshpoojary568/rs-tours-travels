import React from 'react';
import { useContent } from '../context/ContentContext';
import { MessageSquare, Map, Compass, Camera, ArrowRight, CalendarCheck } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const { openBookingModal } = useContent();

  const steps = [
    {
      num: '01',
      title: 'Share Your Travel Vision',
      subtitle: 'Where & When',
      desc: 'Tell us your destination, dates, family or group size, and vehicle preferences via our quick planner or direct WhatsApp.',
      icon: MessageSquare,
    },
    {
      num: '02',
      title: 'We Design Your Itinerary',
      subtitle: 'Crafted with Care',
      desc: 'We map out scenic routes, reserve verified stays, and assign dedicated sanitized tour vehicles with transparent, upfront pricing.',
      icon: Map,
    },
    {
      num: '03',
      title: 'Travel in Comfort',
      subtitle: 'Pure Peace of Mind',
      desc: 'Step into a spotless AC vehicle with an experienced route chauffeur. Enjoy flexible scenic stops, viewpoints, and unhurried driving.',
      icon: Compass,
    },
    {
      num: '04',
      title: 'Cherish Lasting Memories',
      subtitle: 'Stories that Last',
      desc: 'Return refreshed with cameras full of vistas and hearts full of shared joy. Truly not just a trip… but a story worth remembering.',
      icon: Camera,
    },
  ];

  return (
    <section className="py-24 sm:py-28 bg-white text-slate-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-8 h-[2px] bg-amber-500" />
            <span className="text-xs uppercase tracking-[0.25em] text-slate-600 font-bold">
              The Booking Process
            </span>
            <span className="w-8 h-[2px] bg-amber-500" />
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#0B192C] mb-4">
            From Idea to Adventure
          </h2>

          <p className="text-slate-600 text-base sm:text-lg font-light leading-relaxed">
            Planning a holiday shouldn’t feel like homework. We make turning your travel idea into a seamless reality effortless, transparent, and exciting.
          </p>
        </div>

        {/* 4 Steps Grid with connecting line */}
        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-12 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.num}
                  className="bg-slate-50 border border-slate-200/90 rounded-2xl p-7 flex flex-col justify-between hover:shadow-lg transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-xl bg-[#0B192C] text-amber-400 flex items-center justify-center shadow-md">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-2xl font-serif font-bold text-amber-500/80">
                        {item.num}
                      </span>
                    </div>

                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                      {item.subtitle}
                    </span>

                    <h3 className="font-serif text-lg font-bold text-[#0B192C] mb-3">
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-14 text-center">
          <button
            onClick={() => openBookingModal()}
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#0B192C] hover:bg-[#1E293B] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer"
          >
            <CalendarCheck className="w-4 h-4 text-amber-400" />
            <span>Start Planning Step 1</span>
          </button>
        </div>

      </div>
    </section>
  );
};
