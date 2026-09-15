import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { navigateTo } from '../utils/navigation';

export interface HomeTopSlide {
  id: string;
  image: string;
  link: string;
  path: string;
  title: string;
  badgeText: string;
}

export const HOME_TOP_SLIDES: HomeTopSlide[] = [
  {
    id: 'classroom',
    image: 'https://res.cloudinary.com/drvyjj7td/image/upload/v1789445668/MAHIMSCLASSROOM_idmxpd.png',
    link: 'https://mahims.com/classroom',
    path: '/classroom',
    title: "Mahim's Classroom (মাহিম'স ক্লাসরুম)",
    badgeText: 'mahims.com/classroom',
  },
  {
    id: 'portfolio',
    image: 'https://res.cloudinary.com/drvyjj7td/image/upload/v1789448181/portfoliomahim_uulfa0.jpg',
    link: 'https://mahims.com/portfolio',
    path: '/portfolio',
    title: "Mahim's Portfolio (মাহিম'স পোর্টফোলিও)",
    badgeText: 'mahims.com/portfolio',
  },
  {
    id: 'chithi',
    image: 'https://res.cloudinary.com/drvyjj7td/image/upload/v1789445680/MAHIM_CHITHI_xxkl9p.png',
    link: 'https://mahims.com/chithi',
    path: '/chithi',
    title: "Mahim's Chithi (চিঠি ও ভাবনা)",
    badgeText: 'mahims.com/chithi',
  },
];

export const HomeTopBannerSlider: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Auto-advance slides every 3.2 seconds (3200ms) as requested
  useEffect(() => {
    // Preload all 3 banner images to prevent any white flash or lag during sliding
    HOME_TOP_SLIDES.forEach((slide) => {
      const img = new Image();
      img.src = slide.image;
    });

    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % HOME_TOP_SLIDES.length);
    }, 3200);

    return () => clearInterval(timer);
  }, []);

  const currentSlide = HOME_TOP_SLIDES[currentSlideIndex];

  const handleSlideClick = (e: React.MouseEvent) => {
    navigateTo(currentSlide.path, e);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-20 max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-28 pb-2 sm:pb-4"
    >
      <div
        onClick={handleSlideClick}
        id="home-top-carousel-banner"
        className="relative group p-[3px] rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 active:scale-[0.99] orange-pulsing-glow shadow-xl shadow-orange-500/10"
        title={`${currentSlide.title} — ভিজিট করতে ক্লিক করুন (${currentSlide.badgeText})`}
      >
        {/* Traveling Orange Light Beam traveling continuously around the border (Classroom style) */}
        <div className="absolute inset-[-150%] animate-spin-slow bg-[conic-gradient(from_0deg,transparent_0_300deg,#ea580c_320deg,#f97316_340deg,#fbbf24_355deg,#fff7ed_360deg)] pointer-events-none" />

        {/* Inner container keeping the images clean, sharp and uncropped (2170 / 725 natural ratio) */}
        <div className="relative w-full aspect-[2170/725] rounded-[13px] sm:rounded-[21px] overflow-hidden bg-zinc-950 select-none">
          {/* Slider Images with Ambient Fill & Crisp Uncropped Banner */}
          {HOME_TOP_SLIDES.map((slide, idx) => {
            const isActive = idx === currentSlideIndex;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 w-full h-full flex items-center justify-center transition-opacity duration-500 ease-in-out ${
                  isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                {/* Ambient blurred backdrop for seamless edge harmony */}
                <img
                  src={slide.image}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 opacity-35"
                />
                {/* 100% Uncropped Full Banner */}
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="relative z-10 w-full h-full object-contain"
                  loading={idx === 0 ? 'eager' : 'lazy'}
                />
              </div>
            );
          })}

          {/* Quick Destination Pill Tag at Top Right */}
          <div className="absolute top-2.5 sm:top-3.5 right-2.5 sm:right-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 group-hover:bg-black/80 backdrop-blur-md border border-white/20 text-white text-[11px] sm:text-xs font-bold font-['Hind_Siliguri',sans-serif] transition-all shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            <span>{currentSlide.badgeText}</span>
            <ExternalLink size={12} className="text-orange-400 group-hover:translate-x-0.5 transition-transform" />
          </div>

          {/* Minimal Slide Indicator Dots (Clickable to switch slides) */}
          <div className="absolute bottom-2 sm:bottom-3.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/15">
            {HOME_TOP_SLIDES.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlideIndex(idx);
                }}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentSlideIndex
                    ? 'w-6 bg-orange-500 shadow-xs shadow-orange-500/80'
                    : 'w-1.5 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>

          {/* Navigation Arrows for convenient manual navigation */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentSlideIndex((prev) => (prev - 1 + HOME_TOP_SLIDES.length) % HOME_TOP_SLIDES.length);
            }}
            className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/40 hover:bg-black/75 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-xs border border-white/10 cursor-pointer"
            aria-label="Previous slide"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentSlideIndex((prev) => (prev + 1) % HOME_TOP_SLIDES.length);
            }}
            className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/40 hover:bg-black/75 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-xs border border-white/10 cursor-pointer"
            aria-label="Next slide"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
