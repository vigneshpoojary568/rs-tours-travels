import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'auto';
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  customLogoUrl?: string;
  badgeStyle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  variant = 'auto',
  showTagline = true,
  size = 'md',
  customLogoUrl = '/logo/rs_tours_official_logo.jpg',
  badgeStyle = false,
}) => {
  // Normalize URL in case old localStorage or stale data is passed
  const resolvedLogoUrl =
    !customLogoUrl || customLogoUrl.includes('rs_tours_official_logo')
      ? '/logo/rs_tours_official_logo.jpg'
      : customLogoUrl;

  // Dimension classes preserving exact original proportions without distortion
  const imgHeightClass =
    size === 'sm'
      ? 'h-10 sm:h-11'
      : size === 'md'
      ? 'h-13 sm:h-14'
      : size === 'lg'
      ? 'h-20 sm:h-24'
      : 'h-28 sm:h-36';

  const badgeWrapperClass =
    badgeStyle || variant === 'light'
      ? 'bg-[#F7F3EA] p-1 sm:p-1.5 rounded-xl shadow-md border border-[#DFB257]/40'
      : '';

  return (
    <div className={`inline-flex items-center gap-3.5 group select-none ${className}`}>
      {/* Official RS Tours & Travels Logo Image */}
      <div className={`relative shrink-0 transition-transform duration-300 group-hover:scale-105 ${badgeWrapperClass}`}>
        <img
          src={resolvedLogoUrl}
          alt="RS Tours & Travels Official Logo"
          referrerPolicy="no-referrer"
          onError={(e) => {
            const target = e.currentTarget;
            if (target.src.indexOf('/images/rs_tours_official_logo.jpg') === -1) {
              target.src = '/images/rs_tours_official_logo.jpg';
            }
          }}
          className={`${imgHeightClass} w-auto object-contain block`}
        />
      </div>

      {/* Optional Companion Typography Lockup */}
      {showTagline && size !== 'lg' && size !== 'xl' && (
        <div className="hidden sm:flex flex-col">
          <span
            className={`font-brand tracking-[0.16em] font-extrabold uppercase transition-colors ${
              variant === 'light' ? 'text-white' : 'text-[#073B35]'
            } ${
              size === 'sm' ? 'text-sm' : 'text-base lg:text-lg'
            }`}
          >
            RS TOURS & TRAVELS
          </span>
          <span
            className={`font-serif italic text-xs tracking-wider transition-colors ${
              variant === 'light' ? 'text-[#DFB257]' : 'text-[#9F751E]'
            }`}
          >
            “Not just a trip… it’s a story”
          </span>
        </div>
      )}
    </div>
  );
};
