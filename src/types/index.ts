export interface Destination {
  id: string;
  name: string;
  location: string;
  category: 'Mountains' | 'Beaches' | 'Forests' | 'Waterfalls' | 'Heritage' | 'Pilgrimage' | 'Wildlife' | 'City Escapes';
  description: string;
  image: string;
  idealFor: string;
  bestSeason: string;
  highlights: string[];
  enabled: boolean;
  featured?: boolean;
}

export interface TourPackage {
  id: string;
  title: string;
  destination: string;
  duration: string;
  category: 'FAMILY' | 'COUPLES' | 'ADVENTURE' | 'GROUP' | 'PILGRIMAGE' | 'WEEKEND' | 'PREMIUM';
  image: string;
  highlights: string[];
  overview: string;
  itinerarySummary: { day: string; title: string; desc: string }[];
  inclusions: string[];
  priceNote: string;
  regularPrice?: string; // e.g. "₹14,999"
  offerPrice?: string;   // e.g. "₹12,499"
  perPersonPrice?: string;
  groupPrice?: string;
  childPrice?: string;
  seasonalPriceNote?: string;
  featured?: boolean;
  enabled: boolean;
}

export interface TravelExperience {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  highlights: string[];
  categoryKey: 'FAMILY' | 'COUPLES' | 'ADVENTURE' | 'GROUP';
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  image?: string;
  features: string[];
  enabled: boolean;
}

export interface Vehicle {
  id: string;
  name: string;               // e.g. "Toyota Innova Crysta"
  model?: string;             // e.g. "Crysta 2.4 VX", "Dzire VXi"
  registrationNumber?: string; // Optional vehicle registration / fleet plate number
  description?: string;       // Detailed description of the vehicle
  seatingCapacity: string;    // e.g. "6+1 Seater", "7 Seater", "4+1 Seater", "12+1 Seater"
  seatsCount: number;         // numeric count for filter / display
  category: 'Sedan' | 'SUV' | 'MPV' | 'Tempo Traveller' | 'Luxury Coach';
  image: string;              // Car photo URL (bundled project asset or uploaded)
  additionalPhotos?: string[];
  isAc?: boolean;             // AC or Non-AC boolean option
  acType: string;             // e.g. "Dual Zone AC", "Air Conditioned", "Climate Control", "Non-AC"
  luggageCapacity: string;    // e.g. "3-4 Large Bags"
  pricePerKm?: string;        // e.g. "₹18/km"
  dailyRate?: string;         // e.g. "₹3,800 / day"
  features: string[];         // e.g. ["Pushback Luxury Seats", "Uniformed Chauffeur", "GPS Tracking"]
  fuelType?: string;          // e.g. "Diesel", "Petrol", "Electric"
  idealFor?: string;          // e.g. "Family trips, hill station drives, airport transfers"
  enabled: boolean;
  featured?: boolean;
}

export interface Testimonial {
  id: string;
  customerName: string;
  destination: string;
  travelType: string;
  review: string;
  starRating: number;
  date: string;
  verified: boolean;
  enabled: boolean;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  location: string;
  category: 'Destinations' | 'Nature' | 'Road Trips' | 'Travellers' | 'Experiences';
  image: string;
  caption: string;
  aspect?: 'tall' | 'wide' | 'square';
  featured?: boolean;
}

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  destination: string;
  travelDate: string;
  travellers: string;
  travelType: string;
  message: string;
  createdAt: string;
  status: 'New' | 'Contacted' | 'Follow-up' | 'Converted' | 'Closed';
  adminNotes?: string;
  pickupLocation?: string;
  dropLocation?: string;
  vehiclePreference?: string;
  tripType?: string;
  returnDate?: string;
  estimatedFare?: string;
}

export interface SiteConfig {
  brandName: string;
  tagline: string;
  brandLine: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  businessHours: string;
  customLogoUrl: string;
  heroImage: string;
  defaultWhatsAppMessage: string;

  // Homepage Editable Content
  heroHeading: string;
  heroSubheading: string;
  heroDescription: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  brandStoryHeading: string;
  brandStoryText: string;
  whyRsHeading: string;
  finalCtaHeading: string;
  finalCtaText: string;
  finalCtaImage: string;

  // Social & SEO
  googleMapsUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
  websiteTitle: string;
  metaDescription: string;
  footerCopyright: string;
}

export interface CityEscape {
  id: string;
  title: string;
  tagline: string;
  category: 'Sunrise & Day Trips' | 'Hill Stations' | 'Heritage & Palaces' | 'Wildlife & Rivers';
  distanceFromBlr: string; // e.g. "60 km"
  driveTime: string; // e.g. "1.5 Hours"
  highwayRoute: string; // e.g. "NH 44 (Airport Expressway)"
  duration: string; // e.g. "Same-Day (Early Morning)"
  idealFor: string; // e.g. "Couples, Sunrise Chasers & Photographers"
  bestTimeToVisit: string; // e.g. "Year-round (Best Oct–Mar)"
  image: string;
  badge?: string; // e.g. "Top Weekend Pick", "Expressway 2.5 hrs"
  highlights: string[];
  overview: string;
  suggestedSchedule: {
    time: string;
    title: string;
    desc: string;
  }[];
  recommendedBreakfastStop?: string;
  bestTimeToStart: string;
  popularVehicles: string[];
}
