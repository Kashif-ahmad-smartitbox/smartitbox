"use client";

import React from "react";

export interface FounderData {
  heading?: string;
  quote: string;
  name: string;
  title?: string;
  imageSrc: string;
  imageAlt?: string;
  layout?: "image-left" | "image-right" | "centered";
  showDecoration?: boolean;
  variant?: "default" | "minimal" | "elegant";
  badgeText?: string;
}

interface WordsFromFounderProps {
  data: FounderData;
}

const defaultData = {
  heading: "Words From Our Founder",
  title: "Founder SMARTITBOX",
  imageAlt: "Founder photo",
  layout: "image-left" as const,
  showDecoration: true,
  variant: "default" as const,
  badgeText: "Founder's Message",
};

const layoutConfig = {
  "image-left": {
    imageOrder: "order-1",
    textOrder: "order-2",
    textAlign: "lg:pl-12 xl:pl-16",
    gridClass: "grid-cols-1 lg:grid-cols-2",
  },
  "image-right": {
    imageOrder: "order-2",
    textOrder: "order-1",
    textAlign: "lg:pr-12 xl:pr-16",
    gridClass: "grid-cols-1 lg:grid-cols-2",
  },
  centered: {
    imageOrder: "order-1",
    textOrder: "order-2",
    textAlign: "text-center",
    gridClass: "grid-cols-1",
  },
} as const;

const variantConfig = {
  default: {
    container: "bg-white",
    quoteCard: "bg-white rounded-2xl border-2 border-primary-100",
    quoteText: "text-gray-700 text-lg leading-relaxed",
    nameText: "text-gray-900 font-bold text-lg",
    titleText: "text-primary-600 font-medium",
    imageContainer:
      "rounded-2xl border-4 border-white bg-gradient-to-br from-primary-50 to-primary-100 p-4",
    imageStyle: "rounded-xl",
    hasAccentBar: true,
    hasFrame: true,
  },
  minimal: {
    container: "bg-white",
    quoteCard: "bg-transparent border-l-4 border-primary-300 pl-6",
    quoteText: "text-gray-600 text-lg leading-relaxed italic",
    nameText: "text-gray-800 font-semibold",
    titleText: "text-primary-500",
    imageContainer: "rounded-lg border-2 border-primary-100 bg-white p-3",
    imageStyle: "rounded-md",
    hasAccentBar: false,
    hasFrame: true,
  },
  elegant: {
    container: "",
    quoteCard:
      "bg-white rounded-3xl border border-primary-100 backdrop-blur-sm",
    quoteText: "text-gray-800 text-lg leading-relaxed",
    nameText: "text-gray-900 font-bold text-lg",
    titleText: "text-primary-600 font-medium",
    imageContainer:
      "rounded-3xl border-8 border-white bg-gradient-to-br from-primary-100 to-primary-200 p-6",
    imageStyle: "rounded-2xl",
    hasAccentBar: true,
    hasFrame: true,
  },
} as const;

