import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { navigateTo } from '../utils/navigation';
import { HomeTopSlide, INITIAL_TOP_SLIDES, getStoredTopSlides } from '../data/topSlides';

export type { HomeTopSlide };
export const HOME_TOP_SLIDES = INITIAL_TOP_SLIDES;

export const HomeTopBannerSlider: React.FC = () => {
  const [slides, setSlides] = useState<HomeTopSlide[]>(() => getStoredTopSlides());
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    const loaded = getStoredTopSlides();
    setSlides(loaded);

    // Preload banner images to prevent any flash or lag
    loaded.forEach((slide) => {
      const img = new Image();
      img.src = slide.image;
    });

    if (loaded.length === 0) return;

    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % loaded.length);
    }, 3200);

    return () => clearInterval(timer);
  }, []);

  const currentSlide = slides[currentSlideIndex] || slides[0] || INITIAL_TOP_SLIDES[0];

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
        title={`${currentSlide.title} — ভিজিট করতে ক্লিক করুন`}
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
