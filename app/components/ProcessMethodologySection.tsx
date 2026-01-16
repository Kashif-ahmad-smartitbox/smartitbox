"use client";
import React, { useRef, useState, useEffect } from "react";
import {
  Search,
  Brain,
  PenTool,
  Code,
  TestTube,
  Rocket,
  Settings,
  CheckCircle,
  ArrowUpRight,
  ChevronRight,
  Users,
  Target,
  Clock,
  BarChart,
  Sparkles,
  ChevronRight as RightIcon,
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

const METRIC_VARIANTS: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (delay: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

const STEP_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

interface ProcessStep {
  id: string;
  number: string;
  title: string;
  description: string;
  icon:
    | "search"
    | "brain"
    | "penTool"
    | "code"
    | "testTube"
    | "rocket"
    | "settings";
  duration: string;
  tools: string[];
  deliverables: string[];
}

interface ProcessMethodologySectionProps {
  data: {
    sectionLabel: string;
    headingPart1: string;
    headingPart2: string;
    subheading: string;
    overview: string;
    steps: ProcessStep[];
    keyMetrics: Array<{
      value: string;
      label: string;
      icon: "users" | "target" | "clock" | "barChart";
    }>;
    ctaButton: {
      text: string;
      href: string;
    };
  };
}

const iconMap = {
  search: Search,
  brain: Brain,
  penTool: PenTool,
  code: Code,
  testTube: TestTube,
  rocket: Rocket,
  settings: Settings,
};

const metricIconMap = {
  users: Users,
  target: Target,
  clock: Clock,
  barChart: BarChart,
};

function ProcessMethodologySection({ data }: ProcessMethodologySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const controls = useAnimation();
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const [activeStep, setActiveStep] = useState(0);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const progressPercentage = ((activeStep + 1) / data.steps.length) * 100;

  return (
    <section
      ref={sectionRef}
      className="relative bg-linear-to-b from-white via-gray-50/30 to-white py-32 overflow-hidden"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={CONTAINER_VARIANTS}
          initial="hidden"
          animate={controls}
          className="text-center mb-20"
        >
          {/* Top Label */}
          <motion.div
            variants={CHILD_VARIANTS}
            className="inline-flex items-center gap-2 mb-6 px-4 py-2.5 bg-linear-to-r from-primary-50 to-primary-100 text-secondary-900 text-sm font-semibold rounded-lg border border-primary-200/50"
          >
            <Settings size={16} className="text-primary-500" />
            <span>{data.sectionLabel}</span>
          </motion.div>

          {/* Main Heading */}
          <motion.div variants={CHILD_VARIANTS}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight text-gray-900">
              {data.headingPart1}
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
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              {data.subheading}
            </p>
          </motion.div>

          {/* Overview */}
          <motion.div variants={CHILD_VARIANTS}>
            <p className="mt-6 text-gray-700 max-w-2xl mx-auto leading-relaxed">
              {data.overview}
            </p>
          </motion.div>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {data.keyMetrics.map((metric, index) => {
            const IconComponent = metricIconMap[metric.icon];
            const delay = 0.3 + index * 0.1;

            return (
              <motion.div
                key={metric.label}
                custom={delay}
                variants={METRIC_VARIANTS}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                whileHover={{
                  y: -8,
                  boxShadow: "0 20px 40px -10px rgba(59, 130, 246, 0.15)",
                }}
                transition={{
                  type: "spring",
                  stiffness: SPRING_CONFIG.stiffness,
                  damping: SPRING_CONFIG.damping,
                  mass: SPRING_CONFIG.mass,
                }}
                className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-lg shadow-gray-900/5"
              >
                <div className="relative">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{
                      type: "spring",
                      stiffness: SPRING_CONFIG.stiffness,
                      damping: SPRING_CONFIG.damping,
                      mass: SPRING_CONFIG.mass,
                    }}
                    className="w-12 h-12 rounded-xl bg-linear-to-br from-primary-100 to-primary-50 flex items-center justify-center mx-auto mb-4 border border-primary-200/50"
                  >
                    <IconComponent className="text-primary-500" size={24} />
                  </motion.div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {metric.value}
                  </div>
                  <div className="text-sm text-gray-600">{metric.label}</div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Process Visualization */}
        <div className="relative mb-20">
          {/* Progress Bar */}
          <div className="relative h-2 bg-gray-200 rounded-full mb-12 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="absolute h-full bg-linear-to-r from-primary-400 to-primary-500 rounded-full"
            />

            {/* Step Markers */}
            <div className="absolute inset-0 flex justify-between items-center">
              {data.steps.map((step, index) => (
                <motion.button
                  key={step.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setActiveStep(index)}
                  onMouseEnter={() => setHoveredStep(index)}
                  onMouseLeave={() => setHoveredStep(null)}
                  className={`relative w-8 h-8 rounded-full border-4 ${
                    index <= activeStep
                      ? "bg-primary-500 border-white"
                      : "bg-white border-gray-300"
                  } transition-all duration-300 shadow-lg`}
                >
                  {index <= activeStep && (
                    <CheckCircle className="w-4 h-4 text-white absolute inset-0 m-auto" />
                  )}

                  {/* Step Number Tooltip */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <div
                      className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${
                        index <= activeStep
                          ? "bg-linear-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25"
                          : "bg-gray-100 text-gray-600"
                      } transition-all duration-300`}
                    >
                      Step {step.number}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Process Steps */}
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
            {data.steps.map((step, index) => {
              const IconComponent = iconMap[step.icon];
              const isActive = index === activeStep;
              const isCompleted = index < activeStep;
              const delay = 0.7 + index * 0.1;

              return (
                <motion.div
                  key={step.id}
                  custom={delay}
                  variants={STEP_VARIANTS}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  className={`col-span-1 cursor-pointer ${
                    isActive ? "lg:col-span-3" : "lg:col-span-1"
                  }`}
                >
                  <motion.div
                    onClick={() => setActiveStep(index)}
                    onMouseEnter={() => setHoveredStep(index)}
                    onMouseLeave={() => setHoveredStep(null)}
                    whileHover={{
                      y: isActive ? 0 : -8,
                      boxShadow: isActive
                        ? "none"
                        : "0 20px 40px -10px rgba(59, 130, 246, 0.15)",
                    }}
                    transition={{
                      type: "spring",
                      stiffness: SPRING_CONFIG.stiffness,
                      damping: SPRING_CONFIG.damping,
                      mass: SPRING_CONFIG.mass,
                    }}
                    className={`h-full rounded-2xl p-6 transition-all duration-300 relative ${
                      isActive
                        ? "bg-white border-2 border-primary-500 shadow-2xl shadow-primary-500/20"
                        : isCompleted
                        ? "bg-linear-to-br from-primary-50 to-primary-100/30 border border-primary-200/50"
                        : "bg-white border border-gray-100 hover:border-primary-300"
                    }`}
                  >
                    {/* Card Background Effect */}
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay }}
                        className="absolute -inset-2 bg-linear-to-r from-primary-500/5 to-primary-300/5 rounded-2xl blur-xl opacity-50"
                      />
                    )}

                    <div className="flex items-start gap-4 relative">
                      {/* Icon */}
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{
                          type: "spring",
                          stiffness: SPRING_CONFIG.stiffness,
                          damping: SPRING_CONFIG.damping,
                          mass: SPRING_CONFIG.mass,
                        }}
                        className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${
                          isActive
                            ? "bg-linear-to-br from-primary-500 to-primary-600 text-white"
                            : isCompleted
                            ? "bg-linear-to-br from-primary-100 to-primary-50 text-primary-500 border border-primary-200/50"
                            : "bg-linear-to-br from-gray-100 to-gray-50 text-gray-600 border border-gray-200"
                        }`}
                      >
                        <IconComponent size={24} />
                      </motion.div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span
                              className={`text-2xl font-bold ${
                                isActive ? "text-primary-600" : "text-gray-400"
                              }`}
                            >
                              {step.number}
                            </span>
                            <h3
                              className={`text-lg font-bold ${
                                isActive ? "text-gray-900" : "text-gray-700"
                              }`}
                            >
                              {step.title}
                            </h3>
                          </div>
                          {isActive && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Clock size={14} />
                              <span>{step.duration}</span>
                            </div>
                          )}
                        </div>

                        <AnimatePresence>
                          {isActive ? (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              <p className="text-gray-600 mb-6 leading-relaxed">
                                {step.description}
                              </p>

                              {/* Tools & Deliverables */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {/* Tools */}
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                                    Tools & Technologies
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {step.tools.map((tool) => (
                                      <span
                                        key={tool}
                                        className="px-3 py-1.5 bg-linear-to-br from-gray-50 to-gray-100 text-gray-700 text-sm rounded-lg border border-gray-200"
                                      >
                                        {tool}
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                {/* Deliverables */}
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                                    Key Deliverables
                                  </h4>
                                  <div className="space-y-2">
                                    {step.deliverables.map((deliverable) => (
                                      <div
                                        key={deliverable}
                                        className="flex items-center gap-2"
                                      >
                                        <CheckCircle className="w-4 h-4 text-primary-500" />
                                        <span className="text-sm text-gray-600 leading-relaxed">
                                          {deliverable}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                                {step.description}
                              </p>
                              <ChevronRight className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Step Indicator */}
                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            isActive
                              ? "bg-primary-500"
                              : isCompleted
                              ? "bg-primary-400"
                              : "bg-gray-300"
                          }`}
                        />
                        <span>Phase {step.number}</span>
                      </div>

                      {isActive && (
                        <div className="text-sm font-semibold text-primary-600">
                          Current Step
                        </div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
          className="flex justify-center items-center gap-4 mb-20"
        >
          <motion.button
            onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
            disabled={activeStep === 0}
            whileHover={activeStep !== 0 ? { scale: 1.05 } : {}}
            whileTap={activeStep !== 0 ? { scale: 0.95 } : {}}
            className={`px-6 py-3 rounded-full font-semibold flex items-center gap-2 ${
              activeStep === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 border border-gray-300 hover:border-primary-300"
            }`}
          >
            <RightIcon className="w-5 h-5 rotate-180" />
            Previous
          </motion.button>

          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">
              Step {activeStep + 1} of {data.steps.length}
            </div>
            <div className="text-lg font-bold text-gray-900">
              {data.steps[activeStep]?.title}
            </div>
          </div>

          <motion.button
            onClick={() =>
              setActiveStep(Math.min(data.steps.length - 1, activeStep + 1))
            }
            disabled={activeStep === data.steps.length - 1}
            whileHover={
              activeStep !== data.steps.length - 1 ? { scale: 1.05 } : {}
            }
            whileTap={
              activeStep !== data.steps.length - 1 ? { scale: 0.95 } : {}
            }
            className={`px-6 py-3 rounded-full font-semibold flex items-center gap-2 ${
              activeStep === data.steps.length - 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-linear-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-lg shadow-primary-500/25"
            }`}
          >
            Next
            <RightIcon className="w-5 h-5" />
          </motion.button>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.2 }}
          className="text-center"
        >
          <motion.a
            href={data.ctaButton.href}
            initial={false}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 30px -5px rgba(59, 130, 246, 0.3)",
            }}
            whileTap={{ scale: 0.98 }}
            transition={{
              type: "spring",
              stiffness: SPRING_CONFIG.stiffness,
              damping: SPRING_CONFIG.damping,
              mass: SPRING_CONFIG.mass,
            }}
            className="group relative inline-flex items-center bg-linear-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-10 py-4 rounded-full font-semibold text-base shadow-lg shadow-primary-500/25 gap-3"
          >
            <span>{data.ctaButton.text}</span>
            <ArrowUpRight
              size={18}
              className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200"
            />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

export default ProcessMethodologySection;
