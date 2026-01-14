"use client";
import React from "react";
import Image from "next/image";
import {
  ArrowRight,
  Play,
  Star,
  Zap,
  Shield,
  Users,
  Award,
} from "lucide-react";

type CardItem = {
  id: string;
  title: string;
  image?: string;
  href?: string;
  excerpt?: string;
  icon?: string;
};

type CTA = {
  title: string;
  button: { label: string; href: string };
  image?: string;
  backgroundGradient?: string;
  subtitle?: string;
};

type Props = {
  data: {
    title: string;
    subtitle?: string;
    description?: string;
    imageSrc?: string;
    imageAlt?: string;
    background?: string;
    accentColor?: string;
    reverse?: boolean;
    cards?: CardItem[];
    ctaBanner?: CTA;
    badge?: string;
    features?: string[];
  };
};

// Icon mapping for cards
const iconMap = {
  star: Star,
  zap: Zap,
  shield: Shield,
  users: Users,
  award: Award,
  play: Play,
};

/**
 * Enhanced LoyaltyLandingSection with modern design
 */
export default function LoyaltyLandingSection({ data }: Props) {
  const {
    title,
    subtitle,
    description,
    imageSrc,
    imageAlt = "illustration",
    background = "#fff9fb",
    accentColor = "#9b28a0",
    reverse = false,
    cards = [],
    ctaBanner,
    badge = "Premium Feature",
    features = [],
  } = data || {};

  const paleBg = (hex: string) => {
    if (/^#([0-9a-f]{6})$/i.test(hex)) return `${hex}14`;
    return "#f8f5fb";
  };

  const FeatureList = () => {
    if (!features.length) return null;

    return (
      <div className="mt-8 space-y-3">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-3 group">
            <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
              <div className="w-2 h-2 rounded-full bg-primary-600" />
            </div>
            <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
              {feature}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <section className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative z-10">
        {/* Top: artwork + text */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-12 gap-16 items-center ${
            reverse ? "lg:flex-row-reverse" : ""
          }`}
        >
          {/* Artwork column */}
          <div
            className={`lg:col-span-6 flex items-center justify-center ${
              reverse ? "lg:order-1" : "lg:order-2"
            }`}
          >
            <div className="relative w-full max-w-lg">
              <div className="relative group">
                <div
                  className="relative rounded-3xl transition-all duration-700"
                  style={{ borderRadius: 24 }}
                >
                  <div className="relative w-full h-[350px] md:h-[450px] lg:h-[600px]">
                    {imageSrc ? (
                      <Image
                        src={imageSrc}
                        alt={imageAlt}
                        fill
                        style={{ objectFit: "contain" }}
                        className="transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-linear-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                        <div className="text-gray-400 text-lg">Image</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Text column */}
          <div
            className={`lg:col-span-6 flex flex-col justify-center ${
              reverse ? "lg:order-2" : "lg:order-1"
            }`}
          >
            <div className="max-w-2xl">
              {/* Badge */}
              <div className="text-2xl text-primary-500 font-bold mb-2">
                {badge}
              </div>

              {/* Title */}
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight">
                {title}
              </h2>

              {/* Subtitle */}
              {subtitle && (
                <p className="mt-6 text-lg lg:text-xl text-gray-600 leading-relaxed">
                  {subtitle}
                </p>
              )}

              {/* Description */}
              {description && (
                <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                  {description}
                </p>
              )}

              {/* Features list */}
              <FeatureList />

              {/* CTA Buttons */}
              <div className="mt-5 flex flex-col sm:flex-row gap-4">
                <a
                  href="#get-started"
                  className="mt-4 rounded group inline-flex items-center gap-3 px-5 py-3 bg-linear-to-r from-primary-600 to-primary-700 text-white font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                </a>

                <a
                  href="#demo"
                  className="mt-4 rounded group inline-flex items-center gap-3 px-5 py-3 border border-black font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]"
                >
                  <Play className="w-5 h-5 text-black" />
                  <span className="text-black"> Watch Demo</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Cards grid */}
        {cards.length > 0 && (
          <div className="mt-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {cards.map((card) => (
                <a
                  key={card.id}
                  href={card.href || "#"}
                  className="group block bg-white rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border border-gray-100 overflow-hidden"
                >
                  {/* Image with aspect ratio */}
                  <div className="relative mb-6 overflow-hidden rounded-xl bg-gray-50">
                    {card.image ? (
                      <div className="relative pt-[70%]">
                        <img
                          src={card.image}
                          alt={card.title}
                          className="absolute inset-0 w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="pt-[70%] flex items-center justify-center">
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                          <span className="text-3xl opacity-30">📄</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-800 transition-colors line-clamp-2">
                      {card.title}
                    </h3>

                    {card.excerpt && (
                      <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors line-clamp-2">
                        {card.excerpt}
                      </p>
                    )}

                    {/* Simple CTA */}
                    <div className="flex items-center justify-between pt-3">
                      <span
                        className="text-sm font-medium flex items-center gap-1.5"
                        style={{ color: accentColor }}
                      >
                        Learn More
                        <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                    </div>
                  </div>

                  {/* Simple bottom accent line */}
                  <div className="mt-4">
                    <div
                      className="h-0.5 rounded-full w-0 group-hover:w-full transition-all duration-300 origin-left"
                      style={{ backgroundColor: accentColor }}
                    />
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced CTA banner */}
        {ctaBanner && (
          <div className="mt-24">
            <div
              className="relative w-full overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 group"
              style={{ minHeight: 280 }}
            >
              {/* Background Image covering entire card */}
              {ctaBanner.image && (
                <div className="absolute inset-0">
                  <Image
                    src={ctaBanner.image}
                    alt="cta"
                    fill
                    style={{ objectFit: "cover" }}
                    className="transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                </div>
              )}

              {/* Gradient overlay for better text readability */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(90deg, ${accentColor}DD 0%, ${accentColor}99 30%, ${accentColor}80 50%, transparent 100%)`,
                }}
                aria-hidden
              />

              {/* Subtle pattern overlay */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 1px, transparent 1px)`,
                  backgroundSize: "40px 40px",
                }}
                aria-hidden
              />

              {/* Content */}
              <div className="relative p-8 md:p-12 lg:pl-16 lg:pr-8 h-full flex flex-col justify-center max-w-2xl">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-6 w-fit">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span className="text-sm font-semibold uppercase tracking-wide text-white">
                    Special Offer
                  </span>
                </div>

                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                  {ctaBanner.title}
                </h3>

                {ctaBanner.subtitle && (
                  <p className="mt-4 text-xl text-white/90 leading-relaxed">
                    {ctaBanner.subtitle}
                  </p>
                )}
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <a
                    href={ctaBanner.button.href}
                    className="mt-4 rounded group inline-flex items-center gap-3 px-5 py-3 bg-white text-black font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]"
                  >
                    {ctaBanner.button.label}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </a>

                  <a
                    href="#learn-more"
                    className="mt-4 rounded group inline-flex items-center gap-3 px-5 py-3 hover:bg-white/5 text-white border border-white/30 font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]"
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
