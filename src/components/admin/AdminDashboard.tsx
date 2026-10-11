import React, { useState } from 'react';
import { useContent } from '../../context/ContentContext';
import {
  Destination,
  TourPackage,
  ServiceItem,
  Vehicle,
  Testimonial,
  GalleryPhoto,
  Enquiry,
} from '../../types';
import { compressImage } from '../../utils/imageCompressor';
import {
  LayoutDashboard,
  Package,
  MapPin,
  Tag,
  Briefcase,
  Phone,
  Image as ImageIcon,
  Home,
  MessageSquare,
  MessageCircle,
  Inbox,
  Settings,
  LogOut,
  ExternalLink,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  AlertTriangle,
  Upload,
  Search,
  Eye,
  Menu,
  Shield,
  Clock,
  Sparkles,
  ChevronRight,
  Filter,
  Car,
  Users,
} from 'lucide-react';

type AdminTab =
  | 'overview'
  | 'packages'
  | 'destinations'
  | 'vehicles'
  | 'services'
  | 'contact'
  | 'gallery'
  | 'homepage'
  | 'testimonials'
  | 'whatsapp'
  | 'enquiries'
  | 'settings';

export const AdminDashboard: React.FC = () => {
  const {
    siteConfig,
    destinations,
    packages,
    services,
    vehicles,
    testimonials,
    gallery,
    enquiries,
    isAdminPanelOpen,
    setIsAdminPanelOpen,
    adminLogout,
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
    updateEnquiryStatus,
    deleteEnquiry,
    changePassword,
    getWhatsAppUrl,
  } = useContent();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>('');

  // Confirmation modal state
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    title: string;
    onConfirm: () => void;
  } | null>(null);

  // Edit/Add Modals State
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [isNewVehicle, setIsNewVehicle] = useState(false);
  const [savingVehicle, setSavingVehicle] = useState(false);

  const [editingPackage, setEditingPackage] = useState<TourPackage | null>(null);
  const [isNewPackage, setIsNewPackage] = useState(false);

  const [editingDestination, setEditingDestination] = useState<Destination | null>(null);
  const [isNewDestination, setIsNewDestination] = useState(false);

  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isNewService, setIsNewService] = useState(false);

  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isNewTestimonial, setIsNewTestimonial] = useState(false);

  const [editingPhoto, setEditingPhoto] = useState<GalleryPhoto | null>(null);
  const [isNewPhoto, setIsNewPhoto] = useState(false);

  const [viewingEnquiry, setViewingEnquiry] = useState<Enquiry | null>(null);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');

  // Password change state
  const [currPass, setCurrPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');

  if (!isAdminPanelOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    callback: (compressedUrl: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file);
        callback(compressed);
        showToast('Image uploaded & compressed successfully.');
      } catch (err) {
        showToast('Failed to process image. Please try another image file.');
      }
    }
  };

  const navItems: { id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'packages', label: 'Tour Packages', icon: Package },
    { id: 'destinations', label: 'Destinations', icon: MapPin },
    { id: 'vehicles', label: `Cars & Fleet (${vehicles.length})`, icon: Car },
    { id: 'services', label: 'Services', icon: Briefcase },
    { id: 'contact', label: 'Contact Details', icon: Phone },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'homepage', label: 'Homepage Content', icon: Home },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
    { id: 'whatsapp', label: 'WhatsApp Settings', icon: MessageCircle },
    { id: 'enquiries', label: `Enquiries (${enquiries.filter((e) => e.status === 'New').length})`, icon: Inbox },
    { id: 'settings', label: 'Website Settings', icon: Settings },
  ];

  return (
    <div className="fixed inset-0 z-[10000] bg-[#F4F6F8] text-slate-800 flex flex-col md:flex-row overflow-hidden font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#073B35] text-white px-5 py-3 rounded-lg shadow-2xl border border-[#DFB257] flex items-center gap-2.5 animate-in slide-in-from-top duration-200">
          <Check className="w-4 h-4 text-[#25D366]" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <AlertTriangle className="w-6 h-6" />
              <h4 className="font-bold text-base text-slate-900">Confirm Deletion</h4>
            </div>
            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              Are you sure you want to delete <strong className="text-slate-900">{deleteConfirmation.title}</strong>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2.5">
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteConfirmation.onConfirm();
                  setDeleteConfirmation(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SIDEBAR NAVIGATION (Desktop & Collapsible Mobile) */}
      <aside
        className={`w-64 bg-[#0B192C] text-white shrink-0 flex flex-col justify-between border-r border-slate-800 absolute md:static inset-y-0 left-0 z-40 transition-transform duration-300 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-sm shadow">
                RS
              </div>
              <div>
                <h1 className="font-brand font-bold text-sm tracking-wider text-white">
                  RS TOURS & TRAVELS
                </h1>
                <span className="text-[10px] text-amber-400 tracking-widest uppercase block font-mono font-semibold">
                  ADMIN DASHBOARD
                </span>
              </div>
            </div>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="md:hidden text-white/70 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileSidebarOpen(false);
                    setSearchTerm('');
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-slate-800 text-amber-400 font-bold shadow-sm border border-slate-700'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-slate-800 space-y-1">
          <button
            onClick={() => {
              setIsAdminPanelOpen(false);
              if (window.location.hash === '#admin') {
                window.history.replaceState(null, '', window.location.pathname + window.location.search);
              }
            }}
            className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4 text-amber-400" />
            <span>View Live Website</span>
          </button>

          <button
            onClick={adminLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-red-300 hover:text-red-200 hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-md"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="font-serif font-bold text-lg text-slate-900 capitalize">
              {navItems.find((n) => n.id === activeTab)?.label}
            </h2>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                setIsAdminPanelOpen(false);
                if (window.location.hash === '#admin') {
                  window.history.replaceState(null, '', window.location.pathname + window.location.search);
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#073B35] text-white hover:bg-[#0B5D5A] rounded-md text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#DFB257]" />
              <span>Hide Dashboard</span>
            </button>
            <button
              onClick={() => {
                setIsAdminPanelOpen(false);
                if (window.location.hash === '#admin') {
                  window.history.replaceState(null, '', window.location.pathname + window.location.search);
                }
              }}
              className="p-1.5 text-slate-500 hover:text-slate-800 rounded-md hover:bg-slate-100 cursor-pointer"
              title="Close Dashboard"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Scrollable Dashboard Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8">
          
          {/* ========================================================
              TAB 1: DASHBOARD OVERVIEW
          ======================================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-[11px] text-slate-400 uppercase font-semibold block">Total Packages</span>
                  <p className="text-2xl font-bold text-[#073B35] mt-1">{packages.length}</p>
                  <span className="text-[10px] text-[#0D7A68] mt-1 block">Active Itineraries</span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-[11px] text-slate-400 uppercase font-semibold block">Destinations</span>
                  <p className="text-2xl font-bold text-[#073B35] mt-1">{destinations.length}</p>
                  <span className="text-[10px] text-[#0D7A68] mt-1 block">Across South India</span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-[11px] text-slate-400 uppercase font-semibold block">Fleet & Cars</span>
                  <p className="text-2xl font-bold text-[#073B35] mt-1">{vehicles.length}</p>
                  <span className="text-[10px] text-[#0D7A68] mt-1 block">
                    {vehicles.reduce((acc, v) => acc + (v.seatsCount || 0), 0)} Passenger Seats
                  </span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-[11px] text-slate-400 uppercase font-semibold block">Services</span>
                  <p className="text-2xl font-bold text-[#073B35] mt-1">{services.length}</p>
                  <span className="text-[10px] text-[#0D7A68] mt-1 block">Offered Offerings</span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-[11px] text-slate-400 uppercase font-semibold block">Gallery Images</span>
                  <p className="text-2xl font-bold text-[#073B35] mt-1">{gallery.length}</p>
                  <span className="text-[10px] text-[#0D7A68] mt-1 block">Travel Journal</span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs col-span-2 lg:col-span-1 bg-gradient-to-br from-amber-50 to-white">
                  <span className="text-[11px] text-amber-700 uppercase font-semibold block">New Enquiries</span>
                  <p className="text-2xl font-bold text-amber-900 mt-1">
                    {enquiries.filter((e) => e.status === 'New').length}
                  </p>
                  <span className="text-[10px] text-amber-600 mt-1 block">Awaiting Contact</span>
                </div>
              </div>

              {/* Quick Actions Bar */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
                <h3 className="font-bold text-sm text-slate-900 mb-4">Quick Actions</h3>
                <div className="flex flex-wrap gap-2.5">
                  <button
                    onClick={() => {
                      setIsNewVehicle(true);
                      setEditingVehicle({
                        id: `veh-${Date.now()}`,
                        name: '',
                        seatingCapacity: '6+1 Seater',
                        seatsCount: 7,
                        category: 'MPV',
                        image: '',
                        acType: 'Dual Zone AC',
                        luggageCapacity: '4 Large Bags',
                        pricePerKm: '₹18 / km',
                        dailyRate: '₹3,800 / day',
                        features: ['Pushback Luxury Seats', 'Experienced Mountain Chauffeur', 'Sanitized & GPS Enabled'],
                        fuelType: 'Diesel',
                        idealFor: 'Family hill tours & outstation drives',
                        enabled: true,
                        featured: false,
                      });
                      setActiveTab('vehicles');
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#073B35] text-white hover:bg-[#0B5D5A] rounded-md text-xs font-semibold shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Travel Vehicle</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsNewPackage(true);
                      setEditingPackage({
                        id: `pkg-${Date.now()}`,
                        title: '',
                        destination: '',
                        duration: '3 Days / 2 Nights',
                        category: 'FAMILY',
                        image: siteConfig.heroImage,
                        highlights: ['Comfortable transport', 'Handpicked stay'],
                        overview: '',
                        itinerarySummary: [{ day: 'Day 1', title: 'Pickup & Arrival', desc: 'Arrival & check-in' }],
                        inclusions: ['Dedicated AC Vehicle', 'Hotel with Breakfast'],
                        priceNote: '',
                        enabled: true,
                      });
                      setActiveTab('packages');
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#073B35] text-white hover:bg-[#0B5D5A] rounded-md text-xs font-semibold shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Tour Package</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsNewDestination(true);
                      setEditingDestination({
                        id: `dest-${Date.now()}`,
                        name: '',
                        location: '',
                        category: 'Mountains',
                        description: '',
                        image: siteConfig.heroImage,
                        idealFor: 'Families & Couples',
                        bestSeason: 'October to May',
                        highlights: ['Scenic Viewpoint'],
                        enabled: true,
                        featured: true,
                      });
                      setActiveTab('destinations');
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 rounded-md text-xs font-semibold shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Destination</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('vehicles')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 rounded-md text-xs font-semibold shadow-xs"
                  >
                    <Car className="w-3.5 h-3.5" />
                    <span>Manage Cars & Fleet</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('contact')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 rounded-md text-xs font-semibold shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Update Contact Details</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsNewPhoto(true);
                      setEditingPhoto({
                        id: `gal-${Date.now()}`,
                        title: '',
                        location: '',
                        category: 'Destinations',
                        image: '',
                        caption: '',
                        aspect: 'wide',
                        featured: false,
                      });
                      setActiveTab('gallery');
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 rounded-md text-xs font-semibold shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Photo</span>
                  </button>
                </div>
              </div>

              {/* Recent Enquiries & Recent Packages */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Enquiries */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-sm text-slate-900">Recent Customer Enquiries</h3>
                    <button
                      onClick={() => setActiveTab('enquiries')}
                      className="text-xs font-semibold text-[#073B35] hover:underline"
                    >
                      View All
                    </button>
                  </div>

                  <div className="space-y-3">
                    {enquiries.slice(0, 4).map((enq) => (
                      <div
                        key={enq.id}
                        onClick={() => {
                          setViewingEnquiry(enq);
                          setActiveTab('enquiries');
                        }}
                        className="p-3.5 rounded-lg border border-slate-100 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between"
                      >
                        <div>
                          <p className="font-semibold text-xs text-slate-900">{enq.name}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {enq.destination} · {enq.travellers}
                          </p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase ${
                              enq.status === 'New'
                                ? 'bg-amber-100 text-amber-800'
                                : enq.status === 'Contacted'
                                ? 'bg-blue-100 text-blue-800'
                                : enq.status === 'Converted'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {enq.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tour Packages Overview */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-sm text-slate-900">Active Tour Packages</h3>
                    <button
                      onClick={() => setActiveTab('packages')}
                      className="text-xs font-semibold text-[#073B35] hover:underline"
                    >
                      Manage
                    </button>
                  </div>

                  <div className="space-y-3">
                    {packages.slice(0, 4).map((pkg) => (
                      <div
                        key={pkg.id}
                        className="p-3 rounded-lg border border-slate-100 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={pkg.image}
                            alt=""
                            className="w-10 h-10 rounded-md object-cover"
                          />
                          <div>
                            <p className="font-semibold text-xs text-slate-900 truncate max-w-[200px]">
                              {pkg.title}
                            </p>
                            <p className="text-[11px] text-slate-500">{pkg.duration}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] font-semibold text-[#073B35] bg-[#F7F3EA] px-2 py-0.5 rounded font-mono">
                            {pkg.category}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 2: TOUR PACKAGES MANAGEMENT
          ======================================================== */}
          {activeTab === 'packages' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search tour packages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                  />
                </div>

                <button
                  onClick={() => {
                    setIsNewPackage(true);
                    setEditingPackage({
                      id: `pkg-${Date.now()}`,
                      title: '',
                      destination: '',
                      duration: '3 Days / 2 Nights',
                      category: 'FAMILY',
                      image: siteConfig.heroImage,
                      highlights: ['Scenic transport', 'Handpicked stay'],
                      overview: '',
                      itinerarySummary: [{ day: 'Day 1', title: 'Arrival', desc: 'Hotel check-in' }],
                      inclusions: ['Dedicated AC Vehicle', 'Stay with Breakfast'],
                      priceNote: '',
                      enabled: true,
                    });
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#073B35] text-white hover:bg-[#0B5D5A] rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add New Package</span>
                </button>
              </div>

              {/* Packages Table */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-4">Package</th>
                        <th className="p-4">Destination</th>
                        <th className="p-4">Duration</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {packages
                        .filter(
                          (p) =>
                            p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            p.destination.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((pkg) => (
                          <tr key={pkg.id} className="hover:bg-slate-50/60">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={pkg.image}
                                  alt=""
                                  className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                                />
                                <div>
                                  <p className="font-bold text-slate-900">{pkg.title}</p>
                                  {pkg.featured && (
                                    <span className="text-[10px] text-amber-700 font-semibold">
                                      ★ Featured
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-slate-700 font-medium">{pkg.destination}</td>
                            <td className="p-4 text-slate-600">{pkg.duration}</td>
                            <td className="p-4">
                              <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-slate-100 text-slate-700 font-semibold">
                                {pkg.category}
                              </span>
                            </td>
                            <td className="p-4">
                              <button
                                onClick={() => {
                                  updatePackage({ ...pkg, enabled: !pkg.enabled });
                                  showToast(`Package ${pkg.enabled ? 'disabled' : 'enabled'}.`);
                                }}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase cursor-pointer ${
                                  pkg.enabled
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-slate-100 text-slate-500'
                                }`}
                              >
                                {pkg.enabled ? 'Active' : 'Disabled'}
                              </button>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => {
                                    setIsNewPackage(false);
                                    setEditingPackage({ ...pkg });
                                  }}
                                  className="p-1.5 text-slate-600 hover:text-[#073B35] hover:bg-slate-100 rounded"
                                  title="Edit Package"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    setDeleteConfirmation({
                                      isOpen: true,
                                      title: pkg.title,
                                      onConfirm: () => {
                                        deletePackage(pkg.id);
                                        showToast('Package deleted.');
                                      },
                                    });
                                  }}
                                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                                  title="Delete Package"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 3: DESTINATIONS MANAGEMENT
          ======================================================== */}
          {activeTab === 'destinations' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search destinations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                  />
                </div>

                <button
                  onClick={() => {
                    setIsNewDestination(true);
                    setEditingDestination({
                      id: `dest-${Date.now()}`,
                      name: '',
                      location: '',
                      category: 'Mountains',
                      description: '',
                      image: siteConfig.heroImage,
                      idealFor: 'Families & Couples',
                      bestSeason: 'October to May',
                      highlights: ['Scenic Hills'],
                      enabled: true,
                      featured: true,
                    });
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#073B35] text-white hover:bg-[#0B5D5A] rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add Destination</span>
                </button>
              </div>

              {/* Destinations Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {destinations
                  .filter(
                    (d) =>
                      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      d.location.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((dest) => (
                    <div
                      key={dest.id}
                      className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between"
                    >
                      <div className="relative h-44">
                        <img
                          src={dest.image}
                          alt={dest.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white px-2 py-0.5 rounded text-[10px] uppercase font-bold">
                          {dest.category}
                        </div>
                        <div className="absolute top-3 right-3 flex items-center gap-1">
                          <button
                            onClick={() => {
                              updateDestination({ ...dest, enabled: !dest.enabled });
                              showToast(`Destination ${dest.enabled ? 'disabled' : 'enabled'}.`);
                            }}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              dest.enabled ? 'bg-emerald-600 text-white' : 'bg-slate-600 text-white'
                            }`}
                          >
                            {dest.enabled ? 'Active' : 'Disabled'}
                          </button>
                        </div>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-bold text-sm text-slate-900">{dest.name}</h4>
                            <span className="text-[11px] text-[#C9962E] font-medium">{dest.location}</span>
                          </div>
                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                            {dest.description}
                          </p>
                          <div className="text-[11px] text-slate-500 mb-2">
                            <strong>Best Season:</strong> {dest.bestSeason}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setIsNewDestination(false);
                              setEditingDestination({ ...dest });
                            }}
                            className="p-1.5 text-slate-600 hover:text-[#073B35] hover:bg-slate-100 rounded"
                            title="Edit Destination"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setDeleteConfirmation({
                                isOpen: true,
                                title: dest.name,
                                onConfirm: () => {
                                  deleteDestination(dest.id);
                                  showToast('Destination deleted.');
                                },
                              });
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                            title="Delete Destination"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ========================================================
              TAB: FLEET & CARS MANAGEMENT
          ======================================================== */}
          {activeTab === 'vehicles' && (
            <div className="space-y-6">
              {/* Header Banner */}
              <div className="bg-[#073B35] text-white p-6 rounded-xl border border-[#0B5D5A] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif text-xl font-bold text-white mb-1 flex items-center gap-2">
                    <Car className="w-5 h-5 text-[#DFB257]" />
                    <span>Travel Cars & Fleet Management</span>
                  </h3>
                  <p className="text-xs text-slate-200 max-w-2xl leading-relaxed">
                    Add and customize your travel vehicles, upload car photos, set custom seat counts (e.g. 4+1, 7, 12+1 Seater), define per-km tariffs, and toggle visibility on the live website.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsNewVehicle(true);
                    setEditingVehicle({
                      id: `veh-${Date.now()}`,
                      name: '',
                      model: '',
                      registrationNumber: '',
                      description: '',
                      seatingCapacity: '6+1 Seater',
                      seatsCount: 7,
                      category: 'MPV',
                      image: '',
                      isAc: true,
                      acType: 'Dual Zone Automatic AC',
                      luggageCapacity: '4 Large Bags',
                      pricePerKm: '₹18 / km',
                      dailyRate: '₹3,800 / day',
                      features: ['Pushback Luxury Seats', 'Experienced Mountain Chauffeur', 'Sanitized & GPS Enabled'],
                      fuelType: 'Diesel',
                      idealFor: 'Family trips & Western Ghats drives',
                      enabled: true,
                      featured: false,
                    });
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#DFB257] text-[#073B35] hover:bg-[#F3E8C8] rounded-lg text-xs font-bold shadow-sm shrink-0 cursor-pointer transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Car / Vehicle</span>
                </button>
              </div>

              {/* Search & Filter Bar */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by car name, seats, category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-[#073B35]"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="text-xs text-slate-500 font-medium self-end sm:self-center">
                  Total Vehicles: <strong className="text-slate-800">{vehicles.length}</strong> | Active on site:{' '}
                  <strong className="text-[#0D7A68]">{vehicles.filter((v) => v.enabled).length}</strong>
                </div>
              </div>

              {/* Vehicles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles
                  .filter((v) => {
                    if (!searchTerm) return true;
                    const term = searchTerm.toLowerCase();
                    return (
                      v.name.toLowerCase().includes(term) ||
                      v.seatingCapacity.toLowerCase().includes(term) ||
                      v.category.toLowerCase().includes(term) ||
                      (v.acType && v.acType.toLowerCase().includes(term)) ||
                      (v.features && v.features.some((f) => f.toLowerCase().includes(term)))
                    );
                  })
                  .map((veh) => (
                    <div
                      key={veh.id}
                      className={`bg-white rounded-xl border shadow-xs overflow-hidden flex flex-col justify-between transition-all ${
                        veh.enabled ? 'border-slate-200 hover:shadow-md' : 'border-slate-200 opacity-60 bg-slate-50'
                      }`}
                    >
                      {/* Car Thumbnail */}
                      <div className="relative aspect-video bg-slate-100 overflow-hidden">
                        <img
                          src={veh.image}
                          alt={veh.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/car_innova_crysta.jpg';
                          }}
                        />
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#073B35] text-white">
                            {veh.category}
                          </span>
                          {veh.featured && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#DFB257] text-[#073B35]">
                              Popular
                            </span>
                          )}
                        </div>

                        {/* Seating Badge */}
                        <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded bg-black/70 backdrop-blur-xs text-white text-xs font-bold flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-[#DFB257]" />
                          <span>{veh.seatingCapacity}</span>
                        </div>
                      </div>

                      {/* Content Details */}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <h4 className="font-bold text-sm text-slate-900">{veh.name}</h4>
                                {veh.model && (
                                  <span className="text-[10px] font-semibold text-[#0D7A68] bg-[#0D7A68]/10 px-1.5 py-0.2 rounded">
                                    {veh.model}
                                  </span>
                                )}
                                {veh.registrationNumber && (
                                  <span className="text-[10px] font-mono font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded">
                                    {veh.registrationNumber}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-[#0D7A68] font-medium">{veh.idealFor || 'Tour Vehicle'}</p>
                            </div>
                            <span className="text-xs font-bold text-[#073B35] bg-[#FAF7F2] px-2 py-1 rounded border border-[#EFE8DC] shrink-0">
                              {veh.pricePerKm || veh.dailyRate || 'Tariff on Request'}
                            </span>
                          </div>

                          <div className="space-y-1.5 py-2.5 my-2 border-y border-slate-100 text-[11px] text-slate-600">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400">Total Seats:</span>
                              <span className="font-semibold text-slate-800">{veh.seatsCount} Seats ({veh.seatingCapacity})</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400">AC Cooling:</span>
                              <span className="font-semibold text-slate-800">{veh.acType}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400">Luggage Space:</span>
                              <span className="font-semibold text-slate-800">{veh.luggageCapacity}</span>
                            </div>
                          </div>

                          {/* Features Pills */}
                          {veh.features && veh.features.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {veh.features.slice(0, 3).map((feat, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-700 rounded"
                                >
                                  {feat}
                                </span>
                              ))}
                              {veh.features.length > 3 && (
                                <span className="text-[10px] px-1.5 py-0.5 bg-slate-50 text-slate-500 rounded">
                                  +{veh.features.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Card Footer Actions */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                          <label className="flex items-center gap-1.5 cursor-pointer text-xs select-none">
                            <input
                              type="checkbox"
                              checked={veh.enabled}
                              onChange={async (e) => {
                                const enabled = e.target.checked;
                                try {
                                  await updateVehicle({ ...veh, enabled });
                                  showToast(enabled ? `${veh.name} enabled on site.` : `${veh.name} hidden from site.`);
                                } catch (err) {
                                  showToast(err instanceof Error ? err.message : 'Could not update vehicle.');
                                }
                              }}
                              className="rounded border-slate-300 text-[#073B35] focus:ring-[#073B35]"
                            />
                            <span className={veh.enabled ? 'text-[#0D7A68] font-medium' : 'text-slate-400'}>
                              {veh.enabled ? 'Visible' : 'Hidden'}
                            </span>
                          </label>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setIsNewVehicle(false);
                                setEditingVehicle({ ...veh });
                              }}
                              className="p-1.5 text-slate-600 hover:text-[#073B35] hover:bg-slate-100 rounded cursor-pointer"
                              title="Edit Vehicle"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setDeleteConfirmation({
                                  isOpen: true,
                                  title: veh.name,
                                  onConfirm: async () => {
                                    try {
                                      await deleteVehicle(veh.id);
                                      showToast(`${veh.name} deleted.`);
                                    } catch (err) {
                                      showToast(err instanceof Error ? err.message : 'Could not delete vehicle.');
                                    }
                                  },
                                });
                              }}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer"
                              title="Delete Vehicle"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {vehicles.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                  <Car className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700">No vehicles added yet</p>
                  <p className="text-xs text-slate-500 mt-1">Click "Add New Car / Vehicle" above to add your first vehicle.</p>
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              SERVICES MANAGEMENT
          ======================================================== */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setIsNewService(true);
                    setEditingService({
                      id: `srv-${Date.now()}`,
                      title: '',
                      description: '',
                      icon: 'Compass',
                      image: siteConfig.heroImage,
                      features: ['Customized travel', '24/7 on-road support'],
                      enabled: true,
                    });
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#073B35] text-white hover:bg-[#0B5D5A] rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add Service</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((srv) => (
                  <div
                    key={srv.id}
                    className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      {srv.image && (
                        <div className="h-32 rounded-lg overflow-hidden mb-3">
                          <img src={srv.image} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-sm text-slate-900">{srv.title}</h4>
                        <button
                          onClick={() => {
                            updateService({ ...srv, enabled: !srv.enabled });
                            showToast(`Service ${srv.enabled ? 'disabled' : 'enabled'}.`);
                          }}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            srv.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {srv.enabled ? 'Active' : 'Disabled'}
                        </button>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                        {srv.description}
                      </p>
                      <ul className="text-[11px] text-slate-500 space-y-1 mb-4">
                        {srv.features.map((f, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <span className="text-[#0D7A68]">✓</span>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setIsNewService(false);
                          setEditingService({ ...srv });
                        }}
                        className="p-1.5 text-slate-600 hover:text-[#073B35] hover:bg-slate-100 rounded"
                        title="Edit Service"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteConfirmation({
                            isOpen: true,
                            title: srv.title,
                            onConfirm: () => {
                              deleteService(srv.id);
                              showToast('Service deleted.');
                            },
                          });
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                        title="Delete Service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 6: CONTACT DETAILS MANAGEMENT
          ======================================================== */}
          {activeTab === 'contact' && (
            <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs max-w-3xl space-y-6">
              <div>
                <h3 className="font-bold text-base text-slate-900 mb-1">Official Contact Information</h3>
                <p className="text-xs text-slate-500">
                  Update phone numbers, email, physical addresses, and social media handles.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={siteConfig.brandName}
                    onChange={(e) => updateSiteConfig({ brandName: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Phone Number (Call)
                  </label>
                  <input
                    type="text"
                    value={siteConfig.phone}
                    onChange={(e) => updateSiteConfig({ phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={siteConfig.whatsapp}
                    onChange={(e) => updateSiteConfig({ whatsapp: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-mono font-bold text-[#073B35]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Official Email
                  </label>
                  <input
                    type="email"
                    value={siteConfig.email}
                    onChange={(e) => updateSiteConfig({ email: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Business Hours
                </label>
                <input
                  type="text"
                  value={siteConfig.businessHours}
                  onChange={(e) => updateSiteConfig({ businessHours: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Address / Coordination Hubs
                </label>
                <textarea
                  rows={2}
                  value={siteConfig.address}
                  onChange={(e) => updateSiteConfig({ address: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                />
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 uppercase mb-3">Social Media URLs</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Instagram URL</label>
                    <input
                      type="url"
                      placeholder="https://instagram.com/..."
                      value={siteConfig.instagramUrl}
                      onChange={(e) => updateSiteConfig({ instagramUrl: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Facebook URL</label>
                    <input
                      type="url"
                      placeholder="https://facebook.com/..."
                      value={siteConfig.facebookUrl}
                      onChange={(e) => updateSiteConfig({ facebookUrl: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">YouTube URL</label>
                    <input
                      type="url"
                      placeholder="https://youtube.com/..."
                      value={siteConfig.youtubeUrl}
                      onChange={(e) => updateSiteConfig({ youtubeUrl: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded border border-slate-300"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => showToast('Contact details saved successfully.')}
                  className="px-6 py-2.5 bg-[#073B35] hover:bg-[#0B5D5A] text-white text-xs font-bold rounded-lg shadow-sm"
                >
                  SAVE CHANGES
                </button>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 7: GALLERY MANAGEMENT (WITH AUTO-COMPRESSION)
          ======================================================== */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-xs text-slate-600 max-w-lg">
                  Upload client photographs. All images are automatically compressed and resized for optimal performance and mobile loading.
                </p>

                <label className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#073B35] text-white hover:bg-[#0B5D5A] rounded-lg text-xs font-bold shadow-xs cursor-pointer">
                  <Upload className="w-4 h-4" />
                  <span>Upload Real Photos</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) =>
                      handleFileUpload(e, (dataUrl) => {
                        addGalleryPhoto({
                          id: `gal-${Date.now()}`,
                          title: 'Scenic Travel View',
                          location: 'South India',
                          category: 'Nature',
                          image: dataUrl,
                          caption: 'Client travel experience with RS Tours & Travels.',
                          aspect: 'wide',
                          featured: false,
                        });
                        showToast('New client photo added to gallery.');
                      })
                    }
                  />
                </label>
              </div>

              {/* Gallery Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {gallery.map((photo) => (
                  <div
                    key={photo.id}
                    className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between"
                  >
                    <div className="relative h-40">
                      <img src={photo.image} alt={photo.title} className="w-full h-full object-cover" />
                      <span className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded font-mono">
                        {photo.category}
                      </span>
                    </div>

                    <div className="p-3">
                      <h5 className="font-bold text-xs text-slate-900 truncate">{photo.title}</h5>
                      <p className="text-[11px] text-slate-500 truncate">{photo.location}</p>

                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                        <select
                          value={photo.category}
                          onChange={(e) =>
                            updateGalleryPhoto({
                              ...photo,
                              category: e.target.value as any,
                            })
                          }
                          className="text-[10px] border border-slate-200 rounded px-1.5 py-0.5 bg-slate-50"
                        >
                          <option value="Destinations">Destinations</option>
                          <option value="Nature">Nature</option>
                          <option value="Road Trips">Road Trips</option>
                          <option value="Travellers">Travellers</option>
                          <option value="Experiences">Experiences</option>
                        </select>

                        <button
                          onClick={() => {
                            setDeleteConfirmation({
                              isOpen: true,
                              title: photo.title,
                              onConfirm: () => {
                                deleteGalleryPhoto(photo.id);
                                showToast('Photo deleted from gallery.');
                              },
                            });
                          }}
                          className="p-1 text-slate-400 hover:text-red-600 rounded"
                          title="Delete photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 8: HOMEPAGE CONTENT MANAGEMENT
          ======================================================== */}
          {activeTab === 'homepage' && (
            <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs max-w-3xl space-y-6">
              <div>
                <h3 className="font-bold text-base text-slate-900 mb-1">Homepage Content Editor</h3>
                <p className="text-xs text-slate-500">
                  Update headlines, supporting copy, brand story text, and CTAs without touching code.
                </p>
              </div>

              {/* Hero Section */}
              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-bold text-[#073B35] uppercase tracking-wider">
                  Hero Section
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Main Headline 1
                    </label>
                    <input
                      type="text"
                      value={siteConfig.heroHeading}
                      onChange={(e) => updateSiteConfig({ heroHeading: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded border border-slate-300 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Main Headline 2 (Italic)
                    </label>
                    <input
                      type="text"
                      value={siteConfig.heroSubheading}
                      onChange={(e) => updateSiteConfig({ heroSubheading: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded border border-slate-300 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Hero Supporting Description
                  </label>
                  <textarea
                    rows={2}
                    value={siteConfig.heroDescription}
                    onChange={(e) => updateSiteConfig({ heroDescription: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded border border-slate-300"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Primary CTA Text
                    </label>
                    <input
                      type="text"
                      value={siteConfig.primaryCtaText}
                      onChange={(e) => updateSiteConfig({ primaryCtaText: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Secondary CTA Text
                    </label>
                    <input
                      type="text"
                      value={siteConfig.secondaryCtaText}
                      onChange={(e) => updateSiteConfig({ secondaryCtaText: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded border border-slate-300"
                    />
                  </div>
                </div>

                {/* Hero Image upload */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Hero Background Image
                  </label>
                  <div className="flex items-center gap-3">
                    <img
                      src={siteConfig.heroImage}
                      alt="Hero preview"
                      className="w-20 h-12 rounded object-cover border border-slate-200"
                    />
                    <label className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded cursor-pointer border border-slate-300">
                      Upload New Hero Photo
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleFileUpload(e, (dataUrl) => updateSiteConfig({ heroImage: dataUrl }))
                        }
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Brand Story */}
              <div className="space-y-4 pt-6 border-t border-slate-100">
                <h4 className="text-xs font-bold text-[#073B35] uppercase tracking-wider">
                  Brand Story
                </h4>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Story Heading
                  </label>
                  <input
                    type="text"
                    value={siteConfig.brandStoryHeading}
                    onChange={(e) => updateSiteConfig({ brandStoryHeading: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Story Paragraph
                  </label>
                  <textarea
                    rows={3}
                    value={siteConfig.brandStoryText}
                    onChange={(e) => updateSiteConfig({ brandStoryText: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded border border-slate-300"
                  />
                </div>
              </div>

              {/* Final CTA */}
              <div className="space-y-4 pt-6 border-t border-slate-100">
                <h4 className="text-xs font-bold text-[#073B35] uppercase tracking-wider">
                  Final Section CTA
                </h4>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Final Heading
                  </label>
                  <input
                    type="text"
                    value={siteConfig.finalCtaHeading}
                    onChange={(e) => updateSiteConfig({ finalCtaHeading: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Final Subtitle / Quote
                  </label>
                  <input
                    type="text"
                    value={siteConfig.finalCtaText}
                    onChange={(e) => updateSiteConfig({ finalCtaText: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded border border-slate-300"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => showToast('Homepage content updated successfully.')}
                  className="px-6 py-2.5 bg-[#073B35] hover:bg-[#0B5D5A] text-white text-xs font-bold rounded-lg shadow-sm"
                >
                  SAVE HOMEPAGE CONTENT
                </button>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 9: TESTIMONIALS MANAGEMENT
          ======================================================== */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-xs text-slate-500">
                  Manage authentic traveller reviews. Toggle display, edit wording, or add verified feedback.
                </p>

                <button
                  onClick={() => {
                    setIsNewTestimonial(true);
                    setEditingTestimonial({
                      id: `test-${Date.now()}`,
                      customerName: '',
                      destination: 'Wayanad & Coorg',
                      travelType: 'Family Vacation',
                      review: '',
                      starRating: 5,
                      date: 'Verified Tour',
                      verified: true,
                      enabled: true,
                    });
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#073B35] text-white hover:bg-[#0B5D5A] rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add Testimonial</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {testimonials.map((test) => (
                  <div
                    key={test.id}
                    className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-sm text-slate-900">{test.customerName}</h4>
                        <button
                          onClick={() => {
                            updateTestimonial({ ...test, enabled: !test.enabled });
                            showToast(`Testimonial ${test.enabled ? 'disabled' : 'enabled'}.`);
                          }}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            test.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {test.enabled ? 'Visible' : 'Hidden'}
                        </button>
                      </div>

                      <div className="text-[11px] text-[#C9962E] font-medium mb-3">
                        {test.destination} · {test.travelType}
                      </div>

                      <p className="text-xs text-slate-700 italic leading-relaxed mb-4">
                        “{test.review}”
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                      <span>Rating: {test.starRating} / 5</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setIsNewTestimonial(false);
                            setEditingTestimonial({ ...test });
                          }}
                          className="p-1.5 text-slate-600 hover:text-[#073B35] rounded"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteConfirmation({
                              isOpen: true,
                              title: test.customerName,
                              onConfirm: () => {
                                deleteTestimonial(test.id);
                                showToast('Testimonial deleted.');
                              },
                            });
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 10: WHATSAPP MANAGEMENT
          ======================================================== */}
          {activeTab === 'whatsapp' && (
            <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs max-w-2xl space-y-6">
              <div>
                <h3 className="font-bold text-base text-slate-900 mb-1">WhatsApp Integration Settings</h3>
                <p className="text-xs text-slate-500">
                  The WhatsApp number configured here is dynamically used by every button, hero CTA, package enquiry, and mobile bar across the entire website.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Official WhatsApp Number
                </label>
                <input
                  type="text"
                  value={siteConfig.whatsapp}
                  onChange={(e) => updateSiteConfig({ whatsapp: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 font-mono font-bold text-[#073B35]"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Format: +91 96204 52241 (Country code followed by digits)
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Default Pre-filled WhatsApp Message
                </label>
                <textarea
                  rows={3}
                  value={siteConfig.defaultWhatsAppMessage}
                  onChange={(e) => updateSiteConfig({ defaultWhatsAppMessage: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 leading-relaxed"
                />
              </div>

              {/* Live Link Test */}
              <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                <span className="text-xs font-bold text-emerald-900 block mb-1">
                  Live WhatsApp Link Preview:
                </span>
                <code className="text-[11px] text-emerald-800 break-all font-mono block mb-3">
                  {getWhatsAppUrl()}
                </code>
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] text-slate-900 font-bold text-xs rounded shadow-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Test WhatsApp Click</span>
                </a>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => showToast('WhatsApp settings updated across all buttons.')}
                  className="px-6 py-2.5 bg-[#073B35] hover:bg-[#0B5D5A] text-white text-xs font-bold rounded-lg shadow-sm"
                >
                  SAVE WHATSAPP SETTINGS
                </button>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 11: ENQUIRIES MANAGEMENT
          ======================================================== */}
          {activeTab === 'enquiries' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-600">
                  Real-time enquiries received from prospective travelers through the contact form.
                </p>
                <span className="text-xs font-bold text-[#073B35] bg-[#F7F3EA] px-3 py-1 rounded-full border border-[#C9962E]/40">
                  Total: {enquiries.length} Enquiries
                </span>
              </div>

              {/* Enquiries Table */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Contact</th>
                        <th className="p-4">Destination & Date</th>
                        <th className="p-4">Party Size & Type</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {enquiries.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-slate-400">
                            No customer enquiries received yet.
                          </td>
                        </tr>
                      ) : (
                        enquiries.map((enq) => (
                          <tr key={enq.id} className="hover:bg-slate-50/60">
                            <td className="p-4">
                              <p className="font-bold text-slate-900">{enq.name}</p>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {new Date(enq.createdAt).toLocaleDateString()}
                              </span>
                            </td>
                            <td className="p-4">
                              <p className="font-mono text-slate-800">{enq.phone}</p>
                              <p className="text-slate-500 text-[11px] truncate max-w-[160px]">
                                {enq.email || '—'}
                              </p>
                            </td>
                            <td className="p-4">
                              <p className="font-semibold text-slate-800">{enq.destination}</p>
                              <p className="text-[11px] text-slate-500">{enq.travelDate}</p>
                            </td>
                            <td className="p-4">
                              <p className="text-slate-700">{enq.travellers}</p>
                              <p className="text-[11px] text-slate-500">{enq.travelType}</p>
                            </td>
                            <td className="p-4">
                              <select
                                value={enq.status}
                                onChange={(e) => {
                                  updateEnquiryStatus(enq.id, e.target.value as any);
                                  showToast(`Status updated to ${e.target.value}.`);
                                }}
                                className={`text-[10px] font-bold rounded px-2 py-1 border ${
                                  enq.status === 'New'
                                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                                    : enq.status === 'Contacted'
                                    ? 'bg-blue-50 text-blue-800 border-blue-300'
                                    : enq.status === 'Converted'
                                    ? 'bg-green-50 text-green-800 border-green-300'
                                    : 'bg-slate-50 text-slate-700 border-slate-300'
                                }`}
                              >
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Follow-up">Follow-up</option>
                                <option value="Converted">Converted</option>
                                <option value="Closed">Closed</option>
                              </select>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* WhatsApp Customer */}
                                <a
                                  href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                    `Hi ${enq.name}, thank you for enquiring with RS Tours & Travels regarding your trip to ${enq.destination}. We are glad to help you plan!`
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 bg-[#25D366] text-slate-900 rounded hover:bg-[#20BD5A]"
                                  title="WhatsApp Customer"
                                >
                                  <MessageCircle className="w-3.5 h-3.5 fill-slate-900" />
                                </a>

                                {/* Call Customer */}
                                <a
                                  href={`tel:${enq.phone.replace(/[^0-9+]/g, '')}`}
                                  className="p-1.5 bg-slate-100 text-slate-700 rounded hover:bg-slate-200"
                                  title="Call Customer"
                                >
                                  <Phone className="w-3.5 h-3.5" />
                                </a>

                                {/* View Details */}
                                <button
                                  onClick={() => setViewingEnquiry(enq)}
                                  className="p-1.5 text-slate-600 hover:text-[#073B35] rounded"
                                  title="View message"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>

                                {/* Delete */}
                                <button
                                  onClick={() => {
                                    setDeleteConfirmation({
                                      isOpen: true,
                                      title: `Enquiry from ${enq.name}`,
                                      onConfirm: () => {
                                        deleteEnquiry(enq.id);
                                        showToast('Enquiry removed.');
                                      },
                                    });
                                  }}
                                  className="p-1.5 text-slate-400 hover:text-red-600 rounded"
                                  title="Delete Enquiry"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 12: WEBSITE SETTINGS & SECURITY
          ======================================================== */}
          {activeTab === 'settings' && (
            <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs max-w-2xl space-y-8">
              {/* General Site Settings */}
              <div>
                <h3 className="font-bold text-base text-slate-900 mb-1">General Website Settings</h3>
                <p className="text-xs text-slate-500 mb-4">
                  Manage website title, footer copyright, and brand tagline.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Website Meta Title
                    </label>
                    <input
                      type="text"
                      value={siteConfig.websiteTitle}
                      onChange={(e) => updateSiteConfig({ websiteTitle: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Meta Description
                    </label>
                    <textarea
                      rows={2}
                      value={siteConfig.metaDescription}
                      onChange={(e) => updateSiteConfig({ metaDescription: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Brand Tagline
                    </label>
                    <input
                      type="text"
                      value={siteConfig.tagline}
                      onChange={(e) => updateSiteConfig({ tagline: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded border border-slate-300 italic"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Brand Line
                    </label>
                    <input
                      type="text"
                      value={siteConfig.brandLine}
                      onChange={(e) => updateSiteConfig({ brandLine: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded border border-slate-300 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Admin Security / Password Change */}
              <div className="pt-6 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="w-4 h-4 text-[#073B35]" />
                  <h4 className="font-bold text-sm text-slate-900">Change Admin Password</h4>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Passwords are securely salted and hashed using Web Crypto SHA-256.
                </p>

                {passError && (
                  <div className="mb-3 p-2.5 rounded bg-red-50 text-red-700 text-xs border border-red-200">
                    {passError}
                  </div>
                )}
                {passSuccess && (
                  <div className="mb-3 p-2.5 rounded bg-emerald-50 text-emerald-800 text-xs border border-emerald-200">
                    {passSuccess}
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter current password"
                      value={currPass}
                      onChange={(e) => setCurrPass(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded border border-slate-300"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        placeholder="At least 8 characters"
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded border border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        placeholder="Re-enter new password"
                        value={confirmPass}
                        onChange={(e) => setConfirmPass(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded border border-slate-300"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={async () => {
                      setPassError('');
                      setPassSuccess('');
                      if (!currPass || !newPass) {
                        setPassError('Please fill in current and new password.');
                        return;
                      }
                      if (newPass !== confirmPass) {
                        setPassError('New passwords do not match.');
                        return;
                      }
                      const res = await changePassword(currPass, newPass);
                      if (res.success) {
                        setPassSuccess('Password updated successfully.');
                        setCurrPass('');
                        setNewPass('');
                        setConfirmPass('');
                      } else {
                        setPassError(res.error || 'Failed to update password.');
                      }
                    }}
                    className="px-4 py-2 bg-[#073B35] hover:bg-[#0B5D5A] text-white text-xs font-bold rounded shadow-xs"
                  >
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ========================================================
          EDIT / ADD VEHICLE / CAR MODAL
      ======================================================== */}
      {editingVehicle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="px-6 py-4 bg-[#073B35] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Car className="w-5 h-5 text-[#DFB257]" />
                <h3 className="font-bold text-sm">
                  {isNewVehicle ? 'Add New Vehicle / Car' : 'Edit Vehicle Details'}
                </h3>
              </div>
              <button
                onClick={() => setEditingVehicle(null)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Car Name, Model & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-semibold mb-1 text-slate-700">Car / Vehicle Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Toyota Innova Crysta, Swift Dzire, Force Urbania"
                    value={editingVehicle.name}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:outline-none focus:border-[#073B35]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700">Model / Edition</label>
                  <input
                    type="text"
                    placeholder="e.g. Crysta 2.4 VX, Dzire VXi"
                    value={editingVehicle.model || ''}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, model: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:outline-none focus:border-[#073B35]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700">Category *</label>
                  <select
                    value={editingVehicle.category}
                    onChange={(e) =>
                      setEditingVehicle({ ...editingVehicle, category: e.target.value as any })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs bg-white focus:outline-none focus:border-[#073B35]"
                  >
                    <option value="MPV">MPV</option>
                    <option value="SUV">SUV</option>
                    <option value="Sedan">Sedan</option>
                    <option value="Tempo Traveller">Tempo Traveller</option>
                    <option value="Luxury Coach">Luxury Coach</option>
                  </select>
                </div>
              </div>

              {/* Registration Number & Description */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700">Registration Number (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. KA 01 AB 1234"
                    value={editingVehicle.registrationNumber || ''}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, registrationNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs uppercase focus:outline-none focus:border-[#073B35]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-semibold mb-1 text-slate-700">Vehicle Description / Overview</label>
                  <input
                    type="text"
                    placeholder="e.g. Premium chauffeur-driven luxury MPV ideal for mountain ghats and family outstation tours."
                    value={editingVehicle.description || ''}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, description: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:outline-none focus:border-[#073B35]"
                  />
                </div>
              </div>

              {/* Seating Capacity & Numeric Seats Count */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FAF7F2] p-3.5 rounded-lg border border-[#EFE8DC]">
                <div>
                  <label className="block font-bold text-[#073B35] mb-1">
                    Seating Capacity Label *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 6+1 Seater, 4+1 Seater, 12+1 Seater"
                    value={editingVehicle.seatingCapacity}
                    onChange={(e) => {
                      const val = e.target.value;
                      // Auto-extract numbers if possible
                      const match = val.match(/\d+/);
                      setEditingVehicle({
                        ...editingVehicle,
                        seatingCapacity: val,
                        seatsCount: match ? parseInt(match[0], 10) : editingVehicle.seatsCount,
                      });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs bg-white focus:outline-none focus:border-[#073B35]"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Shown prominently on vehicle badges.
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-[#073B35] mb-1">
                    How Many Seats? (Total Seats Count) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    placeholder="e.g. 7"
                    value={editingVehicle.seatsCount || ''}
                    onChange={(e) =>
                      setEditingVehicle({
                        ...editingVehicle,
                        seatsCount: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs bg-white font-bold text-[#073B35] focus:outline-none focus:border-[#073B35]"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Number of passenger seats for filters & stats.
                  </span>
                </div>
              </div>

              {/* Car Photo & Presets */}
              <div className="space-y-2">
                <label className="block font-semibold text-slate-700">Car Photo *</label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="relative w-28 h-20 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0 shadow-xs">
                    <img
                      src={editingVehicle.image || '/images/car_innova_crysta.jpg'}
                      alt="Car Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/car_innova_crysta.jpg';
                      }}
                    />
                  </div>
                  <div className="flex-1 w-full space-y-2">
                    <input
                      type="text"
                      placeholder="Image URL or choose preset / upload file"
                      value={editingVehicle.image}
                      onChange={(e) => setEditingVehicle({ ...editingVehicle, image: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:border-[#073B35]"
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-[11px] font-medium text-slate-700 cursor-pointer">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Custom Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleFileUpload(e, (dataUrl) =>
                              setEditingVehicle({ ...editingVehicle, image: dataUrl })
                            )
                          }
                        />
                      </label>

                      {/* Quick Presets */}
                      <span className="text-[10px] text-slate-400">Presets:</span>
                      <button
                        type="button"
                        onClick={() =>
                          setEditingVehicle({ ...editingVehicle, image: '/images/car_innova_crysta.jpg' })
                        }
                        className="px-2 py-0.5 text-[10px] bg-slate-100 hover:bg-slate-200 rounded border border-slate-200"
                      >
                        Innova Crysta
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setEditingVehicle({ ...editingVehicle, image: '/images/car_ertiga_mpv.jpg' })
                        }
                        className="px-2 py-0.5 text-[10px] bg-slate-100 hover:bg-slate-200 rounded border border-slate-200"
                      >
                        Ertiga
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setEditingVehicle({ ...editingVehicle, image: '/images/car_swift_dzire.jpg' })
                        }
                        className="px-2 py-0.5 text-[10px] bg-slate-100 hover:bg-slate-200 rounded border border-slate-200"
                      >
                        Swift Dzire
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setEditingVehicle({ ...editingVehicle, image: '/images/car_tempo_traveller.jpg' })
                        }
                        className="px-2 py-0.5 text-[10px] bg-slate-100 hover:bg-slate-200 rounded border border-slate-200"
                      >
                        Tempo Traveller
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* AC Cooling & Luggage Space */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700">AC / Non-AC Option *</label>
                  <select
                    value={editingVehicle.isAc !== false ? 'AC' : 'Non-AC'}
                    onChange={(e) => {
                      const isAcVal = e.target.value === 'AC';
                      setEditingVehicle({
                        ...editingVehicle,
                        isAc: isAcVal,
                        acType: isAcVal
                          ? (editingVehicle.acType && editingVehicle.acType !== 'Non-AC' ? editingVehicle.acType : 'Air Conditioned')
                          : 'Non-AC',
                      });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs bg-white focus:outline-none focus:border-[#073B35]"
                  >
                    <option value="AC">Air Conditioned (AC)</option>
                    <option value="Non-AC">Non-AC</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700">AC Cooling Details</label>
                  <input
                    type="text"
                    placeholder="e.g. Dual Zone Automatic AC, High-Efficiency AC"
                    value={editingVehicle.acType}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, acType: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:outline-none focus:border-[#073B35]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700">Luggage Capacity</label>
                  <input
                    type="text"
                    placeholder="e.g. 4 Large Bags + 2 Handbags"
                    value={editingVehicle.luggageCapacity}
                    onChange={(e) =>
                      setEditingVehicle({ ...editingVehicle, luggageCapacity: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:outline-none focus:border-[#073B35]"
                  />
                </div>
              </div>

              {/* Rates / Tariff */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700">Tariff per KM</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹18 / km"
                    value={editingVehicle.pricePerKm || ''}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, pricePerKm: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs font-semibold text-[#073B35] focus:outline-none focus:border-[#073B35]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700">Daily Package Rate</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹3,800 / day"
                    value={editingVehicle.dailyRate || ''}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, dailyRate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs font-semibold text-[#073B35] focus:outline-none focus:border-[#073B35]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700">Fuel Type</label>
                  <select
                    value={editingVehicle.fuelType || 'Diesel'}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, fuelType: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs bg-white focus:outline-none focus:border-[#073B35]"
                  >
                    <option value="Diesel">Diesel</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Electric">Electric</option>
                    <option value="CNG">CNG</option>
                  </select>
                </div>
              </div>

              {/* Ideal For */}
              <div>
                <label className="block font-semibold mb-1 text-slate-700">Ideal For / Recommended For</label>
                <input
                  type="text"
                  placeholder="e.g. Family Holidays, Western Ghats Hill Roads, VIP Tours, Airport Transfers"
                  value={editingVehicle.idealFor || ''}
                  onChange={(e) => setEditingVehicle({ ...editingVehicle, idealFor: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:outline-none focus:border-[#073B35]"
                />
              </div>

              {/* Features / Amenities */}
              <div>
                <label className="block font-semibold mb-1 text-slate-700">
                  Included Amenities & Highlights (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Pushback Seats, Chauffeur Driven, GPS Enabled, Mobile Charging Ports, Sanitized Daily"
                  value={editingVehicle.features ? editingVehicle.features.join(', ') : ''}
                  onChange={(e) =>
                    setEditingVehicle({
                      ...editingVehicle,
                      features: e.target.value
                        .split(',')
                        .map((f) => f.trim())
                        .filter(Boolean),
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:outline-none focus:border-[#073B35]"
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={editingVehicle.enabled}
                    onChange={(e) =>
                      setEditingVehicle({ ...editingVehicle, enabled: e.target.checked })
                    }
                    className="rounded border-slate-300 text-[#073B35] focus:ring-[#073B35]"
                  />
                  <span className="font-semibold text-slate-800">
                    Visible on Live Website
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={editingVehicle.featured || false}
                    onChange={(e) =>
                      setEditingVehicle({ ...editingVehicle, featured: e.target.checked })
                    }
                    className="rounded border-slate-300 text-[#DFB257] focus:ring-[#DFB257]"
                  />
                  <span className="font-semibold text-slate-800">
                    Mark as Popular Choice / Featured
                  </span>
                </label>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingVehicle(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={savingVehicle}
                onClick={async () => {
                  if (!editingVehicle.name.trim()) {
                    showToast('Please enter a car/vehicle name.');
                    return;
                  }
                  if (!editingVehicle.seatingCapacity.trim()) {
                    showToast('Please enter seating capacity.');
                    return;
                  }
                  if (!editingVehicle.image.trim()) {
                    showToast('Please upload a car photo.');
                    return;
                  }
                  setSavingVehicle(true);
                  try {
                    if (isNewVehicle) {
                      await addVehicle(editingVehicle);
                      showToast(`${editingVehicle.name} added to your fleet successfully!`);
                    } else {
                      await updateVehicle(editingVehicle);
                      showToast(`${editingVehicle.name} updated successfully!`);
                    }
                    setEditingVehicle(null);
                  } catch (err) {
                    // Keep the form open so nothing the admin typed is lost
                    showToast(err instanceof Error ? err.message : 'Could not save vehicle. Please try again.');
                  } finally {
                    setSavingVehicle(false);
                  }
                }}
                className="px-5 py-2 text-xs font-bold text-white bg-[#073B35] hover:bg-[#0B5D5A] rounded shadow-sm cursor-pointer disabled:opacity-60 disabled:cursor-wait"
              >
                {savingVehicle ? 'Saving…' : 'Save Vehicle'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          EDIT / ADD PACKAGE MODAL
      ======================================================== */}
      {editingPackage && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="px-6 py-4 bg-[#073B35] text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {isNewPackage ? 'Add Tour Package' : 'Edit Tour Package'}
              </h3>
              <button onClick={() => setEditingPackage(null)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Package Title *</label>
                  <input
                    type="text"
                    value={editingPackage.title}
                    onChange={(e) => setEditingPackage({ ...editingPackage, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Destination *</label>
                  <input
                    type="text"
                    value={editingPackage.destination}
                    onChange={(e) => setEditingPackage({ ...editingPackage, destination: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Duration *</label>
                  <input
                    type="text"
                    value={editingPackage.duration}
                    onChange={(e) => setEditingPackage({ ...editingPackage, duration: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <select
                    value={editingPackage.category}
                    onChange={(e) => setEditingPackage({ ...editingPackage, category: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded bg-white"
                  >
                    <option value="FAMILY">FAMILY</option>
                    <option value="COUPLES">COUPLES</option>
                    <option value="ADVENTURE">ADVENTURE</option>
                    <option value="GROUP">GROUP</option>
                    <option value="PILGRIMAGE">PILGRIMAGE</option>
                    <option value="WEEKEND">WEEKEND</option>
                    <option value="PREMIUM">PREMIUM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Overview Description</label>
                <textarea
                  rows={2}
                  value={editingPackage.overview}
                  onChange={(e) => setEditingPackage({ ...editingPackage, overview: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Package Image</label>
                <div className="flex items-center gap-3">
                  <img src={editingPackage.image} alt="" className="w-16 h-12 rounded object-cover border" />
                  <label className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border rounded cursor-pointer">
                    Upload & Compress Image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleFileUpload(e, (dataUrl) =>
                          setEditingPackage({ ...editingPackage, image: dataUrl })
                        )
                      }
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t flex justify-end gap-2">
              <button
                onClick={() => setEditingPackage(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (isNewPackage) {
                    addPackage(editingPackage);
                    showToast('Package added successfully.');
                  } else {
                    updatePackage(editingPackage);
                    showToast('Package updated successfully.');
                  }
                  setEditingPackage(null);
                }}
                className="px-5 py-2 text-xs font-bold text-white bg-[#073B35] hover:bg-[#0B5D5A] rounded shadow-sm"
              >
                Save Package
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          EDIT / ADD DESTINATION MODAL
      ======================================================== */}
      {editingDestination && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="px-6 py-4 bg-[#073B35] text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {isNewDestination ? 'Add Destination' : 'Edit Destination'}
              </h3>
              <button onClick={() => setEditingDestination(null)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Destination Name *</label>
                  <input
                    type="text"
                    value={editingDestination.name}
                    onChange={(e) => setEditingDestination({ ...editingDestination, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Location *</label>
                  <input
                    type="text"
                    value={editingDestination.location}
                    onChange={(e) => setEditingDestination({ ...editingDestination, location: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Category</label>
                <select
                  value={editingDestination.category}
                  onChange={(e) =>
                    setEditingDestination({ ...editingDestination, category: e.target.value as any })
                  }
                  className="w-full px-3 py-2 border rounded bg-white"
                >
                  <option value="Mountains">Mountains</option>
                  <option value="Beaches">Beaches</option>
                  <option value="Forests">Forests</option>
                  <option value="Waterfalls">Waterfalls</option>
                  <option value="Heritage">Heritage</option>
                  <option value="Pilgrimage">Pilgrimage</option>
                  <option value="Wildlife">Wildlife</option>
                  <option value="City Escapes">City Escapes</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingDestination.description}
                  onChange={(e) =>
                    setEditingDestination({ ...editingDestination, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Best Season to Visit</label>
                <input
                  type="text"
                  value={editingDestination.bestSeason}
                  onChange={(e) =>
                    setEditingDestination({ ...editingDestination, bestSeason: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Image</label>
                <div className="flex items-center gap-3">
                  <img src={editingDestination.image} alt="" className="w-16 h-12 rounded object-cover border" />
                  <label className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border rounded cursor-pointer">
                    Upload & Compress Image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleFileUpload(e, (dataUrl) =>
                          setEditingDestination({ ...editingDestination, image: dataUrl })
                        )
                      }
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t flex justify-end gap-2">
              <button
                onClick={() => setEditingDestination(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (isNewDestination) {
                    addDestination(editingDestination);
                    showToast('Destination added.');
                  } else {
                    updateDestination(editingDestination);
                    showToast('Destination updated.');
                  }
                  setEditingDestination(null);
                }}
                className="px-5 py-2 text-xs font-bold text-white bg-[#073B35] hover:bg-[#0B5D5A] rounded shadow-sm"
              >
                Save Destination
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          VIEW ENQUIRY MODAL
      ======================================================== */}
      {viewingEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b mb-4">
              <div>
                <h4 className="font-bold text-sm text-slate-900">{viewingEnquiry.name}</h4>
                <span className="text-[11px] text-slate-400 font-mono">
                  Received: {new Date(viewingEnquiry.createdAt).toLocaleString()}
                </span>
              </div>
              <button onClick={() => setViewingEnquiry(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <p><strong>Phone:</strong> {viewingEnquiry.phone}</p>
              <p><strong>Email:</strong> {viewingEnquiry.email || 'N/A'}</p>
              <p><strong>Destination:</strong> {viewingEnquiry.destination}</p>
              <p><strong>Travel Date:</strong> {viewingEnquiry.travelDate}</p>
              <p><strong>Travellers:</strong> {viewingEnquiry.travellers}</p>
              <p><strong>Travel Type:</strong> {viewingEnquiry.travelType}</p>
              <div className="p-3 bg-slate-50 rounded border">
                <strong>Message:</strong>
                <p className="mt-1 text-slate-600 italic">{viewingEnquiry.message || 'No additional notes.'}</p>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t flex justify-end gap-2">
              <a
                href={`https://wa.me/${viewingEnquiry.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Hi ${viewingEnquiry.name}, thank you for contacting RS Tours & Travels regarding your trip to ${viewingEnquiry.destination}!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#25D366] text-slate-900 font-bold text-xs rounded flex items-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-slate-900" />
                <span>WhatsApp Customer</span>
              </a>
              <button
                onClick={() => setViewingEnquiry(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
