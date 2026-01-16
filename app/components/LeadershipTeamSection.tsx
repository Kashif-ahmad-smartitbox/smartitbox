"use client";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import {
  Linkedin,
  Mail,
  MapPin,
  Briefcase,
  BookOpen,
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
      delayChildren: 0.1,
    },
  },
};

const CHILD_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  experience: string;
  education: string;
  location: string;
  expertise: string[];
  socialLinks: {
    linkedin?: string;
    email?: string;
  };
}

interface LeadershipTeamSectionProps {
  data: {
    sectionLabel: string;
    headingPart1: string;
    headingPart2: string;
    subheading: string;
    team: TeamMember[];
  };
}

function LeadershipTeamSection({ data }: LeadershipTeamSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const controls = useAnimation();
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-white py-15 lg:py-30 overflow-hidden"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={CONTAINER_VARIANTS}
          initial="hidden"
          animate={controls}
          className="text-center mb-16"
        >
          <motion.div
            variants={CHILD_VARIANTS}
            className="inline-flex items-center gap-2 mb-6 px-4 py-2.5 bg-linear-to-l from-rose-200 via-primary-50 to-rose-200 text-secondary-900 text-sm font-semibold rounded-lg border border-primary-200/50"
          >
            <span>{data.sectionLabel}</span>
          </motion.div>

          {/* Main Heading */}
          <motion.div variants={CHILD_VARIANTS}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight text-gray-900">
              {data.headingPart1}{" "}
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
        </motion.div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.team.map((member, index) => {
            const isSelected = selectedMember === member.id;
            const delay = 0.3 + index * 0.1;

            return (
              <motion.div
                key={member.id}
                custom={delay}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay }}
                className="group relative"
              >
                {/* Member Card */}
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{
                    type: "spring",
                    stiffness: SPRING_CONFIG.stiffness,
                    damping: SPRING_CONFIG.damping,
                    mass: SPRING_CONFIG.mass,
                  }}
                  onClick={() =>
                    setSelectedMember(isSelected ? null : member.id)
                  }
                  className={`relative bg-white rounded-xl border cursor-pointer overflow-hidden transition-all duration-300 ${
                    isSelected
                      ? "border-primary-300 shadow-xl shadow-primary-500/10 ring-1 ring-primary-100"
                      : "border-gray-100 hover:border-gray-200 hover:shadow-lg"
                  }`}
                >
                  {/* Card Content */}
                  <div className="p-6">
                    {/* Top Section */}
                    <div className="flex items-start gap-4">
                      {/* Image */}
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-100"
                      >
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-gray-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.div>

                      {/* Basic Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-gray-900 truncate">
                          {member.name}
                        </h3>
                        <div className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 text-sm font-medium rounded-full mt-2">
                          {member.role}
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                          <MapPin size={12} />
                          <span>{member.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="mt-4 text-gray-600 line-clamp-3 text-sm leading-relaxed">
                      {member.bio}
                    </p>

                    {/* Expertise Tags */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {member.expertise.slice(0, 3).map((skill, idx) => (
                        <motion.span
                          key={skill}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={isInView ? { opacity: 1, scale: 1 } : {}}
                          transition={{ delay: delay + 0.1 + idx * 0.05 }}
                          className="px-3 py-1 bg-gray-50 text-gray-700 text-xs font-medium rounded-full border border-gray-100"
                        >
                          {skill}
                        </motion.span>
                      ))}
                      {member.expertise.length > 3 && (
                        <span className="px-3 py-1 bg-gray-50 text-gray-500 text-xs font-medium rounded-full border border-gray-100">
                          +{member.expertise.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Social Links */}
                    <div className="flex gap-2 mt-6">
                      {member.socialLinks.linkedin && (
                        <motion.a
                          href={member.socialLinks.linkedin}
                          whileHover={{ scale: 1.1, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => e.stopPropagation()}
                          className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 hover:text-blue-600 border border-gray-100 hover:border-blue-200 transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Linkedin size={16} />
                        </motion.a>
                      )}
                      {member.socialLinks.email && (
                        <motion.a
                          href={`mailto:${member.socialLinks.email}`}
                          whileHover={{ scale: 1.1, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => e.stopPropagation()}
                          className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 hover:text-red-600 border border-gray-100 hover:border-red-200 transition-colors"
                        >
                          <Mail size={16} />
                        </motion.a>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Detailed Modal View */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: 20, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4"
                    >
                      <div className="bg-linear-to-br from-gray-50 to-white rounded-xl border border-gray-100 p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          {/* Experience & Education */}
                          <div className="space-y-6">
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <Briefcase
                                  size={18}
                                  className="text-primary-500"
                                />
                                <h4 className="font-semibold text-gray-900">
                                  Experience
                                </h4>
                              </div>
                              <p className="text-gray-600 leading-relaxed">
                                {member.experience}
                              </p>
                            </div>

                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <BookOpen
                                  size={18}
                                  className="text-primary-500"
                                />
                                <h4 className="font-semibold text-gray-900">
                                  Education
                                </h4>
                              </div>
                              <p className="text-gray-600 leading-relaxed">
                                {member.education}
                              </p>
                            </div>
                          </div>

                          {/* Focus Areas */}
                          <div className="space-y-6">
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <Target
                                  size={18}
                                  className="text-primary-500"
                                />
                                <h4 className="font-semibold text-gray-900">
                                  Focus Areas
                                </h4>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {member.expertise.map((skill, idx) => (
                                  <span
                                    key={idx}
                                    className="px-3 py-1.5 bg-white text-primary-700 text-sm font-medium rounded-lg border border-primary-100"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default LeadershipTeamSection;
