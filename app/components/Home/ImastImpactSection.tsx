"use client";
import React, { useEffect, useRef, useState } from "react";
import * as Icons from "lucide-react";

export default function ImpactSection(props: any) {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [visibleCards, setVisibleCards] = useState<boolean[]>(() =>
    props.data.impacts.map(() => false)
  );
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Intersection observer to reveal cards as they scroll into view
  useEffect(() => {
    if (!containerRef.current) return;
    const cards = Array.from(
      containerRef.current.querySelectorAll("[data-impact-card]")
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idxAttr = entry.target.getAttribute("data-impact-index");
          if (!idxAttr) return;
          const idx = parseInt(idxAttr, 10);
          if (entry.isIntersecting) {
            setVisibleCards((prev) => {
              if (prev[idx]) return prev;
              const copy = [...prev];
              copy[idx] = true;
              return copy;
            });
          }
        });
      },
      { threshold: 0.15 }
    );

    cards.forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, [props.data.impacts]);

  return (
    <section
      className="relative py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-white"
      aria-labelledby="impact-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24 relative z-10">
        <header className="text-center mb-12">
          <p className="text-xl font-semibold text-primary-600 uppercase tracking-wide">
            {props.data.subtitle}
          </p>
          <h2
            id="impact-heading"
            className="mt-2 text-2xl sm:text-3xl font-extrabold text-gray-900"
          >
            {props.data.title}
          </h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            {props.data.description}
          </p>
        </header>

        {/* Cards Grid */}
        <div
          ref={containerRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-6 items-start"
        >
          {props.data.impacts.map((it: any, idx: any) => {
            const revealed = visibleCards[idx];
            return (
              <article
                key={idx}
                data-impact-card
                data-impact-index={String(idx)}
                aria-labelledby={`impact-${idx}-title`}
                className="group relative flex flex-col items-start h-full"
                onMouseEnter={() => setActiveCard(idx)}
                onMouseLeave={() => setActiveCard(null)}
              >
                {/* Animated container: we use inline style for per-card delay */}
                <div
                  style={{
                    transition:
                      "transform 320ms cubic-bezier(.2,.9,.3,1), opacity 320ms",
                    transform: revealed ? "translateY(0)" : "translateY(18px)",
                    opacity: revealed ? 1 : 0,
                    transitionDelay: revealed ? `${idx * 90}ms` : "0ms",
                  }}
                  className="relative w-full h-full"
                >
                  {/* Card Content */}
                  <div
                    className={`relative px-6 py-8 text-white shadow-lg rounded-2xl h-full flex flex-col min-h-[280px] bg-gradient-to-r from-primary-500 to-primary-600`}
                  >
                    {/* Top Badge */}
                    <div className="absolute -top-3 left-6 inline-flex items-center gap-2 bg-white text-slate-900 rounded-full px-4 py-2 shadow-lg">
                      <span className="text-sm font-bold whitespace-nowrap">
                        {it.title}
                      </span>
                    </div>

                    {/* Main content area */}
                    <div className="flex-1 flex flex-col justify-between pt-4">
                      <div className="mb-6">
                        <div className="text-4xl font-black leading-tight mb-2">
                          {it.stat}
                        </div>
                        <div className="text-base font-medium opacity-95">
                          {it.subtitle}
                        </div>
                      </div>

                      {/* Progress bar — expands on hover/focus */}
                      <div
                        className="w-full bg-white/20 rounded-full h-1.5 mb-4 overflow-hidden"
                        aria-hidden
                      >
                        <div
                          style={{
                            width: activeCard === idx ? "100%" : "0%",
                            transition: "width 550ms cubic-bezier(.2,.9,.3,1)",
                          }}
                          className="h-full bg-white rounded-full"
                        />
                      </div>
                    </div>

                    {/* Overlapping image badge */}
                    <div
                      className="absolute right-4 -bottom-5 w-32 h-32 rounded-2xl overflow-hidden bg-white ring-4 ring-white/50 shadow-xl"
                      aria-hidden
                    >
                      <img
                        src={it.imageSrc}
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                  </div>

                  {/* Soft colorful drop shadow under each card */}
                  <div
                    aria-hidden
                    className={`absolute left-2 right-2 -bottom-2 h-3 rounded-full opacity-20 blur-md transition-opacity duration-300 ${
                      activeCard === idx ? "opacity-30" : "opacity-20"
                    }`}
                    style={{
                      background: `linear-gradient(90deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))`,
                    }}
                  />
                </div>

                {/* Link */}
                <a
                  id={`impact-${idx}-title`}
                  href={it.href}
                  className="mt-6 inline-flex items-center gap-2 text-base font-semibold text-slate-800 hover:text-blue-600 transition-colors duration-300"
                >
                  Learn more
                  <Icons.ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
