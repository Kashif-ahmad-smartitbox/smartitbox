"use client";
import React from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

type CTA = { label: string; href: string };

export default function HeroHeader({ data }: { data: any }) {
  if (!data) return null;

  const {
    badgeText,
    title,
    highlight,
    subtitle,
    ctaPrimary,
    ctaSecondary,
    height,
    variant = "center",
    breadcrumb,
    backgroundImage,
    backgroundOverlayOpacity = 0.35,
  } = data;

  const containerClasses =
    variant === "compact"
      ? "py-12"
      : variant === "left"
      ? "py-20 sm:py-28"
      : "py-24 sm:py-32";

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      role="region"
      aria-label={title || "Page hero"}
      className={`relative flex items-center overflow-hidden ${containerClasses}`}
      style={{
        minHeight: height || (variant === "compact" ? "36vh" : "70vh"),
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
            className="absolute inset-0 bg-linear-to-br from-white/90 via-white/80 to-white/70"
            style={{
              opacity: backgroundOverlayOpacity,
            }}
          />
        </>
      )}
      <div
        className={`relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${
          variant === "left" ? "text-left" : "text-center"
        }`}
      >
        {/* Breadcrumb */}
        {Array.isArray(breadcrumb) && breadcrumb.length > 0 && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            aria-label="Breadcrumb"
            className={`mb-6 text-sm ${
              variant === "left" ? "sm:mb-8" : "mx-auto max-w-3xl"
            }`}
          >
            <ol className="inline-flex items-center space-x-2">
              {breadcrumb.map((b: any, i: number) => (
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
                      className="text-gray-600 hover:text-primary-600 hover:underline transition-colors font-medium"
                      aria-current={
                        i === breadcrumb.length - 1 ? "page" : undefined
                      }
                    >
                      {b.label}
                    </a>
                  ) : (
                    <span className="text-gray-800 font-semibold">
                      {b.label}
                    </span>
                  )}
                  {i < breadcrumb.length - 1 && (
                    <span className="mx-2 text-gray-400">/</span>
                  )}
                </motion.li>
              ))}
            </ol>
          </motion.nav>
        )}

        <div
          className={`mx-auto ${
            variant === "left" ? "sm:mx-0 max-w-3xl" : "max-w-5xl"
          }`}
        >
          {badgeText && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center px-4 py-2.5 rounded-full bg-primary-50 text-primary-700 border border-primary-200 mb-8 shadow-sm"
            >
              <span className="w-2 h-2 rounded-full mr-2.5 bg-primary-500" />
              <span className="text-sm font-semibold tracking-wide">
                {badgeText}
              </span>
            </motion.div>
          )}

          {title && (
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight ${
                variant === "compact" ? "mb-4" : "mb-6"
              }`}
            >
              <span className="block">{title}</span>

              {highlight && (
                <motion.span
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="relative block mt-4"
                >
                  <span className="relative z-10 text-primary-600">
                    {highlight}
                  </span>
                </motion.span>
              )}
            </motion.h1>
          )}

          {subtitle && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className={`text-lg sm:text-xl text-gray-600 max-w-2xl leading-relaxed ${
                variant === "left" ? "sm:mx-0" : "mx-auto"
              } ${variant === "compact" ? "mb-6" : "mb-10"}`}
            >
              {subtitle}
            </motion.p>
          )}

          {(ctaPrimary || ctaSecondary) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className={`flex flex-col sm:flex-row gap-4 items-center ${
                variant === "left" ? "sm:justify-start" : "justify-center"
              }`}
            >
              {ctaPrimary && (
                <motion.a
                  href={ctaPrimary.href}
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
                  className="group relative px-8 py-4 rounded-full text-base font-semibold text-white bg-linear-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-lg shadow-primary-500/25 overflow-hidden"
                >
                  <span className="relative z-10">{ctaPrimary.label}</span>
                  <div className="absolute inset-0 bg-linear-to-r from-primary-400 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.a>
              )}

              {ctaSecondary && (
                <motion.a
                  href={ctaSecondary.href}
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "rgba(59, 130, 246, 0.1)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 rounded-full text-base font-semibold border-2 border-primary-500 text-primary-600 hover:bg-primary-50 transition-all duration-300"
                >
                  {ctaSecondary.label}
                </motion.a>
              )}
            </motion.div>
          )}
        </div>
      </div>

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
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 shadow-md hover:shadow-lg transition-shadow">
              <ChevronDown className="w-5 h-5 text-gray-600 group-hover:text-primary-600 transition-colors" />
            </div>
            <span className="text-gray-500 text-xs mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
              Scroll down
            </span>
          </motion.a>
        </motion.div>
      )}
    </motion.section>
  );
}
