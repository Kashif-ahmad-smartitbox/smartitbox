"use client";
import React, { memo, useMemo } from "react";
import { CheckCircle, Target, Users } from "lucide-react";

type ValueItem = {
  title: string;
  description: string;
};

function ValueCard({ value, index }: { value: ValueItem; index: number }) {
  return (
    <article
      aria-labelledby={`value-title-${index}`}
      className="group relative bg-white rounded-xl p-6 border border-slate-100 hover:border-primary-200 hover:bg-primary-600 text-slate-900 hover:text-slate-100 cursor-pointer transition-all duration-300 hover:shadow-lg"
      tabIndex={0}
      role="button"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-xl"
          aria-hidden
        >
          <CheckCircle />
        </div>

        <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm font-medium">
          {index + 1}
        </div>
      </div>

      <div>
        <h3
          id={`value-title-${index}`}
          className="text-xl font-semibold mb-3 leading-tight"
        >
          {value.title}
        </h3>

        <p
          className={`text-[15px] text-slate-600 leading-relaxed overflow-hidden transition-[max-height,color] duration-300`}
        >
          {value.description}
        </p>

        <style>
          {`/* CSS to make group hover/focus control p maxHeight */
          .group:focus p, .group:hover p { max-height: 400px; color: inherit; }
          .group:hover .text-slate-600 { color: rgb(255 255 255 / 1); }
        `}
        </style>
      </div>
    </article>
  );
}

export default memo(function SmartitboxValuesSection(props: any) {
  const valuesList = useMemo(() => props.data.values, [props.data.values]);

  return (
    <section className="relative">
      <div className="relative">
        <div className="w-full h-[250px] md:h-[300px] lg:h-[500px] overflow-hidden bg-linear-to-br from-slate-900/20 to-primary-900/10">
          <img
            src={props.data.heroImage.src}
            alt={props.data.heroImage.alt}
            className="w-full h-full object-cover object-top mix-blend-overlay"
            loading="eager"
            decoding="async"
          />
        </div>

        <div className="relative z-30 -mt-[60px] md:-mt-20 lg:-mt-[50px]">
          <div className="w-[94vw] md:w-[86vw] lg:w-[76vw] max-w-6xl mx-auto">
            <div className="bg-white rounded-3xl ring-1 ring-slate-200 p-8 md:p-12 lg:p-16">
              <div className="max-w-5xl mx-auto">
                <header className="text-center mb-8 md:mb-12">
                  <p className="text-2xl font-semibold text-primary-600 uppercase tracking-wide">
                    {props.data.sectionBadge}
                  </p>
                  <h2
                    id="impact-heading"
                    className="mt-2 text-2xl sm:text-3xl font-extrabold text-gray-900"
                  >
                    {props.data.title
                      .split("\n")
                      .map((line: any, i: number) => (
                        <span key={i} className="block">
                          &quot;{line}&quot;
                        </span>
                      ))}
                  </h2>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 md:mb-16">
                  {valuesList.map((value: any, i: number) => (
                    <ValueCard key={i} value={value} index={i} />
                  ))}
                </div>

                <div className="text-center">
                  <a
                    href={props.data.ctaHref}
                    className="inline-block rounded-full px-6 py-3 text-sm font-medium uppercase ring-1 ring-slate-900/5 hover:shadow-md transition"
                  >
                    {props.data.ctaText}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-18 md:h-20 lg:h-25" />
    </section>
  );
});
