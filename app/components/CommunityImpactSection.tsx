"use client";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import {
  Heart,
  Users,
  Globe,
  TreePine,
  GraduationCap,
  DollarSign,
  Clock,
  MapPin,
  ArrowUpRight,
  Target,
  Award,
  BarChart,
  Calendar,
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

const INITIATIVE_VARIANTS: Variants = {
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

interface ImpactInitiative {
  id: string;
  title: string;
  description: string;
  category: "environment" | "education" | "health" | "community";
  impact: string;
  location: string;
  year: string;
  image?: string;
  participants?: number;
  link?: string;
}

interface ImpactMetric {
  value: string;
  label: string;
  icon:
    | "heart"
    | "users"
    | "treePine"
    | "dollarSign"
    | "clock"
    | "graduationCap";
  trend?: "up" | "down" | "neutral";
}

interface PartnerOrganization {
  id: string;
  name: string;
  logo: string;
  focus: string;
  website: string;
}

interface CommunityImpactSectionProps {
  data: {
    sectionLabel: string;
    headingPart1: string;
    headingPart2: string;
    subheading: string;
    missionStatement: string;
    initiatives: ImpactInitiative[];
    impactMetrics: ImpactMetric[];
    partners: PartnerOrganization[];
    recentProjects: Array<{
      title: string;
      description: string;
      outcome: string;
      date: string;
    }>;
    ctaButton: {
      text: string;
      href: string;
    };
  };
}

const categoryIcons = {
  environment: TreePine,
  education: GraduationCap,
  health: Heart,
  community: Users,
};

const metricIcons = {
  heart: Heart,
  users: Users,
  treePine: TreePine,
  dollarSign: DollarSign,
  clock: Clock,
  graduationCap: GraduationCap,
};

const categoryColors = {
  environment: {
    bg: "from-emerald-50 to-emerald-100/50",
    text: "text-emerald-700",
    border: "border-emerald-200/50",
    icon: "text-emerald-500",
    gradient: "from-emerald-500 to-emerald-600",
  },
  education: {
    bg: "from-blue-50 to-blue-100/50",
    text: "text-blue-700",
    border: "border-blue-200/50",
    icon: "text-blue-500",
    gradient: "from-blue-500 to-blue-600",
  },
  health: {
    bg: "from-rose-50 to-rose-100/50",
    text: "text-rose-700",
    border: "border-rose-200/50",
    icon: "text-rose-500",
    gradient: "from-rose-500 to-rose-600",
  },
  community: {
    bg: "from-amber-50 to-amber-100/50",
    text: "text-amber-700",
    border: "border-amber-200/50",
    icon: "text-amber-500",
    gradient: "from-amber-500 to-amber-600",
  },
};

function CommunityImpactSection({ data }: CommunityImpactSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const controls = useAnimation();
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeInitiative, setActiveInitiative] = useState<string | null>(null);

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const categories = [
    { id: "all", label: "All Initiatives", icon: Globe },
    { id: "environment", label: "Environment", icon: TreePine },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "health", label: "Health", icon: Heart },
    { id: "community", label: "Community", icon: Users },
  ];

  const filteredInitiatives =
    selectedCategory === "all"
      ? data.initiatives
      : data.initiatives.filter((init) => init.category === selectedCategory);

  return (
    <section
      ref={sectionRef}
      className="relative bg-linear-to-b from-white via-gray-50/30 to-white py-32 overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-100/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary-300/5 rounded-full blur-3xl" />
      </div>

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
            <Heart size={16} className="text-primary-500" />
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

          {/* Mission Statement */}
          <motion.div
            variants={CHILD_VARIANTS}
            className="mt-12 max-w-4xl mx-auto"
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
              className="bg-linear-to-r from-primary-50 to-primary-100/50 rounded-2xl p-8 border border-primary-200/50 shadow-lg shadow-gray-900/5"
            >
              <div className="flex items-center gap-4 mb-6">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{
                    type: "spring",
                    stiffness: SPRING_CONFIG.stiffness,
                    damping: SPRING_CONFIG.damping,
                    mass: SPRING_CONFIG.mass,
                  }}
                  className="w-12 h-12 rounded-full bg-linear-to-br from-primary-100 to-primary-50 flex items-center justify-center border border-primary-200/50"
                >
                  <Target size={24} className="text-primary-500" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Our Mission
                </h3>
              </div>
              <p className="text-gray-700 text-lg italic leading-relaxed">
                "{data.missionStatement}"
              </p>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Impact Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-20">
          {data.impactMetrics.map((metric, index) => {
            const IconComponent = metricIcons[metric.icon];
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
                  {metric.trend && (
                    <div
                      className={`mt-2 text-xs font-semibold ${
                        metric.trend === "up"
                          ? "text-emerald-600"
                          : metric.trend === "down"
                          ? "text-rose-600"
                          : "text-gray-600"
                      }`}
                    >
                      {metric.trend === "up"
                        ? "↗ Increasing"
                        : metric.trend === "down"
                        ? "↘ Decreasing"
                        : "→ Stable"}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {categories.map((category) => {
            const IconComponent = category.icon;
            const isSelected = selectedCategory === category.id;
            const colors =
              category.id === "all"
                ? categoryColors.environment
                : categoryColors[category.id as keyof typeof categoryColors];

            return (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  isSelected
                    ? category.id === "all"
                      ? "bg-linear-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25"
                      : `bg-linear-to-r ${colors.gradient} text-white shadow-lg shadow-primary-500/25`
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <IconComponent size={16} />
                {category.label}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Initiatives Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
          >
            {filteredInitiatives.map((initiative, index) => {
              const IconComponent = categoryIcons[initiative.category];
              const colors = categoryColors[initiative.category];
              const isActive = activeInitiative === initiative.id;
              const delay = 0.6 + index * 0.1;

              return (
                <motion.div
                  key={initiative.id}
                  custom={delay}
                  variants={INITIATIVE_VARIANTS}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  className="group"
                  onMouseEnter={() => setActiveInitiative(initiative.id)}
                  onMouseLeave={() => setActiveInitiative(null)}
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
                    className={`bg-white rounded-2xl border-2 overflow-hidden h-full relative ${
                      isActive
                        ? `border-primary-500`
                        : "border-gray-100 hover:border-primary-300"
                    }`}
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

                    {/* Image */}
                    {initiative.image && (
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={initiative.image}
                          alt={initiative.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                        />
                        <div className="absolute top-4 left-4">
                          <span
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold bg-linear-to-r ${colors.gradient} text-white shadow-lg`}
                          >
                            {initiative.category.charAt(0).toUpperCase() +
                              initiative.category.slice(1)}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Content */}
                    <div className="relative p-6">
                      <div className="flex items-start gap-4 mb-4">
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
                          <IconComponent size={24} className={colors.icon} />
                        </motion.div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {initiative.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                            <div className="flex items-center gap-1">
                              <MapPin size={14} />
                              {initiative.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar size={14} />
                              {initiative.year}
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {initiative.description}
                      </p>

                      {/* Impact & Participants */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-linear-to-br from-gray-50 to-gray-100/50 rounded-lg p-4 border border-gray-200">
                          <div className="text-sm text-gray-500 mb-1">
                            Impact
                          </div>
                          <div className="font-semibold text-gray-900">
                            {initiative.impact}
                          </div>
                        </div>
                        {initiative.participants && (
                          <div className="bg-linear-to-br from-gray-50 to-gray-100/50 rounded-lg p-4 border border-gray-200">
                            <div className="text-sm text-gray-500 mb-1">
                              Participants
                            </div>
                            <div className="font-semibold text-gray-900">
                              {initiative.participants.toLocaleString()}+
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Link */}
                      {initiative.link && (
                        <motion.a
                          href={initiative.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ x: 4 }}
                          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold text-sm"
                        >
                          Learn More
                          <ArrowUpRight size={14} />
                        </motion.a>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Partners & Recent Projects */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Partners */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-8">
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
                <Users size={20} className="text-primary-500" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900">Our Partners</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {data.partners.map((partner, index) => (
                <motion.div
                  key={partner.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  whileHover={{
                    y: -8,
                    boxShadow: "0 20px 40px -10px rgba(59, 130, 246, 0.15)",
                  }}
                  className="bg-white rounded-xl border border-gray-100 p-6 flex flex-col items-center justify-center text-center shadow-lg shadow-gray-900/5"
                >
                  <div className="relative w-20 h-16 mb-4">
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      fill
                      className="object-contain opacity-70 hover:opacity-100 transition-opacity"
                    />
                  </div>
                  <div className="font-semibold text-gray-900 mb-1">
                    {partner.name}
                  </div>
                  <div className="text-sm text-gray-500">{partner.focus}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recent Projects */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.9 }}
          >
            <div className="flex items-center gap-3 mb-8">
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
                <Award size={20} className="text-primary-500" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900">
                Recent Projects
              </h3>
            </div>

            <div className="space-y-6">
              {data.recentProjects.map((project, index) => (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 1 + index * 0.1 }}
                  whileHover={{
                    x: 8,
                    boxShadow: "0 20px 40px -10px rgba(59, 130, 246, 0.15)",
                  }}
                  className="bg-white rounded-xl border border-gray-100 p-6 shadow-lg shadow-gray-900/5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-gray-900">{project.title}</h4>
                    <span className="text-sm text-gray-500">
                      {project.date}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <BarChart size={16} className="text-primary-500" />
                    <span className="text-sm font-semibold text-primary-600">
                      Outcome: {project.outcome}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.2 }}
          className="text-center"
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
            className="bg-linear-to-r from-primary-50 to-primary-100/50 rounded-3xl p-8 mb-8 border border-primary-200/50 shadow-lg shadow-gray-900/5"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Join Our Community Initiatives
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6 leading-relaxed">
              Together, we can create lasting positive change. Whether you want
              to volunteer, partner, or support our initiatives, every
              contribution makes a difference.
            </p>
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
        </motion.div>
      </div>
    </section>
  );
}

export default CommunityImpactSection;
