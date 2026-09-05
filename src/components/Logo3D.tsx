import React from 'react';

interface Logo3DProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Logo3D: React.FC<Logo3DProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-9 h-9 text-lg',
    md: 'w-11 h-11 text-xl',
    lg: 'w-14 h-14 text-2xl',
  };

  return (
    <div className={`relative group perspective-1000 ${className}`}>
      {/* Dynamic 3D ambient glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-amber-400 to-cyan-500 rounded-2xl blur-md opacity-40 group-hover:opacity-85 transition-opacity duration-500 group-hover:animate-pulse"></div>

      {/* 3D Main Beveled Cube */}
      <div className={`relative ${sizeClasses[size]} rounded-2xl bg-gradient-to-br from-zinc-900 via-black to-zinc-950 border border-white/25 shadow-2xl flex items-center justify-center transform group-hover:rotate-y-12 group-hover:-rotate-x-12 group-hover:scale-105 transition-all duration-300 preserve-3d overflow-hidden`}>
        {/* Specular gloss streak */}
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none rounded-t-xl" />
        
        {/* Diagonal metallic light reflection */}
        <div className="absolute -inset-full bg-gradient-to-tr from-transparent via-white/15 to-transparent transform -rotate-45 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />

        {/* 3D Stylized Monogram M */}
        <svg 
          viewBox="0 0 40 40" 
          className="w-3/4 h-3/4 drop-shadow-[0_2px_8px_rgba(255,255,255,0.4)] transition-transform duration-300 group-hover:scale-110"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="logoGradGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="35%" stopColor="#f59e0b" />
              <stop offset="70%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
            <filter id="glow3d" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000" floodOpacity="0.8" />
            </filter>
          </defs>
          
          {/* 3D Faceted "M" polygon path */}
          <path 
            d="M8 32V9L15 17L20 11L25 17L32 9V32H27V17L22 23L20 20.5L18 23L13 17V32H8Z" 
            fill="url(#logoGradGold)"
            filter="url(#glow3d)"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="0.75"
          />
          {/* Subtle neon dot */}
          <circle cx="20" cy="11" r="1.5" fill="#ffffff" className="animate-ping" style={{ animationDuration: '3s' }} />
        </svg>

        {/* Bottom edge shadow */}
        <div className="absolute bottom-0 inset-x-0 h-1 bg-black/60" />
      </div>
    </div>
  );
};
