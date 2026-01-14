"use client";
import React from "react";
import {
  ShieldCheck,
  Zap,
  Users,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Star,
  Award,
  Clock,
  LucideIcon,
} from "lucide-react";
import SmartitboxCard, { SmartitboxCardProps } from "./SmartitboxCard";
import { highlightText } from "@/lib/highlightText";

export type Feature = {
  icon: string;
  title: string;
  desc: string;
  delay?: number;
};

export type Ipeople = {
  id: number;
  img: string;
  alt: string;
};

export type TrustedData = {
  text?: string;
  brands?: number | string;
  dailyUsers?: string;
  peopleImage?: Ipeople[];
};

export type CTA = {
  text: string;
  link: string;
};

export type KeyValueData = {
  kicker?: string;
  headline: string;
  lead?: string;
  trusted?: TrustedData;
  features: Feature[];
  ctaPrimary: CTA;
  ctaSecondary?: CTA;
  cardComponentProps?: SmartitboxCardProps;
};

// Props type
export type KeyValueProps = {
  data: KeyValueData;
};

// Icon mapping with proper typing
const ICON_MAP: Record<string, LucideIcon> = {
  TrendingUp,
  Zap,
  Users,
  ShieldCheck,
  Clock,
  Star,
  Award,
};

// Component
export default function KeyValue({ data }: KeyValueProps) {
  if (!data) return null;

  return (
    <section className="bg-linear-to-br from-white via-primary-50/20 to-gray-50/50 py-16 lg:py-24 xl:py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-center">
          {/* LEFT: Pitch + benefits */}
          <LeftContent data={data} />

          {/* RIGHT: Card component */}
          <RightContent cardProps={data.cardComponentProps} />
        </div>
      </div>

      <EnhancedStyles />
    </section>
  );
}

// Sub-components for better organization
function LeftContent({ data }: { data: KeyValueData }) {
  return (
    <div className="relative order-2 lg:order-1">
      <HeaderSection
        kicker={data.kicker}
        headline={data.headline}
        lead={data.lead}
      />

      <TrustBadge trusted={data.trusted} />

      <FeaturesGrid features={data.features} />

      <CTASection
        ctaPrimary={data.ctaPrimary}
        ctaSecondary={data.ctaSecondary}
      />
    </div>
  );
}

function RightContent({ cardProps }: { cardProps?: SmartitboxCardProps }) {
  return (
    <div className="relative order-1 lg:order-2">
      <div className="relative z-10 transform hover:scale-[1.02] transition-transform duration-500">
        {/* @ts-expect-error: cardProps may be partial/dynamic */}
        <SmartitboxCard {...(cardProps ?? {})} />
      </div>
    </div>
  );
}

function HeaderSection({
  kicker,
  headline,
  lead,
}: {
  kicker?: string;
  headline: string;
  lead?: string;
}) {
  const highlighted = highlightText(headline, [
    { word: "platform", className: "text-primary-500" },
    { word: "Practical", className: "text-primary-500" },
  ]);

  return (
    <div className="text-center lg:text-left">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-100 mb-4">
        <Star className="w-3 h-3 text-red-500" />
        <span className="text-sm font-medium text-red-600">
          {kicker ?? "Why Choose SMARTITBOX"}
        </span>
      </div>

      <h2
        className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight"
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />

      {lead && (
        <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed">
          {lead}
        </p>
      )}
    </div>
  );
}

