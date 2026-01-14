"use client";

import React from "react";

interface Principle {
  title: string;
  description: string;
}

interface Stats {
  projects: string;
  satisfaction: string;
}

interface Promise {
  title: string;
  description: string;
}

interface PrinciplesSection {
  title: string;
  description: string;
}

interface WhyWeExistSectionProps {
  data: {
    heading?: string;
    subheading?: string;
    logoSrc?: string;
    paragraphBlocks?: string[];
    principles?: Principle[];
    stats?: Stats;
    promise?: Promise;
    principlesSection?: PrinciplesSection;
  };
}

const defaultData = {
  heading: "Why we exist",
  subheading:
    "We design and build products that enable teams and creators to scale with confidence.",
  logoSrc: "/logo.png",
  paragraphBlocks: [
    "We believe in creating meaningful solutions that bridge the gap between technology and human needs. Our mission is to empower businesses with innovative tools that drive growth and foster lasting connections.",
    "In a world of constant change, we provide the stability and innovation needed to thrive. Our commitment to excellence shapes every product, service, and interaction.",
  ],
  principles: [
    {
      title: "Unified Vision",
      description:
        "Bringing together diverse perspectives to create cohesive, powerful solutions that work in harmony.",
    },
    {
      title: "Integrated Approach",
      description:
        "Seamlessly connecting technology, strategy, and execution for maximum impact and efficiency.",
    },
    {
      title: "Comprehensive Solutions",
      description:
        "Delivering end-to-end solutions that address every aspect of your challenges and opportunities.",
    },
  ],
  stats: {
    projects: "50+",
    satisfaction: "98%",
  },
  promise: {
    title: "Our Promise",
    description: "Delivering excellence through innovation and dedication",
  },
  principlesSection: {
    title: "Our Core Principles",
    description: "The foundation of everything we build and deliver",
  },
};

