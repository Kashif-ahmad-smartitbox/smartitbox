"use client";

import React from "react";
import { ArrowRight } from "lucide-react";

type ButtonData = {
  text: string;
  link: string;
  ariaLabel?: string;
  visible?: boolean;
};

type TextsData = {
  title: string;
  subtitle?: string;
  description?: string;
};

type LogoData = {
  src?: string;
  alt?: string;
  size?: number;
};

export type HeroData = {
  logo?: LogoData;
  texts: TextsData;
  buttons?: {
    primary?: ButtonData;
    secondary?: ButtonData;
  };
  primaryColor?: string;
  bgClass?: string;
  bgGradient?: string;
  showScrollIndicator?: boolean;
  backgroundImage?: string;
  backgroundOverlayOpacity?: number;
};

interface SolutionHeroHeaderProps {
  data: HeroData;
  className?: string;
}

export default function SolutionHeroHeader({
  data,
  className = "",
}: SolutionHeroHeaderProps) {
  const {
    logo,
    texts,
    buttons = {},
    primaryColor = "#24357e",
    bgClass = "bg-linear-to-br from-gray-900 via-gray-800 to-gray-950",
    bgGradient,
    showScrollIndicator = true,
    backgroundImage,
    backgroundOverlayOpacity = 0.35,
  } = data;

  const primaryBtn = buttons.primary ?? { text: "Get Started", link: "#" };
  const secondaryBtn = buttons.secondary ?? {
    text: "Learn More",
    link: "#features",
  };

  return (
    <section
      aria-labelledby="solution-hero-title"
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
          <div className="lg:col-span-6 text-left">
            {/* Logo */}
            {logo?.src && (
              <div className="mb-8">
                <div
                  className="inline-flex rounded-2xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 p-4 items-center justify-center"
                  style={{ height: logo.size ?? 80 }}
                >
                  <img
                    src={logo.src}
                    alt={logo.alt ?? texts.title ?? "logo"}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>
              </div>
            )}

            {/* Subtitle as badge */}
            {texts.subtitle && (
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6 backdrop-blur-md shadow-lg">
                <span className="w-2 h-2 rounded-full mr-2.5 bg-primary-500 animate-pulse" />
                <span className="text-white text-sm font-semibold tracking-wide">
                  {texts.subtitle}
                </span>
              </div>
            )}

            {/* Title */}
            <h1
              id="solution-hero-title"
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4"
            >
              <span className="block drop-shadow-lg">{texts.title}</span>
            </h1>

            {/* Description */}
            {texts.description && (
              <p className="text-sm sm:text-base text-gray-200 max-w-2xl leading-relaxed mb-8">
                {texts.description}
              </p>
            )}

            {/* Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
              {primaryBtn.visible !== false && (
                <a
                  href={primaryBtn.link}
                  aria-label={primaryBtn.ariaLabel ?? primaryBtn.text}
                  className="mt-4 rounded group inline-flex items-center gap-3 px-5 py-3 bg-linear-to-r from-primary-600 to-primary-700 text-white font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]"
                >
                  <span className="relative z-10">{primaryBtn.text}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  <div className="absolute inset-0 bg-linear-to-r from-primary-400 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </a>
              )}

              {secondaryBtn.visible !== false && (
                <a
                  href={secondaryBtn.link}
                  aria-label={secondaryBtn.ariaLabel ?? secondaryBtn.text}
                  className="mt-4 rounded group inline-flex items-center gap-3 px-5 py-3 hover:bg-white/5 text-white border border-white/30 font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]"
                >
                  <span>{secondaryBtn.text}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </a>
              )}
            </div>
          </div>

          {/* Right column - empty but maintains layout */}
          <div className="lg:col-span-6"></div>
        </div>
      </div>

      {/* Scroll indicator */}
      {showScrollIndicator && (
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
      )}

      {/* Wave decoration */}
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
    </section>
  );
}

/* Utility functions */
function hexToRgba(hex: string, alpha = 1) {
  const normalized = hex.replace("#", "");
  const bigint = parseInt(
    normalized.length === 3
      ? normalized
          .split("")
          .map((c) => c + c)
          .join("")
      : normalized,
    16
  );
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function shadeHex(hex: string, amount: number) {
  const normalized = hex.replace("#", "");
  const full =
    normalized.length === 6
      ? normalized
      : normalized
          .split("")
          .map((c) => c + c)
          .join("");
  const num = parseInt(full, 16);
  const r = Math.min(255, Math.max(0, ((num >> 16) & 0xff) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0xff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
