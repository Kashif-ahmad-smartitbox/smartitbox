"use client";

import React from "react";
import { Linkedin } from "lucide-react";

export type Maestro = {
  id: string;
  name: string;
  role?: string;
  bio: string;
  avatar: string; // url
  linkedin?: string;
};

interface MeetTheMaestrosProps {
  data: {
    title?: string;
    subtitle?: string;
    members: Maestro[];
    variant?: "side-by-side" | "stacked" | "elegant";
  };
}

const defaultData = {
  title: "Meet The Founders",
  subtitle: "The visionaries behind our journey",
  variant: "side-by-side" as const,
};

export default function MeetTheMaestros({ data }: MeetTheMaestrosProps) {
  const {
    title = defaultData.title,
    subtitle = defaultData.subtitle,
    variant = defaultData.variant,
    members = [],
  } = data ?? {};

  // Ensure we only take the first two members
  const founders = members.slice(0, 2);

  const variantConfig = {
    "side-by-side": {
      container: "bg-white",
      grid: "grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12",
      card: "bg-gradient-to-br from-primary-50 to-white rounded-3xl border-2 border-primary-100 p-8 hover:border-primary-200 hover:shadow-lg transition-all duration-500",
    },
    stacked: {
      container: "bg-gradient-to-br from-primary-900 to-primary-800",
      grid: "grid-cols-1 gap-12 max-w-4xl mx-auto",
      card: "bg-white rounded-3xl shadow-2xl p-10 hover:scale-[1.02] transition-transform duration-500",
    },
    elegant: {
      container: "bg-gradient-to-br from-primary-50 to-primary-100",
      grid: "grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center",
      card: "bg-white rounded-3xl border border-primary-200 p-10 backdrop-blur-sm hover:shadow-xl transition-all duration-500",
    },
  };

  const styles = variantConfig[variant];

  const FounderCard = React.useCallback(
    ({ founder, index }: { founder: Maestro; index: number }) => (
      <article className={`relative ${styles.card} group`}>
        <div className="flex flex-col items-center text-center">
          {/* Avatar with enhanced styling */}
          <div className="relative mb-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-2xl border-4 border-white shadow-2xl overflow-hidden bg-linear-to-br from-primary-200 to-primary-300 p-2">
                <img
                  src={founder.avatar}
                  alt={founder.name}
                  className="w-full h-full object-cover rounded-xl"
                  loading="lazy"
                />
              </div>

              {/* Founder badge */}
              <div className="absolute -bottom-2 -right-2 bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                Founder
              </div>
            </div>

            {/* Decorative background shape */}
            {variant === "side-by-side" && (
              <div className="absolute -inset-4 bg-primary-100 rounded-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            )}
          </div>

          {/* Name and Role */}
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-primary-900 mb-2">
              {founder.name}
            </h3>
            {founder.role && (
              <div className="text-lg font-medium text-primary-600">
                {founder.role}
              </div>
            )}
          </div>

          {/* Bio */}
          <p className="text-primary-700 leading-relaxed text-base mb-8 max-w-md">
            {founder.bio}
          </p>

          {/* LinkedIn Link */}
          {founder.linkedin && (
            <a
              href={founder.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-primary-100 text-primary-700 hover:bg-primary-200 hover:text-primary-800 transition-all duration-300 group/link font-medium"
              aria-label={`Connect with ${founder.name} on LinkedIn`}
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <Linkedin className="w-4 h-4" />
              </div>
              <span>Connect on LinkedIn</span>
            </a>
          )}
        </div>
      </article>
    ),
    [variant, styles.card]
  );

  return (
    <section
      className={`py-20 lg:py-28 ${styles.container} relative overflow-hidden`}
      aria-label="Meet the founders"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 border border-primary-200 mb-6">
            <div className="w-2 h-2 rounded-full bg-primary-500" />
            <span className="text-sm font-semibold uppercase tracking-wide text-primary-700">
              Leadership
            </span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold text-primary-900 mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xl lg:text-2xl text-primary-600 max-w-3xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Founders Grid */}
        {founders.length > 0 ? (
          <div className={`grid ${styles.grid}`}>
            {founders.map((founder, index) => (
              <FounderCard key={founder.id} founder={founder} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-primary-400 text-xl">
              Founder information coming soon
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
