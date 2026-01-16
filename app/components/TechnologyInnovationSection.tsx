"use client";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import {
  Cpu,
  Zap,
  Brain,
  Cloud,
  Shield,
  Code,
  BarChart,
  Target,
  Rocket,
  TrendingUp,
  ArrowUpRight,
  PlayCircle,
  Microscope,
  Network,
  Globe,
  Lock,
  Sparkles,
  ChevronRight,
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

const TECH_STACK_VARIANTS: Variants = {
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

interface TechStackItem {
  id: string;
  name: string;
  category: "frontend" | "backend" | "database" | "cloud" | "devops" | "ai";
  icon?: string;
  description: string;
  useCase: string;
}

interface InnovationProject {
  id: string;
  title: string;
  description: string;
  category: "ai" | "blockchain" | "iot" | "quantum" | "ar-vr";
  status: "research" | "development" | "pilot" | "production";
  impact: string;
  timeline: string;
  link?: string;
}

interface Patent {
  id: string;
  title: string;
  number: string;
  year: string;
  category: string;
  description: string;
}

interface TechnologyInnovationSectionProps {
  data: {
    sectionLabel: string;
    headingPart1: string;
    headingPart2: string;
    subheading: string;
    mission: string;
    techStack: TechStackItem[];
    innovationProjects: InnovationProject[];
    patents: Patent[];
    featuredDemo?: {
      title: string;
      description: string;
      videoUrl: string;
      thumbnail: string;
    };
    ctaButton: {
      text: string;
      href: string;
    };
  };
}

const categoryIcons = {
  frontend: Code,
  backend: Cpu,
  database: BarChart,
  cloud: Cloud,
  devops: Zap,
  ai: Brain,
};

const projectIcons = {
  ai: Brain,
  blockchain: Shield,
  iot: Network,
  quantum: Microscope,
  "ar-vr": Globe,
};

const categoryColors = {
  frontend: {
    bg: "from-purple-100 to-purple-50",
    text: "text-purple-700",
    border: "border-purple-200/50",
    gradient: "from-purple-500 to-purple-600",
  },
  backend: {
    bg: "from-indigo-100 to-indigo-50",
    text: "text-indigo-700",
    border: "border-indigo-200/50",
    gradient: "from-indigo-500 to-indigo-600",
  },
  database: {
    bg: "from-blue-100 to-blue-50",
    text: "text-blue-700",
    border: "border-blue-200/50",
    gradient: "from-blue-500 to-blue-600",
  },
  cloud: {
    bg: "from-sky-100 to-sky-50",
    text: "text-sky-700",
    border: "border-sky-200/50",
    gradient: "from-sky-500 to-sky-600",
  },
  devops: {
    bg: "from-cyan-100 to-cyan-50",
    text: "text-cyan-700",
    border: "border-cyan-200/50",
    gradient: "from-cyan-500 to-cyan-600",
  },
  ai: {
    bg: "from-pink-100 to-pink-50",
    text: "text-pink-700",
    border: "border-pink-200/50",
    gradient: "from-pink-500 to-pink-600",
  },
};

const projectCategoryColors = {
  ai: {
    bg: "from-pink-100 to-pink-50",
    text: "text-pink-700",
    border: "border-pink-200/50",
    gradient: "from-pink-500 to-pink-600",
  },
  blockchain: {
    bg: "from-amber-100 to-amber-50",
    text: "text-amber-700",
    border: "border-amber-200/50",
    gradient: "from-amber-500 to-amber-600",
  },
  iot: {
    bg: "from-emerald-100 to-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200/50",
    gradient: "from-emerald-500 to-emerald-600",
  },
  quantum: {
    bg: "from-violet-100 to-violet-50",
    text: "text-violet-700",
    border: "border-violet-200/50",
    gradient: "from-violet-500 to-violet-600",
  },
  "ar-vr": {
    bg: "from-indigo-100 to-indigo-50",
    text: "text-indigo-700",
    border: "border-indigo-200/50",
    gradient: "from-indigo-500 to-indigo-600",
  },
};

const projectStatusColors = {
  research: "from-blue-100 to-blue-50 text-blue-700 border-blue-200/50",
  development: "from-amber-100 to-amber-50 text-amber-700 border-amber-200/50",
  pilot:
    "from-emerald-100 to-emerald-50 text-emerald-700 border-emerald-200/50",
  production: "from-green-100 to-green-50 text-green-700 border-green-200/50",
};

function TechnologyInnovationSection({
  data,
}: TechnologyInnovationSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const controls = useAnimation();
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<
    "stack" | "innovation" | "research"
  >("stack");
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const filteredTechStack =
    activeCategory === "all"
      ? data.techStack
      : data.techStack.filter((item) => item.category === activeCategory);

  const categories = [
    { id: "all", label: "All Technologies", icon: Cpu },
    { id: "frontend", label: "Frontend", icon: Code },
    { id: "backend", label: "Backend", icon: Cpu },
    { id: "database", label: "Database", icon: BarChart },
    { id: "cloud", label: "Cloud", icon: Cloud },
    { id: "devops", label: "DevOps", icon: Zap },
    { id: "ai", label: "AI/ML", icon: Brain },
  ];

  const handleDemoClick = () => {
    if (data.featuredDemo) {
      window.open(data.featuredDemo.videoUrl, "_blank");
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-linear-to-l from-gray-700 to-accent py-30 overflow-hidden"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={CONTAINER_VARIANTS}
          initial="hidden"
          animate={controls}
          className="text-center mb-10"
        >
          {/* Top Label */}
          <motion.div
            variants={CHILD_VARIANTS}
            className="inline-flex items-center gap-2 mb-6 px-4 py-2.5 bg-linear-to-r from-primary-500/20 to-primary-600/20 text-primary-200 text-sm font-semibold rounded-lg border border-primary-500/30 backdrop-blur-sm"
          >
            <span>{data.sectionLabel}</span>
          </motion.div>

          {/* Main Heading */}
          <motion.div variants={CHILD_VARIANTS}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight text-white">
              {data.headingPart1}{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text bg-linear-to-r from-primary-400 to-primary-300">
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
                  className="absolute bottom-1 left-0 right-0 h-3 bg-primary-500/20 z-0 rounded-lg"
                />
              </span>
            </h2>
            <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">
              {data.subheading}
            </p>
          </motion.div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {[
            { id: "stack", label: "Tech Stack", icon: Cpu },
            { id: "innovation", label: "Innovation Lab", icon: Brain },
            { id: "research", label: "Research", icon: Microscope },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-linear-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25"
                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Tech Stack Tab */}
        <AnimatePresence mode="wait">
          {activeTab === "stack" && (
            <motion.div
              key="stack"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-20"
            >
              {/* Category Filter */}
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  const isActive = activeCategory === category.id;
                  const colors =
                    category.id === "all"
                      ? categoryColors.frontend
                      : categoryColors[
                          category.id as keyof typeof categoryColors
                        ];

                  return (
                    <motion.button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all ${
                        isActive
                          ? category.id === "all"
                            ? "bg-linear-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25"
                            : `bg-linear-to-r ${colors.gradient} text-white shadow-lg shadow-primary-500/25`
                          : "bg-white/10 text-gray-300 hover:bg-white/20"
                      }`}
                    >
                      <IconComponent size={14} />
                      {category.label}
                    </motion.button>
                  );
                })}
              </div>

              {/* Tech Stack Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTechStack.map((tech, index) => {
                  const IconComponent = categoryIcons[tech.category];
                  const colors = categoryColors[tech.category];
                  const isHovered = hoveredTech === tech.id;
                  const delay = 0.6 + index * 0.1;

                  return (
                    <motion.div
                      key={tech.id}
                      custom={delay}
                      variants={TECH_STACK_VARIANTS}
                      initial="hidden"
                      animate={isInView ? "visible" : "hidden"}
                      onMouseEnter={() => setHoveredTech(tech.id)}
                      onMouseLeave={() => setHoveredTech(null)}
                      className="group"
                    >
                      <motion.div
                        whileHover={{
                          y: -8,
                          boxShadow:
                            "0 20px 40px -10px rgba(59, 130, 246, 0.15)",
                        }}
                        transition={{
                          type: "spring",
                          stiffness: SPRING_CONFIG.stiffness,
                          damping: SPRING_CONFIG.damping,
                          mass: SPRING_CONFIG.mass,
                        }}
                        className={`relative bg-linear-to-br from-white/5 to-white/10 rounded-2xl p-6 border ${
                          isHovered
                            ? "border-primary-500/50"
                            : "border-white/10"
                        } h-full backdrop-blur-sm`}
                      >
                        {/* Card Background Effect */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={
                            isInView
                              ? { opacity: 1, scale: 1 }
                              : { opacity: 0, scale: 0.95 }
                          }
                          transition={{ delay }}
                          className="absolute -inset-2 bg-linear-to-r from-primary-500/5 to-primary-300/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        />

                        <div className="relative flex items-start gap-4 mb-4">
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{
                              type: "spring",
                              stiffness: SPRING_CONFIG.stiffness,
                              damping: SPRING_CONFIG.damping,
                              mass: SPRING_CONFIG.mass,
                            }}
                            className={`w-12 h-12 rounded-xl bg-linear-to-br ${colors.bg} flex items-center justify-center border ${colors.border}`}
                          >
                            {tech.icon ? (
                              <div className="relative w-8 h-8">
                                <Image
                                  src={tech.icon}
                                  alt={tech.name}
                                  fill
                                  className="object-contain"
                                />
                              </div>
                            ) : (
                              <IconComponent size={24} />
                            )}
                          </motion.div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-white mb-2">
                              {tech.name}
                            </h3>
                            <span
                              className={`text-xs font-semibold px-3 py-1 rounded-full bg-linear-to-r ${colors.gradient} text-white`}
                            >
                              {tech.category.charAt(0).toUpperCase() +
                                tech.category.slice(1)}
                            </span>
                          </div>
                        </div>

                        <p className="relative text-gray-300 mb-6 leading-relaxed">
                          {tech.description}
                        </p>

                        <div className="relative mt-6 pt-6 border-t border-white/10">
                          <div className="text-sm text-gray-400 mb-2">
                            Use Case
                          </div>
                          <div className="text-gray-200 leading-relaxed">
                            {tech.useCase}
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Innovation Lab Tab */}
          {activeTab === "innovation" && (
            <motion.div
              key="innovation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-20"
            >
              {/* Featured Demo */}
              {data.featuredDemo && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-12"
                >
                  <motion.div
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
                    className="bg-linear-to-r from-primary-500/10 to-primary-600/10 rounded-2xl p-8 border border-primary-500/20 backdrop-blur-sm shadow-lg shadow-primary-500/10"
                  >
                    <div className="flex flex-col lg:flex-row items-center gap-8">
                      <div className="lg:w-1/2">
                        <h3 className="text-2xl font-bold text-white mb-4">
                          {data.featuredDemo.title}
                        </h3>
                        <p className="text-gray-300 mb-6 leading-relaxed">
                          {data.featuredDemo.description}
                        </p>
                        <motion.button
                          onClick={handleDemoClick}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="inline-flex items-center gap-2 bg-linear-to-r from-primary-500 to-primary-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg shadow-primary-500/25"
                        >
                          <PlayCircle size={20} />
                          Watch Demo
                        </motion.button>
                      </div>
                      <div className="lg:w-1/2">
                        <motion.div
                          onClick={handleDemoClick}
                          whileHover={{ y: -8 }}
                          transition={{
                            type: "spring",
                            stiffness: SPRING_CONFIG.stiffness,
                            damping: SPRING_CONFIG.damping,
                            mass: SPRING_CONFIG.mass,
                          }}
                          className="relative aspect-video rounded-2xl overflow-hidden border border-white/20 cursor-pointer shadow-lg shadow-gray-900/5"
                        >
                          <Image
                            src={data.featuredDemo.thumbnail}
                            alt="Featured Demo"
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                              <PlayCircle size={40} className="text-white" />
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {/* Innovation Projects */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {data.innovationProjects.map((project, index) => {
                  const IconComponent = projectIcons[project.category];
                  const colors = projectCategoryColors[project.category];
                  const delay = 0.5 + index * 0.1;

                  return (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay }}
                      className="group"
                    >
                      <motion.div
                        whileHover={{
                          y: -8,
                          boxShadow:
                            "0 20px 40px -10px rgba(59, 130, 246, 0.15)",
                        }}
                        transition={{
                          type: "spring",
                          stiffness: SPRING_CONFIG.stiffness,
                          damping: SPRING_CONFIG.damping,
                          mass: SPRING_CONFIG.mass,
                        }}
                        className="relative bg-linear-to-br from-white/5 to-white/10 rounded-2xl p-6 border border-white/10 backdrop-blur-sm"
                      >
                        {/* Card Background Effect */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay }}
                          className="absolute -inset-2 bg-linear-to-r from-primary-500/5 to-primary-300/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        />

                        <div className="relative flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <motion.div
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              transition={{
                                type: "spring",
                                stiffness: SPRING_CONFIG.stiffness,
                                damping: SPRING_CONFIG.damping,
                                mass: SPRING_CONFIG.mass,
                              }}
                              className={`w-12 h-12 rounded-xl bg-linear-to-br ${colors.bg} flex items-center justify-center border ${colors.border}`}
                            >
                              <IconComponent size={24} />
                            </motion.div>
                            <div>
                              <h3 className="text-xl font-bold text-white">
                                {project.title}
                              </h3>
                              <div className="flex items-center gap-2 mt-2">
                                <span
                                  className={`text-xs font-semibold px-3 py-1 rounded-full bg-linear-to-r ${colors.gradient} text-white`}
                                >
                                  {project.category.toUpperCase()}
                                </span>
                                <span
                                  className={`text-xs font-semibold px-3 py-1 rounded-full bg-linear-to-br ${
                                    projectStatusColors[project.status]
                                  }`}
                                >
                                  {project.status.charAt(0).toUpperCase() +
                                    project.status.slice(1)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <p className="relative text-gray-300 mb-6 leading-relaxed">
                          {project.description}
                        </p>

                        <div className="relative grid grid-cols-2 gap-4 mb-6">
                          <div className="bg-linear-to-br from-white/5 to-white/10 rounded-lg p-4 border border-white/10">
                            <div className="text-sm text-gray-400 mb-1">
                              Impact
                            </div>
                            <div className="font-semibold text-white">
                              {project.impact}
                            </div>
                          </div>
                          <div className="bg-linear-to-br from-white/5 to-white/10 rounded-lg p-4 border border-white/10">
                            <div className="text-sm text-gray-400 mb-1">
                              Timeline
                            </div>
                            <div className="font-semibold text-white">
                              {project.timeline}
                            </div>
                          </div>
                        </div>

                        {project.link && (
                          <motion.a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ x: 4 }}
                            className="relative inline-flex items-center gap-2 text-primary-300 hover:text-primary-200 font-semibold text-sm"
                          >
                            View Research Paper
                            <ArrowUpRight size={14} />
                          </motion.a>
                        )}
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Research Tab */}
          {activeTab === "research" && (
            <motion.div
              key="research"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-20"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Patents */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{
                        type: "spring",
                        stiffness: SPRING_CONFIG.stiffness,
                        damping: SPRING_CONFIG.damping,
                        mass: SPRING_CONFIG.mass,
                      }}
                      className="w-10 h-10 rounded-xl bg-linear-to-br from-primary-100 to-primary-50 flex items-center justify-center border border-primary-200/50"
                    >
                      <Shield size={20} className="text-primary-500" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white">
                      Patents & IP
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {data.patents.map((patent, index) => (
                      <motion.div
                        key={patent.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        whileHover={{
                          x: 8,
                          boxShadow:
                            "0 20px 40px -10px rgba(59, 130, 246, 0.15)",
                        }}
                        className="bg-linear-to-br from-white/5 to-white/10 rounded-xl p-5 border border-white/10 backdrop-blur-sm"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-bold text-white">
                            {patent.title}
                          </h4>
                          <span className="text-sm text-gray-400">
                            {patent.year}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mb-3">
                          <div className="text-sm font-semibold text-primary-300">
                            {patent.number}
                          </div>
                          <span className="text-xs px-2 py-1 bg-linear-to-br from-white/10 to-white/5 rounded text-gray-300">
                            {patent.category}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {patent.description}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Research Initiatives */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{
                        type: "spring",
                        stiffness: SPRING_CONFIG.stiffness,
                        damping: SPRING_CONFIG.damping,
                        mass: SPRING_CONFIG.mass,
                      }}
                      className="w-10 h-10 rounded-xl bg-linear-to-br from-primary-100 to-primary-50 flex items-center justify-center border border-primary-200/50"
                    >
                      <Microscope size={20} className="text-primary-500" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white">
                      Research Focus Areas
                    </h3>
                  </div>

                  <div className="grid gap-4">
                    {[
                      {
                        title: "Explainable AI",
                        description:
                          "Developing transparent AI models that can explain their decision-making processes.",
                        progress: 85,
                        gradient: "from-pink-500 to-rose-500",
                      },
                      {
                        title: "Quantum Computing",
                        description:
                          "Exploring quantum algorithms for complex optimization problems.",
                        progress: 60,
                        gradient: "from-purple-500 to-indigo-500",
                      },
                      {
                        title: "Edge AI",
                        description:
                          "Running AI models on edge devices for real-time processing.",
                        progress: 75,
                        gradient: "from-primary-500 to-cyan-500",
                      },
                      {
                        title: "Neuromorphic Computing",
                        description:
                          "Developing brain-inspired computing architectures.",
                        progress: 40,
                        gradient: "from-emerald-500 to-teal-500",
                      },
                    ].map((area, index) => (
                      <motion.div
                        key={area.title}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        whileHover={{
                          x: 8,
                          boxShadow:
                            "0 20px 40px -10px rgba(59, 130, 246, 0.15)",
                        }}
                        className="bg-linear-to-br from-white/5 to-white/10 rounded-xl p-5 border border-white/10 backdrop-blur-sm"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-white">{area.title}</h4>
                          <span className="text-sm font-semibold text-gray-300">
                            {area.progress}%
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm mb-3 leading-relaxed">
                          {area.description}
                        </p>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${area.progress}%` }}
                            transition={{
                              delay: 0.5 + index * 0.1,
                              duration: 1,
                            }}
                            className={`h-full bg-linear-to-r ${area.gradient} rounded-full`}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

export default TechnologyInnovationSection;