function TrustBadge({ trusted }: { trusted?: TrustedData }) {
  return (
    <div className="mt-8 lg:mt-10 p-4 sm:p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 hover:shadow-md transition-all duration-300 group">
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        <div className="flex -space-x-3 shrink-0">
          {trusted?.peopleImage?.map((item) => (
            <div
              key={item.id}
              className="w-10 h-10 bg-linear-to-br from-red-600 to-red-400 overflow-hidden rounded-full border-3 border-white flex items-center justify-center"
            >
              <img
                src={item.img}
                alt={item.alt}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
            <Award className="w-4 h-4 text-yellow-500" />
            <p className="text-sm font-semibold text-gray-900">
              {trusted?.text ?? "Trusted by industry leaders"}
            </p>
          </div>
          <p className="text-sm text-gray-600">
            <strong className="text-gray-800 font-semibold">
              {trusted?.brands ?? "500+"}
            </strong>{" "}
            brands ·{" "}
            <strong className="text-gray-800 font-semibold">
              {trusted?.dailyUsers ?? "2M+"}
            </strong>{" "}
            daily users
          </p>
        </div>
        <CheckCircle className="w-6 h-6 text-green-500 shrink-0" />
      </div>
    </div>
  );
}

function FeaturesGrid({ features }: { features: Feature[] }) {
  return (
    <div className="mt-10 lg:mt-12 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2">
      {features.map((feature, index) => (
        <EnhancedFeature
          key={feature.title + index}
          feature={feature}
          index={index}
        />
      ))}
    </div>
  );
}

function CTASection({
  ctaPrimary,
  ctaSecondary,
}: {
  ctaPrimary: CTA;
  ctaSecondary?: CTA;
}) {
  return (
    <div className="mt-10 lg:mt-12 flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
      <CTAButton {...ctaPrimary} variant="primary" />

      {ctaSecondary && <CTAButton {...ctaSecondary} variant="secondary" />}
    </div>
  );
}

function CTAButton({
  text,
  link,
  variant = "primary",
}: CTA & { variant?: "primary" | "secondary" }) {
  const baseClasses =
    "group relative inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3 rounded font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] overflow-hidden";

  const variants = {
    primary: `${baseClasses} bg-linear-to-r from-primary-500 to-primary-600 text-white shadow-lg hover:shadow-xl`,
    secondary: `${baseClasses} border-2 border-gray-200 bg-white/80 text-gray-700 hover:bg-white hover:border-primary-200 hover:text-primary-700 hover:shadow-md`,
  };

  return (
    <a href={link} className={variants[variant]}>
      {variant === "primary" && (
        <div className="absolute inset-0 bg-linear-to-r from-primary-700 to-primary-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      )}
      <span className="relative">{text}</span>
      <ArrowRight
        className={`w-4 h-4 relative transition-transform duration-300 ${
          variant === "primary"
            ? "group-hover:translate-x-1"
            : "opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1"
        }`}
      />
    </a>
  );
}

function EnhancedFeature({
  feature,
  index,
}: {
  feature: Feature;
  index: number;
}) {
  const { icon, title, desc, delay = 0 } = feature;
  const IconComp = ICON_MAP[icon] ?? TrendingUp;

  return (
    <div
      className="feature-hover group p-4 sm:p-5 rounded-2xl bg-white/70 border border-gray-100 hover:border-gray-200 hover:bg-white/90 backdrop-blur-sm cursor-pointer transition-all duration-300 hover:shadow-lg"
      style={{
        animationDelay: `${delay}ms`,
        animation: `statIn 700ms cubic-bezier(0.2, 0.9, 0.3, 1.2) both ${
          index * 100
        }ms`,
      }}
    >
      <div className="flex gap-4 items-start">
        <div
          className={`flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-r from-primary-500 to-primary-600 text-white shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3`}
        >
          <IconComp className="w-6 h-6" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-base group-hover:text-gray-800 transition-colors line-clamp-2">
            {title}
          </h3>
          <p className="text-gray-600 mt-2 leading-relaxed text-sm line-clamp-3">
            {desc}
          </p>
        </div>
      </div>
    </div>
  );
}

function EnhancedStyles() {
  return (
    <style jsx>{`
      @keyframes float {
        0%,
        100% {
          transform: translateY(0px) rotate(0deg);
        }
        50% {
          transform: translateY(-12px) rotate(2deg);
        }
      }

      @keyframes statIn {
        from {
          opacity: 0;
          transform: translateY(15px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      @keyframes pulse-slow {
        0%,
        100% {
          opacity: 0.4;
        }
        50% {
          opacity: 0.6;
        }
      }

      @keyframes bounce-slow {
        0%,
        100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-10px);
        }
      }

      .animate-float {
        animation: float 8s ease-in-out infinite;
      }

      .animate-stat {
        animation: statIn 700ms cubic-bezier(0.2, 0.9, 0.3, 1.2) both;
      }

      .animate-pulse-slow {
        animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }

      .animate-bounce-slow {
        animation: bounce-slow 3s infinite;
      }

      .feature-hover {
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .feature-hover:hover {
        transform: translateY(-6px);
      }

      @media (max-width: 640px) {
        .animate-float {
          animation: float 10s ease-in-out infinite;
        }
      }
    `}</style>
  );
}
