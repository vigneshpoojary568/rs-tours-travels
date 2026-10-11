import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { Logo } from './Logo';
import {
  MessageCircle,
  Compass,
  ArrowRight,
  Calendar,
  MapPin,
  Car,
  ShieldCheck,
  Award,
  Clock,
  Sparkles,
} from 'lucide-react';

export const Hero: React.FC = () => {
  const { siteConfig, getWhatsAppUrl, openBookingModal, destinations } = useContent();

  // Search interface state
  const [searchTripType, setSearchTripType] = useState<string>('Outstation Roundtrip');
  const [searchPickup, setSearchPickup] = useState<string>('Bengaluru');
  const [searchDestination, setSearchDestination] = useState<string>('');
  const [searchDate, setSearchDate] = useState<string>('');
  const [searchVehicleCategory, setSearchVehicleCategory] = useState<string>('SUV (Innova Crysta)');

  const scrollToDestinations = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.querySelector('#destinations');
    if (el) {
      const navOffset = 70;
      const elementPosition = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - navOffset,
        behavior: 'smooth',
      });
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    openBookingModal({
      tripType: searchTripType,
      pickupLocation: searchPickup,
      destination: searchDestination || 'Popular Western Ghats / Coastal',
      travelDate: searchDate,
      vehiclePreference: searchVehicleCategory,
    });
  };

  return (
    <section
      id="home"
      className="relative min-h-[92vh] lg:min-h-screen flex items-center justify-center overflow-hidden bg-[#0A192F]"
    >
      {/* Background Image Container with Cinematic Lighting */}
      <div className="absolute inset-0 z-0">
        <img
          src={siteConfig.heroImage || '/images/hero_luxury_travel_panoramic.jpg'}
          alt="Luxury travel tour vehicle cruising along scenic coastal cliffs and mountains"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.src = '/images/hero_luxury_travel_panoramic.jpg';
          }}
          className="w-full h-full object-cover object-center scale-100"
        />

        {/* Sophisticated Deep Navy Scrim Overlays ensuring WCAG AA Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C] via-[#0B192C]/65 to-black/75 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B192C]/80 via-transparent to-[#0B192C]/50 pointer-events-none" />
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-28 pb-16 lg:pt-36 lg:pb-20 flex flex-col items-center">
        
        {/* Subtle Brand Tagline */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/60 backdrop-blur-md border border-amber-400/30 mb-5 text-amber-300 text-xs sm:text-sm font-semibold tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Premium Tours & Travels • Verified Chauffeurs</span>
        </div>

        {/* Required Headline */}
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-white font-bold tracking-tight leading-[1.12] max-w-4xl drop-shadow-md text-balance mb-5">
          Your Journey, <span className="text-amber-400 italic">Our Responsibility.</span>
        </h1>

        {/* Required Supporting Text */}
        <p className="text-sm sm:text-lg md:text-xl text-slate-200 font-light max-w-2xl leading-relaxed text-balance mb-8 sm:mb-10">
          Discover beautiful destinations and travel comfortably with our reliable Tours & Travels services. From hill station escapes to sanitized outstation cabs and airport transfers.
        </p>

        {/* Prominent Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto mb-10">
          {/* Explore Destinations */}
          <a
            href="#destinations"
            onClick={scrollToDestinations}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold text-sm rounded-xl shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer whitespace-nowrap"
          >
            <Compass className="w-4 h-4 text-slate-950" />
            <span>Explore Destinations</span>
          </a>

          {/* Book Your Ride */}
          <button
            onClick={() => openBookingModal()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#0B192C]/90 hover:bg-[#0B192C] text-white border border-slate-700/80 hover:border-amber-400/80 backdrop-blur-md font-semibold text-sm rounded-xl shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer whitespace-nowrap"
          >
            <span>Book Your Ride</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>

          {/* WhatsApp Action */}
          <a
            href={getWhatsAppUrl('Hi RS Tours & Travels, I would like to check cab tariffs and customized tour package options.')}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded-xl shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer whitespace-nowrap"
            aria-label="Chat on WhatsApp"
          >
            <MessageCircle className="w-4 h-4 text-white fill-white/20" />
            <span>WhatsApp Enquiry</span>
          </a>
        </div>

        {/* Interactive Booking Search Interface */}
        <div className="w-full max-w-4xl bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-2xl border border-slate-200/80 text-left">
          {/* Search Trip Type Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-3 border-b border-slate-100 scrollbar-none">
            {[
              'Outstation Roundtrip',
              'One-Way Drop',
              'Bengaluru City Escape',
              'Airport Transfer',
            ].map((type) => (
              <button
                type="button"
                key={type}
                onClick={() => setSearchTripType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  searchTripType === type
                    ? 'bg-[#0B192C] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Search Form Fields Grid */}
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
            {/* Pickup */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Pickup City
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                <input
                  type="text"
                  required
                  value={searchPickup}
                  onChange={(e) => setSearchPickup(e.target.value)}
                  placeholder="e.g. Bengaluru"
                  className="w-full pl-8 pr-2 py-2 text-xs font-medium rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                />
              </div>
            </div>

            {/* Destination */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Destination
              </label>
              <select
                value={searchDestination}
                onChange={(e) => setSearchDestination(e.target.value)}
                className="w-full px-2.5 py-2 text-xs font-medium rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white text-slate-800"
              >
                <option value="">Choose Destination...</option>
                {destinations
                  .filter((d) => d.enabled !== false)
                  .map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                <option value="Coorg & Western Ghats">Coorg & Western Ghats</option>
                <option value="Wayanad & Chembra Peak">Wayanad & Chembra Peak</option>
                <option value="Ooty & Nilgiri Hills">Ooty & Nilgiri Hills</option>
                <option value="Chikmagalur Coffee Valleys">Chikmagalur Coffee Valleys</option>
                <option value="Gokarna & Coastal Beaches">Gokarna & Coastal Beaches</option>
                <option value="Mysore Heritage Circuit">Mysore Heritage Circuit</option>
                <option value="Kempegowda Airport Express">Kempegowda Airport Express</option>
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Travel Date
              </label>
              <div className="relative">
                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                <input
                  type="date"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  className="w-full pl-8 pr-2 py-2 text-xs font-medium rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                />
              </div>
            </div>

            {/* Preferred Vehicle */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Preferred Vehicle
              </label>
              <div className="relative">
                <Car className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                <select
                  value={searchVehicleCategory}
                  onChange={(e) => setSearchVehicleCategory(e.target.value)}
                  className="w-full pl-8 pr-2 py-2 text-xs font-medium rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white text-slate-800"
                >
                  <option value="SUV (Innova Crysta)">SUV (Innova Crysta)</option>
                  <option value="Sedan (Dzire / Etios)">Sedan (Dzire / Etios)</option>
                  <option value="MPV (Ertiga / Carens)">MPV (Ertiga / Carens)</option>
                  <option value="Tempo Traveller (12+1)">Tempo Traveller (12+1)</option>
                  <option value="Luxury Coach (20+)">Luxury Coach (20+)</option>
                </select>
              </div>
            </div>

            {/* Submit Action */}
            <div>
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[#0B192C] hover:bg-[#1E293B] text-amber-400 font-bold text-xs rounded-lg shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Find & Book</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>

        {/* 4-Item Trust & Quality Strip */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-6 text-left max-w-3xl w-full">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-400 shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <p className="text-white text-xs sm:text-sm font-bold">Verified Drivers</p>
              <p className="text-slate-400 text-[11px]">Experienced on hill roads</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-400 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-white text-xs sm:text-sm font-bold">Sanitized Fleet</p>
              <p className="text-slate-400 text-[11px]">Fully air-conditioned cars</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-400 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-white text-xs sm:text-sm font-bold">Transparent Rates</p>
              <p className="text-slate-400 text-[11px]">No surprise surcharges</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-400 shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-white text-xs sm:text-sm font-bold">24/7 Support</p>
              <p className="text-slate-400 text-[11px]">Live tour desk on-call</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
