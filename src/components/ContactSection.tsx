import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { Logo } from './Logo';
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  ShieldCheck,
  CalendarCheck,
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { siteConfig, getWhatsAppUrl, submitPublicEnquiry, openBookingModal } = useContent();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    destination: '',
    travelDate: '',
    travellers: '2 - 4',
    travelType: 'Family Outstation Trip',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [submissionSummary, setSubmissionSummary] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('Please fill in at least your Name and Phone Number.');
      return;
    }

    const bookingRefId = `RS-${Math.floor(100000 + Math.random() * 900000)}`;

    submitPublicEnquiry({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      destination: formData.destination || 'Open to recommendations',
      travelDate: formData.travelDate || 'Flexible',
      travellers: formData.travellers,
      travelType: formData.travelType,
      message: `[Reference: ${bookingRefId}]\nDetails: ${formData.message || 'Please share packages & vehicle quotes'}`,
      tripType: formData.travelType,
    });

    const summary = `Hi ${siteConfig.brandName},\n*Travel Enquiry [Ref: ${bookingRefId}]*\n• Name: ${formData.name}\n• Phone: ${formData.phone}\n• Email: ${formData.email || 'N/A'}\n• Destination: ${formData.destination || 'Custom recommendations'}\n• Date: ${formData.travelDate || 'Flexible'}\n• Travellers: ${formData.travellers}\n• Type: ${formData.travelType}\n${formData.message ? `• Notes: ${formData.message}\n` : ''}Please share available vehicles and quote.`;

    setSubmissionSummary(summary);
    setSubmitted(true);
  };

  const handlePushToWhatsApp = () => {
    window.open(getWhatsAppUrl(submissionSummary), '_blank');
  };

  return (
    <section id="contact" className="py-24 sm:py-28 bg-white text-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-8 h-[2px] bg-amber-500" />
            <span className="text-xs uppercase tracking-[0.25em] text-slate-600 font-bold">
              Direct Coordination
            </span>
            <span className="w-8 h-[2px] bg-amber-500" />
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#0B192C] mb-4">
            Contact & Travel Enquiry
          </h2>

          <p className="text-slate-600 text-base sm:text-lg font-light leading-relaxed">
            Fill in your trip details below or message us directly on WhatsApp. Our travel coordination desk will respond promptly with tailored itineraries and upfront cab tariffs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT COLUMN: Business Details & Contact Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0B192C] text-white rounded-2xl p-8 sm:p-10 shadow-xl border border-slate-800 relative overflow-hidden">
              <div className="relative z-10">
                <div className="mb-5">
                  <Logo
                    variant="light"
                    size="md"
                    customLogoUrl={siteConfig.customLogoUrl}
                    badgeStyle={true}
                    showTagline={false}
                  />
                </div>

                <span className="text-xs uppercase tracking-widest text-amber-400 font-bold block mb-1">
                  Established Travel Desk
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold mb-6 text-white">
                  {siteConfig.brandName}
                </h3>

                <div className="space-y-6">
                  {/* WhatsApp */}
                  <a
                    href={getWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 group cursor-pointer"
                  >
                    <div className="w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center text-white shrink-0 group-hover:bg-[#25D366] group-hover:text-slate-950 transition-colors border border-slate-700">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 uppercase tracking-wider block">
                        Official WhatsApp
                      </span>
                      <span className="text-base sm:text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                        {siteConfig.whatsapp}
                      </span>
                      <span className="text-[11px] text-emerald-400 block">
                        Direct messaging • Instant quotes
                      </span>
                    </div>
                  </a>

                  {/* Phone */}
                  <a
                    href={`tel:${siteConfig.phone.replace(/[^0-9+]/g, '')}`}
                    className="flex items-start gap-4 group cursor-pointer"
                  >
                    <div className="w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center text-amber-400 shrink-0 group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors border border-slate-700">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 uppercase tracking-wider block">
                        Direct Call Line
                      </span>
                      <span className="text-base sm:text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                        {siteConfig.phone}
                      </span>
                      <span className="text-[11px] text-slate-400 block">
                        Available 7 days a week
                      </span>
                    </div>
                  </a>

                  {/* Email */}
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="flex items-start gap-4 group cursor-pointer"
                  >
                    <div className="w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 shrink-0 group-hover:bg-white group-hover:text-slate-900 transition-colors border border-slate-700">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 uppercase tracking-wider block">
                        Email Desk
                      </span>
                      <span className="text-sm sm:text-base font-medium text-white group-hover:text-amber-400 transition-colors break-all">
                        {siteConfig.email}
                      </span>
                    </div>
                  </a>

                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 shrink-0 border border-slate-700">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 uppercase tracking-wider block">
                        Headquarters & Operations
                      </span>
                      <span className="text-xs sm:text-sm text-slate-300 leading-relaxed block">
                        {siteConfig.address}
                      </span>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 shrink-0 border border-slate-700">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 uppercase tracking-wider block">
                        Service Hours
                      </span>
                      <span className="text-xs sm:text-sm text-slate-300 block">
                        {siteConfig.businessHours}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-800">
                  <button
                    onClick={() => openBookingModal()}
                    className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CalendarCheck className="w-4 h-4" />
                    <span>Open Interactive Trip Planner</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Form */}
          <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-2xl p-8 sm:p-10 shadow-sm">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-[#0B192C]">
                    Send Us Your Itinerary Request
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    Tell us where you want to travel. We’ll calculate vehicle options and pricing with zero obligation.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Anand Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Phone / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 96204 52241"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Destination / Place of Interest
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Coorg, Wayanad, Ooty, Gokarna..."
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Approximate Date
                    </label>
                    <input
                      type="date"
                      value={formData.travelDate}
                      onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Travellers Count
                    </label>
                    <select
                      value={formData.travellers}
                      onChange={(e) => setFormData({ ...formData, travellers: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                    >
                      <option value="1-2">1 - 2 (Couple / Solo)</option>
                      <option value="2-4">2 - 4 (Small Family)</option>
                      <option value="5-7">5 - 7 (Innova / MPV)</option>
                      <option value="8-12">8 - 12 (Tempo Traveller)</option>
                      <option value="13+">13+ (Large Group / Bus)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Tour Type
                    </label>
                    <select
                      value={formData.travelType}
                      onChange={(e) => setFormData({ ...formData, travelType: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                    >
                      <option value="Family Outstation Trip">Family Outstation</option>
                      <option value="Couple Getaway">Couple Getaway</option>
                      <option value="Friends Adventure">Friends Adventure</option>
                      <option value="Pilgrimage & Temples">Pilgrimage</option>
                      <option value="Airport Transfer">Airport Transfer</option>
                      <option value="Bengaluru Sightseeing">Bengaluru Sightseeing</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Special Travel Preferences or Questions
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Share any special preferences (e.g. child seat, pickup from airport, specific hotels, hill driving pace)..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-xl bg-[#0B192C] hover:bg-[#1E293B] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-amber-400" />
                    <span>Submit Travel Enquiry</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-10 space-y-5 animate-in fade-in duration-300">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <h3 className="text-2xl font-serif font-bold text-[#0B192C]">
                  Enquiry Received Successfully!
                </h3>

                <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{formData.name}</strong>. Our tour team has received your enquiry. We will contact you shortly with customized package itineraries and vehicle pricing.
                </p>

                <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handlePushToWhatsApp}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send Directly via WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="w-full sm:w-auto px-5 py-3 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  >
                    Submit Another Query
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
