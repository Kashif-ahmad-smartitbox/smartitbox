"use client";
import React from "react";

type HeadingData = {
  title: string;
  highlight?: string[];
  description?: string;
  accentColor?: string;
  align?: "left" | "center" | "right";
  variant?: "default" | "minimal" | "elegant" | "gradient";
  badge?: {
    text: string;
    color?: string;
  };
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
  spacing?: "sm" | "md" | "lg" | "xl";
  showDivider?: boolean;
  showGridLines?: boolean;
  gridOpacity?: number;
  gridColor?: string;
};

export default function HeadingSection({ data }: { data: HeadingData }) {
  if (!data) return null;

  const {
    title,
    highlight = [],
    description,
    accentColor = "#9b28a0",
    align = "center",
    variant = "default",
    badge,
    maxWidth = "2xl",
    spacing = "md",
    showDivider = false,
    showGridLines = true,
    gridOpacity = 0.05,
    gridColor = "currentColor",
  } = data;

  const words = title.split(" ");

  // Configuration based on variant
  const variantConfig = {
    default: {
      container: "bg-white",
      title: "text-gray-900",
      description: "text-gray-700",
      badge: "bg-gray-100 text-gray-700",
      gridColor: "#6b7280",
    },
    minimal: {
      container: "bg-transparent",
      title: "text-gray-900",
      description: "text-gray-600",
      badge: "bg-gray-50 text-gray-600 border border-gray-200",
      gridColor: "#d1d5db",
    },
    elegant: {
      container: "bg-gradient-to-br from-gray-50 to-white",
      title: "text-gray-900",
      description: "text-gray-700",
      badge: "bg-primary-50 text-primary-700 border border-primary-200",
      gridColor: "#9ca3af",
    },
    gradient: {
      container: "bg-gradient-to-br from-primary-500 to-primary-600",
      title: "text-white",
      description: "text-primary-100",
      badge: "bg-white/20 text-white backdrop-blur-sm border border-white/30",
      gridColor: "#ffffff",
    },
  };

  const spacingConfig = {
    sm: "pt-8 md:pt-12",
    md: "pt-10 md:pt-16",
    lg: "pt-12 md:pt-20",
    xl: "pt-16 md:pt-24",
  };

  const maxWidthConfig = {
    sm: "max-w-2xl",
    md: "max-w-3xl",
    lg: "max-w-4xl",
    xl: "max-w-5xl",
    "2xl": "max-w-6xl",
  };

  const alignConfig = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  };

  const currentVariant = variantConfig[variant];

  return (
    <section
      className={`relative overflow-hidden ${spacingConfig[spacing]} ${currentVariant.container}`}
    >
      {/* Animated background elements for elegant variant */}
      {variant === "elegant" && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute top-10 right-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute bottom-10 left-1/2 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        </div>
      )}

      {/* Gradient overlay for gradient variant */}
      {variant === "gradient" && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl animate-blob" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-4000" />
        </div>
      )}

      <div
        className={`mx-auto px-6 sm:px-8 relative z-10 ${maxWidthConfig[maxWidth]}`}
      >
        {/* Use flex container for perfect centering */}
        <div className={`flex flex-col ${alignConfig[align]}`}>
          {/* Badge - Always centered horizontally within its container */}
          {badge && (
            <div className="flex justify-center mb-6">
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 ${currentVariant.badge}`}
                style={badge.color ? { backgroundColor: badge.color } : {}}
              >
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: accentColor }}
                />
                <span className="text-sm font-semibold uppercase tracking-wide">
                  {badge.text}
                </span>
              </div>
            </div>
          )}

          {/* Title */}
          <h2
            className={`text-2xl md:text-3xl lg:text-4xl font-bold leading-tight md:leading-tight lg:leading-tight ${currentVariant.title} w-full`}
          >
            {words.map((word, i) => {
              const clean = word.replace(/[^a-zA-Z0-9]/g, "");
              const isHighlighted = highlight.some(
                (h) => h.toLowerCase() === clean.toLowerCase()
              );

              return (
                <span
                  key={i}
                  className={`inline-block transition-all duration-500 ${
                    isHighlighted
                      ? "transform hover:scale-110"
                      : "hover:text-opacity-80"
                  }`}
                  style={{
                    color: isHighlighted ? accentColor : "inherit",
                    background:
                      isHighlighted && variant === "gradient"
                        ? "linear-gradient(135deg, #fff, #f0f0f0)"
                        : "none",
                    WebkitBackgroundClip:
                      isHighlighted && variant === "gradient" ? "text" : "none",
                    WebkitTextFillColor:
                      isHighlighted && variant === "gradient"
                        ? "transparent"
                        : "inherit",
                  }}
                >
                  {word}{" "}
                </span>
              );
            })}
          </h2>

          {/* Divider - Perfectly centered */}
          {showDivider && (
            <div
              className={`my-8 h-1 rounded-full transition-all duration-1000 ${
                variant === "gradient" ? "bg-white/30" : "bg-gray-200"
              }`}
              style={{
                width: "100px",
                // The flex container alignment will handle the positioning
              }}
            />
          )}

          {/* Description */}
          {description && (
            <div className="mt-6 transition-all duration-700 delay-300 w-full">
              <p
                className={`text-sm md:text-lg leading-relaxed ${currentVariant.description}`}
                style={{
                  maxWidth: align === "center" ? "none" : "42rem",
                  // For center alignment, let the text flow naturally
                  // For left/right, constrain the width for better readability
                }}
              >
                {description}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
