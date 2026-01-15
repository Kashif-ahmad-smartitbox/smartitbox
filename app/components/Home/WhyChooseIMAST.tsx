"use client";
import React, { useMemo } from "react";
import {
  ShieldCheck,
  Zap,
  Users,
  Layers,
  Award,
  Globe,
  ArrowRight,
  X,
} from "lucide-react";
import SmartitboxAwardsSection from "./ImastAwardsSection";
import Link from "next/link";

// --- Interfaces
interface Differentiator {
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string;
}

interface ComparisonPoint {
  text: string;
}

interface WhyChooseSMARTITBOXData {
  header: {
    subtitle: string;
    title: string;
    description: string;
  };
  awardHeader: {
    title: string;
    description: string;
  };
  backgroundGradient: string;
  differentiators: Differentiator[];
  comparison: {
    title: string;
    subtitle: string;
    tagline: string;
    smartitbox: {
      label: string;
      points: ComparisonPoint[];
    };
    competitor: {
      label: string;
      points: ComparisonPoint[];
    };
    cta: {
      text: string;
      link: string;
    };
  };
  ctaButton: {
    text: string;
    link: string;
  };
  award: {
    awardHeader: {
      title: string;
      description: string;
    };
    awards: {
      title: string;
      issuer: string;
      year?: number;
      description: string;
      media: {
        type: "image" | "video";
        src: string;
        alt?: string;
        poster?: string;
        width?: number;
        height?: number;
      };
    }[];
    autoplayConfig?: {
      delay?: number;
      resumeAfterInteraction?: number;
    };
    styling?: {
      backgroundColor?: string;
      textColor?: string;
      cardBackground?: string;
    };
  };
}

// --- UI Components
function BlinkBullet({ className = "" }: { className?: string }) {
  return (
    <span
      className={`relative inline-flex items-center justify-center ${className}`}
      aria-hidden="true"
    >
      <span
        className="absolute inline-flex h-3 w-3 rounded-full bg-green-400/60 animate-ping"
        style={{ animationDuration: "1200ms" }}
      />
      <span className="relative inline-flex h-3 w-3 rounded-full bg-green-600" />
    </span>
  );
}

function RedCrossBullet({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center ${className}`}
      aria-hidden="true"
    >
      <span className="inline-flex h-3 w-3 rounded-full bg-red-50 items-center justify-center">
        <X className="w-3 h-3 text-red-600" />
      </span>
    </span>
  );
}

// Icon mapping function
const getIconComponent = (iconName: string) => {
  const iconMap = {
    ShieldCheck: <ShieldCheck className="w-6 h-6" />,
    Zap: <Zap className="w-6 h-6" />,
    Users: <Users className="w-6 h-6" />,
    Layers: <Layers className="w-6 h-6" />,
    Award: <Award className="w-6 h-6" />,
    Globe: <Globe className="w-6 h-6" />,
  };

  return (
    iconMap[iconName as keyof typeof iconMap] || <Award className="w-6 h-6" />
  );
};

export default function WhyChooseSMARTITBOX({
  data,
}: {
  data: WhyChooseSMARTITBOXData;
}) {
  const differentiators = useMemo(
    () =>
      data.differentiators.map((diff) => ({
        ...diff,
        icon: getIconComponent(diff.icon as string),
      })),
    [data.differentiators]
  );

  return (
    <section
      className="w-full bg-linear-to-br from-[#E63935] to-[#F29646]"
      aria-labelledby="why-smartitbox-title"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <header className="text-center mb-8">
          <p className="text-3xl font-semibold text-primary-100">
            {data.header.subtitle}
          </p>
          <h2
            id="why-smartitbox-title"
            className="mt-3 text-xl sm:text-4xl font-extrabold tracking-tight text-white"
          >
            {data.header.title}
          </h2>
          <p className="mt-3 max-w-3xl mx-auto text-primary-100">
            {data.header.description}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {differentiators.map((d) => (
              <article
                key={d.title}
                className="relative flex justify-center items-center overflow-hidden rounded-2xl bg-white p-5 sm:p-6 hover:shadow-md transition-transform transform hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`shrink-0 w-14 h-14 rounded-lg bg-[#654c0010] flex items-center justify-center`}
                    aria-hidden
                  >
                    <div className={`${d.color} bg-white/0`}>{d.icon}</div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 leading-tight">
                      {d.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">{d.desc}</p>

                    <div className="mt-4 flex items-center gap-3">
                      <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary-600 text-white text-sm font-medium shadow-sm hover:opacity-95 transition"
                      >
                        Discuss
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="lg:col-span-5 flex flex-col gap-6 h-full">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-gray-500">
                    {data.comparison.title}
                  </div>
                  <div className="mt-2 text-lg font-semibold text-gray-900">
                    {data.comparison.subtitle}
                  </div>
                </div>
                <div className="inline-flex items-center gap-2 text-xs text-gray-400">
                  {data.comparison.tagline}
                </div>
              </div>

              {/* SMARTITBOX section */}
              <div className="mt-6">
                <div className="text-xs font-medium text-green-700 mb-3">
                  {data.comparison.smartitbox.label}
                </div>
                <ul className="space-y-3 text-sm text-gray-700">
                  {data.comparison.smartitbox.points.map((point, index) => (
                    <li
                      key={`smartitbox-${index}`}
                      className="flex items-start gap-3"
                    >
                      <span className="shrink-0 mt-1 flex items-center justify-center">
                        <BlinkBullet />
                      </span>
                      <span className="leading-tight">{point.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Competitor section */}
              <div className="mt-4">
                <div className="text-xs font-medium text-red-700 mb-3">
                  {data.comparison.competitor.label}
                </div>
                <ul className="space-y-3 text-sm text-gray-700">
                  {data.comparison.competitor.points.map((point, index) => (
                    <li
                      key={`comp-${index}`}
                      className="flex items-start gap-3"
                    >
                      <span className="shrink-0 mt-1 flex items-center justify-center">
                        <RedCrossBullet />
                      </span>
                      <span className="leading-tight">{point.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <a
                  href={data.comparison.cta.link}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary-600 text-white text-sm font-medium shadow-sm hover:opacity-95 transition"
                >
                  {data.comparison.cta.text}
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </aside>
        </div>
        <SmartitboxAwardsSection data={data.award} />
      </div>
    </section>
  );
}
