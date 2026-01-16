"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Star, Quote, Award, Trophy, ChevronRight } from "lucide-react";
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

interface ClientsSectionProps {
  data: {
    sectionLabel: string;
    headingPart1: string;
    headingPart2: string;
    clientCount: string;
    stats: Array<{
      value: string;
      label: string;
      icon: string;
    }>;
    testimonials: Array<{
      quote: string;
      author: string;
      role: string;
      rating: number;
    }>;
    clients: Array<{
      name: string;
      logo: string;
      industry?: string;
    }>;
  };
}

// Auto-scrolling marquee component
interface AutoScrollMarqueeProps {
  clients: Array<{ name: string; logo: string; industry?: string }>;
  direction: "left" | "right";
  speed: number;
  rowIndex: number;
}

function AutoScrollMarquee({
  clients,
  direction,
  speed,
  rowIndex,
}: AutoScrollMarqueeProps) {
  const [isPaused, setIsPaused] = useState(false);
  const duplicatedClients = [...clients, ...clients, ...clients];

  return (
    <motion.div
      className="flex gap-5 items-center py-4"
      animate={{
        x:
          direction === "left"
            ? ["0%", `-${100 / 3}%`]
            : [`-${100 / 3}%`, "0%"],
      }}
      transition={{
        duration: speed,
        repeat: Infinity,
        ease: "linear",
        repeatType: "loop",
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{ animationPlayState: isPaused ? "paused" : "running" }}
    >
      {duplicatedClients.map((client, index) => (
        <motion.div
          key={`${client.name}-${rowIndex}-${index}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.02 + rowIndex * 0.1 }}
          whileHover={{
            scale: 1.15,
            y: -5,
            transition: { type: "spring", stiffness: 400, damping: 25 },
          }}
          className="shrink-0 w-30 lg:w-48 h-14 lg:h-28 bg-white rounded-2xl border border-gray-200 flex items-center justify-center p-2 lg:p-6 group transition-all duration-300 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-linear-to-br from-primary-50/0 to-primary-100/0 group-hover:from-white group-hover:to-white transition-all duration-300" />

          <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary-200/30 transition-all duration-300" />

          <div className="relative w-full h-full flex items-center justify-center">
            <div className="relative w-32 h-8 lg:h-16">
              <Image
                src={client.logo}
                alt={client.name}
                fill
                className="object-contain transition-all duration-300 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 128px"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  target.parentElement!.innerHTML = `
                    <div class="w-full h-full flex items-center justify-center bg-primary-50 rounded-lg">
                      <span class="text-lg font-semibold text-primary-600">${client.name}</span>
                    </div>
                  `;
                }}
              />
            </div>
          </div>

          {/* Industry badge - appears on hover */}
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            whileHover={{ opacity: 1, y: 0, scale: 1 }}
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-primary-500 text-white text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap"
          >
            {client.industry}
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  );
}

// Helper function to split clients into rows dynamically
function splitClientsIntoRows(clients: Array<any>, rows: number = 3) {
  const rowsArray = [];
  const clientsPerRow = Math.ceil(clients.length / rows);

  for (let i = 0; i < rows; i++) {
    const start = i * clientsPerRow;
    const end = start + clientsPerRow;
    rowsArray.push(clients.slice(start, end));
  }

  return rowsArray;
}

function ClientsSection({ data }: ClientsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const controls = useAnimation();
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const clientRows = splitClientsIntoRows(data.clients, 3);

  const rowConfigs = [
    { direction: "left" as const, speed: 30 },
    { direction: "right" as const, speed: 40 },
    { direction: "left" as const, speed: 35 },
  ];

  // Icon mapping
  const iconMap: { [key: string]: React.ReactNode } = {
    star: <Star size={20} />,
    quote: <Quote size={20} />,
    award: <Award size={20} />,
    trophy: <Trophy size={20} />,
  };

  // Star rating component
  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={14}
          className={
            i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }
        />
      ))}
    </div>
  );

  if (!isClient) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative bg-primary-200 py-5 lg:py-24 overflow-hidden"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER SECTION */}
        <AnimatePresence mode="wait">
          <motion.div
            key="clients-header"
            variants={CONTAINER_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="text-center max-w-4xl mx-auto"
          >
            {/* Section label */}
            <motion.div
              variants={CHILD_VARIANTS}
              className="inline-flex items-center gap-3 mb-8 px-4 py-2.5 bg-linear-to-r from-primary-50 to-primary-100 text-secondary-900 text-sm font-semibold rounded-lg border border-primary-200/50"
            >
              <span>{data.sectionLabel}</span>
            </motion.div>

            {/* Main heading */}
            <motion.h2
              variants={CHILD_VARIANTS}
              className="text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight text-gray-900 mb-6"
            >
              <span className="relative inline-block mr-3">
                <span className="relative z-10 text-primary-600">
                  {data.clientCount}
                </span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                  transition={{
                    delay: 0.5,
                    duration: 0.8,
                    ease: "easeOut",
                  }}
                  className="absolute bottom-1 left-0 right-0 h-3 bg-primary-100/50 z-0 rounded-lg"
                />
              </span>
              {data.headingPart1}
              <br />
              <span className="relative inline-block">
                <span className="relative z-10 text-primary-600 bg-clip-text">
                  {data.headingPart2}
                </span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                  transition={{
                    delay: 0.7,
                    duration: 0.8,
                    ease: "easeOut",
                  }}
                  className="absolute bottom-1 left-0 right-0 h-3 bg-primary-100/50 z-0 rounded-lg"
                />
              </span>
            </motion.h2>

            {/* Stats grid */}
            <motion.div
              variants={CHILD_VARIANTS}
              className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-2"
            >
              <AnimatePresence>
                {data.stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="group relative"
                  >
                    <div className="bg-white rounded-xl p-6 border border-gray-200 transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <motion.div
                          whileHover={{ rotate: 10, scale: 1.1 }}
                          className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center"
                        >
                          <div className="text-primary-500">
                            {iconMap[stat.icon]}
                          </div>
                        </motion.div>
                        <div>
                          <div className="text-2xl font-bold text-gray-900">
                            {stat.value}
                          </div>
                          <div className="text-sm text-gray-600 mt-1 text-nowrap">
                            {stat.label}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* TESTIMONIALS CAROUSEL */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-20"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {data.testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.2 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white rounded-2xl p-8 border border-gray-200 transition-all duration-300"
              >
                <div className="mb-6">
                  <Quote size={32} className="text-primary-300 rotate-180" />
                </div>
                <p className="text-gray-600 italic mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="mb-6">
                  <StarRating rating={testimonial.rating} />
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                    <div className="text-lg font-semibold text-primary-500">
                      {testimonial.author.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">
                      {testimonial.author}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-24"
        >
          {/* Section label */}
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Trusted by {data.clients.length}+ Industry Leaders Worldwide
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our clients span across{" "}
              {new Set(data.clients.map((c) => c.industry)).size}+ industries
              globally
            </p>
          </div>

          {/* Dynamic rows of auto-scrolling logos */}
          <div className="space-y-2">
            {clientRows.map((rowClients, rowIndex) => (
              <div
                key={`row-${rowIndex}`}
                className="relative overflow-hidden rounded-2xl bg-linear-to-r from-primary-50/20 to-primary-100/10"
              >
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-white to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-white to-transparent z-10 pointer-events-none" />

                <AutoScrollMarquee
                  clients={rowClients}
                  direction={rowConfigs[rowIndex]?.direction || "left"}
                  speed={rowConfigs[rowIndex]?.speed || 35}
                  rowIndex={rowIndex}
                />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default ClientsSection;
