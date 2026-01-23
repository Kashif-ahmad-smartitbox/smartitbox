"use client";
import React, { useRef } from "react";
import { ArrowUpRight, MessageCircle, ChevronUp } from "lucide-react";
import {
  motion,
  useInView,
  useAnimation,
  AnimatePresence,
  type Variants,
} from "framer-motion";
import Image from "next/image";

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
      staggerChildren: 0.15,
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

const OFFERING_VARIANTS: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.3 + i * 0.15,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

interface CoreOfferingsSectionProps {
  data: {
    headingPart1: string;
    headingPart2: string;
    subheading: string;
    contactButton: {
      text: string;
      href: string;
    };
    image: {
      url: string;
      alt: string;
    };
    offerings: Array<{
      title: string;
      items: string[];
    }>;
    whatsappButton: {
      text: string;
      phoneNumber: string;
    };
  };
}

function CoreOfferingsSection({ data }: CoreOfferingsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const controls = useAnimation();
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const handleContactClick = () => {
    console.log("Contact button clicked");
    // Add contact logic here
  };

  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${data.whatsappButton.phoneNumber}`, "_blank");
  };

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-white py-10 lg:py-24 overflow-hidden"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading Section */}
        <div className="text-center mb-20">
          <AnimatePresence mode="wait">
            <motion.div
              key="headings"
              variants={CONTAINER_VARIANTS}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <motion.h2
                variants={CHILD_VARIANTS}
                className="text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight text-gray-900"
              >
                {data.headingPart1}
                <br />
                <span className="relative inline-block">
                  <span className="relative z-10 bg-linear-to-r from-primary-500 to-orange-500 bg-clip-text text-transparent">
                    {data.headingPart2}
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
              </motion.h2>
              <motion.p
                variants={CHILD_VARIANTS}
                className="mt-4 text-xl font-semibold text-gray-900"
              >
                {data.subheading}
              </motion.p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-10">
          {/* LEFT COLUMN */}
          <div className="relative">
            {/* Divider line with animation */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
              className="absolute top-0 left-0 w-full h-px bg-gray-200 origin-left"
            />

            {/* Image Container */}
            <div className="mt-5 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={
                  isInView
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.9 }
                }
                transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                className="relative rounded-2xl overflow-hidden shadow-2xl shadow-gray-900/10 border border-gray-100"
              >
                <Image
                  src={data.image.url}
                  alt={data.image.alt}
                  width={420}
                  height={500}
                  className="object-cover w-full h-auto rounded-2xl"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 420px"
                />
              </motion.div>

              {/* Decorative semi circle */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={
                  isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                }
                transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
                className="hidden lg:block absolute -left-24 top-1/2 -translate-y-1/2"
              >
                <div className="w-44 h-72 border border-gray-300 rounded-r-full" />
              </motion.div>
            </div>
            <motion.a
              href={data.contactButton.href}
              onClick={handleContactClick}
              initial={false}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 30px -5px rgba(251, 191, 36, 0.3)",
              }}
              whileTap={{ scale: 0.98 }}
              transition={{
                type: "spring",
                stiffness: SPRING_CONFIG.stiffness,
                damping: SPRING_CONFIG.damping,
                mass: SPRING_CONFIG.mass,
              }}
              className="mt-5 inline-flex items-center bg-linear-to-r from-primary-500 to-orange-500 hover:bg-primary-600 text-white font-semibold px-10 py-4 rounded-full gap-2 group"
            >
              <span>{data.contactButton.text}</span>
              <ArrowUpRight
                size={18}
                className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200"
              />
            </motion.a>
          </div>

          {/* RIGHT COLUMN - Offerings */}
          <div className="space-y-14">
            <AnimatePresence>
              {data.offerings.map((offering, offeringIndex) => (
                <motion.div
                  key={offering.title}
                  custom={offeringIndex}
                  variants={OFFERING_VARIANTS}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  className="group"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {offering.title}
                  </h3>
                  <ul className="space-y-3 text-gray-600 text-[17px] leading-relaxed">
                    {offering.items.map((item, itemIndex) => (
                      <motion.li
                        key={item}
                        initial={{ opacity: 0, x: -10 }}
                        animate={
                          isInView
                            ? { opacity: 1, x: 0 }
                            : { opacity: 0, x: -10 }
                        }
                        transition={{
                          delay: 0.4 + offeringIndex * 0.15 + itemIndex * 0.05,
                          duration: 0.3,
                        }}
                        className="flex items-start gap-3 group-hover:text-gray-800 transition-colors duration-200"
                      >
                        <div className="shrink-0 w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center mt-1">
                          <div className="w-2 h-2 rounded-full bg-linear-to-r from-primary-500 to-orange-500" />
                        </div>
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CoreOfferingsSection;
