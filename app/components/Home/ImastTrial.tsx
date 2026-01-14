"use client";
import React from "react";
import { ArrowRight, CheckCircle } from "lucide-react";
import { motion, Variants } from "framer-motion";

export type SmartitboxTrialData = {
  brandLogoSrc?: string;
  headline?: {
    pre?: string;
    highlight?: string;
    post?: string;
  };
  subheadline?: string;
  features: string[];
  cta: {
    text: string;
    href: string;
  };
  trust?: {
    brandsLabel?: string;
    brandsCount?: string;
    usersLabel?: string;
    usersCount?: string;
  };
  illustrationSrc?: string;
  accent?: {
    from?: string;
    to?: string;
  };
};

type Props = {
  data: SmartitboxTrialData;
};

const floatAnimation: Variants = {
  initial: { y: 0, rotate: 0, scale: 1 },
  float: {
    y: [0, -12, 2, -8, 0],
    rotate: [-0.5, 0.5, -0.3, 0.3, -0.5],
    scale: [1, 1.002, 0.998, 1.001, 1],
    transition: {
      duration: 8,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "reverse",
    },
  },
  hover: {
    y: -8,
    scale: 1.03,
    rotate: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  tap: { scale: 0.98, transition: { duration: 0.1 } },
};

const backgroundFloat: Variants = {
  initial: { y: 0, opacity: 0.1 },
  animate: {
    y: [0, -20, 0],
    opacity: [0.1, 0.15, 0.1],
    transition: {
      duration: 10,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "reverse",
    },
  },
};

const sparkleAnimation: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: {
    opacity: [0, 0.15, 0.05, 0.12, 0],
    scale: [0.9, 1.1, 0.95, 1.05, 0.9],
    transition: { duration: 9, repeat: Infinity, ease: "easeInOut" },
  },
};

const featureItem: Variants = {
  initial: { opacity: 0, x: -10 },
  animate: { opacity: 1, x: 0 },
};
const containerVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function SmartitboxTrial({ data }: Props) {
  const {
    brandLogoSrc = "/logo.svg",
    headline = { pre: "Try", highlight: "SMARTITBOX", post: "Free" },
    subheadline = "No credit card required. No software to install. Start in minutes.",
    features = [],
    cta,
    trust = {
      brandsLabel: "Trusted by",
      brandsCount: "500+",
      usersLabel: "users",
      usersCount: "2M+",
    },
    illustrationSrc = "/smartitbox-try-free.png",
  } = data;

  return (
    <section className="w-full py-16 lg:py-24 px-6 lg:px-12 bg-gradient-to-br from-slate-900 to-red-900 relative overflow-hidden">
      <motion.div
        variants={backgroundFloat}
        initial="initial"
        animate="animate"
        className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"
      />

      <motion.div
        variants={backgroundFloat}
        initial="initial"
        animate="animate"
        transition={{ delay: 2 }}
        className="absolute bottom-0 right-0 w-96 h-96 bg-primary-300/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"
      />

      <motion.div
        aria-hidden="true"
        variants={sparkleAnimation}
        initial="initial"
        animate="animate"
        className="pointer-events-none absolute right-12 lg:right-40 bottom-8 lg:bottom-20 w-40 h-40 rounded-full bg-primary-400/8 blur-2xl"
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <motion.div
            className="p-6 lg:p-8 text-white space-y-6"
            initial="initial"
            animate="animate"
            variants={containerVariants}
          >
            <div className="flex items-center gap-3 mb-2">
              <img
                src={brandLogoSrc}
                alt="brand"
                className="w-8 h-8 lg:w-44 lg:h-20"
                loading="eager"
              />
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              {headline.pre ? <>{headline.pre} </> : null}
              <span className="relative inline-block">
                <span className="relative z-10">{headline.highlight}</span>
                <div className="absolute bottom-2 left-0 w-full h-3 bg-primary-300/30 -rotate-1 z-0" />
              </span>
              {headline.post ? <> {headline.post}</> : null}
            </h1>

            <p className="text-xl lg:text-2xl font-light text-primary-100 leading-relaxed max-w-xl">
              {subheadline}
            </p>

            <motion.div className="space-y-3" variants={containerVariants}>
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={featureItem}
                  className="flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-primary-200 flex-shrink-0" />
                  <span className="text-primary-100 text-sm lg:text-base">
                    {feature}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            <div className="space-y-4 pt-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <motion.a
                  href={cta.href}
                  className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-primary-700 font-bold rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl active:scale-95 min-w-[200px] justify-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10">{cta.text}</span>
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                  <div className="absolute inset-0 bg-gradient-to-r from-white to-primary-100 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.a>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-primary-100">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-6 h-6 bg-primary-300 rounded-full border-2 border-primary-600"
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">
                      {trust.brandsLabel}{" "}
                      <strong className="text-white">
                        {trust.brandsCount}
                      </strong>
                    </span>
                  </div>
                  <div className="hidden sm:block w-px h-4 bg-primary-400/50" />
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <strong className="text-white">{trust.usersCount}</strong>{" "}
                    {trust.usersLabel}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="relative p-8 lg:p-10 flex justify-center items-center">
            <motion.div
              variants={floatAnimation}
              initial="initial"
              animate="float"
              whileHover="hover"
              whileTap="tap"
              className="relative max-w-md lg:max-w-lg w-full cursor-pointer select-none"
            >
              <motion.div
                initial={{ opacity: 0.06, scale: 0.98 }}
                animate={{
                  opacity: [0.06, 0.15, 0.08, 0.12, 0.06],
                  scale: [0.98, 1.02, 0.99, 1.01, 0.98],
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -inset-4 rounded-xl border border-primary-600/25 blur-md pointer-events-none"
              />

              <motion.img
                src={illustrationSrc}
                alt="SMARTITBOX product preview"
                loading="lazy"
                className="w-full h-auto object-contain rounded-lg relative z-10"
                draggable={false}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              />

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: [0, 0.8, 0.6], y: [10, -5, 10] }}
                transition={{
                  delay: 0.5,
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-6 right-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-xs text-primary-100 font-medium border border-primary-400/20"
              >
                Live preview
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
