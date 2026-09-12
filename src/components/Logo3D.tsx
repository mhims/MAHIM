import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';

interface Logo3DProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  src?: string;
}

export const Logo3D: React.FC<Logo3DProps> = ({ size = 'md', className = '', src }) => {
  const { settings } = useSite();
  const [imageFailed, setImageFailed] = useState(false);

  const logoUrl = src || settings?.logoUrl || '/logo.png';

  const sizeClasses = {
    sm: 'w-9 h-9',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  return (
    <div className={`relative group flex items-center justify-center shrink-0 ${className}`}>
      {/* Subtle warm amber ambient glow on hover */}
      <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/25 via-amber-400/45 to-amber-600/25 rounded-2xl blur-md opacity-40 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Luxury Matte Black & Gold Emblem Frame */}
      <div
        className={`relative ${sizeClasses[size]} rounded-xl sm:rounded-2xl bg-zinc-950 border border-amber-500/40 group-hover:border-amber-400/80 shadow-md group-hover:shadow-amber-500/20 transition-all duration-300 flex items-center justify-center overflow-hidden`}
      >
        {/* Subtle diagonal sheen */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.08] to-transparent pointer-events-none z-10" />

        {!imageFailed && logoUrl ? (
          <img
            src={logoUrl}
            alt="Mahim Logo"
            onError={() => setImageFailed(true)}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          /* Minimalist Vector Monogram "M" for Mahim */
          <svg
            viewBox="0 0 100 100"
            className="w-4/5 h-4/5 transition-transform duration-300 group-hover:scale-105"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="logo3dGoldLight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="35%" stopColor="#FDE047" />
                <stop offset="70%" stopColor="#EAB308" />
                <stop offset="100%" stopColor="#CA8A04" />
              </linearGradient>
              <linearGradient id="logo3dGoldMid" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FACC15" />
                <stop offset="50%" stopColor="#EAB308" />
                <stop offset="100%" stopColor="#A16207" />
              </linearGradient>
              <linearGradient id="logo3dGoldDeep" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#EAB308" />
                <stop offset="50%" stopColor="#B45309" />
                <stop offset="100%" stopColor="#78350F" />
              </linearGradient>
            </defs>

            {/* Precision Chiseled M Monogram */}
            <polygon points="12,84 12,22 27,22 27,84" fill="url(#logo3dGoldMid)" />
            <polygon points="12,22 16,22 16,84 12,84" fill="#FFFFFF" opacity="0.8" />
            <polygon points="73,84 73,22 88,22 88,84" fill="url(#logo3dGoldDeep)" />
            <polygon points="73,22 76,22 76,84 73,84" fill="#FEF08A" opacity="0.4" />
            <polygon points="27,22 50,58 50,76 27,39" fill="url(#logo3dGoldLight)" />
            <line x1="27" y1="22" x2="50" y2="58" stroke="#FFFFFF" strokeWidth="1.5" />
            <polygon points="73,22 50,58 50,76 73,39" fill="url(#logo3dGoldDeep)" />
            <polygon points="50,48 56,58 50,68 44,58" fill="url(#logo3dGoldMid)" />
            <polygon points="50,15 53,20 50,24 47,20" fill="url(#logo3dGoldLight)" />
          </svg>
        )}
      </div>
    </div>
  );
};

