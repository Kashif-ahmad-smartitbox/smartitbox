"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Item = {
  id?: string | number;
  title: string;
  image: string;
  alt?: string;
};

type Data = {
  title?: string;
  subtitle?: string;
  items: Item[];
  bgColor?: string;
  cardBg?: string;
  cardRadius?: string;
  showDots?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
};

interface VerticalsCarouselProps {
  data: Data;
}

export default function VerticalsCarousel({ data }: VerticalsCarouselProps) {
  const {
    title = "Diverse Solutions for Retail Verticals",
    subtitle = "SMARTITBOX Retail Point caters to a multitude of retail sectors with its range of POS software solutions, tailored to single or multi-store licenses across various industries.",
    items = [],
    bgColor = "#b73e96",
    cardBg = "#ffffff",
    cardRadius = "24px",
    showDots = false,
    autoPlay = true,
    autoPlayInterval = 3000,
  } = data;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const visibleCount = 4;
  const maxIndex = Math.max(0, items.length - visibleCount);

  // Auto scroll effect
  useEffect(() => {
    if (!autoPlay || isPaused || items.length <= visibleCount) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        if (prevIndex >= maxIndex) {
          return 0; // Loop back to start
        }
        return prevIndex + 1;
      });
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [
    autoPlay,
    isPaused,
    items.length,
    visibleCount,
    maxIndex,
    autoPlayInterval,
  ]);

  const prevSlide = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const nextSlide = () => setCurrentIndex((i) => Math.min(maxIndex, i + 1));

  // Enhanced wave effect with smooth transitions
  const getCardStyle = (index: number) => {
    const isVisible =
      index >= currentIndex && index < currentIndex + visibleCount;
    const positionInView = index - currentIndex;

    // Staggered vertical offsets for wave effect
    const verticalOffsets = [0, -20, 0, -20];
    const verticalOffset = verticalOffsets[positionInView] || 0;

    // Scale effect for cards in view
    const scale = isVisible ? 1 : 0.85;
    const opacity = isVisible ? 1 : 0.4;

    return {
      transform: `translateY(${verticalOffset}px) scale(${scale})`,
      opacity,
    };
  };

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  if (!items.length) {
    return (
      <div className="min-h-[600px] flex items-center justify-center bg-gray-900">
        <div className="text-white text-center">
          <div className="text-2xl font-bold mb-4">No items to display</div>
          <p className="text-gray-400">Please add items to the carousel</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <section
        className="w-full max-w-[1600px] py-20 px-8 relative overflow-hidden"
        style={{
          background: bgColor,
        }}
      >
        <div className="max-w-6xl mx-auto text-center text-white mb-16 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-6">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="text-sm font-semibold uppercase tracking-wide">
              Retail Solutions
            </span>
          </div>

          <h2 className="text-3xl lg:text-4xl font-bold leading-tight mb-4">
            {title}
          </h2>

          {subtitle && (
            <p className="text-sm lg:text-lg opacity-95 leading-relaxed max-w-3xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        <div
          className="max-w-7xl mx-auto relative px-4"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Carousel Grid Background */}
          <div className="absolute inset-0 -z-10 opacity-5">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `linear--linear(to right, white 1px, transparent 1px),
                                 linear--linear(to bottom, white 1px, transparent 1px)`,
                backgroundSize: "25px 25px",
              }}
            />
          </div>

          <div className="overflow-visible relative z-10">
            <div
              className="flex gap-6 transition-transform duration-700 ease-out items-end"
              style={{
                transform: `translateX(calc(-${
                  currentIndex * (100 / visibleCount)
                }% - ${currentIndex * 1.5}rem))`,
              }}
            >
              {items.map((item, index) => (
                <div
                  key={item.id ?? index}
                  className="shrink-0 transition-all duration-500 ease-out"
                  style={{
                    width: `calc(${100 / visibleCount}% - ${
                      ((visibleCount - 1) * 1.5) / visibleCount
                    }rem)`,
                    ...getCardStyle(index),
                  }}
                >
                  <div
                    className="overflow-hidden shadow-2xl h-full group cursor-pointer hover:scale-105 transition-transform duration-300"
                    style={{
                      background: cardBg,
                      borderRadius: cardRadius,
                      border: "4px solid rgba(255, 255, 255, 0.95)",
                    }}
                  >
                    <div className="relative w-full pb-[75%] overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.alt ?? item.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg--linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Title overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg--linear-to-t from-black/80 to-transparent transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <div className="text-lg font-bold text-white text-center">
                          {item.title}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="mt-16 flex items-center justify-center gap-8 relative z-10">
            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white flex items-center justify-center transition-all duration-300 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 border border-white/20"
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Dots Indicator */}
            {showDots && items.length > visibleCount && (
              <div className="flex items-center gap-3 backdrop-blur-sm bg-white/10 rounded-full px-4 py-2 border border-white/20">
                {Array.from({ length: maxIndex + 1 }).map((_, dotIndex) => (
                  <button
                    key={dotIndex}
                    onClick={() => setCurrentIndex(dotIndex)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      dotIndex === currentIndex
                        ? "bg-white scale-125"
                        : "bg-white/40 hover:bg-white/60"
                    }`}
                    aria-label={`Go to slide ${dotIndex + 1}`}
                  />
                ))}
              </div>
            )}

            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white flex items-center justify-center transition-all duration-300 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 border border-white/20"
              disabled={currentIndex === maxIndex}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Slide counter */}
          <div className="text-center mt-6 relative z-10">
            <span className="text-white/70 text-sm font-medium backdrop-blur-sm bg-white/10 rounded-full px-3 py-1 border border-white/20">
              {currentIndex + 1} of {maxIndex + 1}
            </span>
          </div>
        </div>

        <style jsx>{`
          @keyframes blob {
            0% {
              transform: translate(0px, 0px) scale(1);
            }
            33% {
              transform: translate(30px, -50px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
            100% {
              transform: translate(0px, 0px) scale(1);
            }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }

          @media (prefers-reduced-motion: reduce) {
            .animate-blob {
              animation: none;
            }
          }
        `}</style>
      </section>
    </div>
  );
}
