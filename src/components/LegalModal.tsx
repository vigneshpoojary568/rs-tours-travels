import React from 'react';
import { X, ShieldCheck, FileText } from 'lucide-react';

interface LegalModalProps {
  type: 'privacy' | 'terms';
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white text-slate-800 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#073B35] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            {type === 'privacy' ? (
              <ShieldCheck className="w-5 h-5 text-[#DFB257]" />
            ) : (
              <FileText className="w-5 h-5 text-[#DFB257]" />
            )}
            <h3 className="font-serif text-lg font-bold">
              {type === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-white/80 hover:text-white rounded-md hover:bg-white/10"
            aria-label="Close legal modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
          {type === 'privacy' ? (
            <>
              <h4 className="font-bold text-slate-900 text-sm">1. Commitment to Privacy</h4>
              <p>
                At RS Tours & Travels, we respect your privacy. Any personal information you provide (name, phone number, email, travel preferences) is used strictly to communicate regarding your tour bookings, customize itineraries, and ensure safe travel operations.
              </p>

              <h4 className="font-bold text-slate-900 text-sm">2. Information We Collect</h4>
              <p>
                We only collect information voluntarily provided by you through our travel enquiry forms, direct WhatsApp communication, or phone calls. We do not sell, rent, or trade your contact details to third-party telemarketers or advertisers.
              </p>

              <h4 className="font-bold text-slate-900 text-sm">3. Communication & WhatsApp</h4>
              <p>
                When you enquire via WhatsApp or phone (+91 96204 52241), you consent to receiving tour quotes, itinerary updates, and chauffeur details directly related to your trip.
              </p>

              <h4 className="font-bold text-slate-900 text-sm">4. Data Security</h4>
              <p>
                We maintain appropriate security practices to ensure your travel details and personal communications remain confidential between you and RS Tours & Travels.
              </p>
            </>
          ) : (
            <>
              <h4 className="font-bold text-slate-900 text-sm">1. Tour Booking & Itinerary Confirmation</h4>
              <p>
                All tour packages, dates, vehicle allocations, and accommodations are finalized upon mutual agreement between the client and RS Tours & Travels. Customized quotes are provided transparently based on route, fuel, toll, and stay rates.
              </p>

              <h4 className="font-bold text-slate-900 text-sm">2. Flexible Scheduling & Road Safety</h4>
              <p>
                Your safety is our highest priority. In the event of extreme weather, landslides on mountain roads, forest department restrictions, or unforeseen highway delays, our experienced chauffeurs and coordinators may adjust routes or timing in consultation with you.
              </p>

              <h4 className="font-bold text-slate-900 text-sm">3. Transparent Inclusions</h4>
              <p>
                All confirmed inclusions (such as driver allowances, fuel, tolls, parking, and specific room bookings) are explicitly documented in your trip confirmation to ensure zero surprise costs on the road.
              </p>

              <h4 className="font-bold text-slate-900 text-sm">4. Guest Responsibilities</h4>
              <p>
                Guests are kindly requested to carry valid government photo identification required for hotel check-ins, forest checkposts, or temple darshans.
              </p>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#073B35] text-white text-xs font-semibold rounded-md hover:bg-[#0B5D5A] transition-colors"
          >
            I Understand
          </button>
        </div>

      </div>
    </div>
  );
};