export default function WordsFromFounder({ data }: WordsFromFounderProps) {
  const content = {
    heading: data.heading || defaultData.heading,
    quote: data.quote,
    name: data.name,
    title: data.title || defaultData.title,
    imageSrc: data.imageSrc,
    imageAlt: data.imageAlt || defaultData.imageAlt,
    layout: data.layout || defaultData.layout,
    showDecoration: data.showDecoration ?? defaultData.showDecoration,
    variant: data.variant || defaultData.variant,
    badgeText: data.badgeText || defaultData.badgeText,
  };

  const { imageOrder, textOrder, textAlign, gridClass } =
    layoutConfig[content.layout];
  const variantStyles = variantConfig[content.variant];

  const ImageComponent = React.useCallback(
    () => (
      <div className="flex justify-center">
        <div
          className={`relative w-full max-w-md ${
            content.layout === "centered" ? "max-w-sm" : ""
          }`}
        >
          {/* Main Image Container with Frame */}
          <div className="relative group">
            <div
              className={`${variantStyles.imageContainer} transition-all duration-500 group-hover:scale-[1.02] group-hover:border-primary-200`}
            >
              <img
                src={content.imageSrc}
                alt={content.imageAlt}
                className={`w-full h-auto object-cover ${variantStyles.imageStyle} transition-transform duration-500 group-hover:scale-105`}
                loading="lazy"
              />
            </div>

            {/* Elegant badge for elegant variant */}
            {content.variant === "elegant" && (
              <div className="absolute -bottom-3 -right-3 bg-white rounded-full shadow-lg px-4 py-2 transform transition-transform duration-500 group-hover:scale-105 border border-primary-100">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary-400" />
                  <span className="text-sm font-semibold text-primary-700">
                    Founder
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    ),
    [
      content.imageSrc,
      content.imageAlt,
      content.layout,
      content.showDecoration,
      content.variant,
      variantStyles,
    ]
  );

  const HeadingComponent = React.useCallback(() => {
    const words = content.heading.split(" ");
    const lastWord = words.pop();
    const firstPart = words.join(" ");

    return (
      <div className="mb-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-200 mb-6">
          <div className="w-2 h-2 rounded-full bg-primary-400" />
          <span className="text-sm font-semibold uppercase tracking-wide text-primary-700">
            {content.badgeText}
          </span>
        </div>

        <h2
          className={`font-bold text-gray-900 ${
            content.variant === "minimal"
              ? "text-2xl lg:text-3xl"
              : content.variant === "elegant"
              ? "text-3xl lg:text-4xl"
              : "text-2xl lg:text-3xl"
          }`}
        >
          {firstPart} <span className="text-primary-600">{lastWord}</span>
        </h2>
      </div>
    );
  }, [content.heading, content.variant, content.badgeText]);

  const AuthorSection = React.useCallback(
    () => (
      <div className="flex items-center gap-4">
        <div className="shrink-0">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg bg-linear-to-br from-primary-500 to-primary-600 shadow-sm">
            {content.name.charAt(0)}
          </div>
        </div>
        <div>
          <div className={variantStyles.nameText}>{content.name}</div>
          {content.title && (
            <div className={`${variantStyles.titleText} text-sm mt-1`}>
              {content.title}
            </div>
          )}
        </div>
      </div>
    ),
    [content.name, content.title, variantStyles]
  );

  const QuoteCard = React.useCallback(
    () => (
      <div
        className={`${variantStyles.quoteCard} p-8 lg:p-10 relative transition-all duration-500 group hover:border-primary-200`}
      >
        {/* Accent Bar */}
        {variantStyles.hasAccentBar && (
          <div
            className="absolute left-0 top-8 bottom-8 w-1 rounded-r-full bg-linear-to-b from-primary-400 to-primary-500 transition-all duration-500 group-hover:from-primary-500 group-hover:to-primary-600"
            aria-hidden="true"
          />
        )}

        {/* Quote icon */}
        <div
          className="absolute top-6 right-6 opacity-5 group-hover:opacity-10 transition-opacity"
          aria-hidden="true"
        >
          <svg
            className="w-16 h-16 text-primary-500"
            fill="currentColor"
            viewBox="0 0 32 32"
          >
            <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
          </svg>
        </div>

        <div className={variantStyles.hasAccentBar ? "pl-6" : ""}>
          {/* Quote */}
          <blockquote
            className={`${variantStyles.quoteText} mb-8 relative z-10`}
          >
            &quot;{content.quote}&quot;
          </blockquote>

          {/* Author */}
          <AuthorSection />
        </div>

        {/* Corner accents */}
        {content.variant === "elegant" && (
          <>
            <div className="absolute top-4 left-4 w-3 h-3 border-t-2 border-l-2 border-primary-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute top-4 right-4 w-3 h-3 border-t-2 border-r-2 border-primary-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-4 left-4 w-3 h-3 border-b-2 border-l-2 border-primary-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-4 right-4 w-3 h-3 border-b-2 border-r-2 border-primary-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </>
        )}
      </div>
    ),
    [content.quote, variantStyles, AuthorSection]
  );

  const TextContent = React.useCallback(
    () => (
      <div className={textAlign}>
        <HeadingComponent />
        <QuoteCard />
      </div>
    ),
    [textAlign, HeadingComponent, QuoteCard]
  );

  const CenteredLayout = React.useCallback(
    () => (
      <div className="text-center max-w-4xl mx-auto">
        <div className="mb-12">
          <ImageComponent />
        </div>
        <TextContent />
      </div>
    ),
    [ImageComponent, TextContent]
  );

  const SideBySideLayout = React.useCallback(
    () => (
      <div className={`grid ${gridClass} gap-12 lg:gap-16 items-center`}>
        <div className={imageOrder}>
          <ImageComponent />
        </div>
        <div className={textOrder}>
          <TextContent />
        </div>
      </div>
    ),
    [gridClass, imageOrder, textOrder, ImageComponent, TextContent]
  );

  return (
    <section
      className={`py-16 lg:py-24 ${variantStyles.container} relative overflow-hidden`}
    >
      {/* <BackgroundDecoration /> */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {content.layout === "centered" ? (
          <CenteredLayout />
        ) : (
          <SideBySideLayout />
        )}
      </div>
    </section>
  );
}
