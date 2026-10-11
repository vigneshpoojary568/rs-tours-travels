import React, { useState } from 'react';
import { useContent } from '../../context/ContentContext';
import { Lock } from 'lucide-react';

export const AdminAccessIcon: React.FC = () => {
  const {
    isAdminLoggedIn,
    setShowAdminLoginModal,
    setIsAdminPanelOpen,
    isAdminPanelOpen,
  } = useContent();

  const [isHovered, setIsHovered] = useState(false);

  if (isAdminPanelOpen) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAdminLoggedIn) {
      setIsAdminPanelOpen(true);
    } else {
      setShowAdminLoginModal(true);
    }
  };

  return (
    <div
      className="fixed right-[18px] bottom-[128px] sm:bottom-[82px] z-[9999] flex items-center select-none"
      style={{ zIndex: 9999 }}
    >
      {/* Desktop Hover Tooltip (hidden permanently, only visible on hover) */}
      <div
        className={`hidden sm:block absolute right-full mr-3 px-3 py-1.5 bg-[#073B35] text-[#DFB257] text-xs font-semibold rounded-md shadow-xl border border-[#0B5D5A] whitespace-nowrap transition-all duration-200 pointer-events-none ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-1'
        }`}
      >
        <span>{isAdminLoggedIn ? 'Admin Dashboard' : 'Admin Login'}</span>
        {/* Triangle pointer */}
        <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-[#073B35] rotate-45 border-t border-r border-[#0B5D5A]" />
      </div>

      {/* Admin Access Button: 42px on desktop, 44px on mobile */}
      <button
        type="button"
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Admin Login"
        className="w-[44px] h-[44px] sm:w-[42px] sm:h-[42px] rounded-full bg-[#073B35] hover:bg-[#0B5D5A] text-[#DFB257] hover:text-white border-2 border-[#DFB257]/60 hover:border-[#DFB257] flex items-center justify-center shadow-xl shadow-black/35 cursor-pointer hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#DFB257] focus:ring-offset-2"
      >
        <Lock className="w-5 h-5 text-[#DFB257]" />
      </button>
    </div>
  );
};
