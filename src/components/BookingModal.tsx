import React, { useState, useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import {
  X,
  Calendar,
  Users,
  MapPin,
  Car,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  Clock,
  ShieldCheck,
  Search,
  Check,
  Sparkles,
  Info,
  Phone,
  Copy,
} from 'lucide-react';
import { Vehicle } from '../types';

export const BookingModal: React.FC = () => {
  const {
    isBookingModalOpen,
    setIsBookingModalOpen,
    bookingPrefill,
    destinations,
    vehicles,
    siteConfig,
    getWhatsAppUrl,
    submitPublicEnquiry,
    enquiries,
  } = useContent();

  const [activeTab, setActiveTab] = useState<'plan' | 'track'>('plan');

  // Form State
  const [tripType, setTripType] = useState<string>('Outstation Roundtrip');
  const [pickupLocation, setPickupLocation] = useState<string>('Bengaluru, Karnataka');
  const [destination, setDestination] = useState<string>('');
  const [travelDate, setTravelDate] = useState<string>('');
  const [returnDate, setReturnDate] = useState<string>('');
  const [travellers, setTravellers] = useState<string>('4');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Confirmation state
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  // Tracking State
  const [trackingQuery, setTrackingQuery] = useState<string>('');
  const [trackingResult, setTrackingResult] = useState<any | null>(null);
  const [trackingSearched, setTrackingSearched] = useState<boolean>(false);

  // Filter available active vehicles
  const activeVehicles = vehicles.filter((v) => v.enabled);

  // Apply prefill whenever modal opens with props
  useEffect(() => {
    if (bookingPrefill) {
      if (bookingPrefill.destination) setDestination(bookingPrefill.destination);
      if (bookingPrefill.tripType) setTripType(bookingPrefill.tripType);
      if (bookingPrefill.travelDate) setTravelDate(bookingPrefill.travelDate);
      if (bookingPrefill.travellers) setTravellers(bookingPrefill.travellers);
      if (bookingPrefill.pickupLocation) setPickupLocation(bookingPrefill.pickupLocation);
      if (bookingPrefill.vehiclePreference) {
        const found = activeVehicles.find(
          (v) => v.id === bookingPrefill.vehiclePreference || v.name === bookingPrefill.vehiclePreference
        );
        if (found) setSelectedVehicleId(found.id);
      }
    }
  }, [bookingPrefill, isBookingModalOpen]);

  // Set default vehicle if none selected
  useEffect(() => {
    if (!selectedVehicleId && activeVehicles.length > 0) {
      setSelectedVehicleId(activeVehicles[0].id);
    }
  }, [activeVehicles, selectedVehicleId]);

  if (!isBookingModalOpen) return null;

  const selectedVehicle = activeVehicles.find((v) => v.id === selectedVehicleId) || activeVehicles[0];

  const handleClose = () => {
    setIsBookingModalOpen(false);
    setConfirmedBookingId(null);
    setTrackingResult(null);
    setTrackingSearched(false);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert('Please provide your full name and contact phone number.');
      return;
    }
    if (!destination.trim()) {
      alert('Please choose or enter your travel destination.');
      return;
    }

    const bookingRefId = `RS-${Math.floor(100000 + Math.random() * 900000)}`;
    const vehName = selectedVehicle ? `${selectedVehicle.name} (${selectedVehicle.seatingCapacity})` : 'Vehicle to be recommended';

    // Submit into database
    submitPublicEnquiry({
      name,
      phone,
      email,
      destination,
      travelDate: travelDate || 'Flexible / To be confirmed',
      travellers,
      travelType: tripType,
      message: `[Reference: ${bookingRefId}]\nPickup: ${pickupLocation}\nReturn Date: ${returnDate || 'N/A'}\nVehicle Selected: ${vehName}\nEstimated Rate: ${selectedVehicle?.pricePerKm || selectedVehicle?.dailyRate || 'Standard tariff'}\nSpecial notes: ${notes || 'None'}`,
      pickupLocation,
      dropLocation: destination,
      vehiclePreference: vehName,
      tripType,
      returnDate,
      estimatedFare: selectedVehicle?.pricePerKm || selectedVehicle?.dailyRate || 'To be calculated',
    });

    setConfirmedBookingId(bookingRefId);
  };

  const generateWhatsAppMessage = (refId: string) => {
    const vehInfo = selectedVehicle ? `${selectedVehicle.name} (${selectedVehicle.seatingCapacity})` : 'Fleet Selection';
    return `Hi ${siteConfig.brandName},\n*Trip Booking Enquiry [Ref: ${refId}]*\n• Name: ${name}\n• Phone: ${phone}\n• Trip Type: ${tripType}\n• Pickup: ${pickupLocation}\n• Destination: ${destination}\n• Travel Date: ${travelDate || 'Flexible'}${returnDate ? `\n• Return Date: ${returnDate}` : ''}\n• Passengers: ${travellers}\n• Preferred Vehicle: ${vehInfo}\n• Tariff Est: ${selectedVehicle?.pricePerKm || selectedVehicle?.dailyRate || 'Standard rate'}\n${notes ? `• Notes: ${notes}\n` : ''}Please confirm availability and share the chauffeur dispatch details.`;
  };

  const handleCopySummary = (refId: string) => {
    const text = generateWhatsAppMessage(refId);
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
  };

  const handleTrackLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setTrackingSearched(true);
    const query = trackingQuery.trim().toLowerCase();
    if (!query) {
      setTrackingResult(null);
      return;
    }

    const match = enquiries.find(
      (enq) =>
        enq.id.toLowerCase().includes(query) ||
        enq.phone.replace(/[^0-9]/g, '').includes(query.replace(/[^0-9]/g, '')) ||
        (enq.message && enq.message.toLowerCase().includes(query))
    );
    setTrackingResult(match || null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#0A192F]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Modal Top Header */}
        <div className="px-6 py-5 bg-[#0B192C] text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400">
                Official Travel Reservation
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight mt-0.5">
              Plan & Book Your Ride
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab Switcher */}
            <div className="flex items-center p-1 bg-slate-800/80 rounded-lg border border-slate-700 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('plan')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  activeTab === 'plan' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                Book Ride
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('track')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  activeTab === 'track' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                Track Status
              </button>
            </div>

            <button
              onClick={handleClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              aria-label="Close booking modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">

          {/* ============================================================
              TAB 1: BOOKING FLOW
          ============================================================ */}
          {activeTab === 'plan' && !confirmedBookingId && (
            <form onSubmit={handleBookingSubmit} className="space-y-6">
              
              {/* Trip Type Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  1. Trip Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    'Outstation Roundtrip',
                    'One-Way Drop',
                    'Bengaluru City Escape',
                    'Airport Transfer',
                  ].map((type) => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => setTripType(type)}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold text-center transition-all border ${
                        tripType === type
                          ? 'bg-[#0B192C] text-white border-[#0B192C] shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Route & Dates Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Pickup */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Pickup Location / City *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      placeholder="e.g. Bengaluru, Bangalore Airport, Mysore"
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Destination Dropdown or custom */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Destination *
                  </label>
                  <div className="relative">
                    <select
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    >
                      <option value="">Select Destination...</option>
                      {destinations
                        .filter((d) => d.enabled !== false)
                        .map((d) => (
                          <option key={d.id} value={d.name}>
                            {d.name} ({d.location})
                          </option>
                        ))}
                      <option value="Bengaluru Local Sightseeing">Bengaluru Local Sightseeing</option>
                      <option value="Nandi Hills Sunrise Trip">Nandi Hills Sunrise Trip</option>
                      <option value="Mysore Palace Heritage Tour">Mysore Palace Heritage Tour</option>
                      <option value="Kempegowda Airport Direct Transfer">Kempegowda Airport Direct Transfer</option>
                      <option value="Custom Outstation Route">Other / Custom Outstation Route</option>
                    </select>
                  </div>
                </div>

                {/* Travel Date */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Travel Date *
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="date"
                      required
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Return Date / Passengers */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Return Date
                    </label>
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full px-2.5 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Passengers
                    </label>
                    <div className="relative">
                      <Users className="w-4 h-4 text-slate-400 absolute left-2.5 top-3" />
                      <select
                        value={travellers}
                        onChange={(e) => setTravellers(e.target.value)}
                        className="w-full pl-8 pr-2 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="1-2">1 - 2 Travellers</option>
                        <option value="3-4">3 - 4 Travellers</option>
                        <option value="5-7">5 - 7 Travellers</option>
                        <option value="8-12">8 - 12 Travellers</option>
                        <option value="13+">13+ Group</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicle Selection Carousel / Grid */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    2. Choose Your Tour Vehicle
                  </label>
                  <span className="text-[11px] text-slate-500">
                    {activeVehicles.length} vehicles available
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {activeVehicles.map((veh) => {
                    const isSelected = veh.id === selectedVehicleId;
                    return (
                      <div
                        key={veh.id}
                        onClick={() => setSelectedVehicleId(veh.id)}
                        className={`relative rounded-xl border p-3 cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-amber-50/50 border-amber-500 ring-2 ring-amber-500/30 shadow-md'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="relative aspect-[16/10] rounded-lg overflow-hidden mb-2.5 bg-slate-100">
                          <img
                            src={veh.image}
                            alt={veh.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/car_innova_crysta.jpg';
                            }}
                          />
                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 bg-amber-500 text-slate-950 p-1 rounded-full shadow-sm">
                              <Check className="w-3.5 h-3.5 font-bold" />
                            </div>
                          )}
                          <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-black/60 text-white backdrop-blur-xs">
                            {veh.seatingCapacity}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 truncate" title={veh.name}>
                          {veh.name}
                        </h4>
                        <div className="flex items-center justify-between mt-1 text-[11px]">
                          <span className="text-slate-500">{veh.isAc !== false ? 'AC' : 'Non-AC'}</span>
                          <span className="font-bold text-[#0B192C]">
                            {veh.pricePerKm || veh.dailyRate || 'Standard Rate'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Passenger Contact Details */}
              <div className="pt-2 border-t border-slate-200">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                  3. Passenger Contact Information
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-xs text-slate-600 mb-1">Special Requirements (Optional)</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Airport flight number, extra luggage space, elderly passenger assistance, child seat..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Price Transparency & Trust Notice */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-600 leading-relaxed">
                  <span className="font-bold text-slate-900 block">Transparent Travel Guarantee:</span>
                  No payment is processed now. We verify vehicle & verified driver availability, then provide an upfront fare summary without surprise surcharges.
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 bg-[#0B192C] hover:bg-[#1E293B] text-white font-bold text-sm rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer"
                >
                  <span>Submit Trip Booking Request</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </button>
              </div>

            </form>
          )}

          {/* ============================================================
              CONFIRMATION SUCCESS SCREEN
          ============================================================ */}
          {activeTab === 'plan' && confirmedBookingId && (
            <div className="text-center py-6 px-2 space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
                  Enquiry Submitted Successfully
                </span>
                <h3 className="text-2xl font-serif font-bold text-slate-900 mt-1">
                  Trip Reference: {confirmedBookingId}
                </h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto mt-2 leading-relaxed">
                  Thank you, <strong>{name}</strong>! Your booking request for{' '}
                  <strong>{destination}</strong> with <strong>{selectedVehicle?.name}</strong> has been logged into our fleet system.
                </p>
              </div>

              {/* Booking Snapshot Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Pickup:</span>
                  <span className="font-semibold text-slate-800">{pickupLocation}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Destination:</span>
                  <span className="font-semibold text-slate-800">{destination}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Travel Date:</span>
                  <span className="font-semibold text-slate-800">{travelDate || 'Flexible'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Vehicle:</span>
                  <span className="font-semibold text-slate-800">{selectedVehicle?.name}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                    Under Review (Driver Allocation)
                  </span>
                </div>
              </div>

              {/* WhatsApp instant dispatch action */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <a
                  href={getWhatsAppUrl(generateWhatsAppMessage(confirmedBookingId))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 fill-slate-950/20" />
                  <span>Confirm Instantly via WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={() => handleCopySummary(confirmedBookingId)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-sm rounded-xl border border-slate-200 transition-colors cursor-pointer"
                >
                  <Copy className="w-4 h-4" />
                  <span>{copySuccess ? 'Copied to Clipboard!' : 'Copy Summary'}</span>
                </button>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
                >
                  Return to Website
                </button>
              </div>
            </div>
          )}

          {/* ============================================================
              TAB 2: TRACK STATUS
          ============================================================ */}
          {activeTab === 'track' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-serif font-bold text-slate-900">
                  Track Your Booking Enquiry
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Enter your Booking Reference ID (e.g. RS-123456) or your phone number to check the current review status.
                </p>
              </div>

              <form onSubmit={handleTrackLookup} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    value={trackingQuery}
                    onChange={(e) => setTrackingQuery(e.target.value)}
                    placeholder="Enter Reference ID or Phone Number..."
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#0B192C] hover:bg-[#1E293B] text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Search
                </button>
              </form>

              {trackingSearched && (
                <div>
                  {trackingResult ? (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs text-slate-500">Booking Enquiry:</span>
                          <h4 className="text-base font-serif font-bold text-slate-900">
                            {trackingResult.destination || 'Custom Tour'}
                          </h4>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            trackingResult.status === 'Converted'
                              ? 'bg-emerald-100 text-emerald-800'
                              : trackingResult.status === 'Contacted'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          Status: {trackingResult.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200">
                        <div>
                          <span className="text-slate-500 block">Traveller Name:</span>
                          <span className="font-semibold text-slate-800">{trackingResult.name}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Travel Date:</span>
                          <span className="font-semibold text-slate-800">{trackingResult.travelDate}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Vehicle Preference:</span>
                          <span className="font-semibold text-slate-800">
                            {trackingResult.vehiclePreference || 'Assigned on call'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Registered Phone:</span>
                          <span className="font-semibold text-slate-800">{trackingResult.phone}</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                        <span className="text-slate-500">Need immediate confirmation?</span>
                        <a
                          href={getWhatsAppUrl(`Hi RS Tours, checking on my booking enquiry: ${trackingQuery}`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-emerald-700 font-bold hover:underline"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Chat with Tour Desk</span>
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200">
                      <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-slate-700">No matching booking record found</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Please check your reference ID or phone number, or contact us directly on WhatsApp.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
