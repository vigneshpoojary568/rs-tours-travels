import React from 'react';
import { useContent } from '../context/ContentContext';
import { Phone, MessageCircle, CalendarCheck } from 'lucide-react';

export const MobileStickyBar: React.FC = () => {
  const { siteConfig, getWhatsAppUrl, openBookingModal } = useContent();

  return (
    <aside
      aria-label="Quick contact actions"
      className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-[#0B192C]/95 backdrop-blur-md border-t border-slate-800 p-2 shadow-2xl flex items-center gap-2 h-[52px]"
    >
      {/* Click to Call */}
      <a
        href={`tel:${siteConfig.phone.replace(/[^0-9+]/g, '')}`}
        className="flex-1 h-full inline-flex items-center justify-center gap-1.5 bg-slate-800 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold active:bg-slate-700 transition-colors"
        aria-label="Call directly"
      >
        <Phone className="w-3.5 h-3.5 text-amber-400" />
        <span>Call</span>
      </a>

      {/* Book Ride Action */}
      <button
        onClick={() => openBookingModal()}
        className="flex-1 h-full inline-flex items-center justify-center gap-1.5 bg-amber-500 text-slate-950 rounded-lg text-xs font-bold active:bg-amber-600 transition-colors shadow-sm"
      >
        <CalendarCheck className="w-3.5 h-3.5" />
        <span>Book Ride</span>
      </button>

      {/* WhatsApp Action */}
      <a
        href={getWhatsAppUrl('Hi RS Tours & Travels, I would like to plan a trip. Please share the available tour packages.')}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 h-full inline-flex items-center justify-center gap-1.5 bg-[#25D366] text-slate-950 rounded-lg text-xs font-bold active:bg-[#20BD5A] transition-colors shadow-md"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-3.5 h-3.5 fill-slate-950" />
        <span>WhatsApp</span>
      </a>
    </aside>
  );
};
