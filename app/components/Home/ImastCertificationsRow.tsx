"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const DEFAULT_BADGES = [
  {
    id: "gdpr",
    title: "GDPR",
    href: "/compliance#gdpr",
    src: "/badges/gdpr.png",
  },
  {
    id: "soc2",
    title: "SOC 2",
    href: "/compliance#soc2",
    src: "/badges/soc2.png",
  },
  {
    id: "iso27001",
    title: "ISO 27001",
    href: "/compliance#iso27001",
    src: "/badges/iso-27001.png",
  },
  {
    id: "pcidss",
    title: "PCI DSS",
    href: "/compliance#pcidss",
    src: "/badges/pcidss.png",
  },
  {
    id: "iso27018",
    title: "ISO 27018",
    href: "/compliance#iso27018",
    src: "/badges/iso-27018.png",
  },
  {
    id: "iso14001",
    title: "ISO 14001",
    href: "/compliance#iso14001",
    src: "/badges/iso-14001.png",
  },
];

export default function SmartitboxCertificationsRow({
  badges = DEFAULT_BADGES,
}) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const msPerBadge = 700;
    const pauseAfterCycle = 900;

    function startLoop() {
      let idx = 0;
      setTimeout(() => setActiveIndex(0), 50);
      intervalRef.current = window.setInterval(() => {
        idx += 1;
        if (idx >= badges.length) {
          // finish cycle
          setActiveIndex(-1);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setTimeout(() => {
            if (!isPaused) startLoop();
          }, pauseAfterCycle);
          return;
        }
        setActiveIndex(idx);
      }, msPerBadge);
    }

    if (!isPaused) startLoop();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [badges.length, isPaused]);

  const handleMouseEnter = (index: number) => {
    // pause autoplay and highlight hovered badge
    setIsPaused(true);
    setActiveIndex(index);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
  const handleMouseLeave = () => {
    setIsPaused(false);
    setActiveIndex(-1);
  };

  return (
    <section className="relative w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 lg:pt-16">
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-red-600">
            Certified & Compliant
          </h3>
          <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-gray-900">
            Enterprise-Grade Security Standards
          </h2>
          <p className="mt-2 text-sm text-gray-600 max-w-xl">
            Adhering to global compliance frameworks to ensure your data remains
            protected with the highest security certifications
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
          className="relative"
        >
          {/* make grid overflow-visible so the tooltip can escape */}
          <div className="relative grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-8 overflow-visible">
            {badges.map((badge, index) => {
              const isActive = index === activeIndex;

              return (
                <motion.a
                  key={badge.id}
                  href={badge.href ?? "#"}
                  // accessibility: remove title (native tooltip) but keep aria-label
                  aria-label={badge.title}
                  // avoid clipping of children by allowing overflow and ensuring z-index layering
                  className="group relative flex flex-col items-center justify-center p-4 sm:p-6 bg-white rounded-2xl shadow-xs border border-gray-200/80 hover:shadow-lg transition-all duration-300 hover:border-blue-300/50 z-10 overflow-visible"
                  whileHover={{ scale: 1.06, y: -6 }}
                  whileTap={{ scale: 0.98 }}
                  animate={{
                    scale: isActive ? 1.06 : 1,
                    y: isActive ? -6 : 0,
                  }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={() => handleMouseLeave()}
                >
                  {/* background layers - pointer-events-none so they don't block hover */}
                  <div className="absolute inset-0 bg-linear-to-br from-white to-blue-50/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg pointer-events-none" />

                  {/* content above border */}
                  <div className="relative z-10 w-full flex justify-center">
                    <Image
                      src={badge.src}
                      alt={badge.title}
                      width={120}
                      height={48}
                      className="object-contain transition-all duration-300 group-hover:scale-105 h-20 w-auto"
                    />
                  </div>

                  {/* titles */}
                  <div className="relative z-10 mt-3">
                    <span className="text-xs sm:text-sm font-medium text-gray-700 text-center group-hover:text-gray-900 transition-colors duration-300 block lg:hidden">
                      {badge.title.split(" ")[0]}
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-gray-700 text-center group-hover:text-gray-900 transition-colors duration-300 hidden lg:block">
                      {badge.title}
                    </span>
                  </div>

                  {/* custom tooltip (desktop) - visible on hover or when autoplay highlights the badge */}
                  <div
                    className={`absolute -bottom-14 left-1/2 transform -translate-x-1/2 px-3 py-2 bg-gray-900 text-white text-xs font-medium rounded-lg transition-all duration-300 pointer-events-none hidden lg:block ${
                      isActive
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-2"
                    }`}
                    aria-hidden="true"
                  >
                    {badge.title}
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                  </div>
                </motion.a>
              );
            })}
          </div>

          {/* horizontal connection line for desktop */}
          <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-px bg-linear-to-r from-transparent via-gray-300/50 to-transparent hidden lg:block" />
        </motion.div>
      </div>
    </section>
  );
}
