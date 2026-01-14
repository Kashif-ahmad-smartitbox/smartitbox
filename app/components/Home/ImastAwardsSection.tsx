"use client";

import React, {
  memo,
  useRef,
  useState,
  useEffect,
  useCallback,
  KeyboardEvent,
} from "react";
import Image from "next/image";
import {
  Award,
  Calendar,
  Play,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Trophy,
} from "lucide-react";

/* ----- Types ----- */
type Media =
  | {
      type: "image";
      src: string;
      alt?: string;
      width?: number;
      height?: number;
    }
  | {
      type: "video";
      src: string;
      poster?: string;
      alt?: string;
      width?: number;
      height?: number;
    };

type AwardItem = {
  title: string;
  issuer: string;
  year?: number;
  description?: string;
  logo?: string;
  media?: Media;
};

interface SmartitboxAwardsSectionProps {
  data: {
    awardHeader: {
      title: string;
      description: string;
    };
    awards: AwardItem[];
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

/* ----- Lightbox Modal ----- */
function Lightbox({
  open,
  onClose,
  media,
  title,
}: {
  open: boolean;
  onClose: () => void;
  media?: Media;
  title?: string;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!open && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [open]);

  if (!open || !media) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title ?? "Media preview"}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4"
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-xl bg-white">
        <button
          aria-label="Close preview"
          onClick={onClose}
          className="absolute right-2 top-2 z-20 rounded-full bg-white/90 p-2 shadow sm:right-3 sm:top-3"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-full h-full flex items-center justify-center bg-black">
          {media.type === "image" ? (
            <div className="relative w-full h-0 pb-[56.25%]">
              {" "}
              {/* 16:9 aspect ratio */}
              <Image
                src={media.src}
                alt={media.alt ?? title ?? "Image"}
                layout="fill"
                objectFit="contain"
                priority
              />
            </div>
          ) : (
            <video
              ref={videoRef}
              src={media.src}
              poster={media.poster}
              controls
              autoPlay
              className="max-h-[90vh] w-full h-auto"
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ----- MediaBlock (card-level) ----- */
function MediaBlock({
  media,
  heading,
  onOpenLightbox,
  setPlayingFromPoster,
}: {
  media?: Media;
  heading?: string;
  onOpenLightbox?: () => void;
  setPlayingFromPoster?: (v: boolean) => void;
}) {
  if (!media) return null;

  const overlayHeading = (
    <div className="absolute left-2 right-2 bottom-2 sm:left-3 sm:right-3 sm:bottom-3 md:left-4 md:right-4 md:bottom-4 flex items-center">
      <div className="bg-gradient-to-t from-black/70 to-transparent backdrop-blur-sm rounded-md px-2 py-1.5 sm:px-3 sm:py-2 w-full">
        <h4 className="text-xs sm:text-sm md:text-base font-semibold text-white leading-tight truncate">
          {heading}
        </h4>
      </div>
    </div>
  );

  if (media.type === "image") {
    return (
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] bg-slate-50 overflow-hidden rounded-t-lg sm:rounded-t-xl">
        <Image
          src={media.src}
          alt={media.alt ?? heading ?? "Award image"}
          layout="fill"
          objectFit="cover"
          placeholder="blur"
          blurDataURL="/_placeholder.png"
        />
        {overlayHeading}
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] bg-slate-50 overflow-hidden rounded-t-lg sm:rounded-t-xl">
      {media.poster ? (
        <Image
          src={media.poster}
          alt={media.alt ?? heading ?? "Award video poster"}
          layout="fill"
          objectFit="cover"
          placeholder="blur"
          blurDataURL="/_placeholder.png"
        />
      ) : (
        <div className="absolute inset-0 bg-black/10" />
      )}

      <div className="absolute inset-0 flex items-center justify-center">
        <button
          aria-label={`Play ${heading ?? "video"}`}
          onClick={() => {
            setPlayingFromPoster?.(true);
            onOpenLightbox?.();
          }}
          className="bg-black/50 hover:bg-black/60 active:bg-black/70 rounded-full p-2 sm:p-3 transition-shadow shadow-lg"
        >
          <Play className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
        </button>
      </div>

      {overlayHeading}
    </div>
  );
}

/* ----- Award Card ----- */
function AwardCard({
  award,
  openLightbox,
}: {
  award: AwardItem;
  openLightbox: (media?: Media, title?: string) => void;
}) {
  return (
    <article
      className="group bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer flex-shrink-0 w-[280px] xs:w-[300px] sm:w-[320px] md:w-[350px] lg:w-[380px] transition-all duration-500 border border-gray-200/60 hover:border-primary-300/50"
      tabIndex={0}
      aria-labelledby={`award-title-${award.title}`}
      onKeyDown={(e: KeyboardEvent) => {
        if (e.key === "Enter" && award.media) {
          openLightbox(award.media, award.title);
        }
      }}
      style={{ scrollSnapAlign: "start" }}
    >
      {/* Background effect */}
      <div className="absolute inset-0 rounded-xl sm:rounded-2xl md:rounded-3xl bg-gradient-to-br from-primary-500 to-primary-600 opacity-0 group-hover:opacity-5 transition-opacity duration-500" />

      {/* Animated border */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary-200/30 rounded-xl sm:rounded-2xl md:rounded-3xl transition-all duration-500" />

      {/* Media Section */}
      <div
        className="relative"
        onClick={() => award.media && openLightbox(award.media, award.title)}
      >
        <MediaBlock
          media={award.media}
          heading={award.title}
          onOpenLightbox={() => openLightbox(award.media, award.title)}
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-5 md:p-6 relative z-10">
        <div className="flex items-start gap-3 sm:gap-4">
          {/* Enhanced Icon */}
          <div
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl md:rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white shadow-lg flex-shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500"
            aria-hidden
          >
            <Award className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform duration-300" />
          </div>

          {/* Text Content */}
          <div className="flex-1 min-w-0">
            {/* Title and Year */}
            <div className="flex items-start justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
              <h4
                id={`award-title-${award.title}`}
                className="text-sm sm:text-base md:text-lg font-bold text-gray-900 group-hover:text-primary-700 transition-colors duration-300 line-clamp-2 leading-tight flex-1"
              >
                {award.title}
              </h4>
              {award.year && (
                <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600 bg-gray-50 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full flex-shrink-0 border border-gray-200 group-hover:bg-primary-50 group-hover:border-primary-200 group-hover:text-primary-700 transition-all duration-300">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="font-medium">{award.year}</span>
                </div>
              )}
            </div>

            {/* Issuer */}
            <p className="text-xs sm:text-sm md:text-base text-primary-600 font-semibold mb-2 sm:mb-3 group-hover:!text-primary-700 transition-colors duration-300 line-clamp-1">
              {award.issuer}
            </p>

            <p
              className="text-xs sm:text-sm text-gray-700 leading-relaxed overflow-hidden group-hover:!text-gray-800 transition-colors duration-300"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
              }}
            >
              {award.description}
            </p>
          </div>
        </div>
      </div>

      {/* Hover accent line */}
      <div className="absolute bottom-0 left-4 right-4 sm:left-6 sm:right-6 h-0.5 sm:h-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

      {/* Corner accents */}
      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 w-1 h-1 sm:w-2 sm:h-2 border-t border-r border-primary-500/0 group-hover:border-primary-500/50 transition-all duration-500 delay-200" />
      <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 w-1 h-1 sm:w-2 sm:h-2 border-b border-l border-primary-500/0 group-hover:border-primary-500/50 transition-all duration-500 delay-300" />
    </article>
  );
}

export default memo(function SmartitboxAwardsSection({
  data,
}: SmartitboxAwardsSectionProps) {
  const { awardHeader, awards = [], autoplayConfig = {}, styling = {} } = data;

  const {
    delay: AUTOPLAY_DELAY = 3000,
    resumeAfterInteraction: RESUME_AFTER_INTERACTION = 2000,
  } = autoplayConfig;

  const {
    backgroundColor = "bg-transparent",
    textColor = "text-white",
    cardBackground = "bg-white",
  } = styling;

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const autoplayTimerRef = useRef<number | null>(null);
  const interactionTimeoutRef = useRef<number | null>(null);

  // Scroll-to-index helper
  const scrollToIndex = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const container = scrollContainerRef.current;
      if (!container) return;
      const child = container.children[index] as HTMLElement | undefined;
      if (!child) return;

      const left = child.offsetLeft;
      container.scrollTo({ left, behavior });
    },
    []
  );

  // Update arrow visibility based on scroll position
  const checkScrollButtons = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    setShowLeftArrow(container.scrollLeft > 5);
    setShowRightArrow(
      container.scrollLeft + container.clientWidth < container.scrollWidth - 5
    );
  }, []);

  // When container scrolls (user scroll), update state & arrows
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const onScroll = () => {
      checkScrollButtons();
      const children = Array.from(container.children) as HTMLElement[];
      if (!children.length) return;
      const scrollLeft = container.scrollLeft;
      let nearest = 0;
      let minDiff = Infinity;
      children.forEach((c, i) => {
        const diff = Math.abs(c.offsetLeft - scrollLeft);
        if (diff < minDiff) {
          minDiff = diff;
          nearest = i;
        }
      });
      setCurrentIndex(nearest);
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    checkScrollButtons();

    return () => {
      container.removeEventListener("scroll", onScroll);
    };
  }, [checkScrollButtons]);

  // Pause/resume helpers
  const pauseTemporarily = useCallback(() => {
    setIsPaused(true);
    if (interactionTimeoutRef.current) {
      window.clearTimeout(interactionTimeoutRef.current);
    }
    interactionTimeoutRef.current = window.setTimeout(() => {
      setIsPaused(false);
      interactionTimeoutRef.current = null;
    }, RESUME_AFTER_INTERACTION);
  }, [RESUME_AFTER_INTERACTION]);

  // Mouse/touch/wheel handlers
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const onEnter = () => setIsPaused(true);
    const onLeave = () => {
      if (interactionTimeoutRef.current)
        window.clearTimeout(interactionTimeoutRef.current);
      interactionTimeoutRef.current = window.setTimeout(() => {
        setIsPaused(false);
        interactionTimeoutRef.current = null;
      }, 250);
    };
    const onWheel = () => pauseTemporarily();
    const onTouchStart = () => pauseTemporarily();

    container.addEventListener("mouseenter", onEnter);
    container.addEventListener("mouseleave", onLeave);
    container.addEventListener("wheel", onWheel, { passive: true });
    container.addEventListener("touchstart", onTouchStart, { passive: true });

    return () => {
      container.removeEventListener("mouseenter", onEnter);
      container.removeEventListener("mouseleave", onLeave);
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("touchstart", onTouchStart);
      if (interactionTimeoutRef.current) {
        window.clearTimeout(interactionTimeoutRef.current);
        interactionTimeoutRef.current = null;
      }
    };
  }, [pauseTemporarily]);

  // Autoplay effect
  useEffect(() => {
    if (autoplayTimerRef.current) {
      window.clearInterval(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }

    if (isPaused || awards.length <= 1) return;

    autoplayTimerRef.current = window.setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % awards.length;
        scrollToIndex(next, "smooth");
        return next;
      });
    }, AUTOPLAY_DELAY);

    return () => {
      if (autoplayTimerRef.current) {
        window.clearInterval(autoplayTimerRef.current);
        autoplayTimerRef.current = null;
      }
    };
  }, [isPaused, awards.length, scrollToIndex, AUTOPLAY_DELAY]);

  // Arrow controls
  const goToPrev = () => {
    setCurrentIndex((prev) => {
      const next = prev <= 0 ? awards.length - 1 : prev - 1;
      scrollToIndex(next, "smooth");
      pauseTemporarily();
      return next;
    });
  };

  const goToNext = () => {
    setCurrentIndex((prev) => {
      const next = (prev + 1) % awards.length;
      scrollToIndex(next, "smooth");
      pauseTemporarily();
      return next;
    });
  };

  // Lightbox controls
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxMedia, setLightboxMedia] = useState<Media | undefined>(
    undefined
  );
  const [lightboxTitle, setLightboxTitle] = useState<string | undefined>(
    undefined
  );

  const openLightbox = (media?: Media, title?: string) => {
    if (!media) return;
    setLightboxMedia(media);
    setLightboxTitle(title);
    setLightboxOpen(true);
    setIsPaused(true);
    if (interactionTimeoutRef.current) {
      window.clearTimeout(interactionTimeoutRef.current);
      interactionTimeoutRef.current = null;
    }
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setLightboxMedia(undefined);
    setLightboxTitle(undefined);
    if (interactionTimeoutRef.current)
      window.clearTimeout(interactionTimeoutRef.current);
    interactionTimeoutRef.current = window.setTimeout(() => {
      setIsPaused(false);
      interactionTimeoutRef.current = null;
    }, RESUME_AFTER_INTERACTION);
  };

  // On mount, ensure first slide snapped into place
  useEffect(() => {
    scrollToIndex(0, "auto");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className={`relative py-8 sm:py-12 md:py-16 ${textColor}`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 sm:mb-10 md:mb-12 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold sm:font-extrabold mb-3 sm:mb-4">
            {awardHeader.title}
          </h2>
          <p className="text-sm sm:text-base md:text-lg opacity-90 max-w-2xl mx-auto leading-relaxed">
            {awardHeader.description}
          </p>
        </div>

        <div className="relative">
          {/* Left Arrow */}
          {showLeftArrow && (
            <button
              onClick={goToPrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-2 sm:p-3 shadow-lg transition-all duration-200 hover:scale-110 -ml-2 sm:-ml-4 md:-ml-6"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-800" />
            </button>
          )}

          {/* Right Arrow */}
          {showRightArrow && (
            <button
              onClick={goToNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-2 sm:p-3 shadow-lg transition-all duration-200 hover:scale-110 -mr-2 sm:-mr-4 md:-mr-6"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-800" />
            </button>
          )}

          {/* Slider container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 sm:gap-6 md:gap-8 overflow-x-auto pb-6 sm:pb-8 scrollbar-hide"
            style={{
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            aria-roledescription="carousel"
          >
            {awards.map((award, idx) => (
              <AwardCard key={idx} award={award} openLightbox={openLightbox} />
            ))}
          </div>
        </div>

        {/* Auto-play status indicator */}
        <div className="flex justify-center mt-6 sm:mt-8">
          <div className="flex items-center gap-2 text-xs sm:text-sm opacity-80">
            <span className="text-center">
              {isPaused
                ? "Paused — interacting"
                : "Auto-play slider — hover or scroll to pause"}
            </span>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </div>
        </div>
      </div>

      <Lightbox
        open={lightboxOpen}
        onClose={closeLightbox}
        media={lightboxMedia}
        title={lightboxTitle}
      />

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
});
