"use client";
import React, { useRef, useEffect } from "react";
import Image from "next/image";
import {
  Linkedin,
  Twitter,
  Mail,
  Globe,
  Sparkles,
  ChevronRight,
  ArrowUpRight,
  Award,
  Users,
  Rocket,
  Heart,
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

const STAT_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

// Types
interface TeamMember {
  id: number;
  name: string;
  role: string;
  description: string;
  image: string;
  social: {
    linkedin?: string;
    twitter?: string;
    email?: string;
    website?: string;
  };
  expertise: string[];
  funFact: string;
}

interface TeamStat {
  label: string;
  value: string;
  description: string;
  icon: "users" | "award" | "rocket" | "heart";
}

interface TeamSectionProps {
  data: {
    stats: TeamStat[];
    teamMembers: TeamMember[];
    ctaButton: {
      text: string;
      href: string;
      action: string;
    };
    ctaSection: {
      title: string;
      description: string;
      highlightText: string;
    };
  };
}

// Icon mapping component
const StatIcon = ({ type }: { type: TeamStat["icon"] }) => {
  const icons = {
    users: <Users className="w-5 h-5" />,
    award: <Award className="w-5 h-5" />,
    rocket: <Rocket className="w-5 h-5" />,
    heart: <Heart className="w-5 h-5" />,
  };
  return icons[type];
};

function TeamSection({ data }: TeamSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const controls = useAnimation();
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const handleCtaClick = () => {
    if (data.ctaButton.action === "viewPositions") {
      console.log("Viewing open positions");
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-white py-32 overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary-50/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-primary-100/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CLASSIC STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-24">
          {data.stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={STAT_VARIANTS}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              custom={index * 0.1}
              whileHover={{ y: -5 }}
              className="group relative"
            >
              <div className="relative bg-white rounded-2xl p-8 border border-gray-200 transition-all duration-300">
                {/* Icon with gradient background */}
                <div className="absolute top-6 right-6 w-12 h-12 bg-linear-to-br from-primary-50 to-primary-100 rounded-xl flex items-center justify-center">
                  <StatIcon type={stat.icon} />
                </div>

                <div className="mb-4">
                  <div className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-primary-600 uppercase tracking-wider mt-1">
                    {stat.label}
                  </div>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed">
                  {stat.description}
                </p>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-primary-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* CLASSIC TEAM CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-24">
          {data.teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              {/* Classic Card Design */}
              <div className="relative bg-white rounded-2xl overflow-hidden border border-gray-200 transition-all duration-500 h-full">
                {/* Card Header with Image */}
                <div className="relative h-30 bg-linear-to-r from-gray-50 to-gray-100">
                  {/* Profile Image Container */}
                  <motion.div
                    className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                  </motion.div>
                </div>

                {/* Card Content */}
                <div className="pt-16 pb-8 px-6 text-center">
                  {/* Name and Role */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {member.name}
                    </h3>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-50 rounded-full">
                      <span className="w-2 h-2 bg-primary-400 rounded-full" />
                      <span className="text-sm font-medium text-primary-700">
                        {member.role}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    {member.description}
                  </p>

                  {/* Expertise Tags */}
                  <div className="flex flex-wrap gap-2 justify-center mb-8">
                    {member.expertise.map((skill, idx) => (
                      <motion.span
                        key={skill}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 + idx * 0.1 }}
                        className="px-3 py-1.5 bg-gray-50 text-gray-700 text-sm font-medium rounded-lg border border-gray-200"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>

                  {/* Social Links */}
                  <div className="flex gap-3 justify-center">
                    {Object.entries(member.social).map(
                      ([platform, href], idx) => (
                        <motion.a
                          key={platform}
                          href={href || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          initial={{ opacity: 0, scale: 0.5 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 + idx * 0.1 }}
                          whileHover={{
                            scale: 1.1,
                            backgroundColor: "rgba(59, 130, 246, 0.1)",
                          }}
                          className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-gray-200 hover:border-primary-300 transition-all duration-200"
                        >
                          {platform === "linkedin" && (
                            <Linkedin size={18} className="text-gray-600" />
                          )}
                          {platform === "twitter" && (
                            <Twitter size={18} className="text-gray-600" />
                          )}
                          {platform === "email" && (
                            <Mail size={18} className="text-gray-600" />
                          )}
                          {platform === "website" && (
                            <Globe size={18} className="text-gray-600" />
                          )}
                        </motion.a>
                      )
                    )}
                  </div>
                </div>

                {/* Hover overlay effect */}
                <div className="absolute inset-0 bg-linear-to-br from-primary-500/0 to-primary-500/0 group-hover:from-primary-500/5 group-hover:to-primary-500/10 transition-all duration-500 pointer-events-none rounded-2xl" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* ELEGANT CTA SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="relative max-w-7xl mx-auto p-12 lg:p-16 rounded-3xl border border-primary-100">
            <div className="text-center">
              {/* CTA Title */}
              <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                {data.ctaSection.title}
                <span className="text-primary-500">
                  {" "}
                  {data.ctaSection.highlightText}
                </span>
              </h3>

              {/* CTA Description */}
              <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                {data.ctaSection.description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                {/* Primary CTA */}
                <motion.a
                  href={data.ctaButton.href}
                  onClick={handleCtaClick}
                  initial={false}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 20px 40px rgba(59, 130, 246, 0.15)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{
                    type: "spring",
                    stiffness: SPRING_CONFIG.stiffness,
                    damping: SPRING_CONFIG.damping,
                    mass: SPRING_CONFIG.mass,
                  }}
                  className="group relative inline-flex items-center bg-linear-to-r from-primary-500 to-primary-600 text-white px-10 py-4 rounded-full font-semibold text-lg shadow-lg shadow-primary-500/20 gap-3"
                >
                  <span>{data.ctaButton.text}</span>
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <ArrowUpRight size={20} />
                  </motion.span>

                  {/* Hover glow effect */}
                  <div className="absolute inset-0 rounded-full bg-primary-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                </motion.a>

                {/* Secondary Action */}
                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.05 }}
                  className="group inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold text-lg gap-2 px-6 py-2"
                >
                  <span>Contact Our Team</span>
                  <ChevronRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform duration-200"
                  />
                </motion.a>
              </div>

              {/* Stats Preview */}
              <div className="mt-12 pt-8 border-t border-gray-200/50">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {data.stats.slice(0, 4).map((stat, idx) => (
                    <div key={stat.label} className="text-center">
                      <div className="text-2xl font-bold text-primary-500">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating decorative elements */}
            <motion.div
              className="absolute -top-4 -right-4 w-20 h-20 bg-primary-100/30 rounded-full blur-xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
              className="absolute -bottom-4 -left-4 w-16 h-16 bg-primary-200/20 rounded-full blur-xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default TeamSection;
