"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Server,
  Zap,
  Users,
  Database,
  Link as LinkIcon,
  Cloud,
  ShieldCheck,
  ArrowRight,
  Cpu,
  GitBranch,
  BarChart3,
  BarChart3 as BarChart,
} from "lucide-react";
import SmartitboxCertificationsRow from "./SmartitboxCertificationsRow";

type IconName =
  | "Server"
  | "Zap"
  | "Users"
  | "Database"
  | "Link"
  | "Cloud"
  | "ShieldCheck"
  | "ArrowRight"
  | "Cpu"
  | "GitBranch"
  | "BarChart3";

const ICON_MAP: Record<IconName, React.ComponentType<any>> = {
  Server,
  Zap,
  Users,
  Database,
  Link: LinkIcon,
  Cloud,
  ShieldCheck,
  ArrowRight,
  Cpu,
  GitBranch,
  BarChart3,
};

export type Step = {
  id: number;
  title: string;
  desc: string;
  iconName: IconName;
};

export type Channel = {
  label: string;
  iconName: IconName;
  color?: string;
};

export type BusCard = {
  title: string;
  subtitle: string;
  iconName: IconName;
  gradient?: string;
};

export type Highlight = {
  iconName: IconName;
  title: string;
  description: string;
  gradient?: string;
};

export type HowItWorksData = {
  eyebrow?: string;
  title: string;
  intro?: string;
  steps: Step[];
  cloudPlatform: {
    title: string;
    subtitle?: string;
    statusDots?: string[];
  };
  channels: Channel[];
  dataSyncLabel?: string;
  busCards: BusCard[];
  highlights: Highlight[];
  cta: {
    text: string;
    href: string;
    pretitle?: string;
    description?: string;
  };
  badges: any;
};

type Props = {
  data: HowItWorksData;
};

