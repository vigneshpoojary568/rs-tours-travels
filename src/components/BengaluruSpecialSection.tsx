import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import {
  Plane,
  MapPin,
  Clock,
  Car,
  ShieldCheck,
  CheckCircle2,
  MessageCircle,
  Phone,
  Compass,
  ArrowRight,
  Sparkles,
  Camera,
  Calendar,
} from 'lucide-react';

interface TouristSpot {
  name: string;
  category: string;
  timing: string;
  entryFee: string;
  description: string;
  highlights: string[];
  image: string;
  suggestedDuration: string;
}

const BANGALORE_TOURIST_SPOTS: TouristSpot[] = [
  {
    name: 'Bangalore Palace',
    category: 'Royal Heritage',
    timing: '10:00 AM – 5:30 PM (All days)',
    entryFee: 'Nominal ticket at gate',
    description: 'Built by Chamaraja Wodeyar in 1887 in Tudor revival architecture, echoing Windsor Castle. Features grand wooden carvings, royal ballroom, manicured gardens, and historical paintings.',
    highlights: ['Tudor revival battlements', 'Maharaja durbar hall & ballroom', 'Exquisite courtyard gardens', 'Royal photo galleries'],
    image: '/images/bangalore_palace_view.jpg',
    suggestedDuration: '2 – 3 Hours',
  },
  {
    name: 'Lalbagh Botanical Gardens & Glass House',
    category: 'Gardens & Flora',
    timing: '6:00 AM – 7:00 PM (Daily)',
    entryFee: 'Nominal entry fee',
    description: 'Commissioned by Hyder Ali in 1760 and completed by Tipu Sultan. Spans 240 acres with over 1,800 species of rare tropical trees, a 3,000-million-year-old Lalbagh Rock, and the iconic Victorian Glass House.',
    highlights: ['Victorian Crystal Palace replica', 'Centuries-old rare botanical collection', 'Lalbagh Rock & Kempegowda Tower', 'Serene lotus lake walkway'],
    image: '/images/lalbagh_glass_house.jpg',
    suggestedDuration: '2 Hours (Best Morning / Late Afternoon)',
  },
  {
    name: 'Vidhana Soudha & High Court Attara Kacheri',
    category: 'Architectural Monument',
    timing: 'Exterior view all days (Illuminated Sun & holidays)',
    entryFee: 'Free (Exterior photography & boulevard)',
    description: 'The monumental seat of Karnataka state legislature, sculpted from Bangalore granite in majestic Neo-Dravidian architecture. Facing it across the green boulevard stands the vibrant red Attara Kacheri (Karnataka High Court).',
    highlights: ['Neo-Dravidian ornamental granite dome', 'Evening golden illuminations', 'Attara Kacheri red brick heritage court', 'Statues of Nehru & Dr. Ambedkar'],
    image: '/images/vidhana_soudha_monument.jpg',
    suggestedDuration: '1 Hour (Sunset & Twilight)',
  },
  {
    name: 'Cubbon Park & MG Road Heritage Boulevard',
    category: 'Green Heart & City Vibe',
    timing: '6:00 AM – 8:00 PM (Walking & leisure)',
    entryFee: 'Free entry',
    description: '300 acres of lush lung space in the city center with ancient bamboo groves, bandstand, state central library, and quick connectivity to colonial MG Road and Brigade Road shopping.',
    highlights: ['Centuries-old mahogany & bamboo avenues', 'State Central Library red brick facade', 'Sir M. Visvesvaraya Museum nearby', 'Proximity to MG Road & Church Street cafes'],
    image: '/images/hero_cinematic_landscape.jpg',
    suggestedDuration: '2 Hours',
  },
  {
    name: 'Bull Temple (Dodda Basavana Gudi) & Basavanagudi',
    category: 'Ancient Temples & Culture',
    timing: '6:00 AM – 8:00 PM',
    entryFee: 'Free darshan',
    description: 'Dating back to 1537 founded by Kempe Gowda I, this monolith Nandi bull carved out of a single granite boulder is one of the largest in the world. Located in traditional Basavanagudi, home to legendary filter coffee hubs.',
    highlights: ['Monolithic 4.5m tall Nandi granite idol', 'Adjacent Dodda Ganapathi temple', 'Brahmin’s Coffee Bar & Gandhi Bazaar walk', 'Authentic South Bangalore culture'],
    image: '/images/cinematic_winding_road.jpg',
    suggestedDuration: '1.5 Hours',
  },
  {
    name: 'Bannerghatta National Park & Zoo Safari',
    category: 'Wildlife & Nature',
    timing: '9:30 AM – 5:00 PM (Closed on Tuesdays)',
    entryFee: 'Safari package available at ticket counter',
    description: 'Located in South Bengaluru, offering protected AC bus and jeep safaris to view royal Bengal tigers, lions, bears, and herbivores, alongside India’s first enclosed butterfly conservatory.',
    highlights: ['Close-up Tiger & Lion safari', 'Grand herbivore jungle enclosure', 'Butterfly park with circular conservatory', 'Rescue center & zoo museum'],
    image: '/images/adventure_mountain_trek.jpg',
    suggestedDuration: 'Half Day (4 – 5 Hours)',
  },
];

