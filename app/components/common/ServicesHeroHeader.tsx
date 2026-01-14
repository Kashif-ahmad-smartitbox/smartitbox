"use client";

import React from "react";
import { ArrowRight } from "lucide-react";

type Button = {
  text: string;
  link: string;
  ariaLabel?: string;
  visible?: boolean;
};

type RightCard = {
  title?: string;
  subtitle?: string;
  bullets?: string[];
  cta?: Button;
};

type ServicesData = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  description?: string;
  buttons?: {
    primary?: Button;
    secondary?: Button;
  };
  rightCard?: RightCard;
  showWave?: boolean;
  backgroundImage?: string;
  backgroundOverlayOpacity?: number;
};

interface ServicesHeroHeaderProps {
  data: ServicesData;
  className?: string;
}

export default function ServicesHeroHeader({
  data,
  className = "",
}: ServicesHeroHeaderProps) {
  const {
    eyebrow,
    title,
    subtitle,
    description,
    buttons = {},
    rightCard,
    showWave = true,
    backgroundImage,
    backgroundOverlayOpacity = 0.35,
  } = data;

  const primary = buttons.primary ?? {
    text: "Talk to an expert",
    link: "/contact",
  };
  const secondary = buttons.secondary ?? {
    text: "View work",
    link: "/case-studies",
  };

  return (
    <section
      aria-label="Services hero"
      className={`relative flex items-center overflow-hidden bg-linear-to-br from-gray-900 via-gray-800 to-gray-950 py-24 sm:py-32 ${className}`}
      style={{
        backgroundImage: backgroundImage
          ? `url(${backgroundImage})`
          : undefined,
        backgroundSize: backgroundImage ? "cover" : undefined,
        backgroundPosition: backgroundImage ? "center" : undefined,
      }}
    >
      {/* Sophisticated geometric background - Same as HeroHeader */}
      <div aria-hidden="true" className="absolute inset-0">
        {/* Large geometric shapes */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-linear-to-br from-primary-500/5 to-primary-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-linear-to-tr from-primary-400/5 to-primary-500/10 rounded-full blur-3xl" />

        {/* Angular shapes for modern feel */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-linear-to-br from-gray-700/20 to-gray-600/10 transform rotate-45 blur-2xl" />
        <div className="absolute bottom-1/3 left-1/3 w-48 h-48 bg-linear-to-tr from-gray-600/15 to-gray-500/10 transform -rotate-12 blur-2xl" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px),
                           linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Subtle particle effect */}
      <div aria-hidden="true" className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                           radial-gradient(circle at 75% 75%, rgba(255,255,255,0.08) 1px, transparent 1px)`,
            backgroundSize: "50px 50px, 70px 70px",
          }}
        />
      </div>

      {backgroundImage && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gray-900"
          style={{
            opacity: backgroundOverlayOpacity,
            mixBlendMode: "multiply",
          }}
        />
      )}

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Content - Keeping original text layout */}
          <div className="lg:col-span-6 text-left">
            {eyebrow && (
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6 backdrop-blur-md shadow-lg">
                <span className="w-2 h-2 rounded-full mr-2.5 bg-primary-500 animate-pulse" />
                <span className="text-white text-sm font-semibold tracking-wide">
                  {eyebrow}
                </span>
              </div>
            )}

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
              <span className="block drop-shadow-lg">{title}</span>
            </h1>

            {subtitle && (
              <p className="text-sm sm:text-base text-gray-200 max-w-2xl leading-relaxed mb-4">
                {subtitle}
              </p>
            )}

            {description && (
              <p className="text-sm sm:text-base text-gray-200 max-w-2xl leading-relaxed mb-8">
                {description}
              </p>
            )}

            <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
              {primary.visible !== false && (
                <a
                  href={primary.link}
                  aria-label={primary.ariaLabel ?? primary.text}
                  className="mt-4 rounded group inline-flex items-center gap-3 px-5 py-3 bg-linear-to-r from-primary-600 to-primary-700 text-white font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]"
                >
                  <span className="relative z-10">{primary.text}</span>
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </a>
              )}

              {secondary.visible !== false && (
                <a
                  href={secondary.link}
                  aria-label={secondary.ariaLabel ?? secondary.text}
                  className="mt-4 rounded group inline-flex items-center gap-3 px-5 py-3 hover:bg-white/5 text-white border border-white/30 font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]"
                >
                  <span>{secondary.text}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </a>
              )}
            </div>
          </div>

          {/* Right Feature Card (render only if backend provides rightCard) */}
          <div className="lg:col-span-6">
            {rightCard ? (
              <div className="relative bg-white rounded-3xl shadow-2xl ring-1 ring-white/10 p-8 md:p-10 lg:p-12 backdrop-blur-sm">
                {rightCard.title && (
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {rightCard.title}
                  </h3>
                )}

                {rightCard.subtitle && (
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {rightCard.subtitle}
                  </p>
                )}

                {rightCard.bullets?.length ? (
                  <ul className="space-y-4 mb-8">
                    {rightCard.bullets.map((b, i) => (
                      <li className="flex items-start gap-4" key={i}>
                        <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-linear-to-r from-primary-500 to-primary-600 text-white text-xs font-bold shrink-0">
                          ✓
                        </span>
                        <span className="text-gray-700 leading-relaxed">
                          {b}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {rightCard.cta && rightCard.cta.visible !== false && (
                  <div className="mt-8">
                    <a
                      href={rightCard.cta.link}
                      aria-label={rightCard.cta.ariaLabel ?? rightCard.cta.text}
                      className="group relative px-6 py-3 rounded-xl text-sm font-semibold text-white bg-linear-to-r from-primary-500 to-primary-600 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary-300 overflow-hidden inline-flex items-center gap-2"
                    >
                      <span className="relative z-10">
                        {rightCard.cta.text}
                      </span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      <div className="absolute inset-0 bg-linear-to-r from-primary-400 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </a>
                  </div>
                )}

                {/* Decorative background element */}
                <div className="absolute -bottom-10 -right-10 w-56 h-56 bg-primary-500 opacity-20 blur-3xl rounded-full" />
              </div>
            ) : (
              <div className="hidden lg:block" />
            )}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-8 z-20">
        <a
          href="#content"
          aria-label="Scroll to content"
          className="flex flex-col items-center justify-center group"
        >
          <div className="w-6 h-10 flex justify-center">
            <div className="w-1 h-6 bg-white/70 rounded-full animate-bounce" />
          </div>
          <span className="text-white text-xs mt-2 opacity-0 group-hover:opacity-70 transition-opacity">
            Scroll
          </span>
        </a>
      </div>

      {/* Optional wave - only if showWave is true */}
      {showWave && (
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none opacity-30">
          <svg
            viewBox="0 0 1440 120"
            className="w-full h-24"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              d="M0,48 C120,96 360,120 720,96 C1080,72 1320,16 1440,0 L1440 120 L0 120 Z"
              fill="url(#gradient)"
            />
            <defs>
              <linearGradient id="gradient" x1="0" x2="1">
                <stop offset="0%" stopColor="#EF0046" stopOpacity="1" />
                <stop offset="100%" stopColor="#A53D96" stopOpacity="0.5" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      )}
    </section>
  );
}
