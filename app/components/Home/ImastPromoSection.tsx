"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Play,
  X,
  Star,
  CheckCircle,
  Clock,
  Users,
  ArrowRight,
} from "lucide-react";

export default function SmartitboxPromoSection(props: any) {
  const [open, setOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Intersection Observer for fade-in animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // prevent background scroll when modal open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  // close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open && modalRef.current) modalRef.current.focus();
  }, [open]);

  return (
    <section
      ref={sectionRef}
      className={`${props.data.sectionBg} px-4 py-10 lg:py-20 overflow-hidden`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div
            className={`lg:col-span-6 transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <p className="text-lg font-semibold text-primary-600 uppercase tracking-wider mb-3">
              {props.data.badgeText}
            </p>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-6">
              <span className="block">{props.data.title}</span>
              <span
                className={`block text-transparent bg-clip-text bg-gradient-to-r ${props.data.gradientText} mt-4`}
              >
                {props.data.discountText}
              </span>
            </h1>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {props.data.features.map((feature: any, index: number) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle
                    className={`w-5 h-5 ${props.data.accentColor}`}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>

            <div className="text-md text-gray-700 space-y-4 leading-relaxed mb-8">
              {props.data.descriptionParagraphs.map(
                (paragraph: string, index: number) => (
                  <p
                    key={index}
                    dangerouslySetInnerHTML={{ __html: paragraph }}
                  />
                )
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a
                href={props.data.ctaLink}
                className="mt-4 rounded group inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]"
              >
                <span>{props.data.ctaText}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          {/* Right column - media */}
          <div
            className={`lg:col-span-6 flex justify-center lg:justify-end transition-all duration-700 delay-300 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <div className="relative w-full max-w-2xl">
              <div className="relative">
                <div className="relative w-full rounded-3xl border border-gray-100 overflow-hidden ring-1 ring-white/20 bg-white/10 backdrop-blur-sm">
                  <div className="relative w-full aspect-[16/10] bg-gradient-to-br from-gray-100 to-gray-200">
                    {/* Demo dashboard image */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900">
                      <img
                        src={props.data.posterSrc}
                        className="h-full"
                        alt=""
                      />
                      {/* Play button overlay */}
                      <button
                        aria-label={props.data.playButtonAriaLabel}
                        onClick={() => setOpen(true)}
                        className="absolute inset-0 flex items-center justify-center group focus:outline-none"
                      >
                        <div className="relative">
                          <div className="absolute inset-0 bg-white/20 rounded-full scale-150 group-hover:scale-170 transition-transform duration-300"></div>
                          <div className="relative bg-gradient-to-r from-primary-600 to-primary-700 rounded-full p-6 shadow-2xl group-hover:scale-110 transition-transform duration-300">
                            <Play className="w-8 h-8 text-white ml-1" />
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Card footer */}
                  <div className="p-6 bg-white/90 backdrop-blur-sm">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          {props.data.cardTitle}
                        </h3>
                        <p className="text-gray-600 leading-relaxed text-sm">
                          {props.data.cardDescription}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 ml-4">
                        <Clock className="w-4 h-4" />
                        <span>{props.data.videoDuration}</span>
                      </div>
                    </div>

                    <div className="mt-4 w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full bg-gradient-to-r ${props.data.gradientText}`}
                        style={{ width: props.data.progressWidth }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg p-4 border border-gray-300">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">
                      {props.data.floatingDiscount.value}
                    </div>
                    <div className="text-xs font-medium text-gray-600">
                      {props.data.floatingDiscount.label}
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg p-3 border border-gray-300">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="text-sm font-semibold text-gray-700">
                      {props.data.floatingTimeline.value}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal / Lightbox */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={props.data.modalAriaLabel}
          tabIndex={-1}
          ref={modalRef}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
          style={{ background: "rgba(0,0,0,0.8)" }}
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-7xl bg-black rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src={props.data.videoSrc}
              controls
              autoPlay
              className="w-full h-[70vh] max-h-[80vh] object-contain bg-black"
            />

            <button
              aria-label="Close video"
              onClick={() => setOpen(false)}
              className="absolute top-6 right-6 z-20 inline-flex items-center justify-center h-12 w-12 rounded-full bg-white/90 text-gray-800 shadow-lg hover:bg-white hover:scale-110 transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="absolute bottom-6 left-6 right-6 bg-gradient-to-t from-black/80 to-transparent p-6 pt-16 pointer-events-none">
              <h3 className="text-white text-xl font-bold mb-2">
                {props.data.modalTitle}
              </h3>
              <p className="text-white/80 text-sm">
                {props.data.modalDescription}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
