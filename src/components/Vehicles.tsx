import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { Vehicle } from '../types';
import {
  Users,
  Wind,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  MessageCircle,
  ArrowRight,
  Car,
  CalendarCheck,
  Sparkles,
} from 'lucide-react';

export const Vehicles: React.FC = () => {
  const { vehicles, siteConfig, getWhatsAppUrl, openBookingModal } = useContent();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Filter all enabled vehicles added by admin
  const activeVehicles = vehicles.filter((v) => v.enabled !== false);

  // Dynamic category derivation so ANY vehicle added in the admin panel appears instantly
  const dynamicCategories = [
    'All',
    ...Array.from(new Set(activeVehicles.map((v) => v.category || 'Standard'))),
  ];

  const filteredVehicles =
    selectedCategory === 'All'
      ? activeVehicles
      : activeVehicles.filter((v) => v.category === selectedCategory);

  const getVehicleWhatsAppLink = (vehicle: Vehicle) => {
    const msg = `Hi ${siteConfig.brandName}, I would like to enquire about renting the ${vehicle.name} (${vehicle.seatingCapacity}). Please share availability and tariff for our upcoming trip.`;
    return getWhatsAppUrl(msg);
  };

  const handleBookVehicle = (vehicle: Vehicle) => {
    openBookingModal({
      vehiclePreference: `${vehicle.name} (${vehicle.seatingCapacity})`,
      message: `Interested in booking ${vehicle.name} (${vehicle.seatingCapacity}). Tariff: ${vehicle.pricePerKm || vehicle.dailyRate || 'Standard rate'}`,
    });
  };

  return (
    <section id="vehicles" className="py-24 sm:py-28 bg-white relative overflow-hidden scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold uppercase tracking-widest mb-3">
            <Car className="w-3.5 h-3.5 text-amber-500" />
            <span>Our Travel Fleet</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#0B192C] tracking-tight leading-tight mb-4">
            Comfortable & Sanitized <span className="text-amber-600 italic">Tour Fleet</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-light">
            Travel without fatigue across scenic mountain climbs, winding ghats, and open coastal highways.
            Every vehicle is thoroughly inspected, fully air-conditioned, and chauffeured by courteous, experienced drivers.
          </p>

          {/* Dynamic Category Filter Tabs */}
          {activeVehicles.length > 0 && dynamicCategories.length > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
              {dynamicCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#0B192C] text-white shadow-sm scale-105'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  {cat === 'All' ? 'All Fleet' : cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Empty State when no vehicles are available */}
        {activeVehicles.length === 0 ? (
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-12 text-center max-w-xl mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center mx-auto mb-4 text-slate-700">
              <Car className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-xl font-serif font-bold text-[#0B192C] mb-2">Fleet Under Scheduled Maintenance</h3>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              Our travel fleet vehicles are being updated. You can still reach us directly on WhatsApp or Call for custom vehicle bookings and tariffs.
            </p>
            <a
              href={getWhatsAppUrl(`Hi ${siteConfig.brandName}, I would like to check available vehicles and cab tariffs.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0B192C] hover:bg-slate-800 text-white font-semibold text-sm transition-all shadow-md"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>Contact for Vehicle Availability</span>
            </a>
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-10 text-center max-w-md mx-auto shadow-sm">
            <p className="text-sm font-semibold text-[#0B192C]">No vehicles found in this category</p>
            <p className="text-xs text-slate-500 mt-1 mb-4">Please choose another category or view all fleet vehicles.</p>
            <button
              onClick={() => setSelectedCategory('All')}
              className="px-4 py-2 bg-[#0B192C] text-white rounded-lg text-xs font-semibold cursor-pointer hover:bg-slate-800"
            >
              View All Vehicles
            </button>
          </div>
        ) : (
          /* Vehicles Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 lg:gap-10">
            {filteredVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Car Photo Container */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/car_innova_crysta.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                    <div className="flex items-center gap-1.5">
                      <span className="px-3 py-1 rounded-md text-xs font-bold bg-[#0B192C]/90 backdrop-blur-md text-white border border-white/20 shadow-sm">
                        {vehicle.category}
                      </span>
                      {vehicle.isAc !== undefined && (
                        <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold backdrop-blur-md border border-white/20 shadow-sm ${
                          vehicle.isAc ? 'bg-emerald-700/90 text-white' : 'bg-slate-700/80 text-white'
                        }`}>
                          {vehicle.isAc ? 'AC' : 'Non-AC'}
                        </span>
                      )}
                    </div>

                    {vehicle.featured && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-bold bg-amber-500 text-slate-950 shadow-sm">
                        <Sparkles className="w-3 h-3" />
                        Popular Choice
                      </span>
                    )}
                  </div>

                  {/* Bottom Seating Capacity Overlaid Badge */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white pointer-events-none">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-md border border-white/20 shadow-md">
                      <Users className="w-4 h-4 text-amber-400" />
                      <span className="text-sm font-bold tracking-wide">
                        {vehicle.seatingCapacity}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {vehicle.fuelType && (
                        <span className="text-xs font-medium text-white/90 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded">
                          {vehicle.fuelType}
                        </span>
                      )}
                      {vehicle.registrationNumber && (
                        <span className="text-[10px] font-mono tracking-wider font-semibold text-amber-300 bg-black/60 backdrop-blur-md px-2 py-1 rounded border border-white/10">
                          {vehicle.registrationNumber}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Car Name & Rate */}
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-4 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#0B192C]">
                            {vehicle.name}
                          </h3>
                          {vehicle.model && (
                            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                              {vehicle.model}
                            </span>
                          )}
                        </div>
                        {vehicle.idealFor && (
                          <p className="text-xs text-amber-700 font-medium mt-0.5">
                            {vehicle.idealFor}
                          </p>
                        )}
                      </div>
                      {(vehicle.pricePerKm || vehicle.dailyRate) && (
                        <div className="text-left sm:text-right">
                          <span className="text-lg font-bold text-[#0B192C]">
                            {vehicle.pricePerKm || vehicle.dailyRate}
                          </span>
                          {vehicle.pricePerKm && vehicle.dailyRate && (
                            <div className="text-xs text-slate-500">
                              or {vehicle.dailyRate}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Vehicle Description */}
                    {vehicle.description && (
                      <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                        {vehicle.description}
                      </p>
                    )}

                    {/* Specs Matrix */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-5 py-3 px-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-slate-500 shrink-0" />
                        <div>
                          <span className="block text-[10px] uppercase font-bold text-slate-400">Seats</span>
                          <span className="font-semibold text-slate-900">{vehicle.seatsCount ? `${vehicle.seatsCount} Seats` : vehicle.seatingCapacity}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Wind className="w-4 h-4 text-slate-500 shrink-0" />
                        <div>
                          <span className="block text-[10px] uppercase font-bold text-slate-400">AC Cooling</span>
                          <span className="font-semibold text-slate-900 truncate max-w-[110px]" title={vehicle.acType}>{vehicle.acType}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                        <Briefcase className="w-4 h-4 text-slate-500 shrink-0" />
                        <div>
                          <span className="block text-[10px] uppercase font-bold text-slate-400">Luggage</span>
                          <span className="font-semibold text-slate-900 truncate max-w-[120px]" title={vehicle.luggageCapacity}>{vehicle.luggageCapacity}</span>
                        </div>
                      </div>
                    </div>

                    {/* Features Chips */}
                    {vehicle.features && vehicle.features.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-xs uppercase tracking-wider font-bold text-slate-600 mb-2">
                          Included Amenities & Safety:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {vehicle.features.map((feat, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              {feat}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
                    <button
                      onClick={() => handleBookVehicle(vehicle)}
                      className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B192C] hover:bg-[#1E293B] text-white text-xs sm:text-sm font-bold transition-all shadow-md hover:shadow-lg cursor-pointer"
                    >
                      <CalendarCheck className="w-4 h-4 text-amber-400" />
                      <span>Book This Vehicle</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-70" />
                    </button>

                    <a
                      href={getVehicleWhatsAppLink(vehicle)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold border border-slate-200 transition-all cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 text-[#25D366]" />
                      <span>WhatsApp Tariff</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Fleet Guarantee Strip */}
        <div className="mt-14 bg-[#0B192C] rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h4 className="text-lg sm:text-xl font-serif font-bold text-white">
                Reliable Chauffeurs & Round-the-Clock On-Road Support
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 font-light mt-1">
                All vehicles feature commercial permits, speed governors, comprehensive insurance, and emergency mechanical backup.
              </p>
            </div>
          </div>

          <button
            onClick={() => openBookingModal()}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all shrink-0 cursor-pointer"
          >
            Custom Fleet Request
          </button>
        </div>

      </div>
    </section>
  );
};
