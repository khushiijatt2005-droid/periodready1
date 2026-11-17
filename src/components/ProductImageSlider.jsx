import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductImageSlider({ images, activeIndexOverride = null, onSlideChange = null }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    if (activeIndexOverride !== null && activeIndexOverride !== currentIndex) {
      goToIndex(activeIndexOverride);
    }
  }, [activeIndexOverride]);

  const goToIndex = (index) => {
    if (!images || images.length === 0) return;
    const targetIdx = Math.max(0, Math.min(index, images.length - 1));
    setCurrentIndex(targetIdx);
    if (onSlideChange) onSlideChange(targetIdx);

    if (containerRef.current) {
      const width = containerRef.current.clientWidth;
      containerRef.current.scrollTo({
        left: width * targetIdx,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollLeft, clientWidth } = containerRef.current;
    if (clientWidth === 0) return;
    const newIndex = Math.round(scrollLeft / clientWidth);
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < images.length) {
      setCurrentIndex(newIndex);
      if (onSlideChange) onSlideChange(newIndex);
    }
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="relative group overflow-hidden rounded-2xl bg-white border border-lavender-border">
      {/* Scrollable Container with Scroll-Snap with explicit height so it never collapses to 0 */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex w-full overflow-x-auto snap-x snap-mandatory hide-scrollbar h-64 sm:h-80 min-h-[250px] items-center bg-gradient-to-b from-[#fff5f8]/60 via-white to-white"
      >
        {images.map((img, idx) => (
          <div
            key={idx}
            className="w-full h-full flex-shrink-0 snap-center relative flex items-center justify-center p-3 sm:p-5 bg-transparent"
          >
            <img
              src={img.url}
              alt={img.alt || `Product Image ${idx + 1}`}
              className="max-h-full max-w-full w-auto h-auto object-contain transition-all duration-300 group-hover:scale-[1.03] drop-shadow-[0_12px_22px_rgba(68,60,130,0.15)]"
              loading={idx === 0 ? "eager" : "lazy"}
              onError={(e) => {
                if (e.target.src.endsWith('.png')) {
                  e.target.src = e.target.src.replace('.png', '.jpg');
                }
              }}
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows (Visible when multiple images exist) */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToIndex(currentIndex - 1);
            }}
            disabled={currentIndex === 0}
            aria-label="Previous Slide"
            className={`absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center text-slate-700 transition-all ${
              currentIndex === 0 
                ? 'opacity-0 cursor-default' 
                : 'opacity-80 group-hover:opacity-100 hover:bg-white hover:scale-105 active:scale-95'
            }`}
          >
            <ChevronLeft className="w-5 h-5 text-indigo" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              goToIndex(currentIndex + 1);
            }}
            disabled={currentIndex === images.length - 1}
            aria-label="Next Slide"
            className={`absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center text-slate-700 transition-all ${
              currentIndex === images.length - 1 
                ? 'opacity-0 cursor-default' 
                : 'opacity-80 group-hover:opacity-100 hover:bg-white hover:scale-105 active:scale-95'
            }`}
          >
            <ChevronRight className="w-5 h-5 text-indigo" />
          </button>

          {/* Dot Indicators */}
          <div className="absolute bottom-2.5 left-0 right-0 flex justify-center items-center gap-1.5 z-10">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  goToIndex(idx);
                }}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all rounded-full ${
                  currentIndex === idx
                    ? 'w-6 h-2 bg-indigo'
                    : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
