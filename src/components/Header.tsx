import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { useContent } from '../context/ContentContext';
import { MessageCircle, Menu, X, CalendarCheck, } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    siteConfig,
    getWhatsAppUrl,
    openBookingModal,
    isAdminLoggedIn,
    setIsAdminPanelOpen,
  } = useContent();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Destinations', href: '#destinations' },
    { label: 'City Escape', href: '#bengaluru-airport-sightseeing' },
    { label: 'Our Vehicles', href: '#vehicles' },
    { label: 'Packages', href: '#packages' },
    { label: 'About Us', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      const navOffset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - navOffset,
        behavior: 'smooth',
      });
    }
  };

 

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0B192C]/95 backdrop-blur-md shadow-xl py-3 border-b border-slate-800/80'
          : 'bg-gradient-to-b from-[#0B192C]/90 via-[#0B192C]/40 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* ZONE 1: Brand Wordmark & Logo */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, '#home')}
            className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded shrink-0"
          >
            <Logo
              variant="light"
              size={isScrolled ? 'sm' : 'md'}
              customLogoUrl={siteConfig.customLogoUrl}
              badgeStyle={true}
              showTagline={true}
            />
          </a>

          {/* ZONE 2: Clean Desktop Navigation Links (Unboxed, single-line) */}
          <nav className="hidden xl:flex items-center gap-6 text-sm font-medium tracking-wide">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-slate-200 hover:text-white transition-colors relative py-1 whitespace-nowrap after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-amber-400 hover:after:w-full after:transition-all after:duration-300"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* ZONE 3: Primary Action & Profile Controls */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0">
            
            {/* Direct WhatsApp Action */}
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-slate-800/80 hover:bg-slate-700/80 rounded-lg transition-all border border-slate-700 whitespace-nowrap"
              aria-label="Chat on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
              <span className="hidden md:inline">WhatsApp</span>
            </a>

            {/* Prominent Book Now Action Button */}
            <button
              onClick={() => openBookingModal()}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 rounded-lg transition-all shadow-md hover:shadow-lg whitespace-nowrap cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Book Now</span>
            </button>
          </div>

          {/* MOBILE TOGGLE & QUICK ACTIONS */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={() => openBookingModal()}
              className="sm:hidden px-3 py-1.5 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-md"
            >
              Book Now
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-200 hover:text-white hover:bg-slate-800 rounded-lg focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE DROPDOWN DRAWER */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-[#0B192C] border-t border-slate-800 px-4 pt-4 pb-6 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-2.5">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-slate-200 text-sm font-medium py-2 px-3 rounded-lg hover:bg-slate-800/80 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}

            <div className="pt-3 border-t border-slate-800 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openBookingModal();
                }}
                className="w-full py-2.5 px-4 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg text-center flex items-center justify-center gap-2 shadow"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Book Now (Trip Planner)</span>
              </button>

              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-white bg-slate-800 rounded-lg border border-slate-700"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>Chat on WhatsApp (+91 96204 52241)</span>
              </a>

              
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
