"use client";
import React from "react";
import Image from "next/image";
import { ArrowRight, Sparkles, Users, Target, TrendingUp } from "lucide-react";
import Link from "next/link";

type CardItem = {
  title: string;
  image?: string;
  href?: string;
  description?: string;
};

type CTA = {
  title?: string;
  button?: { label?: string; href?: string };
  image?: string;
  backgroundGradient?: string;
};

type Data = {
  title?: string;
  subtitle?: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
  background?: string;
  accentColor?: string;
  reverse?: boolean;
  cards?: CardItem[];
  ctaBanner?: CTA;
  badgeText?: string;
  stats?: Array<{
    value: string;
    label: string;
    icon?: string;
  }>;
};

export default function LoyaltyIntro({ data }: { data: Data }) {
  const {
    title = "We Create and Transform Loyalty Programs. We Enhance Traction.",
    subtitle = "We believe the transformation from a business to a brand begins with how you build loyalty — among customers, channel partners, employees, and influencers.",
    description = "At SMARTITBOX, we design loyalty programs that not only strengthen relationships but also inspire advocacy. We combine behavioral insights, strategy, and cutting-edge technology to build systems that sustain brand love and maximize ROI.",
    imageSrc = "/images/loyalty-intro.png",
    imageAlt = "Customer interacting with SMARTITBOX loyalty program",
    background = "#fff7fb",
    accentColor = "#9b28a0",
    reverse = false,
    cards = [],
    ctaBanner,
    badgeText = "Loyalty Solutions",
    stats = [],
  } = data || {};

  const paleBg = (hex: string) => {
    if (!hex) return "#f7f0fb";
    if (/^#([0-9a-f]{6})$/i.test(hex)) return `${hex}14`;
    return hex;
  };

  // Icon mapping for stats
  const iconMap = {
    users: Users,
    target: Target,
    trending: TrendingUp,
    sparkles: Sparkles,
  };

  const StatCard = ({ stat, index }: { stat: any; index: number }) => {
    const IconComponent = stat.icon
      ? iconMap[stat.icon as keyof typeof iconMap]
      : TrendingUp;

    return (
      <div
        className="text-center p-6 rounded-2xl bg-white/80 border border-primary-100 hover:border-primary-200 transition-all duration-300 group"
        style={{ animationDelay: `${index * 200}ms` }}
      >
        <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-primary-500 to-primary-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
          <IconComponent className="w-8 h-8 text-white" />
        </div>
        <div className="text-3xl lg:text-4xl font-bold text-primary-600 mb-2">
          {stat.value}
        </div>
        <div className="text-sm text-primary-700 font-medium">{stat.label}</div>
      </div>
    );
  };

  return (
    <section
      className="relative overflow-hidden py-20 lg:py-28"
      aria-labelledby="loyalty-section-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          className={`grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center ${
            reverse ? "lg:flex-row-reverse" : ""
          }`}
        >
          {/* IMAGE (left on desktop by default) */}
          <div
            className={`lg:col-span-6 flex items-center justify-center ${
              reverse ? "lg:order-2" : "lg:order-1"
            }`}
          >
            <div className="relative w-full max-w-lg">
              <div
                className="relative rounded-3xl overflow-visible group"
                style={{ padding: 20, zIndex: 10 }}
              >
                <div
                  className="relative rounded-3xl overflow-hidden transform transition-all duration-700 group-hover:scale-105"
                  style={{ borderRadius: 24 }}
                >
                  <div className="relative w-full h-[400px] sm:h-[450px] md:h-[500px]">
                    <Image
                      src={imageSrc}
                      alt={imageAlt}
                      fill
                      priority
                      className="transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TEXT CONTENT */}
          <div
            className={`lg:col-span-6 ${
              reverse ? "lg:order-1" : "lg:order-2"
            } flex flex-col justify-center`}
          >
            <div className="max-w-2xl">
              {/* Badge */}
              <div className="font-bold text-primary-500 text-2xl mb-3">
                {badgeText}
              </div>
              <h2
                id="loyalty-section-heading"
                className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-6"
              >
                We Create and Transform{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary-600 to-primary-800">
                  Loyalty Programs
                </span>
                . We Enhance{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary-500 to-primary-700">
                  Traction
                </span>
                .
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                {subtitle}
              </p>

              <p className="text-sm text-slate-600 leading-relaxed mb-8">
                {description}
              </p>

              {/* Stats Grid */}
              {stats.length > 0 && (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {stats.map((stat, index) => (
                    <StatCard key={index} stat={stat} index={index} />
                  ))}
                </div>
              )}

              {/* CTA Button */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  className="mt-4 rounded group inline-flex items-center gap-3 px-5 py-3 bg-linear-to-r from-primary-600 to-primary-700 text-white font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]"
                >
                  <span>Start Your Loyalty Journey</span>
                  <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/case-studies"
                  className="mt-4 rounded group inline-flex items-center gap-3 px-5 py-3 hover:bg-white/5 text-black border border-black/30 font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]"
                >
                  <span>View Case Studies</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ENHANCED CARDS GRID */}
        {cards.length > 0 && (
          <div className="mt-20">
            <div className="text-center mb-12">
              <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Our Loyalty Solutions
              </h3>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Comprehensive loyalty programs designed for every aspect of your
                business
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {cards.map((card, index) => (
                <a
                  key={index}
                  href={card.href ?? "#"}
                  className="group block rounded-3xl bg-white/80 p-6 transition-all duration-500 border border-primary-100 hover:border-primary-300 hover:scale-105"
                >
                  <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-linear-to-br from-primary-50 to-primary-100 mb-4">
                    {card.image ? (
                      <Image
                        src={card.image}
                        alt={card.title}
                        fill
                        style={{ objectFit: "cover" }}
                        className="transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                          <Sparkles className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    )}

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-primary-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-700 transition-colors">
                    {card.title}
                  </h3>

                  {card.description && (
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {card.description}
                    </p>
                  )}

                  {/* Hover arrow */}
                  <div className="mt-4 flex items-center gap-2 text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-sm font-semibold">Learn more</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* ENHANCED CTA BANNER */}
        {ctaBanner && (
          <div className="mt-20 relative rounded-3xl overflow-hidden shadow-2xl group">
            {/* Background Image with Overlay */}
            {ctaBanner.image && (
              <div className="absolute inset-0">
                <Image
                  src={ctaBanner.image}
                  alt="CTA Background"
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                  priority
                />
                <div
                  className="absolute inset-0 bg-linear-to-r from-primary-900/80 to-primary-700/80"
                  aria-hidden="true"
                />
              </div>
            )}

            {/* Content Layer */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center text-white px-8 py-16 sm:py-20 lg:py-24">
              <div className="max-w-4xl">
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6">
                  {ctaBanner.title}
                </h3>

                <a
                  href={ctaBanner.button?.href ?? "#contact"}
                  className="rounded group inline-flex items-center gap-3 px-5 py-3 bg-white hover:bg-white/5 text-black hover:text-white border border-white/30 font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]"
                >
                  {ctaBanner.button?.label ?? "Get In Touch"}
                  <ArrowRight className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-white/10 animate-pulse" />
              <div className="absolute bottom-1/3 right-1/3 w-24 h-24 rounded-full bg-white/5 animate-pulse animation-delay-1000" />
            </div>
          </div>
        )}
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
      `}</style>
    </section>
  );
}
