import React from 'react';

// Peacock Feather SVG
export function PeacockFeatherSvg({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 64 64" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      aria-label="ময়ূরের পাখা"
    >
      <path d="M10 58C22 46 36 30 52 8" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M48 12C36 15 26 26 20 40C27 36 38 31 48 12Z" fill="#059669" opacity="0.9" />
      <path d="M52 8C48 22 42 34 28 46C35 39 46 30 52 8Z" fill="#047857" opacity="0.9" />
      <path d="M42 16L32 20M46 20L36 26M50 24L40 32" stroke="#10b981" strokeWidth="1" strokeLinecap="round" opacity="0.75" />
      <ellipse cx="41" cy="21" rx="11" ry="13" transform="rotate(32 41 21)" fill="#f59e0b" opacity="0.9" />
      <ellipse cx="41" cy="21" rx="8.5" ry="10.5" transform="rotate(32 41 21)" fill="#06b6d4" />
      <ellipse cx="41" cy="21" rx="5.5" ry="7" transform="rotate(32 41 21)" fill="#1e3a8a" />
      <ellipse cx="41" cy="21" rx="2.5" ry="3.2" transform="rotate(32 41 21)" fill="#fbbf24" />
    </svg>
  );
}

// Crimson Lotus SVG (লাল পদ্ম)
export function LotusSvg({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 64 64" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      aria-label="লাল পদ্ম"
    >
      {/* Green pad leaf */}
      <ellipse cx="32" cy="52" rx="24" ry="7" fill="#047857" opacity="0.8" />
      <path d="M22 52C27 50 37 50 42 52" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
      {/* Outer Lotus petals */}
      <path d="M32 50C20 46 12 36 14 26C18 36 26 44 32 50Z" fill="#be123c" />
      <path d="M32 50C44 46 52 36 50 26C46 36 38 44 32 50Z" fill="#be123c" />
      {/* Mid petals */}
      <path d="M32 50C24 42 18 30 22 18C28 28 30 40 32 50Z" fill="#e11d48" />
      <path d="M32 50C40 42 46 30 42 18C36 28 34 40 32 50Z" fill="#e11d48" />
      {/* Center glowing bud petal */}
      <path d="M32 48C28 38 28 24 32 12C36 24 36 38 32 48Z" fill="#fb7185" />
      {/* Golden core pollen */}
      <circle cx="32" cy="34" r="3" fill="#fbbf24" />
      <circle cx="30.5" cy="32" r="1.5" fill="#fef08a" />
      <circle cx="33.5" cy="32" r="1.5" fill="#fef08a" />
    </svg>
  );
}

// Vintage Postal Runner SVG (ডাকহরকরা / রানার)
export function RunnerSvg({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 64 64" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      aria-label="ডাকহরকরা"
    >
      {/* Night Moon glow */}
      <circle cx="48" cy="16" r="10" fill="#fef08a" opacity="0.35" />
      <circle cx="48" cy="16" r="7" fill="#fef3c7" opacity="0.8" />
      {/* Runner Stick with bell/harpoon top */}
      <line x1="14" y1="12" x2="38" y2="52" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
      {/* Hanging Lantern with glowing flame */}
      <line x1="18" y1="18" x2="16" y2="24" stroke="#d97706" strokeWidth="1.5" />
      <rect x="12" y="24" width="8" height="11" rx="2" fill="#b45309" stroke="#78350f" strokeWidth="1" />
      <circle cx="16" cy="29" r="3" fill="#fbbf24" />
      <circle cx="16" cy="29" r="1.5" fill="#ffffff" />
      {/* Running Postal Messenger Silhouette */}
      {/* Head with Turban */}
      <circle cx="34" cy="20" r="5" fill="#9a3412" />
      <path d="M30 18C30 15 38 15 39 18C38 21 31 21 30 18Z" fill="#ea580c" />
      {/* Torso & dynamic stride */}
      <path d="M33 25L30 36L22 45M30 36L38 43L46 48M34 26L42 32M32 27L22 24" stroke="#9a3412" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {/* Mail Bag on Back */}
      <rect x="25" y="25" width="8" height="9" rx="2" fill="#78350f" stroke="#451a03" strokeWidth="1" transform="rotate(-15 25 25)" />
      <path d="M25 28L31 32" stroke="#d97706" strokeWidth="1" />
    </svg>
  );
}