export default function HowItWorks({ data }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [visibleSteps, setVisibleSteps] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const nodes = Array.from(
      containerRef.current?.querySelectorAll<HTMLElement>("[data-step]") || []
    );
    if (!nodes.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = Number(entry.target.getAttribute("data-step"));
          if (entry.isIntersecting) {
            setVisibleSteps((s) => ({ ...s, [id]: true }));
            obs.unobserve(entry.target);
          }
        });
      },
      { root: null, threshold: 0.2 }
    );

    nodes.forEach((n) => obs.observe(n));
    return () => obs.disconnect();
  }, [data.steps]);

  return (
    <section
      className="py-20 lg:py-28 bg-[#f5f5fa] to-blue-50/30"
      aria-labelledby="how-it-works-title"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-16">
          {data.eyebrow ? (
            <h3 className="text-2xl font-semibold text-red-600">
              {data.eyebrow}
            </h3>
          ) : null}
          <h2
            id="how-it-works-title"
            className="mt-2 text-2xl sm:text-3xl font-extrabold text-gray-900"
          >
            {data.title}
          </h2>
          {data.intro ? (
            <p className="mt-2 text-sm text-gray-600 max-w-xl">{data.intro}</p>
          ) : null}
        </div>

        <div ref={containerRef} className="relative mb-20">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-linear-to-b from-primary-200 via-amber-200 to-violet-200 hidden lg:block"></div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {data.steps.map((step, index) => (
              <StepCard
                key={step.id}
                step={step}
                visible={!!visibleSteps[step.id]}
                stepNumber={index + 1}
                totalSteps={data.steps.length}
              />
            ))}
          </div>
        </div>

        <div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-100">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {data.cloudPlatform.title}
                </h3>
                {data.cloudPlatform.subtitle ? (
                  <p className="text-gray-600">{data.cloudPlatform.subtitle}</p>
                ) : null}
              </div>

              <div className="">
                <div className="flex items-center gap-3 mb-8 p-4 bg-white rounded-xl border border-gray-100">
                  <Cloud className="text-blue-500" size={24} />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">
                      {data.cloudPlatform.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {data.cloudPlatform.subtitle}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {(data.cloudPlatform.statusDots || []).map((c, i) => (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-full ${c}`}
                      ></div>
                    ))}
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white mb-6">
                      <GitBranch size={16} className="text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Business Modules
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {data.channels.map((ch) => (
                        <EnhancedChannel
                          key={ch.label}
                          iconName={ch.iconName}
                          label={ch.label}
                          color={ch.color}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="relative">
                    <div className="relative flex items-center justify-center gap-2">
                      <div className="flex-1 h-0.5 bg-linear-to-r from-primary-600 to-primary-700"></div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-100">
                        <Cpu size={16} className="text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">
                          {data.dataSyncLabel ?? "Real-time Data Sync"}
                        </span>
                      </div>
                      <div className="flex-1 h-0.5 bg-linear-to-r from-primary-600 to-primary-700"></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {data.busCards.map((b) => (
                      <EnhancedBusCard
                        key={b.title}
                        title={b.title}
                        subtitle={b.subtitle}
                        iconName={b.iconName}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <aside className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Platform Highlights
                </h3>

                <div className="space-y-6">
                  {data.highlights.map((h) => (
                    <HighlightItem
                      key={h.title}
                      iconName={h.iconName}
                      title={h.title}
                      description={h.description}
                      gradient={h.gradient ?? "from-green-500 to-emerald-500"}
                    />
                  ))}
                </div>
              </div>

              <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
                {data.cta.pretitle ? (
                  <h5 className="text-sm text-gray-300 mb-1">
                    {data.cta.pretitle}
                  </h5>
                ) : null}
                <h4 className="font-semibold mb-2">{data.cta.text}</h4>
                {data.cta.description ? (
                  <p className="text-gray-300 text-sm mb-4">
                    {data.cta.description}
                  </p>
                ) : null}
                <a
                  href={data.cta.href}
                  className="inline-flex items-center gap-2 text-sm font-semibold bg-white text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Explore Integrations
                  <ArrowRight size={16} />
                </a>
              </div>
            </aside>
          </div>
        </div>
      </div>
      <SmartitboxCertificationsRow badges={data.badges} />
    </section>
  );
}

function StepCard({
  step,
  visible,
  stepNumber,
  totalSteps,
}: {
  step: Step;
  visible: boolean;
  stepNumber: number;
  totalSteps: number;
}) {
  const IconComp = ICON_MAP[step.iconName];
  return (
    <article
      data-step={step.id}
      className={`relative bg-white border border-gray-100 rounded-2xl p-4 transform transition-all duration-700 hover:shadow-xl hover:scale-105 group ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      aria-labelledby={`step-${step.id}-title`}
    >
      <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-lg flex items-center justify-center">
        <span className="text-sm font-bold text-gray-700">{stepNumber}</span>
      </div>

      <div className="flex flex-col items-start gap-6">
        <div
          className={`w-14 h-14 rounded-2xl bg-linear-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}
        >
          <IconComp size={18} className="text-white" aria-hidden />
        </div>

        <div className="space-y-3">
          <h4
            id={`step-${step.id}-title`}
            className="font-bold text-gray-900 group-hover:text-gray-800 transition-colors"
          >
            {step.title}
          </h4>
          <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
        </div>

        {stepNumber === totalSteps && (
          <div className="w-full h-1 bg-linear-to-r from-primary-500 via-amber-500 to-violet-500 rounded-full mt-2"></div>
        )}
      </div>
    </article>
  );
}

function EnhancedChannel({
  iconName,
  label,
  color,
}: {
  iconName: IconName;
  label: string;
  color?: string;
}) {
  const IconComp = ICON_MAP[iconName];
  return (
    <div className="flex flex-col items-center gap-3 group cursor-pointer">
      <div
        className={`w-16 h-16 bg-white rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 border border-gray-100`}
      >
        <IconComp size={24} className="text-black" />
      </div>
      <div className="text-xs font-medium text-gray-700 text-center leading-tight group-hover:text-gray-900 transition-colors">
        {label}
      </div>
    </div>
  );
}

function EnhancedBusCard({
  title,
  subtitle,
  iconName,
}: {
  title: string;
  subtitle: string;
  iconName: IconName;
}) {
  const IconComp = ICON_MAP[iconName];
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-all duration-300 group hover:scale-105">
      <div className="flex items-start gap-4">
        <div
          className={`w-12 h-12 rounded-lg bg-linear-to-br from-primary-500 to-primary-600 flex items-center text-white justify-center shadow-md`}
        >
          <IconComp />
        </div>
        <div>
          <div className="font-bold text-gray-900 group-hover:text-gray-800">
            {title}
          </div>
          <div className="text-sm text-gray-500 mt-1">{subtitle}</div>
        </div>
      </div>
    </div>
  );
}

function HighlightItem({
  iconName,
  title,
  description,
  gradient,
}: {
  iconName: IconName;
  title: string;
  description: string;
  gradient?: string;
}) {
  const IconComp = ICON_MAP[iconName];
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-gray-100 hover:bg-gray-50 transition-colors">
      <div
        className={`w-12 h-12 rounded-xl bg-linear-to-br ${
          gradient ?? "from-green-500 to-emerald-500"
        } flex items-center justify-center shadow-md shrink-0`}
      >
        <IconComp className="text-white" />
      </div>
      <div>
        <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
