import React from 'react';
import { useContent } from '../context/ContentContext';
import { GENERATED_ASSETS } from '../data/defaultContent';
import { Sparkles, MapPin, ShieldCheck, HeartHandshake } from 'lucide-react';

export const BrandStory: React.FC = () => {
  const { siteConfig } = useContent();

  const highlights = [
    {
      title: 'MEMORABLE JOURNEYS',
      desc: 'Crafted with scenic pauses, sunrise viewpoints, and roads worth remembering long after you return home.',
      icon: Sparkles,
    },
    {
      title: 'CURATED EXPERIENCES',
      desc: 'Handpicked routes, verified stays, and local insights so you explore authentic culture and untamed nature.',
      icon: MapPin,
    },
    {
      title: 'COMFORTABLE TRAVEL',
      desc: 'Sanitized vehicles, skilled hill chauffeurs, flexible stops, and unhurried daily schedules for total peace of mind.',
      icon: ShieldCheck,
    },
    {
      title: 'PERSONALIZED SERVICE',
      desc: 'Direct consultation, 24/7 on-tour assistance, and journeys designed completely around your family or group.',
      icon: HeartHandshake,
    },
  ];

  return (
    <section id="about" className="py-24 sm:py-32 bg-white text-slate-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT COLUMN: Editorial Visual Layout with Overlapping Photographs */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Primary Large Scenic Photo */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] group">
                <img
                  src={GENERATED_ASSETS.cinematicRoad || '/images/cinematic_winding_road.jpg'}
                  alt="Scenic mountain road curving alongside a turquoise river"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = '/images/cinematic_winding_road.jpg';
                  }}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C]/70 via-transparent to-transparent opacity-70" />
                <div className="absolute bottom-4 left-4 right-4 text-white text-xs tracking-wider uppercase font-semibold bg-black/50 backdrop-blur-md px-3.5 py-1.5 rounded-lg inline-block w-fit">
                  Scenic Ghat Roads & River Corridors
                </div>
              </div>

              {/* Secondary Overlapping Photo */}
              <div className="absolute -bottom-8 -right-4 sm:-bottom-10 sm:-right-8 w-3/5 aspect-[4/3] rounded-xl overflow-hidden shadow-2xl border-4 border-white group">
                <img
                  src={GENERATED_ASSETS.familyHoliday || '/images/family_holiday_journey.jpg'}
                  alt="Happy travellers pausing at a scenic mountain viewpoint"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = '/images/family_holiday_journey.jpg';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C]/50 via-transparent to-transparent opacity-60" />
              </div>

              {/* Decorative Warm Gold Accent Frame */}
              <div className="absolute -top-4 -left-4 w-32 h-32 border-t-2 border-l-2 border-amber-400 -z-10" />
            </div>
          </div>

          {/* RIGHT COLUMN: Editorial Story prose */}
          <div className="lg:col-span-6 lg:pl-6">
            {/* Tagline / Subtitle */}
            <div className="flex items-center gap-3 mb-4">
              <span className="h-[2px] w-8 bg-amber-500" />
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-slate-600">
                The RS Story & Philosophy
              </span>
            </div>

            {/* Main Editorial Heading */}
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0B192C] leading-tight mb-5">
              {siteConfig.brandStoryHeading || 'EVERY JOURNEY BEGINS WITH A STORY'}
            </h2>

            {/* Brand Narrative Prose */}
            <div className="space-y-4 text-slate-600 text-base sm:text-lg leading-relaxed font-light mb-8">
              <p className="font-medium text-[#0B192C] text-lg sm:text-xl leading-relaxed italic font-serif">
                “{siteConfig.brandStoryText || `${siteConfig.brandName} is built around the belief that travel is more than reaching a destination. It is about the roads we take, the places we discover, the people we meet and the memories we bring home.`}”
              </p>
              <p>
                From misty mountain passes in the Western Ghats to serene coastal roads, our journeys are thoughtfully designed so you never feel rushed. We take care of every road turn, scenic pause, and verified stay, so you and your loved ones can immerse completely in the experience.
              </p>
            </div>

            {/* Four Editorial Highlight Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-slate-200">
              {highlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-100 text-[#0B192C] shrink-0 mt-0.5 border border-slate-200 shadow-sm">
                      <Icon className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-[#0B192C]">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 leading-normal font-light">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
