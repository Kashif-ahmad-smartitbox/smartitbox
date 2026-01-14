"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  Plus,
  X,
  Users,
  BarChart3,
  Truck,
  Package,
  Shield,
  Target,
  TrendingUp,
  Zap,
  Clock,
  CheckCircle,
} from "lucide-react";

type FeatureItem = {
  id: string | number;
  title: string;
  short?: string;
  content?: string;
  icon?: string;
};

type Data = {
  heading?: string;
  subheading?: string;
  imageSrc?: string;
  imageAlt?: string;
  accentColor?: string;
  features: FeatureItem[];
};

// Icon mapping for Lucide icons
const iconMap: Record<string, React.ElementType> = {
  users: Users,
  barChart: BarChart3,
  truck: Truck,
  package: Package,
  shield: Shield,
  target: Target,
  trendingUp: TrendingUp,
  zap: Zap,
  clock: Clock,
  checkCircle: CheckCircle,
};

export default function DistributorModuleWithAccordion({
  data,
}: {
  data: Data;
}) {
  const {
    heading = "Smartitbox Distributor Module",
    subheading = "Streamline your distribution network with powerful tools and insights",
    imageSrc = "/images/pos-mockup.png",
    imageAlt = "module illustration",
    accentColor = "#ea7a3a",
    features = [],
  } = data || {};

  const [activeId, setActiveId] = useState<string | number | null>(null);

  const toggle = (id: string | number) => {
    setActiveId((cur) => (cur === id ? null : id));
    setTimeout(() => {
      const el = document.getElementById(`feature-expanded-${id}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 150);
  };

  const paleBg = (hex: string) => {
    return `${hex}14`;
  };

  // Default icons if none provided
  const defaultIcons = [Users, BarChart3, Truck, Package, Shield, Target];

  return (
    <section className="py-14 lg:py-15 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header and Image Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-16 lg:mb-20">
          {/* Left: Heading and Subheading */}
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-200 mb-6">
              <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
              <span className="text-sm font-semibold uppercase tracking-wide text-primary-700">
                Distributor Module
              </span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {heading}
            </h2>

            {subheading ? (
              <p className="text-xl text-gray-600 leading-relaxed">
                {subheading}
              </p>
            ) : null}
          </div>

          {/* Right: Image */}
          <div className="lg:col-span-7 flex items-center justify-center">
            <div className="relative w-full max-w-2xl">
              <div className="relative group">
                <div className="relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden transition-all duration-500 group-hover:shadow-3xl">
                  <Image
                    src={imageSrc}
                    alt={imageAlt}
                    fill
                    style={{ objectFit: "contain" }}
                    className="p-8 transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Expanded content (inserted below grid) */}
        <div className="mb-8 space-y-6">
          {features.map((f, index) => {
            const isActive = activeId === f.id;
            const IconComponent = f.icon
              ? iconMap[f.icon]
              : defaultIcons[index % defaultIcons.length];

            if (!isActive) return null;
            return (
              <div
                id={`feature-expanded-${f.id}`}
                key={`expanded-${f.id}`}
                className="rounded-3xl p-8 border-2 transition-all duration-500 animate-in fade-in-50 slide-in-from-bottom-5"
                style={{
                  borderLeft: `6px solid ${accentColor}`,
                  background: `linear-gradient(135deg, ${paleBg(
                    accentColor
                  )}, #ffffff)`,
                  borderColor: accentColor,
                  boxShadow: `0 20px 40px ${accentColor}15`,
                }}
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex items-start gap-6">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 hover:scale-110"
                      style={{
                        background: `linear-gradient(135deg, ${accentColor}20, ${accentColor}40)`,
                        border: `2px solid ${accentColor}30`,
                        boxShadow: `0 8px 20px ${accentColor}20`,
                      }}
                    >
                      {IconComponent && (
                        <IconComponent
                          size={24}
                          style={{ color: accentColor }}
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4
                        className="text-2xl font-bold mb-4 transition-colors duration-300"
                        style={{ color: accentColor }}
                      >
                        {f.title}
                      </h4>
                      {f.content ? (
                        <div
                          className="text-gray-700 leading-relaxed text-lg space-y-4 prose prose-lg max-w-none"
                          dangerouslySetInnerHTML={{ __html: f.content }}
                        />
                      ) : (
                        <p className="text-gray-700 leading-relaxed text-lg">
                          {f.short}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveId(null)}
                    aria-label="Close expanded view"
                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-all duration-300 hover:scale-110 shrink-0 hover:text-gray-800"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Grid of compact items (2 columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((f, index) => {
              const isActive = activeId === f.id;
              const IconComponent = f.icon
                ? iconMap[f.icon]
                : defaultIcons[index % defaultIcons.length];

              return (
                <div key={f.id} className="relative">
                  <button
                    onClick={() => toggle(f.id)}
                    aria-expanded={isActive}
                    className={`w-full flex items-center justify-between gap-4 p-6 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                      isActive
                        ? "shadow-xl  border-2"
                        : "shadow-md hover:shadow-xl border-2 border-transparent"
                    }`}
                    style={{
                      background: isActive ? paleBg(accentColor) : "#ffffff",
                      borderColor: isActive ? accentColor : "transparent",
                    }}
                  >
                    <div className="flex items-center gap-4 relative z-10">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                        style={{
                          background: `linear-gradient(135deg, ${accentColor}20, ${accentColor}40)`,
                          border: `2px solid ${accentColor}30`,
                          boxShadow: isActive
                            ? `0 4px 12px ${accentColor}40`
                            : "none",
                        }}
                      >
                        {IconComponent && (
                          <IconComponent
                            size={20}
                            style={{ color: accentColor }}
                          />
                        )}
                      </div>

                      <div className="text-left">
                        <div
                          className="text-lg font-bold transition-colors duration-300"
                          style={{
                            color: isActive ? accentColor : "#1f2937",
                          }}
                        >
                          {f.title}
                        </div>
                        {f.short ? (
                          <div className="text-sm text-gray-600 mt-1 transition-colors duration-300 group-hover:text-gray-700">
                            {f.short}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="shrink-0 ml-2 relative z-10">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isActive
                            ? "rotate-45 scale-110"
                            : "bg-gray-100 text-gray-600 group-hover:bg-gray-200 group-hover:scale-110"
                        }`}
                        style={{
                          backgroundColor: isActive ? accentColor : undefined,
                          color: isActive ? "white" : undefined,
                        }}
                        aria-hidden
                      >
                        {isActive ? <X size={18} /> : <Plus size={18} />}
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
