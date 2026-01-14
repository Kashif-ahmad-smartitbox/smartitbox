"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  CheckCircle,
  ChevronDown,
  ArrowRight,
  Zap,
  Shield,
  Users,
  BarChart3,
  Smartphone,
  Cloud,
} from "lucide-react";

type Feature = {
  id?: string | number;
  title: string;
  detail?: string;
  icon?: string;
};

type Data = {
  title?: string;
  subtitle?: string;
  features: Feature[];
  imageSrc?: string;
  imageAlt?: string;
  background?: string;
  accentColor?: string;
  button?: { label?: string; href?: string };
  reverse?: boolean;
  rtl?: boolean;
};

// Icon mapping
const iconMap: Record<string, React.ElementType> = {
  check: CheckCircle,
  zap: Zap,
  shield: Shield,
  users: Users,
  barChart: BarChart3,
  smartphone: Smartphone,
  cloud: Cloud,
};

export default function FeatureCardSimple({ data }: { data: Data }) {
  const {
    title = "POS Made Effortless: Simplifying Your Retail Operations",
    subtitle,
    features = [],
    imageSrc = "/images/pos-mockup.png",
    imageAlt = "app mockup",
    background = "bg-gradient-to-br from-red-50 to-red-100",
    accentColor = "oklch(64.5% 0.246 16.439)",
    button = { label: "Learn More", href: "#" },
    reverse = false,
    rtl = false,
  } = data || {};

  const [openItems, setOpenItems] = useState<Set<string | number>>(new Set());

  const toggleItem = (id: string | number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  const bgClass = background.startsWith("bg-") ? background : undefined;
  const bgStyle = bgClass ? undefined : { background };

  const textAlignClass = rtl ? "text-right" : "text-left";
  const listItemFlexDirection = rtl ? "flex-row-reverse" : "flex-row";
  const chevronSide = rtl ? "mr-0 ml-2" : "ml-0 mr-2";

  const FeatureIcon = ({
    icon = "check",
    index,
  }: {
    icon?: string;
    index: number;
  }) => {
    const IconComponent = iconMap[icon] || CheckCircle;
    const defaultIcons = [Zap, Shield, Users, BarChart3, Smartphone, Cloud];
    const FallbackIcon = defaultIcons[index % defaultIcons.length];

    return (
      <div
        className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110"
        style={{
          backgroundColor: `${accentColor}15`,
          color: accentColor,
        }}
      >
        <IconComponent size={16} />
      </div>
    );
  };

  return (
    <section className="py-12 lg:py-16 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          className={`rounded-3xl p-6 lg:p-8 ${bgClass ? bgClass : ""}`}
          style={bgStyle}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-12">
            {/* Content Column */}
            <div
              className={`lg:col-span-6 ${
                reverse ? "lg:order-2" : "lg:order-1"
              }`}
            >
              <div className={`max-w-2xl ${textAlignClass}`}>
                {/* Badge */}
                <div className="mb-4">
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide"
                    style={{
                      backgroundColor: `${accentColor}15`,
                      color: accentColor,
                    }}
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{ backgroundColor: accentColor }}
                    />
                    Features
                  </div>
                </div>

                {/* Title */}
                <h2
                  className={`text-xl lg:text-2xl font-bold text-gray-900 leading-tight mb-3 ${textAlignClass}`}
                >
                  {title}
                </h2>

                {/* Subtitle */}
                {subtitle && (
                  <p
                    className={`text-sm text-gray-600 leading-relaxed mb-6 ${textAlignClass}`}
                  >
                    {subtitle}
                  </p>
                )}

                {/* Features List */}
                <div className="space-y-2">
                  {features.map((f, i) => {
                    const itemId = f.id ?? i;
                    const isOpen = openItems.has(itemId);

                    return (
                      <div
                        key={itemId}
                        className="group border-l-2 transition-all duration-300 hover:border-opacity-100 rounded-r-lg"
                        style={{
                          borderColor: isOpen
                            ? accentColor
                            : `${accentColor}30`,
                        }}
                      >
                        <button
                          onClick={() => toggleItem(itemId)}
                          className="w-full text-left p-3 rounded-r-lg transition-all duration-300 hover:bg-white/60 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-100"
                          aria-expanded={isOpen}
                          aria-controls={`feature-detail-${itemId}`}
                        >
                          <div
                            className={`flex items-center justify-between ${listItemFlexDirection}`}
                          >
                            <div
                              className={`flex items-center gap-3 ${
                                rtl ? "flex-row-reverse" : "flex-row"
                              }`}
                            >
                              <FeatureIcon icon={f.icon} index={i} />

                              <h3 className="text-sm font-semibold text-gray-900 group-hover:text-gray-800">
                                {f.title}
                              </h3>
                            </div>

                            {/* Chevron */}
                            <div
                              className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${
                                isOpen ? "bg-red-50" : "bg-white"
                              } ${chevronSide}`}
                            >
                              <ChevronDown
                                size={14}
                                className={`text-gray-500 transition-transform duration-200 ${
                                  isOpen ? "rotate-180" : "rotate-0"
                                } ${rtl ? "-scale-x-100" : ""}`}
                              />
                            </div>
                          </div>

                          {/* Detail */}
                          {f.detail && (
                            <div
                              id={`feature-detail-${itemId}`}
                              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                isOpen
                                  ? "max-h-32 opacity-100 mt-2"
                                  : "max-h-0 opacity-0"
                              }`}
                            >
                              <div
                                className={`pb-1 ${
                                  rtl ? "pr-11 pl-2" : "pl-11 pr-2"
                                }`}
                              >
                                <p className="text-xs text-gray-600 leading-relaxed">
                                  {f.detail}
                                </p>
                              </div>
                            </div>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* CTA Buttons */}
                <div
                  className={`mt-6 flex flex-col sm:flex-row items-center gap-2 ${
                    rtl ? "sm:flex-row-reverse" : "sm:flex-row"
                  }`}
                >
                  <a
                    href={button.href || "#"}
                    className="group relative inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-lg shadow-sm transition-all duration-300 hover:shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-300 overflow-hidden"
                    style={{
                      backgroundColor: accentColor,
                    }}
                  >
                    <span className="relative z-10">
                      {button.label || "Learn More"}
                    </span>
                    <ArrowRight
                      size={14}
                      className="relative z-10 transition-transform duration-300 group-hover:translate-x-0.5"
                    />

                    {/* Hover overlay */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        backgroundColor: `${accentColor}dd`,
                      }}
                    />
                  </a>

                  <a
                    href="#"
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-700 rounded-lg border border-gray-300 transition-all duration-300 hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-100"
                  >
                    View Demo
                  </a>
                </div>
              </div>
            </div>

            {/* Image Column */}
            <div
              className={`lg:col-span-6 flex items-center justify-center ${
                reverse ? "lg:order-1" : "lg:order-2"
              }`}
            >
              <div className="relative w-full max-w-lg">
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  width={800}
                  height={400}
                  className="w-full h-auto object-cover"
                  priority
                />

                {/* Background decoration */}
                <div
                  className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 rounded-2xl opacity-5 blur-xl"
                  style={{ backgroundColor: accentColor }}
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
