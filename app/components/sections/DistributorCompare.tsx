"use client";
import React from "react";
import {
  CheckCircle,
  XCircle,
  Zap,
  Target,
  Users,
  TrendingUp,
} from "lucide-react";
import { highlightText } from "@/app/lib/highlightText";

type Column = {
  badgeLabel?: string;
  badgeIcon?: string;
  heading: string;
  paragraphs: string[];
  borderColor?: string;
  tint?: string;
  features?: string[];
};

type Data = {
  title?: string;
  subtitle?: string;
  left: Column;
  right: Column;
};

export default function DistributorCompare({ data }: { data: Data }) {
  const {
    title = "Hone Your Entire Distributor-Network's Modus Operating With SMARTITBOX's Coherent Distributor Management System",
    subtitle,
    left,
    right,
  } = data;

  // Icon mapping for badge icons
  const iconMap: Record<string, React.ElementType> = {
    check: CheckCircle,
    x: XCircle,
    zap: Zap,
    target: Target,
    users: Users,
    trendingUp: TrendingUp,
  };

  function Badge({
    label,
    icon,
    color,
  }: {
    label?: string;
    icon?: string;
    color?: string;
  }) {
    const IconComponent = icon ? iconMap[icon] : CheckCircle;

    return (
      <span
        className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full border backdrop-blur-sm"
        style={{
          background: color ? `${color}15` : "rgba(0,0,0,0.04)",
          color: color ?? "#111827",
          borderColor: color ? `${color}30` : "rgba(0,0,0,0.1)",
        }}
      >
        {IconComponent && <IconComponent className="w-4 h-4" />}
        <span>{label}</span>
      </span>
    );
  }

  const Col = ({ col, isLeft }: { col: Column; isLeft?: boolean }) => {
    const bc = col.borderColor ?? (isLeft ? "#ef4444" : "#16a34a");
    const tint = col.tint ?? (isLeft ? "#fef2f2" : "#f0fdf4");

    return (
      <div className="relative group h-full">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 rounded-2xl opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px),
                               linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
              backgroundSize: "30px 30px",
            }}
          />
        </div>

        {/* Main Content */}
        <div
          className="relative w-full h-full rounded-2xl p-8 border-2 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl flex flex-col"
          style={{
            borderColor: bc,
            background: tint,
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            minHeight: "500px",
          }}
        >
          {/* Decorative Corner Accents */}
          <div
            className="absolute top-4 left-4 w-3 h-3 border-t-2 border-l-2 rounded-tl-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ borderColor: bc }}
          />
          <div
            className="absolute top-4 right-4 w-3 h-3 border-t-2 border-r-2 rounded-tr-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ borderColor: bc }}
          />
          <div
            className="absolute bottom-4 left-4 w-3 h-3 border-b-2 border-l-2 rounded-bl-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ borderColor: bc }}
          />
          <div
            className="absolute bottom-4 right-4 w-3 h-3 border-b-2 border-r-2 rounded-br-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ borderColor: bc }}
          />

          {/* Badge */}
          <div className="mb-6">
            <Badge label={col.badgeLabel} icon={col.badgeIcon} color={bc} />
          </div>

          {/* Heading */}
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-6">
            {col.heading}
          </h3>

          {/* Paragraphs */}
          <div className="space-y-4 mb-6 grow">
            {col.paragraphs.map((p, i) => (
              <p key={i} className="text-gray-700 leading-relaxed text-base">
                {p}
              </p>
            ))}
          </div>

          {/* Features List */}
          {col.features && col.features.length > 0 && (
            <div className="space-y-3">
              {col.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{
                      background: bc,
                    }}
                  >
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-gray-700 text-sm leading-relaxed">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Hover Accent Line */}
          <div
            className="absolute bottom-0 left-8 right-8 h-1 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center"
            style={{
              background: `linear-gradient(90deg, ${bc}00, ${bc}, ${bc}00)`,
            }}
          />
        </div>
      </div>
    );
  };

  const highlighted = highlightText(title, [
    { word: "Distributor-Network's", className: "text-primary-500" },
    { word: "SMARTITBOX's", className: "text-primary-500" },
  ]);

  return (
    <section className="py-20 lg:py-28 bg-linear-to-br from-gray-50 to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-200 mb-6">
            <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
            <span className="text-sm font-semibold uppercase tracking-wide text-primary-700">
              Comparison
            </span>
          </div>

          <h2
            className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight"
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />

          {subtitle && (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Comparison Columns - Equal Height Container */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          {/* Left Column */}
          <div className="flex flex-col rounded-2xl overflow-hidden h-full">
            <Col col={left} isLeft={true} />
          </div>

          {/* Right Column */}
          <div className="flex flex-col rounded-2xl overflow-hidden h-full">
            <Col col={right} isLeft={false} />
          </div>
        </div>
      </div>
    </section>
  );
}
