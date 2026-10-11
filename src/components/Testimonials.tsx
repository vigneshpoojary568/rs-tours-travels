import React from 'react';
import { useContent } from '../context/ContentContext';
import { Star, Quote, MapPin, CheckCircle2 } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const { testimonials, getWhatsAppUrl } = useContent();

  const activeTestimonials = testimonials.filter((t) => t.enabled !== false);

  return (
    <section className="py-24 sm:py-28 bg-slate-50 text-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-8 h-[2px] bg-amber-500" />
            <span className="text-xs uppercase tracking-[0.25em] text-slate-600 font-bold">
              Traveller Reflections
            </span>
            <span className="w-8 h-[2px] bg-amber-500" />
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#0B192C] mb-4">
            Customer Testimonials
          </h2>

          <p className="text-slate-600 text-base sm:text-lg font-light leading-relaxed">
            The heart of our service lives in the memories our travelers take home. Read genuine reflections from guests who traveled across hill stations, coastal highways, and heritage circuits.
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {activeTestimonials.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-8 sm:p-10 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 flex flex-col justify-between relative group"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-amber-500/15 group-hover:text-amber-500/30 transition-colors" />

              <div>
                {/* Star Rating */}
                <div className="flex items-center gap-1 mb-4 text-amber-500">
                  {[...Array(item.starRating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500" />
                  ))}
                  <span className="text-xs font-mono ml-2 text-slate-500 font-normal">
                    5.0 / 5.0
                  </span>
                </div>

                {/* Review Text */}
                <p className="text-slate-700 text-base sm:text-lg font-light leading-relaxed mb-6 font-serif italic">
                  “{item.review}”
                </p>
              </div>

              {/* Author & Journey Info */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-lg font-bold text-[#0B192C]">
                      {item.customerName}
                    </h3>
                    <span title="Verified Guest">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    <span>{item.destination}</span>
                    <span>·</span>
                    <span className="text-slate-700 font-medium">{item.travelType}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-400 font-mono block">
                    {item.date}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* WhatsApp feedback prompt */}
        <div className="mt-12 text-center text-xs text-slate-500">
          <span>Traveled with RS Tours & Travels recently? </span>
          <a
            href={getWhatsAppUrl('Hi RS Tours & Travels, I would like to share feedback from my recent journey.')}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-700 font-bold underline hover:text-[#0B192C]"
          >
            Share your experience directly on WhatsApp
          </a>
        </div>

      </div>
    </section>
  );
};
