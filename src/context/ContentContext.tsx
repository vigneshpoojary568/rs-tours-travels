import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Destination,
  TourPackage,
  TravelExperience,
  ServiceItem,
  Vehicle,
  Testimonial,
  GalleryPhoto,
  SiteConfig,
  Enquiry,
  CityEscape,
} from '../types';
import {
  INITIAL_CONFIG,
  DEFAULT_DESTINATIONS,
  DEFAULT_PACKAGES,
  DEFAULT_EXPERIENCES,
  DEFAULT_SERVICES,
  DEFAULT_VEHICLES,
  DEFAULT_TESTIMONIALS,
  DEFAULT_GALLERY,
  DEFAULT_ENQUIRIES,
  DEFAULT_CITY_ESCAPES,
} from '../data/defaultContent';
import {
  getCurrentSession,
  verifyLogin,
  logoutAdmin,
  changeAdminPassword,
} from '../services/authService';
import {
  createServerSession,
  clearServerSession,
  getCachedVehicles,
  cacheVehicles,
  fetchVehicles,
  createVehicleOnServer,
  updateVehicleOnServer,
  deleteVehicleOnServer,
} from '../services/vehicleApi';

interface ContentContextType {
  siteConfig: SiteConfig;
  destinations: Destination[];
  packages: TourPackage[];
  experiences: TravelExperience[];
  services: ServiceItem[];
  vehicles: Vehicle[];
  testimonials: Testimonial[];
  gallery: GalleryPhoto[];
  enquiries: Enquiry[];
  cityEscapes: CityEscape[];

  // Modals state
  activePackage: TourPackage | null;
  setActivePackage: (pkg: TourPackage | null) => void;
  activeDestination: Destination | null;
  setActiveDestination: (dest: Destination | null) => void;
  activeVehicle: Vehicle | null;
  setActiveVehicle: (veh: Vehicle | null) => void;
  activeCityEscape: CityEscape | null;
  setActiveCityEscape: (escape: CityEscape | null) => void;
  lightboxPhoto: GalleryPhoto | null;
  setLightboxPhoto: (photo: GalleryPhoto | null) => void;

  // Global Interactive Booking Planner
  isBookingModalOpen: boolean;
  setIsBookingModalOpen: (open: boolean) => void;
  bookingPrefill: Partial<Enquiry> | null;
  openBookingModal: (prefill?: Partial<Enquiry>) => void;

