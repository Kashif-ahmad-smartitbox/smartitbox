"use client";
import React from "react";
import Image from "next/image";
import {
  ArrowRight,
  Zap,
  Shield,
  Users,
  Rocket,
  Target,
  Star,
} from "lucide-react";
import { highlightText } from "@/app/lib/highlightText";

type CardItem = {
  id: string | number;
  title: string;
  description: string;
  icon?: string;
  href?: string;
  featured?: boolean;
};

type Props = {
  data: {
    heading?: string;
    subtitle?: string;
    // accent color for icons / links (defaults to brand purple)
    accentColor?: string;
    // background for the whole section (pale pink in design)
    background?: string;
    // cards to render
    cards: CardItem[];
    // optional container padding
    containerPadding?: string;
    variant?: "default" | "elegant" | "minimal" | "gradient";
    badge?: {
      text: string;
      color?: string;
    };
    align?: "left" | "center";
    columns?: 2 | 3 | 4;
  };
};

// Icon mapping for common icons
const iconMap = {
  zap: Zap,
  shield: Shield,
  users: Users,
  rocket: Rocket,
  target: Target,
  star: Star,
};

export default function FeatureGridSection({ data }: Props) {
  const {
    heading = "Feature-Rich, Simple To Use And Easy To Implement Solution",
    subtitle = "Utilize one of the top sales force automation tools to boost sales productivity and align the sales team with organizational objectives and procedures.",
    accentColor = "#9b28a0",
    background = "#fff7fb",
    cards = [],
    containerPadding = "py-16 lg:py-20 px-4 sm:px-6 lg:px-8",
    variant = "default",
    badge,
    align = "center",
    columns = 3,
  } = data || {};

  // Configuration based on variant
  const variantConfig = {
    default: {
      container: "bg-gradient-to-br from-primary-50 to-primary-25",
      card: "bg-white border border-primary-100",
      title: "text-gray-900",
      description: "text-gray-600",
    },
    elegant: {
      container: "bg-gradient-to-br from-gray-50 to-white",
      card: "bg-white/80 backdrop-blur-sm border border-gray-200",
      title: "text-gray-900",
      description: "text-gray-600",
    },
    minimal: {
      container: "bg-transparent",
      card: "bg-transparent border border-gray-200",
      title: "text-gray-900",
      description: "text-gray-600",
    },
    gradient: {
      container: "bg-gradient-to-br from-primary-500 to-primary-600",
      card: "bg-white/10 backdrop-blur-sm border border-white/20",
      title: "text-white",
      description: "text-primary-100",
    },
  };

  const columnConfig = {
    2: "grid-cols-1 lg:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  const alignConfig = {
    center: "text-center",
    left: "text-left",
  };

  const currentVariant = variantConfig[variant];
  const cssAccentVar = { ["--accent" as any]: accentColor };

  const FeatureCard = ({ card, index }: { card: CardItem; index: number }) => {
    const IconComponent =
      card.icon && iconMap[card.icon as keyof typeof iconMap];

    return (
      <article
        key={card.id}
        className={`group relative rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${
          card.featured ? "ring-2 ring-primary-300 ring-opacity-50" : ""
        } ${currentVariant.card}`}
        style={{
          animationDelay: `${index * 100}ms`,
        }}
      >
        {/* Featured badge */}
        {card.featured && (
          <div className="absolute -top-3 -right-3 bg-linear-to-r from-primary-500 to-primary-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg z-10">
            Featured
          </div>
        )}

        <div className="relative z-10">
          {/* Centered Icon Container */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 mx-auto"
                style={{
                  background:
                    variant === "gradient"
                      ? "rgba(255, 255, 255, 0.2)"
                      : `${accentColor}15`,
                  boxShadow:
                    variant === "gradient"
                      ? "0 8px 32px rgba(255, 255, 255, 0.1)"
                      : `0 8px 32px ${accentColor}20`,
                }}
              >
                {card.icon ? (
                  card.icon.startsWith("http") ? (
                    <Image
                      src={card.icon}
                      alt={`${card.title} icon`}
                      width={32}
                      height={32}
                      className="object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : IconComponent ? (
                    <IconComponent
                      size={28}
                      className="transition-colors duration-300"
                      style={{
                        color: variant === "gradient" ? "#ffffff" : accentColor,
                      }}
                    />
                  ) : (
                    <div
                      className="w-8 h-8 rounded-full"
                      style={{
                        backgroundColor:
                          variant === "gradient" ? "#ffffff" : accentColor,
                      }}
                    />
                  )
                ) : (
                  <Zap
                    size={28}
                    className="transition-colors duration-300"
                    style={{
                      color: variant === "gradient" ? "#ffffff" : accentColor,
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Content - also centered when align is center */}
          <div className={alignConfig[align]}>
            <h3
              className={`text-xl font-bold leading-tight mb-4 transition-colors duration-300 group-hover:text-primary-700 ${currentVariant.title}`}
            >
              {card.title}
            </h3>

            <p
              className={`text-base leading-relaxed mb-6 ${currentVariant.description}`}
            >
              {card.description}
            </p>

            {/* Enhanced CTA - centered when align is center */}
            {card.href && (
              <div className="mt-6">
                <a
                  href={card.href}
                  className="inline-flex items-center gap-3 group/link font-semibold transition-all duration-300 hover:gap-4"
                  style={{
                    color: variant === "gradient" ? "#ffffff" : accentColor,
                  }}
                >
                  <span className="underline decoration-2 underline-offset-4 transition-all duration-300 group-hover/link:underline-offset-2">
                    Know More
                  </span>
                  <ArrowRight
                    size={18}
                    className="transition-transform duration-300 group-hover/link:translate-x-1"
                  />
                </a>
              </div>
            )}
          </div>
        </div>
      </article>
    );
  };

  const highlighted = highlightText(heading, [
    { word: "Sales Excellence", className: "text-primary-500" },
    { word: "SMARTITBOX", className: "text-primary-500" },
  ]);

  return (
    <section
      className={`relative overflow-hidden ${currentVariant.container}`}
      style={{ ...cssAccentVar }}
      aria-labelledby="feature-grid-heading"
    >
      <div className={`max-w-7xl mx-auto ${containerPadding} relative z-10`}>
        {/* Header */}
        <div className={`mb-12 lg:mb-16 ${alignConfig[align]}`}>
          {badge && (
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor:
                  badge.color ||
                  (variant === "gradient"
                    ? "rgba(255,255,255,0.2)"
                    : `${accentColor}15`),
                color: variant === "gradient" ? "#ffffff" : accentColor,
                border:
                  variant === "gradient"
                    ? "1px solid rgba(255,255,255,0.3)"
                    : `1px solid ${accentColor}30`,
              }}
            >
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{
                  backgroundColor:
                    variant === "gradient" ? "#ffffff" : accentColor,
                }}
              />
              <span className="text-sm font-semibold uppercase tracking-wide">
                {badge.text}
              </span>
            </div>
          )}

          <h2
            id="feature-grid-heading"
            className={`text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-4 ${
              variant === "gradient" ? "text-white" : "text-gray-900"
            }`}
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />

          {subtitle && (
            <p
              className={`text-lg max-w-3xl ${
                align === "center" ? "mx-auto" : ""
              } ${
                variant === "gradient" ? "text-primary-100" : "text-gray-600"
              }`}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Cards grid */}
        <div className={`grid ${columnConfig[columns]} gap-6 lg:gap-8`}>
          {cards.map((card, index) => (
            <FeatureCard key={card.id} card={card} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
