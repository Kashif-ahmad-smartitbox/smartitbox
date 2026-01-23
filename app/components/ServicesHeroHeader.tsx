"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";

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
  };
  rightCard?: RightCard;
  showWave?: boolean;
  backgroundImage?: string;
  backgroundOverlayOpacity?: number;
  height?: string;
  variant?: "center" | "left" | "compact";
  breadcrumb?: Array<{ label: string; href?: string }>;
  highlight?: string;
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
    highlight,
    subtitle,
    description,
    buttons = {},
    rightCard,
    showWave = true,
    backgroundImage,
    backgroundOverlayOpacity = 0.35,
    height,
    variant = "center",
    breadcrumb,
  } = data;

  const primary = buttons.primary ?? {
    text: "Talk to an expert",
    link: "/contact",
  };

  const containerClasses =
    variant === "compact"
      ? "py-12"
      : variant === "left"
        ? "py-20 sm:py-28"
        : "py-20 sm:py-28";

  const textAlignment = variant === "left" ? "text-left" : "text-center";
  const contentWidth = variant === "left" ? "sm:mx-0 max-w-3xl" : "max-w-5xl";
  const justifyButtons =
    variant === "left" ? "sm:justify-start" : "justify-center";

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      aria-label="Services hero"
      className={`relative flex items-center overflow-hidden ${containerClasses} ${className}`}
      style={{
        minHeight: height || (variant === "compact" ? "36vh" : "70vh"),
        backgroundImage: backgroundImage
          ? `url(${backgroundImage})`
          : "linear-gradient(to bottom right, #ff0000, #1f2937, #111827)",
        backgroundSize: backgroundImage ? "cover" : "auto",
        backgroundPosition: backgroundImage ? "center" : "center",
      }}
    >
      {/* Background image with overlay if provided */}
      {backgroundImage && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              filter: "brightness(0.95)",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gray-900"
            style={{
              opacity: backgroundOverlayOpacity,
              mixBlendMode: "multiply",
            }}
          />
        </>
      )}

      {/* Sophisticated geometric background - Only if no background image */}
      {!backgroundImage && (
        <div aria-hidden="true" className="absolute inset-0">
          {/* Large geometric shapes */}
          <div className="absolute top-10 left-10 w-96 h-96 bg-linear-to-br from-primary-500/5 to-primary-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-linear-to-tr from-primary-400/5 to-primary-500/10 rounded-full blur-3xl" />

          {/* Angular shapes for modern feel */}
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-linear-to-br from-gray-700/20 to-gray-600/10 transform rotate-45 blur-2xl" />
          <div className="absolute bottom-1/3 left-1/3 w-48 h-48 bg-linear-to-tr from-gray-600/15 to-gray-500/10 transform -rotate-12 blur-2xl" />
        </div>
      )}

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        {Array.isArray(breadcrumb) && breadcrumb.length > 0 && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            aria-label="Breadcrumb"
            className={`mb-6 text-sm ${variant === "left" ? "sm:mb-8" : "mx-auto max-w-3xl"}`}
          >
            <ol className="inline-flex items-center space-x-2">
              {breadcrumb.map((b, i: number) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="inline-flex items-center"
                >
                  {b.href ? (
                    <a
                      href={b.href}
                      className="text-gray-300 hover:text-white hover:underline transition-colors font-medium"
                      aria-current={
                        i === breadcrumb.length - 1 ? "page" : undefined
                      }
                    >
                      {b.label}
                    </a>
                  ) : (
                    <span className="text-white font-semibold">{b.label}</span>
                  )}
                  {i < breadcrumb.length - 1 && (
                    <span className="mx-2 text-gray-400">/</span>
                  )}
                </motion.li>
              ))}
            </ol>
          </motion.nav>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Content */}
          <div className={`lg:col-span-6 ${textAlignment}`}>
            {eyebrow && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center px-4 py-2.5 rounded-full bg-white/10 border border-white/20 mb-8 backdrop-blur-sm"
              >
                <span className="w-2 h-2 rounded-full mr-2.5 bg-primary-500 animate-pulse" />
                <span className="text-white text-sm font-semibold tracking-wide">
                  {eyebrow}
                </span>
              </motion.div>
            )}

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mb-6`}
            >
              <span className="block drop-shadow-lg">{title}</span>

              {highlight && (
                <motion.span
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="relative block mt-4"
                >
                  <span className="relative z-10 bg-linear-to-r from-primary-500 to-orange-500 bg-clip-text text-transparent">
                    {highlight}
                  </span>
                </motion.span>
              )}
            </motion.h1>

            {subtitle && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className={`text-sm sm:text-lg text-gray-200 max-w-2xl leading-relaxed mb-6 ${
                  variant === "left" ? "sm:mx-0" : "mx-auto"
                }`}
              >
                {subtitle}
              </motion.p>
            )}

            {description && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className={`text-base text-gray-300 max-w-2xl leading-relaxed mb-10 ${
                  variant === "left" ? "sm:mx-0" : "mx-auto"
                }`}
              >
                {description}
              </motion.p>
            )}

            {primary && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className={`flex flex-col sm:flex-row gap-4 items-center ${justifyButtons}`}
              >
                {primary.visible !== false && (
                  <motion.a
                    href={primary.link}
                    aria-label={primary.ariaLabel ?? primary.text}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 10px 30px -5px rgba(59, 130, 246, 0.3)",
                    }}
                    whileTap={{ scale: 0.98 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 25,
                    }}
                    className="group relative px-8 py-4 rounded-full text-base font-semibold text-white bg-linear-to-r from-primary-500 to-orange-500 hover:from-primary-600 hover:to-primary-700 shadow-lg shadow-primary-500/25 overflow-hidden inline-flex items-center gap-2"
                  >
                    <span className="relative z-10">{primary.text}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    <div className="absolute inset-0 bg-linear-to-r from-primary-400 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.a>
                )}
              </motion.div>
            )}
          </div>

          {/* Right Feature Card (render only if backend provides rightCard) */}
          <div className="lg:col-span-6">
            {rightCard ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="relative bg-white rounded-3xl shadow-2xl ring-1 ring-white/10 p-8 md:p-10 lg:p-12 backdrop-blur-sm"
              >
                {rightCard.title && (
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {rightCard.title}
                  </h3>
                )}

                {rightCard.subtitle && (
                  <p className="text-sm text-gray-600 leading-relaxed mb-6">
                    {rightCard.subtitle}
                  </p>
                )}

                {rightCard.bullets?.length ? (
                  <ul className="space-y-4 mb-8">
                    {rightCard.bullets.map((b, i) => (
                      <li className="flex items-center gap-4" key={i}>
                        <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-linear-to-r from-primary-500 to-orange-500 text-white text-xs font-bold shrink-0">
                          ✓
                        </span>
                        <span className="text-sm text-gray-700 leading-relaxed">
                          {b}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {rightCard.cta && rightCard.cta.visible !== false && (
                  <div className="mt-8">
                    <motion.a
                      href={rightCard.cta.link}
                      aria-label={rightCard.cta.ariaLabel ?? rightCard.cta.text}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      className="group relative px-6 py-3 rounded-full text-sm font-semibold text-white bg-linear-to-r from-primary-500 to-orange-500 shadow-xl hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-300 overflow-hidden inline-flex items-center gap-2"
                    >
                      <span className="relative z-10">
                        {rightCard.cta.text}
                      </span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      <div className="absolute inset-0 bg-linear-to-r from-primary-400 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </motion.a>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="hidden lg:block" />
            )}
          </div>
        </div>
      </div>

      {/* Scroll indicator - only for non-compact variants */}
      {variant !== "compact" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute left-1/2 transform -translate-x-1/2 bottom-8 z-20"
        >
          <motion.a
            href="#content"
            aria-label="Scroll to content"
            className="flex flex-col items-center justify-center group"
            animate={{ y: [0, 10, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 border border-white/20 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow">
              <ChevronDown className="w-5 h-5 text-white group-hover:text-primary-400 transition-colors" />
            </div>
            <span className="text-white text-xs mt-3 opacity-0 group-hover:opacity-70 transition-opacity">
              Scroll down
            </span>
          </motion.a>
        </motion.div>
      )}

      {/* Optional wave - only if showWave is true and not compact variant */}
      {showWave && variant !== "compact" && (
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
    </motion.section>
  );
}