const AIRPORT_SERVICES = [
  {
    title: 'Kempegowda BLR Airport Drop',
    desc: 'Guaranteed on-time doorstep pickup from anywhere in Bengaluru. Route-optimized for airport toll expressway to ensure stress-free flight check-in.',
    features: ['Fixed upfront transparent fare', 'Luggage assistance included', 'Sedan, Innova Crysta or Ertiga'],
    popular: true,
  },
  {
    title: 'Kempegowda BLR Airport Pickup',
    desc: 'Chauffeur with name sign greets you at Terminal 1 or award-winning Terminal 2 (Garden Terminal). We track your flight live so delays don’t cost you.',
    features: ['Free flight delay buffer waiting', 'Clean sanitized AC car at arrival curb', 'Direct drop to home / hotel'],
    popular: false,
  },
  {
    title: 'Airport Directly to Outstation Tours',
    desc: 'Landing at BLR Airport and heading straight to Mysore, Coorg, Ooty, Chikmagalur, or Wayanad? Skip Bengaluru traffic with direct bypass expressway routes.',
    features: ['Zero city-traffic bypass routing', 'Driver with hill & ghat experience', 'Luggage racks & child-friendly cars'],
    popular: true,
  },
  {
    title: 'Full Day Bangalore Airport + City Sightseeing',
    desc: 'Have a layover or business day? We pick you up from BLR Airport, take you on a curated city tour, and drop you back at the terminal on time.',
    features: ['Luggage stays safe inside vehicle', 'Customized temple, palace & cafe stops', 'Timed return to departure gates'],
    popular: false,
  },
];

