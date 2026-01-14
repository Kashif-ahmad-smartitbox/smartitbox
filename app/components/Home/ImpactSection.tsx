"use client";
import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export type Stat = {
  value: string;
  label: string;
};

export type ImageRef =
  | string
  | {
      src: string;
      alt?: string;
      width?: number;
      height?: number;
    };

export type ImpactData = {
  backgroundImage?: ImageRef;
  overlayImage?: ImageRef;
  headline: {
    title: string;
    subtitle?: string;
  };
  stats: Stat[];
  button?: {
    text: string;
    href: string;
    ariaLabel?: string;
  };
  className?: string;
};

type Props = {
  data: ImpactData;
};

export default function ImpactSection({ data }: Props) {
  const backgroundImage =
    typeof data.backgroundImage === "string"
      ? { src: data.backgroundImage, alt: "", width: 700, height: 400 }
      : data.backgroundImage || { src: "", alt: "", width: 700, height: 400 };

  const overlayImage =
    typeof data.overlayImage === "string"
      ? { src: data.overlayImage, alt: "", width: 120, height: 120 }
      : data.overlayImage || null;

  const { headline, stats, button } = data;

  return (
    <section
      className={`relative bg-primary-700 text-white overflow-hidden ${
        data.className ?? ""
      }`}
    >
      {backgroundImage?.src ? (
        <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none select-none z-0">
          <Image
            src={backgroundImage.src}
            alt={backgroundImage.alt ?? ""}
            width={backgroundImage.width ?? 700}
            height={backgroundImage.height ?? 400}
            priority={false}
          />
        </div>
      ) : null}

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28 relative z-10">
        {overlayImage?.src ? (
          <img
            src={
              typeof overlayImage === "string" ? overlayImage : overlayImage.src
            }
            className="w-30 mb-6"
            alt={typeof overlayImage === "string" ? "" : overlayImage.alt ?? ""}
          />
        ) : null}

        <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight max-w-3xl">
          {headline.title}
          {headline.subtitle ? (
            <>
              <br />
              {headline.subtitle}
            </>
          ) : null}
        </h2>

        <dl className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-4 max-w-4xl">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col">
              <dt className="text-2xl md:text-3xl font-extrabold">{s.value}</dt>
              <dd className="text-sm text-primary-100">{s.label}</dd>
            </div>
          ))}
        </dl>

        {button ? (
          <div className="mt-10">
            <a
              href={button.href}
              aria-label={button.ariaLabel ?? button.text}
              className="inline-flex items-center gap-2 rounded-md border border-white/40 bg-white/10 px-6 py-3 text-sm md:text-base font-semibold hover:bg-white hover:text-primary-700 transition"
            >
              {button.text}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export type { Props as ImpactSectionProps };
