"use client";

import React, { useEffect, useRef, useState } from "react";
import { Play, X, ArrowLeft, ArrowRight } from "lucide-react";

export type Slide = {
  id: string;
  image: string;
  name?: string;
  role?: string;
  videoUrl: string;
  alt?: string;
};

export type LifeVideoData = {
  title?: string;
  paragraphs?: string[];
  buttonText?: string;
  buttonHref?: string;
  slides: Slide[];
  autoplay?: boolean;
  autoplayIntervalMs?: number;
};

export default function LifeVideoSection({ data }: { data: LifeVideoData }) {
  const {
    title = "Life At SMARTITBOX",
    paragraphs = [],
    buttonText = "Join Our Team",
    buttonHref = "/careers",
    slides = [],
    autoplay = true,
    autoplayIntervalMs = 5000,
  } = data ?? {};

  const [index, setIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalVideoUrl, setModalVideoUrl] = useState<string | null>(null);

  const autoplayRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playButtonRef = useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // start/stop autoplay
  useEffect(() => {
    if (!autoplay || slides.length <= 1) return;
    function start() {
      stop();
      autoplayRef.current = window.setInterval(() => {
        setIndex((i) => (i + 1) % slides.length);
      }, autoplayIntervalMs);
    }
    function stop() {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
        autoplayRef.current = null;
      }
    }
    start();
    const node = containerRef.current;
    const onEnter = () => stop();
    const onLeave = () => start();
    node?.addEventListener("mouseenter", onEnter);
    node?.addEventListener("mouseleave", onLeave);
    node?.addEventListener("focusin", onEnter);
    node?.addEventListener("focusout", onLeave);
    return () => {
      stop();
      node?.removeEventListener("mouseenter", onEnter);
      node?.removeEventListener("mouseleave", onLeave);
      node?.removeEventListener("focusin", onEnter);
      node?.removeEventListener("focusout", onLeave);
    };
  }, [autoplay, autoplayIntervalMs, slides.length]);

  // keyboard nav for slides
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (isModalOpen) return;
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % slides.length);
      if (e.key === "ArrowLeft")
        setIndex((i) => (i - 1 + slides.length) % slides.length);
      if (e.key === "Home") setIndex(0);
      if (e.key === "End") setIndex(slides.length - 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [slides.length, isModalOpen]);

  // open modal
  function openModalWithVideo(url: string) {
    if (!url) return;
    setModalVideoUrl(url);
    setIsModalOpen(true);
  }

  // close modal + cleanup
  function closeModal() {
    setIsModalOpen(false);
    try {
      const v = videoRef.current;
      if (v) {
        v.pause();
        v.currentTime = 0;
        v.removeAttribute("src");
        v.load();
      }
    } catch (_) {}
    setTimeout(() => playButtonRef.current?.focus(), 0);
  }

  // when modal opens: attach src and try play; trap Esc and Tab
  useEffect(() => {
    if (!isModalOpen) return;
    const v = videoRef.current;
    if (v && modalVideoUrl) {
      v.src = modalVideoUrl;
      const p = v.play();
      if (p && typeof p.then === "function") p.catch(() => {});
    }
    closeButtonRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeModal();
      if (e.key === "Tab") {
        const focusable = [closeButtonRef.current].filter(
          Boolean
        ) as HTMLElement[];
        if (focusable.length === 0) return;
        const first = focusable[0];
        if (!document.activeElement) return;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isModalOpen, modalVideoUrl]);

  const [fadeKey, setFadeKey] = useState(0);
  useEffect(() => {
    setFadeKey((k) => k + 1);
  }, [index]);

  const nextSlide = () => setIndex((i) => (i + 1) % slides.length);
  const prevSlide = () =>
    setIndex((i) => (i - 1 + slides.length) % slides.length);

  return (
    <section
      className="py-20 lg:py-28 relative overflow-hidden"
      aria-label="Life at SMARTITBOX"
    >
      {/* Vibrant Background */}
      <div className="absolute inset-0 bg-linear-to-br from-primary-500 via-primary-600 to-primary-700"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <div className="lg:col-span-5 text-white">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 mb-8">
              <div className="w-2 h-2 rounded-full bg-black animate-pulse" />
              <span className="text-sm font-semibold uppercase tracking-wide text-black">
                Our Culture
              </span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              {title.split(" ").slice(0, -1).join(" ")}{" "}
              <span className="bg-linear-to-r from-white to-primary-100 bg-clip-text text-transparent">
                {title.split(" ").slice(-1)}
              </span>
            </h2>

            <div className="space-y-4 text-primary-50 mb-8">
              {paragraphs.map((p, i) => (
                <p key={i} className="text-lg leading-relaxed opacity-90">
                  {p}
                </p>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={buttonHref}
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-primary-600 font-bold text-lg shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50"
              >
                {buttonText}
              </a>
              <button
                onClick={() => openModalWithVideo(slides[index]?.videoUrl)}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl border-2 border-white text-white font-bold text-lg hover:bg-white hover:text-primary-600 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50"
              >
                <Play className="w-5 h-5" />
                Watch Story
              </button>
            </div>
          </div>

          {/* Right: Carousel */}
          <div className="lg:col-span-7" ref={containerRef}>
            <div className="relative">
              {/* Main Carousel Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-linear-to-br from-white to-primary-50 p-4">
                <div
                  key={fadeKey}
                  className="w-full h-[500px] rounded-2xl overflow-hidden bg-linear-to-br from-primary-100 to-primary-200 transition-all duration-500 ease-out"
                >
                  {slides[index] ? (
                    <img
                      src={slides[index].image}
                      alt={
                        slides[index].alt ??
                        slides[index].name ??
                        `Slide ${index + 1}`
                      }
                      className="w-full h-full object-cover block transform transition-transform duration-700 ease-out hover:scale-110"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-primary-200 to-primary-300 flex items-center justify-center">
                      <div className="text-primary-500 text-lg">Loading...</div>
                    </div>
                  )}
                </div>

                {/* Play Button Overlay */}
                <button
                  ref={playButtonRef}
                  onClick={() => openModalWithVideo(slides[index]?.videoUrl)}
                  aria-label={`Play ${slides[index]?.name ?? "video"}`}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-white bg-opacity-95 backdrop-blur-sm flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50 group"
                  title="Play video"
                >
                  <div className="w-16 h-16 rounded-full bg-linear-to-r from-primary-500 to-primary-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                    <Play className="w-8 h-8 text-white fill-current ml-1" />
                  </div>
                </button>
              </div>

              {/* Slide Info & Dots */}
              <div className="mt-6 flex items-center justify-between">
                {/* Slide Info */}
                {(slides[index]?.name || slides[index]?.role) && (
                  <div className="text-white">
                    {slides[index]?.name && (
                      <div className="font-bold text-lg">
                        {slides[index].name}
                      </div>
                    )}
                    {slides[index]?.role && (
                      <div className="text-primary-100 text-sm">
                        {slides[index].role}
                      </div>
                    )}
                  </div>
                )}

                {/* Dots Indicator */}
                {slides.length > 1 && (
                  <div
                    className="flex gap-3"
                    role="tablist"
                    aria-label="Slide selector"
                  >
                    {slides.map((s, i) => (
                      <button
                        key={s.id}
                        role="tab"
                        aria-selected={i === index}
                        aria-label={`Go to slide ${i + 1}: ${s.name ?? s.id}`}
                        onClick={() => setIndex(i)}
                        className={`w-3 h-3 rounded-full transition-all transform focus:outline-none focus:ring-2 focus:ring-white ${
                          i === index
                            ? "bg-white scale-125 shadow-lg"
                            : "bg-white bg-opacity-50 hover:scale-110 hover:bg-opacity-70"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {isModalOpen && modalVideoUrl && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Video player"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={closeModal}
            aria-hidden
          />

          <div className="relative z-10 w-full max-w-4xl mx-auto bg-linear-to-br from-primary-900 to-primary-800 rounded-3xl overflow-hidden shadow-2xl border border-primary-600">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-primary-700">
              <h3 className="text-xl font-bold text-white">
                Life at SMARTITBOX
              </h3>
              <button
                ref={closeButtonRef}
                onClick={closeModal}
                aria-label="Close video"
                className="p-3 rounded-xl bg-primary-700 hover:bg-primary-600 text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Video */}
            <div className="p-6">
              <video
                ref={videoRef}
                controls
                playsInline
                preload="metadata"
                className="w-full h-auto max-h-[70vh] bg-black rounded-xl shadow-lg"
                poster={slides[index]?.image}
              >
                <source src={modalVideoUrl} type="video/mp4" />
                Your browser does not support HTML video.
              </video>
            </div>
          </div>
        </div>
      )}

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
