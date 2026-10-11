import React, { useState, useRef } from 'react';
import { Logo } from './Logo';
import { useContent } from '../context/ContentContext';
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Youtube,
  Shield,
  ArrowRight,
  CalendarCheck,
} from 'lucide-react';
import { LegalModal } from './LegalModal';

export const Footer: React.FC = () => {
  const {
    siteConfig,
    getWhatsAppUrl,
    isAdminLoggedIn,
    setIsAdminPanelOpen,
    setShowAdminLoginModal,
    openBookingModal,
  } = useContent();

  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | null>(null);
  const [socialNotice, setSocialNotice] = useState<string | null>(null);
  const devClicksRef = useRef<number>(0);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleCopyrightClick = () => {
    devClicksRef.current += 1;
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }
    if (devClicksRef.current >= 3) {
      devClicksRef.current = 0;
      if (isAdminLoggedIn) {
        setIsAdminPanelOpen(true);
      } else {
        setShowAdminLoginModal(true);
      }
    } else {
      clickTimeoutRef.current = setTimeout(() => {
        devClicksRef.current = 0;
      }, 1500);
    }
  };

  const handleDiscreetAdminAccess = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAdminLoggedIn) {
      setIsAdminPanelOpen(true);
    } else {
      setShowAdminLoginModal(true);
    }
  };

  const showSocialNote = (platform: string) => {
    setSocialNotice(`Official ${platform} channel is active on inquiry! Connect with us directly on WhatsApp.`);
    setTimeout(() => setSocialNotice(null), 3500);
  };

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About Us', href: '#about' },
    { label: 'Destinations', href: '#destinations' },
    { label: 'City Escape', href: '#bengaluru-airport-sightseeing' },
    { label: 'Our Vehicles', href: '#vehicles' },
    { label: 'Tour Packages', href: '#packages' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const navOffset = 70;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - navOffset,
        behavior: 'smooth',
      });
    }
  };

  return (
    <footer className="bg-[#0B192C] text-slate-300 border-t border-slate-800 pt-16 pb-24 sm:pb-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info & Logo */}
          <div className="lg:col-span-5 space-y-4">
            <Logo
              variant="light"
              size="lg"
              customLogoUrl={siteConfig.customLogoUrl}
              badgeStyle={true}
              showTagline={false}
            />

            <p className="text-sm text-slate-300 font-light max-w-sm leading-relaxed mt-4">
              {siteConfig.tagline}
            </p>
            <p className="text-xs text-slate-400 font-light max-w-sm leading-relaxed">
              Curating scenic mountain roads, serene river valleys, and verified stays across South India. Dedicated to comfortable, unhurried family and group travel.
            </p>

            {/* Social Media Links */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-[#25D366] hover:text-slate-950 text-white flex items-center justify-center transition-colors shadow-sm border border-slate-700"
                aria-label="RS Tours WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={() => showSocialNote('Instagram')}
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-amber-400 hover:text-slate-950 text-white flex items-center justify-center transition-colors shadow-sm border border-slate-700 cursor-pointer"
                aria-label="Instagram handle"
              >
                <Instagram className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => showSocialNote('Facebook')}
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-amber-400 hover:text-slate-950 text-white flex items-center justify-center transition-colors shadow-sm border border-slate-700 cursor-pointer"
                aria-label="Facebook page"
              >
                <Facebook className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => showSocialNote('YouTube')}
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-amber-400 hover:text-slate-950 text-white flex items-center justify-center transition-colors shadow-sm border border-slate-700 cursor-pointer"
                aria-label="YouTube channel"
              >
                <Youtube className="w-4 h-4" />
              </button>
            </div>

            {socialNotice && (
              <div className="text-xs text-amber-300 bg-slate-800/80 border border-amber-400/30 px-3 py-1.5 rounded-md animate-in fade-in duration-200">
                {socialNotice}
              </div>
            )}
          </div>

          {/* Quick Navigation Links */}
          <div className="lg:col-span-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-amber-400 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="hover:text-amber-400 transition-colors flex items-center gap-1.5 text-slate-300"
                  >
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Direct Contact Summary */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-amber-400 mb-4">
              Contact Desk
            </h4>
            
            <div className="space-y-3 text-xs sm:text-sm">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 hover:text-amber-400 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{siteConfig.whatsapp}</span>
              </a>

              <a
                href={`tel:${siteConfig.phone.replace(/[^0-9+]/g, '')}`}
                className="flex items-center gap-2.5 hover:text-amber-400 transition-colors"
              >
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{siteConfig.phone}</span>
              </a>

              <a
                href={`mailto:${siteConfig.email}`}
                className="flex items-center gap-2.5 hover:text-amber-400 transition-colors break-all"
              >
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{siteConfig.email}</span>
              </a>

              <div className="flex items-start gap-2.5 text-slate-400 pt-1">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span className="text-xs">{siteConfig.address}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => openBookingModal()}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-md cursor-pointer"
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>Book Your Ride Now</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            <span
              onClick={handleCopyrightClick}
              className="select-none cursor-default"
              title="RS Tours & Travels"
            >
              {siteConfig.footerCopyright || `© ${new Date().getFullYear()} RS Tours & Travels. All Rights Reserved.`}
            </span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setLegalModalType('privacy')}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setLegalModalType('terms')}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              Terms of Booking
            </button>
            
            {/* Developer Admin Dashboard link - only visible when developer is actively logged in */}
            {isAdminLoggedIn && (
              <button
                onClick={handleDiscreetAdminAccess}
                className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer font-semibold"
                title="Admin Dashboard"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Panel</span>
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Legal Policy Modal */}
      {legalModalType && (
        <LegalModal
          type={legalModalType}
          onClose={() => setLegalModalType(null)}
        />
      )}
    </footer>
  );
};
