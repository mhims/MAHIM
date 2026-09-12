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

  const logoUrl =
    src ||
    settings?.logoUrl ||
    'https://res.cloudinary.com/drvyjj7td/image/upload/v1789236304/mahims.com-Logo_ezjh1b.png';

  const sizeClasses = {
    sm: 'w-9 h-9',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  return (
    <div className={`relative group flex items-center justify-center shrink-0 ${className}`}>
      {/* Subtle warm amber ambient glow on hover */}
      <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 via-amber-400/35 to-amber-600/20 rounded-full blur-md opacity-40 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Circular Emblem Frame */}
      <div
        className={`relative ${sizeClasses[size]} rounded-full bg-white dark:bg-zinc-900 border border-amber-500/30 group-hover:border-amber-400/80 shadow-md group-hover:shadow-amber-500/20 transition-all duration-300 flex items-center justify-center overflow-hidden p-0.5`}
      >
        {!imageFailed && logoUrl ? (
          <img
            src={logoUrl}
            alt="Mahim's World Logo"
            onError={() => setImageFailed(true)}
            className="w-full h-full object-contain rounded-full transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <img
            src="/logo.png"
            alt="Mahim's World Logo"
            className="w-full h-full object-contain rounded-full"
          />
        )}
      </div>
    </div>
  );
};

