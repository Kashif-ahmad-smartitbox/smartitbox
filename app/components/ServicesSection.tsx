"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { ArrowUpRight, Star } from "lucide-react";
import {
  motion,
  useInView,
  useAnimation,
  AnimatePresence,
  type Variants,
} from "framer-motion";

// Animation constants
const SPRING_CONFIG = {
  stiffness: 300,
  damping: 25,
  mass: 0.5,
};

const CONTAINER_VARIANTS: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const CHILD_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const STAT_VARIANTS: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.3 + i * 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

const SERVICE_ITEM_VARIANTS: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.4 + i * 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

interface ServicesSectionProps {
  data: {
    stats: Array<{
      value: string;
      label: string;
    }>;
    marqueeItems: string[];
    sectionLabel: string;
    headingPart1: string;
    headingPart2: string;
    viewAllButton: {
      text: string;
      href: string;
    };
    services: Array<{
      id: string;
      title: string;
      description: string;
      image: {
        url: string;
        alt: string;
      };
    }>;
  };
}

function ServicesSection({ data }: ServicesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const controls = useAnimation();
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const [activeService, setActiveService] = useState(data.services[0]);

  const handleViewAllClick = () => {
    console.log("View all work clicked");
    // Add navigation logic here
  };

  const handleServiceClick = (serviceId: string) => {
    const service = data.services.find((s) => s.id === serviceId);
    if (service) {
      setActiveService(service);
    }
    console.log(`Service clicked: ${serviceId}`);
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-primary-400 py-10 lg:py-24 overflow-hidden"
    >
      {/* STATS SECTION */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center"
          variants={CONTAINER_VARIANTS}
          initial="hidden"
          animate="visible"
        >
          {data.stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              custom={index}
              variants={STAT_VARIANTS}
              className="relative group"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-white/30"
              >
                <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                  {stat.value}
                </h3>
                <div className="h-0.5 w-12 bg-linear-to-r from-primary-600 to-primary-800 rounded-full mx-auto mb-4" />
                <p className="text-gray-700 font-medium">{stat.label}</p>
              </motion.div>
              {index !== data.stats.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 h-14 w-px bg-white/40 group-hover:bg-white/60 transition-colors duration-300" />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* MARQUEE SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="relative my-20 overflow-hidden"
      >
        {/* Background bar */}
        <motion.div
          animate={{ rotate: [-3, -3.5, -3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-white -rotate-3"
        />

        {/* Marquee content */}
        <div className="relative bg-white/95 backdrop-blur-sm py-6 border-y border-primary-200">
          <motion.div
            className="flex gap-12 whitespace-nowrap"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {[...data.marqueeItems, ...data.marqueeItems].map((item, index) => (
              <div
                key={`${item}-${index}`}
                className="inline-flex items-center gap-6"
              >
                <span className="text-xl font-semibold text-primary-800">
                  {item}
                </span>
                <Star size={16} className="text-primary-600 fill-primary-400" />
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* SERVICES HEADER */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <motion.div
          variants={CONTAINER_VARIANTS}
          initial="hidden"
          animate="visible"
          className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8"
        >
          <div>
            <motion.div
              variants={CHILD_VARIANTS}
              className="inline-flex items-center gap-3 mb-6 px-4 py-2.5 bg-white text-primary-800 text-sm font-semibold rounded-lg border border-white/50"
            >
              <span>{data.sectionLabel}</span>
            </motion.div>

            <motion.h2
              variants={CHILD_VARIANTS}
              className="text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight text-white"
            >
              {data.headingPart1}
              <br />
              <span className="relative inline-block">
                <span className="relative z-10 text-white">
                  {data.headingPart2}
                </span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                  transition={{
                    delay: 0.8,
                    duration: 0.8,
                    ease: "easeOut",
                  }}
                  className="absolute bottom-1 left-0 right-0 h-3 bg-white/30 z-0 rounded-lg"
                />
              </span>
            </motion.h2>
          </div>

          <motion.a
            variants={CHILD_VARIANTS}
            href={data.viewAllButton.href}
            onClick={handleViewAllClick}
            initial={false}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 30px -5px rgba(255, 255, 255, 0.3)",
            }}
            whileTap={{ scale: 0.98 }}
            transition={{
              type: "spring",
              stiffness: SPRING_CONFIG.stiffness,
              damping: SPRING_CONFIG.damping,
              mass: SPRING_CONFIG.mass,
            }}
            className="hidden lg:flex items-center justify-center w-32 h-32 rounded-full border-2 border-white text-white font-semibold hover:bg-white/10 transition-all duration-300"
          >
            <div className="text-center">
              <span className="block">{data.viewAllButton.text}</span>
              <ArrowUpRight className="inline-block ml-1" size={18} />
            </div>
          </motion.a>
        </motion.div>
      </div>

      {/* SERVICES CONTENT */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 border-t border-white/30">
          {/* LEFT LIST */}
          <div className="border-r border-white/30">
            <AnimatePresence>
              {data.services.map((service, index) => (
                <motion.div
                  key={service.id}
                  custom={index}
                  variants={SERVICE_ITEM_VARIANTS}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                  onMouseEnter={() => setActiveService(service)}
                  onClick={() => handleServiceClick(service.id)}
                  className={`p-8 cursor-pointer border-b border-white/30 transition-all duration-300 ${
                    activeService.id === service.id
                      ? "bg-white/20 backdrop-blur-sm shadow-lg"
                      : "bg-transparent"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-50 mb-3">
                        {service.title}
                      </h3>
                      <AnimatePresence mode="wait">
                        {activeService.id === service.id && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-white/90 leading-relaxed overflow-hidden"
                          >
                            {service.description}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                    <motion.div
                      whileHover={{ rotate: 45, scale: 1.1 }}
                      className="shrink-0 w-10 h-10 bg-white text-primary-600 rounded-full flex items-center justify-center ml-4"
                    >
                      <ArrowUpRight size={18} />
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* RIGHT IMAGE */}
          <div className="flex items-center justify-center p-8 lg:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeService.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="relative w-full max-w-md"
              >
                <div className="relative rounded-2xl overflow-hidden bg-white shadow-xl border border-white/50">
                  <Image
                    src={activeService.image.url}
                    alt={activeService.image.alt}
                    width={480}
                    height={360}
                    className="object-cover w-full h-auto rounded-2xl"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 480px"
                  />
                </div>
                <motion.div
                  className="absolute inset-0 rounded-2xl border-2 border-white/30 pointer-events-none"
                  animate={{
                    borderWidth: [2, 3, 2],
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile View All Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="lg:hidden mt-12 flex justify-center"
      >
        <motion.a
          href={data.viewAllButton.href}
          onClick={handleViewAllClick}
          initial={false}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 10px 30px -5px rgba(255, 255, 255, 0.3)",
          }}
          whileTap={{ scale: 0.98 }}
          transition={{
            type: "spring",
            stiffness: SPRING_CONFIG.stiffness,
            damping: SPRING_CONFIG.damping,
            mass: SPRING_CONFIG.mass,
          }}
          className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-white text-primary-600 font-semibold hover:bg-white/90 transition-all duration-300"
        >
          <span>{data.viewAllButton.text}</span>
          <ArrowUpRight size={18} />
        </motion.a>
      </motion.div>
    </section>
  );
}

export default ServicesSection;
