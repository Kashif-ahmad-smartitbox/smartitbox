"use client";
import React, { useRef, useEffect } from "react";
import {
  motion,
  useInView,
  useAnimation,
  AnimatePresence,
  type Variants,
} from "framer-motion";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Award,
  Zap,
  Users,
  Heart,
  Sparkles,
  ArrowRight,
  Building,
  ArrowUpRight,
  ChevronRight,
  Globe,
  Coffee,
  Dumbbell,
  Palette,
  Music,
  BookOpen,
  Check,
} from "lucide-react";

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

// Types
interface JobOpening {
  id: number;
  title: string;
  department: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Remote";
  salary: string;
  experience: string;
  description: string;
  tags: string[];
  postedDate: string;
}

interface Benefit {
  title: string;
  description: string;
  icon: "briefcase" | "dollar" | "award" | "heart" | "zap" | "users";
}

interface CareerSectionProps {
  data: {
    benefits: Benefit[];
    jobOpenings: JobOpening[];
  };
}

// Icon mapping
const BenefitIcon = ({ type }: { type: Benefit["icon"] }) => {
  const icons = {
    briefcase: <Briefcase className="w-5 h-5" />,
    dollar: <DollarSign className="w-5 h-5" />,
    award: <Award className="w-5 h-5" />,
    heart: <Heart className="w-5 h-5" />,
    zap: <Zap className="w-5 h-5" />,
    users: <Users className="w-5 h-5" />,
  };
  return icons[type];
};

function CareerSection({ data }: CareerSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const controls = useAnimation();
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-linear-to-b from-white via-gray-50/30 to-white py-5 lg:py-20 overflow-hidden"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* BENEFITS SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Why You'll Love Working Here
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group relative"
              >
                <div className="relative bg-white rounded-2xl p-6 border border-gray-200 transition-all duration-300 h-full">
                  {/* Icon Container */}
                  <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mb-4 border border-primary-100">
                    <BenefitIcon type={benefit.icon} />
                  </div>

                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    {benefit.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* JOB OPENINGS */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="flex flex-col md:flex-row justify-between items-center mb-7 gap-4">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                Open Positions
              </h3>
              <p className="text-gray-600">
                Find your perfect role and apply today
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {data.jobOpenings.map((job) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <div className="relative bg-white rounded-2xl p-6 border border-gray-200 transition-all duration-300 h-full">
                  {/* Job Header */}
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                        {job.title}
                      </h4>

                      {/* Job Details */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                        <span className="flex items-center gap-1.5">
                          <Building size={14} />
                          {job.department}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin size={14} />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock size={14} />
                          {job.type}
                        </span>
                      </div>
                    </div>

                    {/* Salary & Experience */}
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary-500 mb-1">
                        {job.salary}
                      </div>
                      <div className="text-sm text-gray-500">
                        {job.experience}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {job.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {job.tags.map((tag, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="px-3 py-1.5 bg-gray-50 text-gray-700 text-sm font-medium rounded-lg border border-gray-200 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-colors"
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-sm text-gray-500">
                      {job.postedDate}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors shadow-sm"
                    >
                      Apply Now
                      <ArrowRight size={16} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default CareerSection;
