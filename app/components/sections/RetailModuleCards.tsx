"use client";
import React from "react";
import Image from "next/image";

type Card = {
  id: string | number;
  title: string;
  description: string;
  icon?: string; // optional URL to small icon
};

type Props = {
  data: {
    heading?: string;
    subheading?: string;
    // main artwork (right side by default)
    imageSrc?: string;
    imageSrc2?: string;
    imageAlt?: string;
    // swap sides on larger screens
    reverse?: boolean;
    // page background (pale pink used in design)
    background?: string;
    // card background (white by default)
    cardBg?: string;
    // accent used for small icon circle or highlight
    accentColor?: string;
    // list of cards to display below
    cards: Card[];
    // optional container padding control
    containerPadding?: string;
  };
};

/**
 * RetailModuleCards - Enhanced Version
 *
 * Improvements:
 * - Better visual hierarchy and typography
 * - Enhanced animations and hover effects
 * - Improved image layering and shadows
 * - Better responsive design
 * - Enhanced card designs with gradients
 * - Smooth transitions and micro-interactions
 */
export default function RetailModuleCards({ data }: Props) {
  const {
    heading = "Smartitbox Retail Module",
    subheading = "",
    imageSrc = "/images/phone-mockup.png",
    imageSrc2 = "/images/dashboard-widgets.png",
    imageAlt = "retail artwork",
    reverse = false,
    background = "#fffff",
    cardBg = "#ffffff",
    accentColor = "#9b28a0",
    cards = [],
    containerPadding = "py-20 lg:py-28 px-4 sm:px-6 lg:px-8",
  } = data || {};

  // helper for pale background shape under artwork
  const paleBg = (hex: string) => {
    if (/^#([0-9a-f]{6})$/i.test(hex)) return `${hex}14`;
    return "#fff7fb";
  };

  return (
    <section
      className={`relative overflow-hidden ${containerPadding}`}
      style={{ background }}
      aria-labelledby="retail-module-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Header Section */}
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-primary-200 mb-6">
            <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
            <span className="text-sm font-semibold uppercase tracking-wide text-primary-700">
              Retail Solutions
            </span>
          </div>

          <h2
            id="retail-module-heading"
            className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight"
          >
            {heading.split(" ").map((word, index) =>
              word.toLowerCase().includes("retail") ? (
                <span
                  key={index}
                  className="bg-linear-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent"
                  style={{ marginRight: 8 }}
                >
                  {word}
                </span>
              ) : (
                <span key={index} style={{ marginRight: 8 }}>
                  {word}
                </span>
              )
            )}
          </h2>

          {subheading && (
            <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {subheading}
            </p>
          )}
        </div>

        {/* Enhanced Main Content */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-20 ${
            reverse ? "lg:flex-row-reverse" : ""
          }`}
        >
          {/* Text Column */}
          <div
            className={`lg:col-span-6 ${
              reverse ? "lg:order-2" : "lg:order-1"
            } flex flex-col justify-center`}
          >
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/80 backdrop-blur-sm border border-primary-200 mb-2">
                <div className="w-2 h-2 rounded-full bg-primary-500" />
                <span className="text-sm font-semibold text-primary-700">
                  Comprehensive Solution
                </span>
              </div>

              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                Transform Your Retail Operations
              </h3>

              <p className="text-lg text-gray-600 leading-relaxed">
                Streamline your retail business with our comprehensive suite of
                tools designed to enhance customer experience, optimize
                operations, and drive growth.
              </p>

              {/* Feature Highlights */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-primary-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Real-time Analytics
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-primary-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Inventory Management
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-primary-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Customer Insights
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-primary-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Multi-channel
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Artwork Column */}
          <div
            className={`lg:col-span-6 flex items-center justify-center ${
              reverse ? "lg:order-1" : "lg:order-2"
            }`}
          >
            <div className="relative w-full max-w-2xl">
              {/* Main container with enhanced styling */}
              <div className="relative">
                {/* Main image container */}
                <div className="relative rounded-3xl p-8">
                  <div className="relative w-full h-[400px] lg:h-[480px]">
                    {/* Dashboard widgets - enhanced positioning */}
                    <div
                      className="absolute inset-0 transform transition-all duration-700 hover:scale-105"
                      style={{
                        zIndex: 20,
                        borderRadius: 24,
                      }}
                    >
                      <Image
                        src={imageSrc2}
                        alt={`${imageAlt} widgets`}
                        fill
                        className="transition-transform duration-700 hover:scale-110"
                      />
                    </div>

                    {/* Phone mockup - enhanced positioning */}
                    <div
                      className="absolute bottom-2 left-0 w-3/5 h-4/5 transform transition-all duration-700 hover:scale-105 hover:-rotate-2"
                      style={{
                        zIndex: 30,
                        borderRadius: 24,
                      }}
                    >
                      <Image
                        src={imageSrc}
                        alt={imageAlt}
                        fill
                        className="transition-transform duration-700 hover:scale-110"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Cards Grid */}
        <div className="mt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map((card, index) => (
              <article
                key={card.id}
                className="group relative rounded-3xl p-8 backdrop-blur-sm border border-primary-100 hover:border-primary-300 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                style={{ background: cardBg }}
              >
                {/* Background decorative element */}
                <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-primary-500 to-primary-600 opacity-0 group-hover:opacity-5 transition-opacity duration-500" />

                {/* Enhanced Icon Container */}
                <div className="relative mb-6">
                  <div className="absolute -top-2 -left-2 w-16 h-16 bg-primary-100 rounded-2xl transform rotate-6 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  <div className="relative w-14 h-14 rounded-2xl bg-linear-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-500">
                    {card.icon ? (
                      <img
                        src={card.icon}
                        alt={`${card.title} icon`}
                        className="w-6 h-6 filter brightness-0 invert"
                      />
                    ) : (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="text-white"
                      >
                        <rect
                          x="3"
                          y="3"
                          width="18"
                          height="18"
                          rx="4"
                          fill="currentColor"
                        />
                      </svg>
                    )}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-primary-800 transition-colors duration-300">
                  {card.title}
                </h3>

                <p className="text-gray-600 leading-relaxed text-base">
                  {card.description}
                </p>

                {/* Hover accent line */}
                <div className="absolute bottom-0 left-8 right-8 h-1 bg-linear-to-r from-primary-500 to-primary-600 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
