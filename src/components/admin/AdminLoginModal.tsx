import React, { useState } from 'react';
import { useContent } from '../../context/ContentContext';
import { Lock, Eye, EyeOff, ShieldCheck, X, AlertCircle } from 'lucide-react';

export const AdminLoginModal: React.FC = () => {
  const {
    showAdminLoginModal,
    setShowAdminLoginModal,
    adminLogin,
  } = useContent();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!showAdminLoginModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      setError('Please provide both username/email and password.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await adminLogin(identifier, password);
      if (!res.success) {
        setError(res.error || 'Authentication failed. Please verify credentials.');
      } else {
        // Reset form
        setPassword('');
      }
    } catch {
      setError('An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="px-6 py-5 bg-[#0B192C] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold">
                RS Tours & Travels
              </h3>
              <p className="text-[11px] text-amber-400 tracking-wider uppercase font-mono font-semibold">
                Developer & Admin Access
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setShowAdminLoginModal(false);
              setError('');
              if (window.location.hash === '#admin') {
                window.history.replaceState(null, '', window.location.pathname + window.location.search);
              }
            }}
            className="p-1.5 text-white/70 hover:text-white rounded-md hover:bg-white/10"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Email / Username
            </label>
            <input
              type="text"
              required
              autoFocus
              autoComplete="username"
              placeholder="e.g. admin@rstours.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#073B35] bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-3.5 pr-10 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#073B35] bg-slate-50/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#0B192C] hover:bg-[#1E293B] text-white font-bold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Login to Dashboard</span>
                </>
              )}
            </button>
          </div>

          {/* Secure Hint */}
          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 leading-normal">
            <p className="text-slate-400 mb-1">
              Authorized access only. All actions are logged.
            </p>
            <div className="p-2.5 rounded-lg bg-slate-50 text-slate-600 border border-slate-200">
              <span className="font-semibold text-[#0B192C]">Initial Credentials:</span>{' '}
              <code className="text-slate-800 font-mono">admin@rstours.com</code> /{' '}
              <code className="text-slate-800 font-mono">RSTravels@2026!</code>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};
