import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { MessageCircle } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const { getWhatsAppUrl, isAdminPanelOpen } = useContent();
  const [isHovered, setIsHovered] = useState(false);

  if (isAdminPanelOpen) return null;

  return (
    <div
      className="fixed right-[18px] bottom-[70px] sm:bottom-[18px] z-[9998] flex items-center select-none"
      style={{ zIndex: 9998 }}
    >
      {/* Desktop Tooltip */}
      <div
        className={`hidden sm:block absolute right-full mr-3 px-3 py-1.5 bg-[#073B35] text-[#F7F3EA] text-xs font-medium rounded-md shadow-lg border border-[#0B5D5A] whitespace-nowrap transition-all duration-200 pointer-events-none ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-1'
        }`}
      >
        <span>Chat on WhatsApp</span>
        {/* Triangle pointer */}
        <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-[#073B35] rotate-45 border-t border-r border-[#0B5D5A]" />
      </div>

      {/* Floating Action Button */}
      <a
        href={getWhatsAppUrl('Hi RS Tours & Travels, I would like to plan a trip. Please share package details.')}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Chat on WhatsApp with RS Tours & Travels"
        className="w-[48px] h-[48px] sm:w-[50px] sm:h-[50px] rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white flex items-center justify-center shadow-lg shadow-black/25 border-2 border-white/90 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
      >
        <MessageCircle className="w-6 h-6 fill-white text-[#25D366]" />
      </a>
    </div>
  );
};
