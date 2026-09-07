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
          /* Minimalist Vector Monogram "M" for Mahim fallback */
          <svg
            viewBox="0 0 32 32"
            className="w-5/6 h-5/6 transition-transform duration-300 group-hover:scale-105"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="minimalGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="40%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
            </defs>

            {/* Clean architectural Monogram lines */}
            <path
              d="M7 23V9L11 9V23H7Z"
              fill="url(#minimalGoldGrad)"
            />
            <path
              d="M21 23V9L25 9V23H21Z"
              fill="url(#minimalGoldGrad)"
            />
            <path
              d="M11 9L16 16.5L21 9H17.8L16 12L14.2 9H11Z"
              fill="#FFFFFF"
            />
            <circle
              cx="16"
              cy="19"
              r="1.75"
              fill="#F59E0B"
            />
          </svg>
        )}
      </div>
    </div>
  );
};

