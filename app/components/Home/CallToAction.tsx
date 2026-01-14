"use client";
import React from "react";
import {
  ArrowRight,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  Zap,
  Target,
  Rocket,
} from "lucide-react";

// --- Interfaces
interface ContactMethod {
  icon: string;
  title: string;
  desc: string;
  href: string;
  color: string;
}

interface FeatureCard {
  number: string;
  title: string;
  description: string;
}

interface CTAButton {
  text: string;
  href: string;
  variant: "primary" | "secondary";
}

interface CallToActionData {
  background: {
    color: string;
    gradient?: string;
  };
  header: {
    title: string;
    highlightedText: string;
    description: string;
  };
  featureCards: FeatureCard[];
  primaryCTAs: CTAButton[];
  quickConnect: {
    title: string;
    description: string;
    methods: ContactMethod[];
    bottomCTAs: CTAButton[];
  };
}

// Icon mapping function
const getIconComponent = (iconName: string) => {
  const iconMap = {
    Phone: Phone,
    Mail: Mail,
    MessageSquare: MessageSquare,
    Calendar: Calendar,
    Zap: Zap,
    Target: Target,
    Rocket: Rocket,
    ArrowRight: ArrowRight,
  };

  return iconMap[iconName as keyof typeof iconMap] || Phone;
};

export default function CallToAction({ data }: { data: CallToActionData }) {
  return (
    <section
      className="relative overflow-hidden py-24 bg-primary-700 text-white"
      aria-labelledby="cta-title"
    >
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left - headline and bullets */}
          <div className="lg:col-span-7">
            <h1
              id="cta-title"
              className="mt-6 text-3xl font-bold leading-tight"
            >
              {data.header.title.split("{highlight}")[0]}
              <span className="bg-gradient-to-r from-white to-primary-100 bg-clip-text text-transparent">
                {data.header.highlightedText}
              </span>
              {data.header.title.split("{highlight}")[1]}
            </h1>

            <p className="mt-6 text-lg text-primary-50 max-w-2xl leading-relaxed">
              {data.header.description}
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.featureCards.map((card, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 bg-white/10 backdrop-blur-sm p-5 rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center font-bold text-white shadow-lg">
                    {card.number}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-md">
                      {card.title}
                    </div>
                    <div className="text-primary-100 text-sm mt-1">
                      {card.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
              {data.primaryCTAs.map((cta, index) => (
                <a
                  key={index}
                  href={cta.href}
                  className={`rounded group inline-flex items-center gap-3 px-5 py-3 font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] ${
                    cta.variant === "primary"
                      ? "bg-white text-black"
                      : "hover:bg-white/5 text-white border border-white/30"
                  }`}
                >
                  <span>{cta.text}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </a>
              ))}
            </div>
          </div>

          {/* Right - contact cards */}
          <aside className="lg:col-span-5">
            <div className="relative bg-white/10 rounded-3xl p-8 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-bold text-white">
                  {data.quickConnect.title}
                </h3>
              </div>

              <p className="text-primary-100 text-md mb-6">
                {data.quickConnect.description}
              </p>

              <div className="grid grid-cols-1 gap-4">
                {data.quickConnect.methods.map((item, index) => {
                  const IconComponent = getIconComponent(item.icon);
                  return (
                    <a
                      key={index}
                      href={item.href}
                      className="group flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
                    >
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center shadow-lg`}
                      >
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-white group-hover:text-white/90">
                          {item.title}
                        </div>
                        <div className="text-primary-100 text-sm">
                          {item.desc}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-transform" />
                    </a>
                  );
                })}
              </div>

              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex flex-col sm:flex-row gap-3">
                  {data.quickConnect.bottomCTAs.map((cta, index) => (
                    <a
                      key={index}
                      href={cta.href}
                      className={`mt-4 rounded group inline-flex items-center gap-3 px-5 py-3 font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] ${
                        cta.variant === "primary"
                          ? "bg-white text-black"
                          : "hover:bg-white/5 text-white border border-white/30"
                      }`}
                    >
                      <span>{cta.text}</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
