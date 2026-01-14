"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink, Zap } from "lucide-react";

type Card = {
  id?: string | number;
  title?: string;
  image: string;
  href?: string;
  featured?: boolean;
};

type Props = {
  data: {
    heading?: string;
    subtitle?: string;
    background?: string;
    accentColor?: string;
    cards: Card[];
    containerPadding?: string;
    variant?: "default" | "elegant" | "minimal" | "gradient";
    badge?: {
      text: string;
      color?: string;
    };
    columns?: 2 | 3 | 4;
  };
};

export default function ModuleShowcase({ data }: Props) {
  const {
    heading = "Technology platform modules with Manpower Outsourcing",
    subtitle,
    background = "#E80041",
    accentColor = "#9b28a0",
    cards = [],
    containerPadding = "py-20 lg:py-28",
    variant = "default",
    badge,
    columns = 3,
  } = data || {};

  // Configuration based on variant
  const variantConfig = {
    default: {
      container: "bg-linear-to-br from-primary-600 to-primary-700",
      card: "bg-white border border-primary-100",
      title: "text-white",
      subtitle: "text-primary-100",
    },
    elegant: {
      container:
        "bg-linear-to-br from-primary-500 via-primary-600 to-primary-700",
      card: "bg-white/95 backdrop-blur-sm border border-white/20",
      title: "text-white",
      subtitle: "text-primary-50",
    },
    minimal: {
      container: "bg-primary-600",
      card: "bg-white border border-gray-200",
      title: "text-white",
      subtitle: "text-primary-100",
    },
    gradient: {
      container: "bg-linear-to-br from-primary-500 to-primary-800",
      card: "bg-white/10 backdrop-blur-sm border border-white/20",
      title: "text-white",
      subtitle: "text-primary-50",
    },
  };

  const columnConfig = {
    2: "grid-cols-1 lg:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  const currentVariant = variantConfig[variant];

  const ModuleCard = ({ card, index }: { card: Card; index: number }) => (
    <article
      key={card.id ?? index}
      className={`group relative rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl min-h-[280px] flex flex-col ${
        card.featured ? "ring-2 ring-white/30 ring-opacity-50" : ""
      } ${currentVariant.card}`}
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-primary-500 to-primary-600 opacity-0 group-hover:opacity-5 transition-opacity duration-500" />

      {/* Featured badge */}
      {card.featured && (
        <div className="absolute -top-3 -right-3 bg-linear-to-r from-primary-500 to-primary-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg z-10 backdrop-blur-sm">
          Featured
        </div>
      )}

      {/* Image/Logo Container */}
      <div className="flex-1 flex items-center justify-center mb-6">
        <div className="relative w-full h-32 max-h-32 flex items-center justify-center">
          <div className="relative w-24 h-24 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
            <Image
              src={card.image}
              alt={card.title ?? "module logo"}
              fill
              style={{ objectFit: "contain" }}
              sizes="(max-width: 1024px) 50vw, 33vw"
              className="transition-transform duration-300 group-hover:scale-105"
            />

            {/* Animated background shape */}
            <div className="absolute -inset-4 bg-primary-100 rounded-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        </div>
      </div>

      {/* Title (if provided) */}
      {card.title && (
        <h3 className="text-center text-lg font-semibold text-gray-900 mb-4 transition-colors duration-300 group-hover:text-primary-700">
          {card.title}
        </h3>
      )}
    </article>
  );

  return (
    <section
      className={`relative overflow-hidden ${containerPadding}`}
      style={{ background }}
      aria-labelledby="module-showcase-heading"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          {badge && (
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-white/30"
              style={{
                backgroundColor: badge.color || "rgba(255,255,255,0.2)",
                color: "#ffffff",
              }}
            >
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: "#ffffff" }}
              />
              <span className="text-sm font-semibold uppercase tracking-wide">
                {badge.text}
              </span>
            </div>
          )}

          <h2
            id="module-showcase-heading"
            className={`text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-4 ${currentVariant.title}`}
          >
            {heading}
          </h2>

          {subtitle && (
            <p
              className={`text-lg max-w-3xl mx-auto ${currentVariant.subtitle}`}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Cards grid */}
        <div className={`grid ${columnConfig[columns]} gap-6 lg:gap-8`}>
          {cards.map((card, index) => (
            <ModuleCard key={card.id ?? index} card={card} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
