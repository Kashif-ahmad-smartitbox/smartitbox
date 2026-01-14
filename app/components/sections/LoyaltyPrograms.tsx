"use client";
import React from "react";
import Image from "next/image";
import {
  ArrowRight,
  Star,
  Award,
  Gift,
  Crown,
  Zap,
  Sparkles,
} from "lucide-react";
import { highlightText } from "@/app/lib/highlightText";

type Program = {
  id: string | number;
  title: string;
  description: string;
  icon?: string; // optional icon url (if not provided a default SVG will be used)
  features?: string[]; // optional features list
};

type Props = {
  data: {
    heading?: string;
    subheading?: string;
    programs: Program[];
    // layout
    columns?: number; // 2 (default) -> 2 columns on md/lg screens
    // colors / styles
    accentColor?: string; // circle background color e.g. "#9b2b77"
    textColor?: string;
    // CTA
    ctaLabel?: string;
    ctaHref?: string;
    // spacing
    containerPadding?: string;
    variant?: "default" | "modern" | "elegant" | "minimal";
  };
};

// Default icons for programs
const defaultIcons = [Award, Crown, Gift, Star, Zap, Sparkles];

export default function LoyaltyPrograms({ data }: Props) {
  const {
    heading = "Loyalty Program Campaigns Empowered by the Smartitbox Loyalty Board",
    subheading = "Transform customer relationships with innovative loyalty solutions that drive engagement and retention",
    programs = [],
    columns = 2,
    accentColor = "#9b2b77",
    textColor = "#111827",
    ctaLabel = "Contact Us",
    ctaHref = "#",
    containerPadding = "py-16 px-4 sm:px-6 lg:px-8",
    variant = "modern",
  } = data || {};

  const variantConfig = {
    default: {
      container: "bg-white",
      card: "bg-white border border-gray-200",
      iconBg: "bg-gray-100",
    },
    modern: {
      container: "bg-linear-to-br from-gray-50 to-white",
      card: "bg-white/80 backdrop-blur-sm border border-gray-100",
      iconBg: "bg-linear-to-br from-primary-500 to-primary-600",
    },
    elegant: {
      container: "bg-linear-to-br from-primary-25 to-primary-50",
      card: "bg-white border border-primary-100",
      iconBg: "bg-primary-100",
    },
    minimal: {
      container: "bg-white",
      card: "bg-transparent border-l-4 border-primary-500",
      iconBg: "bg-primary-50",
    },
  };

  const styles = variantConfig[variant];

  const ProgramCard = ({
    program,
    index,
  }: {
    program: Program;
    index: number;
  }) => {
    const DefaultIcon = defaultIcons[index % defaultIcons.length];

    return (
      <div
        className={`group relative rounded-2xl p-5 md:p-6 transition-all duration-500 hover:-translate-y-1 ${styles.card}`}
        aria-labelledby={`prog-title-${program.id}`}
      >
        {/* Background decorative elements for modern variant */}
        {variant === "modern" && (
          <>
            <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-primary-500 to-primary-600 opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
            <div className="absolute -inset-1 rounded-2xl bg-linear-to-r from-primary-500 to-primary-600 opacity-0 group-hover:opacity-10 blur-sm transition-opacity duration-500" />
          </>
        )}

        <div className="flex items-start gap-4 relative z-10">
          {/* Enhanced icon circle */}
          <div className="relative">
            <div
              className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 ${
                variant === "modern" ? styles.iconBg : `bg-[${accentColor}]`
              } shadow-md`}
              style={
                variant !== "modern"
                  ? {
                      background: accentColor,
                      boxShadow: `${accentColor}33 0 8px 20px -8px`,
                    }
                  : undefined
              }
            >
              {program.icon ? (
                <Image
                  src={program.icon}
                  alt={`${program.title} icon`}
                  width={20}
                  height={20}
                  className="object-contain filter brightness-0 invert"
                />
              ) : (
                <DefaultIcon
                  className={`w-5 h-5 ${
                    variant === "modern" ? "text-white" : "text-white"
                  }`}
                />
              )}
            </div>
          </div>

          {/* Enhanced content */}
          <div className="flex-1 min-w-0">
            <h3
              id={`prog-title-${program.id}`}
              className="text-lg font-semibold group-hover:text-primary-700 transition-colors duration-300"
              style={{ color: textColor }}
            >
              {program.title}
            </h3>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
              {program.description}
            </p>

            {/* Features list */}
            {program.features && program.features.length > 0 && (
              <ul className="mt-3 space-y-1">
                {program.features.map((feature, featureIndex) => (
                  <li
                    key={featureIndex}
                    className="flex items-center gap-2 text-xs text-gray-500"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Accent line for minimal variant */}
        {variant === "minimal" && (
          <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-linear-to-r from-primary-500 to-primary-600 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
        )}
      </div>
    );
  };

  const highlighted = highlightText(heading, [
    { word: "Campaigns", className: "text-primary-500" },
    { word: "Loyalty", className: "text-primary-500" },
    { word: "Smartitbox", className: "text-primary-500" },
  ]);

  return (
    <section
      className={`${containerPadding} ${styles.container} relative overflow-hidden`}
      aria-labelledby="loyalty-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-12 lg:mb-16">
          {variant === "modern" && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-100 border border-primary-200 mb-4 backdrop-blur-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wide text-primary-700">
                Loyalty Programs
              </span>
            </div>
          )}

          <h2
            id="loyalty-heading"
            className="text-2xl lg:text-3xl font-bold leading-tight mb-3"
            style={{ color: textColor }}
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />

          {subheading && (
            <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {subheading}
            </p>
          )}
        </div>

        {/* Enhanced Programs Grid */}
        <div
          className={`grid gap-4 lg:gap-4 ${
            columns === 2
              ? "grid-cols-1 lg:grid-cols-2"
              : "grid-cols-1 lg:grid-cols-2"
          }`}
        >
          {programs.map((program, index) => (
            <ProgramCard key={program.id} program={program} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
