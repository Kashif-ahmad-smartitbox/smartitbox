"use client";

import React from "react";
import {
  Zap,
  Shield,
  Users,
  TrendingUp,
  BarChart3,
  Smartphone,
  Cloud,
  Lock,
  HeartHandshake,
  Globe,
  Target,
  CheckCircle,
} from "lucide-react";
import { highlightText } from "@/app/lib/highlightText";

type ModuleItem = {
  id?: string | number;
  title: string;
  description: string;
  icon?: string;
};

type ModulesData = {
  title?: string;
  subtitle?: string;
  items: ModuleItem[];
};

// Icon mapping for Lucide icons
const iconMap: Record<string, React.ElementType> = {
  zap: Zap,
  shield: Shield,
  users: Users,
  trendingUp: TrendingUp,
  barChart: BarChart3,
  smartphone: Smartphone,
  cloud: Cloud,
  lock: Lock,
  heart: HeartHandshake,
  globe: Globe,
  target: Target,
  check: CheckCircle,
};

export default function DMSModulesSection({ data }: { data: ModulesData }) {
  const {
    title = "SMARTITBOX DMS Modules",
    subtitle = "Comprehensive modules designed to streamline your distributor management operations",
    items = [],
  } = data || {};

  // Default icons if none provided
  const defaultIcons = [Zap, Shield, Users, TrendingUp, BarChart3, Smartphone];

  const highlighted = highlightText(title, [
    { word: "IM", className: "text-primary-500" },
    { word: "DMS", className: "text-primary-500" },
  ]);

  return (
    <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-200 mb-6">
            <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
            <span className="text-sm font-semibold uppercase tracking-wide text-primary-700">
              Modules
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

        {/* Modules Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item, index) => {
              const IconComponent = item.icon
                ? iconMap[item.icon]
                : defaultIcons[index % defaultIcons.length];

              return (
                <article
                  key={item.id ?? index}
                  className="group relative bg-white rounded-3xl p-8 border-2 border-gray-100 hover:border-primary-200 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col h-full"
                >
                  {/* Background gradient on hover */}
                  <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-primary-500 to-primary-600 opacity-0 group-hover:opacity-5 transition-opacity duration-500" />

                  {/* Icon Container */}
                  <div className="relative mb-6">
                    <div className="absolute -top-2 -left-2 w-16 h-16 bg-primary-100 rounded-2xl transform rotate-6 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                    <div className="relative w-14 h-14 rounded-2xl bg-linear-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-500">
                      {IconComponent && (
                        <IconComponent
                          size={24}
                          className="text-white"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-primary-800 transition-colors duration-300">
                    {item.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed text-base grow">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-blob {
            animation: none;
          }
          .group:hover .group-hover\\:scale-110 {
            transform: scale(1);
          }
          .group:hover .group-hover\\:-translate-y-2 {
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
