import React from 'react';
import { ContentProvider } from './context/ContentContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { BrandStory } from './components/BrandStory';
import { TravelExperiences } from './components/TravelExperiences';
import { Destinations } from './components/Destinations';
import { BengaluruSpecialSection } from './components/BengaluruSpecialSection';
import { TourPackages } from './components/TourPackages';
import { Vehicles } from './components/Vehicles';
import { WhyRS } from './components/WhyRS';
import { Services } from './components/Services';
import { CinematicStory } from './components/CinematicStory';
import { HowItWorks } from './components/HowItWorks';
import { Testimonials } from './components/Testimonials';
import { Gallery } from './components/Gallery';
import { WhatsAppConversion } from './components/WhatsAppConversion';
import { FinalCTA } from './components/FinalCTA';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { MobileStickyBar } from './components/MobileStickyBar';
import { PackageDetailModal } from './components/PackageDetailModal';
import { DestinationDetailModal } from './components/DestinationDetailModal';
import { CityEscapeModal } from './components/CityEscapeModal';
import { LightboxModal } from './components/LightboxModal';
import { BookingModal } from './components/BookingModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';

export default function App() {
  return (
    <ContentProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-amber-500/25 selection:text-slate-950 relative">
        {/* Sticky Header: Clean, pristine public website with no editing controls */}
        <Header />

        {/* Main Content Flow: Visual Journey progression */}
        <main>
          {/* 1. Cinematic Hero: Winding Road & Mountains at Sunrise */}
          <Hero />

          {/* 2. Brand Story: Every Journey Begins with a Story */}
          <BrandStory />

          {/* 3. Travel Experiences: Beyond the Destination */}
          <TravelExperiences />

          {/* 4. Destinations: Places Worth Remembering */}
          <Destinations />

          {/* 4b. City Escape: Airport Transfers & Bengaluru Sightseeing Tourist Places */}
          <BengaluruSpecialSection />

          {/* 5. Tour Packages: Choose Your Next Escape */}
          <TourPackages />

          {/* 6. Fleet & Vehicles: Travel in Comfort with Sanitized Cars & Verified Chauffeurs */}
          <Vehicles />

          {/* 7. Why RS: The Natural Standard & Commitments */}
          <WhyRS />

          {/* 7. Dedicated Services Showcase */}
          <Services />

          {/* 8. Full-Width Cinematic Story Break */}
          <CinematicStory />

          {/* 9. Travel Journey Timeline: From Idea to Adventure */}
          <HowItWorks />

          {/* 10. Traveller Testimonials: Real Journey Memories */}
          <Testimonials />

          {/* 11. Travel Journal Masonry Gallery */}
          <Gallery />

          {/* 12. WhatsApp Conversion Callout */}
          <WhatsAppConversion />

          {/* 13. Dramatic Golden-Hour Final Call to Action */}
          <FinalCTA />

          {/* 14. Contact & Interactive Travel Enquiry Form */}
          <ContactSection />
        </main>

        {/* Sophisticated Deep Forest-Green Footer */}
        <Footer />

        {/* Mobile Sticky Contact Bar (≤ 15% Viewport height) */}
        <MobileStickyBar />

        {/* Global Interactive Modals */}
        <PackageDetailModal />
        <DestinationDetailModal />
        <CityEscapeModal />
        <LightboxModal />
        <BookingModal />

        {/* Floating WhatsApp Action Button (Arranged vertically at bottom) */}
        <FloatingWhatsApp />

        {/* Secure Admin Login & Dashboard (Hidden from public; accessed via URL #admin, shortcut, or discreet trigger) */}
        <AdminLoginModal />
        <AdminDashboard />
      </div>
    </ContentProvider>
  );
}
