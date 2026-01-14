"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  ChevronRight,
  CheckCircle,
  Clock,
  Users,
  Zap,
  Target,
} from "lucide-react";
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

const STEP_VARIANTS: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.3 + i * 0.1,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const IMAGE_VARIANTS: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 40 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

interface WorkProcessSectionProps {
  data: {
    sectionLabel: string;
    headingPart1: string;
    headingPart2: string;
    moreAboutButton: {
      text: string;
      href: string;
    };
    image: {
      url: string;
      alt: string;
    };
    steps: Array<{
      step: string;
      title: string;
      description: string;
    }>;
    stats: Array<{
      value: string;
      label: string;
      icon: string;
    }>;
  };
}

function WorkProcessSection({ data }: WorkProcessSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const controls = useAnimation();
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const handleMoreAboutClick = () => {
    console.log("More about clicked");
  };

  const iconMap: { [key: string]: React.ReactNode } = {
    clock: <Clock size={20} />,
    users: <Users size={20} />,
    zap: <Zap size={20} />,
    target: <Target size={20} />,
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-white to-gray-50/30 py-20 lg:py-24 overflow-hidden"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-start">
        <div className="relative">
          <motion.div
            variants={CONTAINER_VARIANTS}
            initial="hidden"
            animate="visible"
            className="relative"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute -top-10 -left-10 z-20"
            >
              <div className="bg-white rounded-xl p-4 border border-gray-100 w-48">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    {iconMap[data.stats[0]?.icon || "clock"]}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">
                      {data.stats[0]?.value}
                    </div>
                    <div className="text-xs text-gray-600">
                      {data.stats[0]?.label}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="relative">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="absolute -left-6 top-0 bottom-0 w-12 z-10"
              >
                <div className="relative h-full w-full">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "100%" }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="absolute left-1/2 top-0 w-0.5 bg-linear-to-b from-primary-400 via-primary-300 to-transparent -translate-x-1/2"
                  />

                  {[0, 1, 2].map((node) => (
                    <motion.div
                      key={node}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8 + node * 0.2 }}
                      className={`absolute left-1/2 w-4 h-4 rounded-full bg-white border-2 border-primary-400 -translate-x-1/2 ${
                        node === 0
                          ? "top-1/4"
                          : node === 1
                          ? "top-1/2"
                          : "top-3/4"
                      }`}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-400 mx-auto mt-0.5" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                variants={CHILD_VARIANTS}
                className="absolute left-4 top-40 w-56 h-96 bg-primary-500/10 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-primary-200/30 overflow-hidden"
              >
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 left-0 w-20 h-20 border-2 border-primary-400 rounded-full" />
                  <div className="absolute bottom-0 right-0 w-32 h-32 border-2 border-primary-300 rounded-full" />
                </div>

                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative"
                >
                  <svg
                    width="140"
                    height="320"
                    viewBox="0 0 140 320"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2.5, ease: "easeInOut" }}
                      d="M70 20 C40 80, 100 140, 70 200 C40 260, 100 300, 70 300"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      className="text-primary-400"
                    />
                    {[0, 1, 2].map((i) => (
                      <motion.circle
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1 + i * 0.3 }}
                        cx={70}
                        cy={80 + i * 90}
                        r="6"
                        fill="currentColor"
                        className="text-primary-500"
                      />
                    ))}
                  </svg>
                </motion.div>
              </motion.div>

              <motion.div
                variants={IMAGE_VARIANTS}
                className="relative z-10 ml-12"
              >
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "320px", opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="relative h-30 bg-linear-to-r from-primary-400 via-primary-500 to-primary-600 rounded-t-3xl mx-auto overflow-hidden"
                >
                  <div className="absolute inset-0 bg-linear-to-b from-primary-400/40 via-primary-500/20 to-transparent" />
                  <div className="absolute top-4 left-8 text-white text-sm font-semibold">
                    Work Process Flow
                  </div>

                  <div className="absolute bottom-4 left-8 flex gap-2">
                    {[...Array(7)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.7 + i * 0.1 }}
                        className={`w-2 h-2 rounded-full ${
                          i <= (hoveredStep || 0) ? "bg-white" : "bg-white/30"
                        }`}
                      />
                    ))}
                  </div>
                </motion.div>

                <div className="relative w-80 h-125 rounded-b-3xl overflow-hidden shadow-2xl shadow-gray-900/10 border border-gray-100 group">
                  <Image
                    src={data.image.url}
                    alt={data.image.alt}
                    width={320}
                    height={500}
                    className="object-cover w-full h-full rounded-b-3xl grayscale group-hover:grayscale-0 transition-all duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 320px"
                  />

                  <div className="absolute inset-0 bg-linear-to-t from-gray-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <motion.div
                    className="absolute inset-0 rounded-b-3xl border-2 border-primary-200/30 pointer-events-none"
                    animate={{
                      borderWidth: [2, 4, 2],
                      opacity: [0.2, 0.5, 0.2],
                    }}
                    transition={{
                      delay: 1,
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />

                  {/* Floating label */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg text-sm font-medium"
                  >
                    Team Collaboration
                  </motion.div>
                </div>

                {/* Stats bar below image */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="mt-6 grid grid-cols-2 gap-1"
                >
                  {data.stats.slice(1).map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.2 + index * 0.1 }}
                      whileHover={{ y: -4 }}
                      className="bg-white rounded-xl p-4 border border-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                          {iconMap[stat.icon]}
                        </div>
                        <div>
                          <div className="text-lg font-bold text-gray-900">
                            {stat.value}
                          </div>
                          <div className="text-xs text-gray-600">
                            {stat.label}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Connecting line with animation */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "80px" }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                  className="relative w-px h-20 mx-auto"
                >
                  <div className="absolute inset-0 w-px bg-linear-to-b from-primary-400 to-transparent" />
                  <motion.div
                    animate={{ y: [0, 80, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute top-0 left-1/2 w-2 h-2 rounded-full bg-primary-500 -translate-x-1/2"
                  />
                </motion.div>

                {/* Circular button with enhanced effects */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 1.4, type: "spring", stiffness: 200 }}
                  className="flex justify-center"
                >
                  <motion.button
                    onClick={handleMoreAboutClick}
                    initial={false}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 20px 40px -10px rgba(251, 191, 36, 0.4)",
                      borderColor: "#f59e0b",
                      rotate: 5,
                    }}
                    whileTap={{ scale: 0.98 }}
                    transition={{
                      type: "spring",
                      stiffness: SPRING_CONFIG.stiffness,
                      damping: SPRING_CONFIG.damping,
                      mass: SPRING_CONFIG.mass,
                    }}
                    className="relative w-40 h-40 rounded-full border-2 border-gray-800 bg-white flex flex-col items-center justify-center font-semibold text-gray-900 shadow-2xl shadow-gray-900/10 group overflow-hidden"
                  >
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-5">
                      <div className="absolute top-0 left-0 w-20 h-20 border border-primary-300 rounded-full" />
                      <div className="absolute bottom-0 right-0 w-32 h-32 border border-primary-200 rounded-full" />
                    </div>

                    <span className="text-lg mb-2 relative z-10">
                      {data.moreAboutButton.text}
                    </span>
                    <ArrowUpRight
                      size={24}
                      className="text-primary-500 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-300 relative z-10"
                    />

                    {/* Pulsing ring effect */}
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 border-2 border-primary-300 rounded-full"
                    />
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* RIGHT SIDE - CONTENT (Two-column layout) */}
        <div className="relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key="process-content"
              variants={CONTAINER_VARIANTS}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {/* Section label */}
              <motion.div
                variants={CHILD_VARIANTS}
                className="inline-flex items-center gap-3 mb-8 px-4 py-2.5 bg-linear-to-r from-primary-50 to-primary-100 text-secondary-900 text-sm font-semibold rounded-lg border border-primary-200/50"
              >
                <span>{data.sectionLabel}</span>
              </motion.div>

              {/* Main heading with description */}
              <motion.div variants={CHILD_VARIANTS} className="mb-12">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight text-gray-900 mb-6">
                  {data.headingPart1}
                  <br />
                  <span className="relative inline-block">
                    <span className="relative z-10 text-primary-500 bg-clip-text">
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
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
                  Our structured 7-step methodology ensures your project is
                  delivered with precision, efficiency, and exceptional quality
                  at every phase of development.
                </p>
              </motion.div>

              {/* Two-column steps grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <AnimatePresence>
                  {data.steps.map((step, index) => (
                    <motion.div
                      key={step.step}
                      custom={index}
                      variants={STEP_VARIANTS}
                      initial="hidden"
                      animate="visible"
                      onMouseEnter={() => setHoveredStep(index)}
                      onMouseLeave={() => setHoveredStep(null)}
                      whileHover={{
                        scale: 1.02,
                        boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.1)",
                      }}
                      className="group h-full"
                    >
                      <div className="bg-white rounded-2xl p-6 border border-gray-200 transition-all duration-300 h-full relative overflow-hidden">
                        {/* Background effect on hover */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 0.1 }}
                          className="absolute inset-0 bg-linear-to-br from-primary-400 to-primary-500"
                        />

                        {/* Step header */}
                        <div className="flex items-start gap-4 mb-4 relative z-10">
                          {/* Step number with connecting line */}
                          <div className="relative">
                            <motion.div
                              whileHover={{ rotate: 10, scale: 1.1 }}
                              className="relative z-10 w-12 h-12 rounded-full bg-linear-to-br from-primary-400 to-primary-500 flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-primary-500/25"
                            >
                              {step.step}
                            </motion.div>

                            {/* Connecting line */}
                            {index < 3 && (
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: "40px" }}
                                transition={{
                                  delay: index * 0.2 + 0.5,
                                  duration: 0.6,
                                }}
                                className="absolute top-12 left-1/2 w-0.5 bg-linear-to-b from-primary-300 to-transparent -translate-x-1/2"
                              />
                            )}
                          </div>

                          {/* Title with icon */}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                                {step.title}
                              </h3>
                              <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 + 0.3 }}
                              >
                                <ChevronRight
                                  size={18}
                                  className="text-primary-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all duration-200"
                                />
                              </motion.div>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 text-sm leading-relaxed relative z-10">
                          {step.description}
                        </p>

                        {/* Progress indicator */}
                        <div className="flex items-center justify-between mt-4 relative z-10">
                          <div className="flex items-center gap-2">
                            <div className="flex -space-x-1">
                              {[...Array(3)].map((_, dotIndex) => (
                                <motion.div
                                  key={dotIndex}
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{
                                    delay: index * 0.1 + dotIndex * 0.1,
                                  }}
                                  className="w-1.5 h-1.5 rounded-full bg-primary-200"
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500">
                              Phase {parseInt(step.step)}
                            </span>
                          </div>
                          <div className="text-xs font-medium text-primary-500">
                            {index === 0
                              ? "Start"
                              : index === data.steps.length - 1
                              ? "Final"
                              : `Step ${index + 1}`}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

export default WorkProcessSection;