export default function WhyWeExistSection({ data }: WhyWeExistSectionProps) {
  // Merge data with defaults
  const content = React.useMemo(
    () => ({
      heading: data?.heading ?? defaultData.heading,
      subheading: data?.subheading ?? defaultData.subheading,
      logoSrc: data?.logoSrc ?? defaultData.logoSrc,
      paragraphBlocks: data?.paragraphBlocks ?? defaultData.paragraphBlocks,
      principles: data?.principles ?? defaultData.principles,
      stats: {
        projects: data?.stats?.projects ?? defaultData.stats.projects,
        satisfaction:
          data?.stats?.satisfaction ?? defaultData.stats.satisfaction,
      },
      promise: {
        title: data?.promise?.title ?? defaultData.promise.title,
        description:
          data?.promise?.description ?? defaultData.promise.description,
      },
      principlesSection: {
        title:
          data?.principlesSection?.title ?? defaultData.principlesSection.title,
        description:
          data?.principlesSection?.description ??
          defaultData.principlesSection.description,
      },
    }),
    [data]
  );

  const ParagraphBlock = React.useCallback(
    ({ text }: { text: string }) => (
      <div className="group">
        <div className="flex items-start gap-4">
          <div className="shrink-0 mt-1">
            <div className="w-6 h-6 rounded-full border-2 border-primary-200 grid place-items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
            </div>
          </div>
          <p className="text-base md:text-lg text-gray-700 leading-relaxed">
            {text}
          </p>
        </div>
      </div>
    ),
    []
  );

  const StatsSection = React.useCallback(
    () => (
      <div className="grid grid-cols-2 gap-6 pt-8 border-t border-gray-200">
        <div className="text-center">
          <div className="text-3xl md:text-4xl font-extrabold text-primary-700 mb-2">
            {content.stats.projects}
          </div>
          <div className="text-sm text-gray-600">Projects Delivered</div>
        </div>
        <div className="text-center">
          <div className="text-3xl md:text-4xl font-extrabold text-primary-700 mb-2">
            {content.stats.satisfaction}
          </div>
          <div className="text-sm text-gray-600">Client Satisfaction</div>
        </div>
      </div>
    ),
    [content.stats.projects, content.stats.satisfaction]
  );

  const PromiseCard = React.useCallback(
    () => (
      <aside
        className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-6 shadow-xl border border-gray-200 max-w-xs hidden lg:block"
        aria-labelledby="promise-title"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-primary-500" />
          </div>
          <h4
            id="promise-title"
            className="text-base font-semibold text-gray-900"
          >
            {content.promise.title}
          </h4>
        </div>
        <p className="text-sm text-gray-600 pl-11">
          {content.promise.description}
        </p>
      </aside>
    ),
    [content.promise.title, content.promise.description]
  );

  const LogoVisual = React.useCallback(
    () => (
      <div className="relative w-full">
        <div className="relative rounded-3xl p-6 lg:p-8 aspect-square lg:aspect-auto lg:h-96 flex items-center justify-center overflow-hidden bg-linear-to-br from-primary-50 to-white border border-gray-100 shadow-sm">
          <div className="relative z-10 p-8 rounded-2xl bg-white border border-gray-100 shadow-md">
            <div className="w-40 h-40 bg-primary-50 rounded-xl flex items-center justify-center border-2 border-primary-100">
              {content.logoSrc ? (
                <img
                  src={content.logoSrc}
                  alt="Company Logo"
                  className="w-32 h-32 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    const fallback = target.nextSibling as HTMLElement;
                    if (fallback) fallback.style.display = "flex";
                  }}
                />
              ) : null}
              <div className="w-32 h-32 hidden items-center justify-center">
                <div className="text-center">
                  <span className="text-3xl font-bold text-primary-600">
                    LOGO
                  </span>
                  <div className="text-sm text-primary-400 mt-1">Company</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <PromiseCard /> */}
      </div>
    ),
    [content.logoSrc, PromiseCard]
  );

  const PrincipleCard = React.memo(
    ({ principle, index }: { principle: Principle; index: number }) => (
      <article
        className="group relative rounded-2xl p-6 md:p-8 bg-white border border-gray-200 hover:shadow-lg hover:border-primary-300 transition-all duration-300"
        aria-labelledby={`principle-${index}-title`}
      >
        <div className="absolute -top-3 -left-3">
          <div className="w-10 h-10 rounded-xl grid place-items-center bg-primary-500 text-white font-bold">
            <span aria-hidden="true">{index + 1}</span>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-3">
            <div className="shrink-0 w-2 h-8 bg-primary-500 rounded-full" />
            <h4
              id={`principle-${index}-title`}
              className="text-xl font-bold text-gray-900"
            >
              {principle.title}
            </h4>
          </div>
          <p className="text-gray-600 leading-relaxed pl-5">
            {principle.description}
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-center gap-2 text-primary-600 text-sm font-medium">
            <span>Learn more</span>
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </div>
        </div>
      </article>
    )
  );

  PrincipleCard.displayName = "PrincipleCard";

  const PrinciplesSection = React.useCallback(
    () => (
      <section className="mt-16">
        <div className="bg-linear-to-b from-primary-50/30 to-white rounded-3xl p-6 lg:p-10 border border-gray-100">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-1 bg-primary-500 rounded-full" />
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                {content.principlesSection.title}
              </h3>
              <div className="w-12 h-1 bg-primary-500 rounded-full" />
            </div>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              {content.principlesSection.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.principles.map((principle, index) => (
              <PrincipleCard
                key={`${principle.title}-${index}`}
                principle={principle}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>
    ),
    [
      content.principles,
      content.principlesSection.title,
      content.principlesSection.description,
    ]
  );

  return (
    <section
      className="relative py-16 lg:py-24 overflow-hidden bg-white"
      aria-labelledby="whyweexist-heading"
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary-50/20 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-50/10 rounded-full translate-x-1/3 translate-y-1/3" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-20">
          <div className="space-y-10">
            <header className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-1 bg-primary-500 rounded-full" />
                <h2
                  id="whyweexist-heading"
                  className="text-3xl md:text-4xl font-bold text-gray-900"
                >
                  {content.heading}
                </h2>
              </div>
              <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
                {content.subheading}
              </p>
            </header>

            <div className="space-y-8">
              {content.paragraphBlocks.map((text, index) => (
                <ParagraphBlock key={`paragraph-${index}`} text={text} />
              ))}
            </div>

            <StatsSection />
          </div>

          <LogoVisual />
        </div>

        <PrinciplesSection />
      </div>
    </section>
  );
}