// Realistic Golden Paperclip SVG (সোনার ক্লিপ)
export function GoldenPaperClipSvg({ className = "w-6 h-12" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 28 60" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      aria-label="পেপার ক্লিপ"
    >
      <defs>
        <filter id="clipShadow" x="-20%" y="-10%" width="150%" height="130%" filterUnits="userSpaceOnUse">
          <feDropShadow dx="1.5" dy="2.5" stdDeviation="1.5" floodColor="#451a03" floodOpacity="0.45" />
        </filter>
        <linearGradient id="goldMetallic" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="35%" stopColor="#eab308" />
          <stop offset="65%" stopColor="#ca8a04" />
          <stop offset="85%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#a16207" />
        </linearGradient>
      </defs>
      {/* Paperclip wire path */}
      <path 
        d="M9 16V45C9 50 13 54 18 54C23 54 27 50 27 45V14C27 7.5 21.5 2 15 2C8.5 2 3 7.5 3 14V46C3 47.5 4.5 49 6 49C7.5 49 9 47.5 9 46V18" 
        stroke="url(#goldMetallic)" 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        filter="url(#clipShadow)"
      />
      {/* Subtle metallic shine highlight */}
      <path 
        d="M15 3C20.5 3 25.5 7.5 25.5 13.5V36" 
        stroke="#ffffff" 
        strokeWidth="1" 
        strokeLinecap="round" 
        opacity="0.65" 
      />
    </svg>
  );
}

// Dried Rose SVG (শুকনো গোলাপ)
export function DriedRoseSvg({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Stem & sepals */}
      <path d="M30 60C31 48 30 38 32 30" stroke="#5f5647" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M30 46C24 44 20 40 18 36" stroke="#5f5647" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M31 40C37 38 42 34 44 30" stroke="#5f5647" strokeWidth="1.5" strokeLinecap="round" />
      {/* Dried crimson rose petals */}
      <ellipse cx="32" cy="24" rx="14" ry="12" fill="#881337" opacity="0.9" />
      <path d="M22 22C24 14 38 12 42 20C40 28 26 28 22 22Z" fill="#9f1239" />
      <path d="M26 18C28 12 36 12 38 16C36 22 28 22 26 18Z" fill="#be123c" />
      <path d="M29 16C30 13 34 13 35 15C34 18 30 18 29 16Z" fill="#fda4af" opacity="0.8" />
    </svg>
  );
}

// Jasmine / Beli Flower SVG (বেলি ফুল)
export function JasmineSvg({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Leaves */}
      <ellipse cx="22" cy="42" rx="10" ry="5" transform="rotate(-30 22 42)" fill="#166534" opacity="0.8" />
      <ellipse cx="42" cy="42" rx="10" ry="5" transform="rotate(30 42 42)" fill="#15803d" opacity="0.8" />
      {/* Star/circle overlapping white jasmine petals */}
      <circle cx="32" cy="28" r="7" fill="#ffffff" stroke="#fef08a" strokeWidth="1" />
      <ellipse cx="32" cy="18" rx="5" ry="8" fill="#fdfbf7" stroke="#fef08a" strokeWidth="0.8" />
      <ellipse cx="32" cy="38" rx="5" ry="8" fill="#fdfbf7" stroke="#fef08a" strokeWidth="0.8" />
      <ellipse cx="22" cy="28" rx="8" ry="5" fill="#fdfbf7" stroke="#fef08a" strokeWidth="0.8" />
      <ellipse cx="42" cy="28" rx="8" ry="5" fill="#fdfbf7" stroke="#fef08a" strokeWidth="0.8" />
      {/* Delicate golden center */}
      <circle cx="32" cy="28" r="3.5" fill="#facc15" />
      <circle cx="32" cy="28" r="1.5" fill="#eab308" />
    </svg>
  );
}