  // Admin state & actions
  isAdminLoggedIn: boolean;
  showAdminLoginModal: boolean;
  setShowAdminLoginModal: (open: boolean) => void;
  isAdminPanelOpen: boolean;
  setIsAdminPanelOpen: (open: boolean) => void;
  adminLogin: (identifier: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  adminLogout: () => void;
  changePassword: (curr: string, next: string) => Promise<{ success: boolean; error?: string }>;

  // CRUD Actions
  updateSiteConfig: (newConfig: Partial<SiteConfig>) => void;
  // Vehicles / Cars
  // Vehicles are stored on the server; these throw an Error (with a user-friendly message) on failure.
  addVehicle: (veh: Vehicle) => Promise<void>;
  updateVehicle: (veh: Vehicle) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;
  // Packages
  addPackage: (pkg: TourPackage) => void;
  updatePackage: (pkg: TourPackage) => void;
  deletePackage: (id: string) => void;
  // Destinations
  addDestination: (dest: Destination) => void;
  updateDestination: (dest: Destination) => void;
  deleteDestination: (id: string) => void;
  // Services
  addService: (srv: ServiceItem) => void;
  updateService: (srv: ServiceItem) => void;
  deleteService: (id: string) => void;
  // Gallery
  addGalleryPhoto: (photo: GalleryPhoto) => void;
  updateGalleryPhoto: (photo: GalleryPhoto) => void;
  deleteGalleryPhoto: (id: string) => void;
  // Testimonials
  addTestimonial: (test: Testimonial) => void;
  updateTestimonial: (test: Testimonial) => void;
  deleteTestimonial: (id: string) => void;
  // Enquiries
  submitPublicEnquiry: (data: Omit<Enquiry, 'id' | 'createdAt' | 'status'>) => Enquiry;
  updateEnquiryStatus: (id: string, status: Enquiry['status'], notes?: string) => void;
  deleteEnquiry: (id: string) => void;

  resetAllContent: () => void;
  getWhatsAppUrl: (customMessage?: string, customPhone?: string) => string;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function normalizeAssetPath(url: string | undefined, fallback = '/images/hero_cinematic_landscape.jpg'): string {
  if (!url || typeof url !== 'string') return fallback;
  const trimmed = url.trim();
  if (!trimmed) return fallback;
  
  // Data URLs (e.g. uploaded/compressed images) and remote HTTPS/HTTP URLs are completely valid
  if (trimmed.startsWith('data:image/') || trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // Reject invalid browser session URLs
  if (trimmed.startsWith('blob:') || trimmed.startsWith('file:') || trimmed.includes('localhost:')) {
    return fallback;
  }

  if (trimmed.includes('hero_luxury_travel_panoramic')) return '/images/hero_luxury_travel_panoramic.jpg';
  if (trimmed.includes('popular_beach_paradise')) return '/images/popular_beach_paradise.jpg';
  if (trimmed.includes('temple_heritage_palace')) return '/images/temple_heritage_palace.jpg';
  if (trimmed.includes('luxury_fleet_showcase')) return '/images/luxury_fleet_showcase.jpg';
  if (trimmed.includes('rs_tours_official_logo')) return '/logo/rs_tours_official_logo.jpg';
  if (trimmed.includes('hero_cinematic_landscape')) return '/images/hero_cinematic_landscape.jpg';
  if (trimmed.includes('cinematic_winding_road')) return '/images/cinematic_winding_road.jpg';
  if (trimmed.includes('family_holiday_journey')) return '/images/family_holiday_journey.jpg';
  if (trimmed.includes('adventure_mountain_trek')) return '/images/adventure_mountain_trek.jpg';
  if (trimmed.includes('final_cta_golden_hour')) return '/images/final_cta_golden_hour.jpg';
  if (trimmed.includes('car_innova_crysta')) return '/images/car_innova_crysta.jpg';
  if (trimmed.includes('car_swift_dzire')) return '/images/car_swift_dzire.jpg';
  if (trimmed.includes('car_tempo_traveller')) return '/images/car_tempo_traveller.jpg';
  if (trimmed.includes('car_ertiga_mpv')) return '/images/car_ertiga_mpv.jpg';

  if (trimmed.startsWith('/src/assets/images/')) {
    return trimmed.replace('/src/assets/images/', '/images/');
  }
  return trimmed;
}

const STORAGE_KEYS = {
  CONFIG: 'rs_tours_config_v3',
  DESTINATIONS: 'rs_tours_destinations_v3',
  PACKAGES: 'rs_tours_packages_v3',
  SERVICES: 'rs_tours_services_v3',
  TESTIMONIALS: 'rs_tours_testimonials_v3',
  GALLERY: 'rs_tours_gallery_v3',
  ENQUIRIES: 'rs_tours_enquiries_v3',
};

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONFIG) || localStorage.getItem('rs_tours_config_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_CONFIG,
          ...parsed,
          customLogoUrl: normalizeAssetPath(parsed.customLogoUrl || INITIAL_CONFIG.customLogoUrl, '/logo/rs_tours_official_logo.jpg'),
          heroImage: normalizeAssetPath(parsed.heroImage || INITIAL_CONFIG.heroImage, '/images/hero_cinematic_landscape.jpg'),
          finalCtaImage: normalizeAssetPath(parsed.finalCtaImage || INITIAL_CONFIG.finalCtaImage, '/images/final_cta_golden_hour.jpg'),
        };
      }
      return INITIAL_CONFIG;
    } catch {
      return INITIAL_CONFIG;
    }
  });

  const [destinations, setDestinations] = useState<Destination[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DESTINATIONS) || localStorage.getItem('rs_tours_destinations_v2');
      if (saved) {
        const list: Destination[] = JSON.parse(saved);
        return list.map((d) => ({
          ...d,
          image: normalizeAssetPath(d.image, '/images/hero_cinematic_landscape.jpg'),
        }));
      }
      return DEFAULT_DESTINATIONS.map((d) => ({
        ...d,
        image: normalizeAssetPath(d.image, '/images/hero_cinematic_landscape.jpg'),
      }));
    } catch {
      return DEFAULT_DESTINATIONS;
    }
  });

  const [packages, setPackages] = useState<TourPackage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PACKAGES) || localStorage.getItem('rs_tours_packages_v2');
      if (saved) {
        const list: TourPackage[] = JSON.parse(saved);
        return list.map((p) => ({
          ...p,
          image: normalizeAssetPath(p.image, '/images/hero_cinematic_landscape.jpg'),
        }));
      }
      return DEFAULT_PACKAGES.map((p) => ({
        ...p,
        image: normalizeAssetPath(p.image, '/images/hero_cinematic_landscape.jpg'),
      }));
    } catch {
      return DEFAULT_PACKAGES;
    }
  });

  const [experiences] = useState<TravelExperience[]>(() =>
    DEFAULT_EXPERIENCES.map((e) => ({
      ...e,
      image: normalizeAssetPath(e.image, '/images/hero_cinematic_landscape.jpg'),
    }))
  );

  const [services, setServices] = useState<ServiceItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SERVICES) || localStorage.getItem('rs_tours_services_v2');
      if (saved) {
        const list: ServiceItem[] = JSON.parse(saved);
        return list.map((s) => ({
          ...s,
          image: normalizeAssetPath(s.image, '/images/hero_cinematic_landscape.jpg'),
        }));
      }
      return DEFAULT_SERVICES.map((s) => ({
        ...s,
        image: normalizeAssetPath(s.image, '/images/hero_cinematic_landscape.jpg'),
      }));
    } catch {
      return DEFAULT_SERVICES;
    }
  });

  // Vehicles come from the server (shared by all visitors). The last fetched list is cached
  // locally only so the section renders instantly on repeat visits; the server stays the source of truth.
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => getCachedVehicles());

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TESTIMONIALS) || localStorage.getItem('rs_tours_testimonials_v2');
      return saved ? JSON.parse(saved) : DEFAULT_TESTIMONIALS;
    } catch {
      return DEFAULT_TESTIMONIALS;
    }
  });

  const [gallery, setGallery] = useState<GalleryPhoto[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GALLERY) || localStorage.getItem('rs_tours_gallery_v2');
      if (saved) {
        const list: GalleryPhoto[] = JSON.parse(saved);
        return list.map((g) => ({
          ...g,
          image: normalizeAssetPath(g.image, '/images/hero_cinematic_landscape.jpg'),
        }));
      }
      return DEFAULT_GALLERY.map((g) => ({
        ...g,
        image: normalizeAssetPath(g.image, '/images/hero_cinematic_landscape.jpg'),
      }));
    } catch {
      return DEFAULT_GALLERY;
    }
  });

  const [enquiries, setEnquiries] = useState<Enquiry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ENQUIRIES);
      return saved ? JSON.parse(saved) : DEFAULT_ENQUIRIES;
    } catch {
      return DEFAULT_ENQUIRIES;
    }
  });

  // Interactive Public Modal states
  const [cityEscapes, setCityEscapes] = useState<CityEscape[]>(DEFAULT_CITY_ESCAPES);
  const [activePackage, setActivePackage] = useState<TourPackage | null>(null);
  const [activeDestination, setActiveDestination] = useState<Destination | null>(null);
  const [activeVehicle, setActiveVehicle] = useState<Vehicle | null>(null);
  const [activeCityEscape, setActiveCityEscape] = useState<CityEscape | null>(null);
  const [lightboxPhoto, setLightboxPhoto] = useState<GalleryPhoto | null>(null);

  // Global Interactive Booking Planner
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [bookingPrefill, setBookingPrefill] = useState<Partial<Enquiry> | null>(null);

  const openBookingModal = (prefill?: Partial<Enquiry>) => {
    setBookingPrefill(prefill || null);
    setIsBookingModalOpen(true);
  };

  // Admin Auth & Panel state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return !!getCurrentSession();
  });
  const [showAdminLoginModal, setShowAdminLoginModal] = useState<boolean>(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState<boolean>(false);

  // Hash route listener: #admin or /admin opens admin modal or panel
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#admin' || window.location.pathname === '/admin') {
        if (getCurrentSession()) {
          setIsAdminPanelOpen(true);
        } else {
          setShowAdminLoginModal(true);
        }
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  // Keyboard shortcut: Ctrl+Shift+A or Cmd+Shift+A opens admin
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        if (getCurrentSession()) {
          setIsAdminPanelOpen(true);
        } else {
          setShowAdminLoginModal(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Multi-tab / Cross-window storage synchronization
  useEffect(() => {
    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.CONFIG && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setSiteConfig((prev) => ({ ...prev, ...parsed }));
        } catch (err) {
          console.error(err);
        }
      } else if (e.key === STORAGE_KEYS.PACKAGES && e.newValue) {
        try {
          const list: TourPackage[] = JSON.parse(e.newValue);
          setPackages(list);
        } catch (err) {
          console.error(err);
        }
      } else if (e.key === STORAGE_KEYS.DESTINATIONS && e.newValue) {
        try {
          const list: Destination[] = JSON.parse(e.newValue);
          setDestinations(list);
        } catch (err) {
          console.error(err);
        }
      }
    };

    window.addEventListener('storage', handleStorageEvent);
    return () => window.removeEventListener('storage', handleStorageEvent);
  }, []);

  // Sync back to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(siteConfig));
    } catch (e) {
      console.error(e);
    }
  }, [siteConfig]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DESTINATIONS, JSON.stringify(destinations));
    } catch (e) {
      console.error(e);
    }
  }, [destinations]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(packages));
    } catch (e) {
      console.error(e);
    }
  }, [packages]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
    } catch (e) {
      console.error(e);
    }
  }, [services]);

  // Load vehicles from the server on start, when the tab regains focus, and every minute,
  // so edits/deletes made in the admin panel reach every visitor without a manual reload.
  const refreshVehicles = async () => {
    try {
      const list = await fetchVehicles();
      setVehicles(list);
      cacheVehicles(list);
    } catch (e) {
      console.error('Could not load vehicles', e);
    }
  };

  useEffect(() => {
    refreshVehicles();
    const onVisible = () => {
      if (document.visibilityState === 'visible') refreshVehicles();
    };
    document.addEventListener('visibilitychange', onVisible);
    const timer = window.setInterval(onVisible, 60_000);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(testimonials));
    } catch (e) {
      console.error(e);
    }
  }, [testimonials]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(gallery));
    } catch (e) {
      console.error(e);
    }
  }, [gallery]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(enquiries));
    } catch (e) {
      console.error(e);
    }
  }, [enquiries]);

  // Auth actions
  const adminLogin = async (identifier: string, pass: string) => {
    const res = await verifyLogin(identifier, pass);
    if (res.success) {
      // Also sign in to the server so vehicle changes can be saved (non-blocking: login itself is unchanged).
      await createServerSession(identifier, pass);
      refreshVehicles();
      setIsAdminLoggedIn(true);
      setShowAdminLoginModal(false);
      setIsAdminPanelOpen(true);
    }
    return res;
  };

  const adminLogout = () => {
    logoutAdmin();
    clearServerSession();
    refreshVehicles();
    setIsAdminLoggedIn(false);
    setIsAdminPanelOpen(false);
    if (window.location.hash === '#admin') {
      window.history.pushState(null, '', window.location.pathname);
    }
  };

  const changePassword = async (curr: string, next: string) => {
    return changeAdminPassword(curr, next);
  };

  // Content actions
  const updateSiteConfig = (newConfig: Partial<SiteConfig>) => {
    setSiteConfig((prev) => ({ ...prev, ...newConfig }));
  };

  // Vehicles / Fleet (persisted on the server; photos go to cloud storage)
  const addVehicle = async (veh: Vehicle) => {
    const saved = await createVehicleOnServer(veh);
    setVehicles((prev) => {
      const next = [saved, ...prev.filter((v) => v.id !== saved.id)];
      cacheVehicles(next);
      return next;
    });
  };
  const updateVehicle = async (updated: Vehicle) => {
    const saved = await updateVehicleOnServer(updated);
    setVehicles((prev) => {
      const next = prev.map((v) => (v.id === saved.id ? saved : v));
      cacheVehicles(next);
      return next;
    });
  };
  const deleteVehicle = async (id: string) => {
    await deleteVehicleOnServer(id);
    setVehicles((prev) => {
      const next = prev.filter((v) => v.id !== id);
      cacheVehicles(next);
      return next;
    });
  };

  // Packages
  const addPackage = (pkg: TourPackage) => {
    setPackages((prev) => [pkg, ...prev]);
  };
  const updatePackage = (updated: TourPackage) => {
    setPackages((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };
  const deletePackage = (id: string) => {
    setPackages((prev) => prev.filter((p) => p.id !== id));
  };

  // Destinations
  const addDestination = (dest: Destination) => {
    setDestinations((prev) => [dest, ...prev]);
  };
  const updateDestination = (updated: Destination) => {
    setDestinations((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
  };
  const deleteDestination = (id: string) => {
    setDestinations((prev) => prev.filter((d) => d.id !== id));
  };

  // Services
  const addService = (srv: ServiceItem) => {
    setServices((prev) => [srv, ...prev]);
  };
  const updateService = (updated: ServiceItem) => {
    setServices((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };
  const deleteService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  // Gallery
  const addGalleryPhoto = (photo: GalleryPhoto) => {
    setGallery((prev) => [photo, ...prev]);
  };
  const updateGalleryPhoto = (photo: GalleryPhoto) => {
    setGallery((prev) => prev.map((g) => (g.id === photo.id ? photo : g)));
  };
  const deleteGalleryPhoto = (id: string) => {
    setGallery((prev) => prev.filter((g) => g.id !== id));
  };

  // Testimonials
  const addTestimonial = (test: Testimonial) => {
    setTestimonials((prev) => [test, ...prev]);
  };
  const updateTestimonial = (updated: Testimonial) => {
    setTestimonials((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };
  const deleteTestimonial = (id: string) => {
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
  };

  // Enquiries
  const submitPublicEnquiry = (data: Omit<Enquiry, 'id' | 'createdAt' | 'status'>) => {
    const newEnq: Enquiry = {
      ...data,
      id: `enq-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'New',
    };
    setEnquiries((prev) => [newEnq, ...prev]);
    return newEnq;
  };

  const updateEnquiryStatus = (id: string, status: Enquiry['status'], notes?: string) => {
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status, adminNotes: notes ?? e.adminNotes } : e))
    );
  };

  const deleteEnquiry = (id: string) => {
    setEnquiries((prev) => prev.filter((e) => e.id !== id));
  };

  const resetAllContent = () => {
    setSiteConfig(INITIAL_CONFIG);
    setDestinations(DEFAULT_DESTINATIONS);
    setPackages(DEFAULT_PACKAGES);
    setServices(DEFAULT_SERVICES);
    setTestimonials(DEFAULT_TESTIMONIALS);
    setGallery(DEFAULT_GALLERY);
    setEnquiries(DEFAULT_ENQUIRIES);
    try {
      localStorage.removeItem(STORAGE_KEYS.CONFIG);
      localStorage.removeItem(STORAGE_KEYS.DESTINATIONS);
      localStorage.removeItem(STORAGE_KEYS.PACKAGES);
      localStorage.removeItem(STORAGE_KEYS.SERVICES);
      localStorage.removeItem(STORAGE_KEYS.TESTIMONIALS);
      localStorage.removeItem(STORAGE_KEYS.GALLERY);
      localStorage.removeItem(STORAGE_KEYS.ENQUIRIES);
    } catch (e) {
      console.error(e);
    }
  };

  const getWhatsAppUrl = (customMessage?: string, customPhone?: string) => {
    const targetPhone = customPhone || siteConfig.whatsapp;
    const cleanPhone = targetPhone.replace(/[^0-9]/g, '');
    const textToEncode = customMessage || siteConfig.defaultWhatsAppMessage;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(textToEncode)}`;
  };

  return (
    <ContentContext.Provider
      value={{
        siteConfig,
        destinations,
        packages,
        experiences,
        services,
        vehicles,
        testimonials,
        gallery,
        enquiries,
        cityEscapes,
        activeCityEscape,
        setActiveCityEscape,
        activePackage,
        setActivePackage,
        activeDestination,
        setActiveDestination,
        activeVehicle,
        setActiveVehicle,
        lightboxPhoto,
        setLightboxPhoto,
        isBookingModalOpen,
        setIsBookingModalOpen,
        bookingPrefill,
        openBookingModal,
        isAdminLoggedIn,
        showAdminLoginModal,
        setShowAdminLoginModal,
        isAdminPanelOpen,
        setIsAdminPanelOpen,
        adminLogin,
        adminLogout,
        changePassword,
        updateSiteConfig,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        addPackage,
        updatePackage,
        deletePackage,
        addDestination,
        updateDestination,
        deleteDestination,
        addService,
        updateService,
        deleteService,
        addGalleryPhoto,
        updateGalleryPhoto,
        deleteGalleryPhoto,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        submitPublicEnquiry,
        updateEnquiryStatus,
        deleteEnquiry,
        resetAllContent,
        getWhatsAppUrl,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
