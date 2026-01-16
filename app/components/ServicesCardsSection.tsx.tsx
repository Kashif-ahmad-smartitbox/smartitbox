"use client";
import React, { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useInView,
  AnimatePresence,
  type Variants,
} from "framer-motion";

// Animation constants matching HeroSection
const SPRING_CONFIG = {
  stiffness: 300,
  damping: 25,
  mass: 0.5,
};

// Animation variants with proper typing
const SECTION_VARIANTS: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const CARD_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const IMAGE_VARIANTS: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

interface ServiceCardData {
  isImageCard?: boolean;
  imageSrc?: string;
  imageAlt?: string;
  title?: string;
  description?: string;
  bgColor?: string;
}

interface ServiceCardProps {
  service: ServiceCardData;
  index: number;
  isInView: boolean;
}

interface ServicesCardsSectionProps {
  data: {
    services: ServiceCardData[];
  };
}

function ServicesCardsSection({ data }: ServicesCardsSectionProps) {
  console.log("data", JSON.stringify(data));

  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  // Use data from props or fallback to default
  const services = data?.services || [
    {
      isImageCard: true,
      imageSrc:
        "https://res.cloudinary.com/diefvxqdv/image/upload/v1765950707/smartitbox/media/ux-788002_1280.jpg",
      imageAlt: "Abstract design",
    },
    {
      title: "Web Design",
      description:
        "Web design usually refers to the user experience aspects of website development rather than software development.",
      bgColor: "bg-primary-300",
    },
    {
      title: "Digital Transformation",
      description:
        "Digital transformation is the incorporation of computer-based technologies into an organization's products, processes and strategies.",
      bgColor: "bg-primary-100",
    },
  ];

  return (
    <motion.section
      ref={sectionRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={SECTION_VARIANTS}
      className="bg-white pt-20 overflow-hidden"
    >
      {/* Background decorative element */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={
            isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
          }
          transition={{ delay: 0.3, duration: 0.8 }}
          className="absolute -top-10 left-0 w-64 h-64 bg-primary-100/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-4">
          <AnimatePresence mode="wait">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                service={service}
                index={index}
                isInView={isInView}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
}

function ServiceCard({ service, index, isInView }: ServiceCardProps) {
  const {
    isImageCard = false,
    imageSrc,
    imageAlt,
    title = "",
    description = "",
    bgColor = "bg-primary-50",
  } = service;

  return (
    <motion.div
      variants={CARD_VARIANTS}
      custom={index}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      whileHover={{
        y: -8,
        transition: {
          type: "spring",
          stiffness: SPRING_CONFIG.stiffness,
          damping: SPRING_CONFIG.damping,
          mass: SPRING_CONFIG.mass,
        },
      }}
      className={`group relative rounded-2xl ${bgColor} border border-gray-50 p-6 lg:p-8 overflow-hidden`}
    >
      {/* Hover effect background */}
      <motion.div
        className="absolute inset-0 bg-linear-to-br from-primary-200/0 via-primary-300/0 to-primary-400/0 group-hover:from-primary-200/10 group-hover:via-primary-300/5 group-hover:to-primary-400/10 transition-all duration-500"
        initial={false}
      />

      {/* Card content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center">
        {isImageCard && imageSrc ? (
          <motion.div
            variants={IMAGE_VARIANTS}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="w-full"
          >
            <Image
              src={imageSrc}
              alt={imageAlt || "Service image"}
              width={320}
              height={220}
              className="object-contain w-full h-auto"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 320px"
            />
          </motion.div>
        ) : (
          <>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="text-xl lg:text-2xl font-semibold text-secondary-900 mb-4 text-center"
            >
              {title}
            </motion.h3>

            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="h-0.5 w-12 bg-linear-to-r from-primary-400 to-primary-300 rounded-full mb-6"
            />

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="text-sm lg:text-base leading-relaxed text-secondary-600 text-center"
            >
              {description}
            </motion.p>
          </>
        )}
      </div>

      {/* Border animation */}
      <motion.div
        className="absolute inset-0 rounded-2xl border-2 border-primary-200/20 pointer-events-none"
        animate={{
          borderWidth: [2, 3, 2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          delay: 1 + index * 0.2,
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
}

export default ServicesCardsSection;