export const BengaluruSpecialSection: React.FC = () => {
  const { getWhatsAppUrl, siteConfig, openBookingModal } = useContent();
  const [activeTab, setActiveTab] = useState<'airport' | 'tourist-places'>('airport');
  const [selectedSpot, setSelectedSpot] = useState<TouristSpot | null>(null);

  const handleAirportBooking = (type: string) => {
    openBookingModal({
      tripType: 'Airport Transfer',
      pickupLocation: type.includes('Drop') ? 'Anywhere in Bengaluru' : 'Kempegowda BLR Airport',
      destination: type.includes('Pickup') ? 'Bengaluru City Hotel / Home' : 'BLR Airport Terminal 1 & 2',
      message: `Enquiring for "${type}".`,
    });
  };

  const handleCityTourBooking = (spotName?: string) => {
    openBookingModal({
      tripType: 'Bengaluru City Escape',
      destination: spotName ? `Bengaluru City (${spotName})` : 'Bengaluru City Sightseeing Full Day',
      message: spotName
        ? `Interested in visiting ${spotName} and top Bengaluru attractions.`
        : 'Full day Bengaluru sightseeing circuit (Bangalore Palace, Lalbagh, Vidhana Soudha).',
    });
  };

  return (
    <section id="bengaluru-airport-sightseeing" className="py-24 sm:py-28 bg-slate-50 text-slate-900 relative border-b border-slate-200 scroll-mt-20">
      <div id="city-escape" className="absolute -top-20" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 border-b border-slate-200 pb-8 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-[2px] bg-amber-500" />
              <span className="text-xs uppercase tracking-[0.22em] text-slate-600 font-bold">
                City Escape & Airport Hub
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#0B192C]">
              Airport Transfers & Bengaluru Sightseeing
            </h2>
          </div>
          <p className="text-slate-600 text-sm sm:text-base font-light max-w-md leading-relaxed">
            Whether arriving at award-winning BLR Kempegowda International Airport or exploring the Garden City’s royal palaces and lush botanical gardens, travel with dedicated chauffeurs and spotless AC vehicles.
          </p>
        </div>

        {/* Tab Toggle Switchers */}
        <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
          <button
            onClick={() => setActiveTab('airport')}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'airport'
                ? 'bg-[#0B192C] text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Plane className="w-4 h-4 text-amber-400" />
            <span>BLR Kempegowda Airport Taxis & Transfers</span>
          </button>

          <button
            onClick={() => setActiveTab('tourist-places')}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'tourist-places'
                ? 'bg-[#0B192C] text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Camera className="w-4 h-4 text-amber-400" />
            <span>Bengaluru City Sightseeing & Tourist Places</span>
          </button>
        </div>

        {/* TAB 1: AIRPORT TRANSFERS CONTENT */}
        {activeTab === 'airport' && (
          <div className="space-y-12">
            
            {/* Airport Hero Banner Card */}
            <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm grid grid-cols-1 lg:grid-cols-12">
              <div className="relative lg:col-span-6 min-h-[300px] lg:min-h-full">
                <img
                  src="/images/blr_airport_transfer.jpg"
                  alt="Bengaluru Kempegowda Airport Terminal 2"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute top-4 left-4 bg-emerald-800 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                  24/7 Available
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-xs font-medium text-amber-300 uppercase tracking-widest mb-1">
                    Kempegowda International Airport (BLR)
                  </p>
                  <h3 className="font-serif text-2xl font-bold">
                    Terminal 1 & Terminal 2 Garden Terminal Pickups
                  </h3>
                </div>
              </div>

              <div className="p-8 lg:p-10 lg:col-span-6 flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200/60 rounded-full text-xs font-semibold text-amber-900 mb-4">
                    <Sparkles className="w-3.5 h-3.5 text-[#C9962E]" />
                    <span>Zero Toll Surprises • Flight Delay Buffer</span>
                  </div>
                  
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#073B35] mb-4">
                    Punctual, Stress-Free Airport Cabs Across Bengaluru
                  </h3>
                  
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    Avoid surge pricing, endless taxi queues, and sudden cancellations. Our dedicated airport fleet operates around the clock with flight tracking, clean AC Sedans and Innova Crystas, and drivers who know every shortcut on the Airport Expressway and Hebbal flyovers.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                    <div className="flex items-center gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Live flight arrival tracking</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>T1 & T2 Arrival Curb Meet & Greet</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Sedans, Innova Crysta & 12-Seater</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Direct outstation transfer connectivity</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => handleAirportBooking('BLR Airport Transfer')}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#0D7A68] hover:bg-[#073B35] text-white rounded-xl font-semibold text-sm transition-all shadow-md cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Book Airport Cab on WhatsApp</span>
                  </button>
                  <a
                    href={`tel:${siteConfig.phone.replace(/[^0-9+]/g, '')}`}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-white hover:bg-slate-50 text-[#073B35] border border-slate-200 rounded-xl font-semibold text-sm transition-all"
                  >
                    <Phone className="w-4 h-4 text-[#C9962E]" />
                    <span>Call Airport Desk</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Airport Service Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {AIRPORT_SERVICES.map((srv, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    {srv.popular && (
                      <span className="inline-block bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-3">
                        Most Booked
                      </span>
                    )}
                    <h4 className="font-serif text-lg font-bold text-[#073B35] mb-2">
                      {srv.title}
                    </h4>
                    <p className="text-slate-600 text-xs leading-relaxed mb-4">
                      {srv.desc}
                    </p>
                    <div className="space-y-1.5 mb-6">
                      {srv.features.map((feat, i) => (
                        <div key={i} className="flex items-center gap-2 text-[11px] text-slate-600">
                          <CheckCircle2 className="w-3 h-3 text-[#0D7A68] shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleAirportBooking(srv.title)}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-50 hover:bg-[#073B35] text-[#073B35] hover:text-white rounded-lg text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
                  >
                    <span>Check Tariff & Book</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Popular Outstation Direct Routes from BLR Airport */}
            <div className="bg-[#073B35] text-white rounded-2xl p-8 sm:p-10 shadow-lg">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-white/10 pb-6">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#C9962E] font-semibold">
                    Direct Airport Highway Connections
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold mt-1">
                    Direct Outstation Cabs from BLR Kempegowda Airport
                  </h3>
                </div>
                <p className="text-slate-300 text-xs sm:text-sm max-w-md">
                  Land at Bangalore and head straight to Karnataka's top destinations without getting stuck in city center traffic.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { dest: 'BLR Airport ➔ Nandi Hills', dist: '35 km • 45 mins', tag: 'Direct Sunrise Route' },
                  { dest: 'BLR Airport ➔ Mysore', dist: '180 km • 3.0 hrs', tag: 'NICE / Expressway' },
                  { dest: 'BLR Airport ➔ Coorg', dist: '290 km • 5.5 hrs', tag: 'Hill Coffee Retreat' },
                  { dest: 'BLR Airport ➔ Chikmagalur', dist: '260 km • 4.5 hrs', tag: 'Hassan 4-Lane Highway' },
                ].map((route, i) => (
                  <div
                    key={i}
                    onClick={() => handleAirportBooking(route.dest)}
                    className="bg-white/10 hover:bg-white/15 backdrop-blur-sm p-4 rounded-xl border border-white/15 transition-all cursor-pointer group"
                  >
                    <span className="text-[10px] text-amber-300 uppercase tracking-wider font-semibold block mb-1">
                      {route.tag}
                    </span>
                    <h4 className="font-medium text-sm text-white group-hover:text-amber-200 transition-colors mb-1">
                      {route.dest}
                    </h4>
                    <p className="text-xs text-slate-300 mb-3">{route.dist}</p>
                    <div className="flex items-center gap-1 text-[11px] text-amber-300 font-semibold">
                      <span>Reserve Taxi</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BENGALURU TOURIST PLACES CONTENT */}
        {activeTab === 'tourist-places' && (
          <div className="space-y-12">
            
            {/* Overview Intro Banner */}
            <div className="bg-white rounded-2xl p-8 sm:p-10 border border-slate-200/90 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="max-w-2xl">
                <span className="text-xs uppercase tracking-widest text-[#0D7A68] font-bold">
                  City Sightseeing Package (8 Hours / 80 Km or Full Day)
                </span>
                <h3 className="font-serif text-2xl sm:text-4xl font-bold text-[#073B35] mt-2 mb-3">
                  Discover Bengaluru’s Heritage, Gardens & Iconic Architecture
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Bengaluru blends royal Wodeyar history, vibrant botanical canopies, majestic granite governance monuments, and world-famous South Indian breakfast heritage. Book our private AC sightseeing cab for your family or guests with custom stops and experienced city chauffeurs.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
                <button
                  onClick={() => handleCityTourBooking()}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#073B35] hover:bg-[#0B5D5A] text-white rounded-xl font-semibold text-sm transition-all shadow-md cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-[#C9962E]" />
                  <span>Book City Sightseeing Cab</span>
                </button>
              </div>
            </div>

            {/* Bengaluru Tourist Spots Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {BANGALORE_TOURIST_SPOTS.map((spot, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Spot Image */}
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={spot.image}
                        alt={spot.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <span className="absolute top-3 left-3 bg-[#073B35]/85 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded">
                        {spot.category}
                      </span>
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <h4 className="font-serif text-xl font-bold">
                          {spot.name}
                        </h4>
                      </div>
                    </div>

                    {/* Spot Info */}
                    <div className="p-6">
                      <p className="text-slate-600 text-xs leading-relaxed mb-4">
                        {spot.description}
                      </p>

                      <div className="space-y-1.5 mb-5 bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <div className="flex items-center justify-between text-[11px] text-slate-700">
                          <span className="font-semibold text-slate-500">Timings:</span>
                          <span className="font-medium">{spot.timing}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-700">
                          <span className="font-semibold text-slate-500">Time Needed:</span>
                          <span className="font-medium text-[#0D7A68]">{spot.suggestedDuration}</span>
                        </div>
                      </div>

                      {/* Highlights */}
                      <div className="space-y-1.5 mb-6">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                          Must-See Highlights
                        </span>
                        {spot.highlights.map((h, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#0D7A68] shrink-0" />
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="p-6 pt-0 border-t border-slate-100">
                    <button
                      onClick={() => handleCityTourBooking(spot.name)}
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-50 hover:bg-[#073B35] text-[#073B35] hover:text-white rounded-lg text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Plan Tour with {spot.name}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Suggested Bengaluru 1-Day Itinerary Box */}
            <div className="bg-white rounded-2xl p-8 sm:p-10 border border-slate-200/90 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-[2px] bg-[#C9962E]" />
                <span className="text-xs uppercase tracking-widest text-[#0D7A68] font-bold">
                  Recommended Schedule
                </span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#073B35] mb-6">
                Sample 1-Day Bengaluru Sightseeing Plan (8:30 AM – 6:30 PM)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  {
                    time: '08:30 AM',
                    title: 'Doorstep Pickup & Breakfast',
                    desc: 'AC cab arrives at your location. Stop for crispy Masala Dosa and authentic filter coffee at CTR Malleshwaram or Vidyarthi Bhavan.',
                  },
                  {
                    time: '10:00 AM',
                    title: 'Bangalore Palace & Grounds',
                    desc: 'Explore Tudor royal architecture, ballroom carvings, and grand grounds with comfortable parking coordination.',
                  },
                  {
                    time: '01:00 PM',
                    title: 'Lalbagh & South Indian Lunch',
                    desc: 'Stroll through Lalbagh Glass House and ancient rock hills. Relish traditional thali lunch nearby in VV Puram / Basavanagudi.',
                  },
                  {
                    time: '04:30 PM',
                    title: 'Vidhana Soudha & Cubbon Park',
                    desc: 'Drive along the illuminated Vidhana Soudha grand boulevard, Cubbon Park green avenues, and safe return back home.',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="relative pl-6 border-l-2 border-[#C9962E]/40">
                    <span className="inline-block bg-[#073B35] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-2">
                      {item.time}
                    </span>
                    <h4 className="font-serif font-bold text-base text-[#073B35] mb-1">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-slate-500">
                  * All itineraries are completely flexible. Add or swap spots (Bannerghatta Zoo, ISKCON Temple, Commercial Street) as per your choice.
                </p>
                <button
                  onClick={() => handleCityTourBooking('Custom 1-Day Itinerary')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0D7A68] hover:bg-[#073B35] text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Customize This Schedule on WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
