"use client";
import React from "react";
import Image from "next/image";
import { ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";

export default function SmartitboxCreativeHero(props: any) {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Subtle radial backdrop */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/4 -translate-x-1/2 w-[680px] h-[680px] rounded-full bg-gradient-to-br from-primary-50 via-white to-transparent opacity-80 blur-3xl" />
        <div className="absolute -right-32 bottom-0 w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-sky-50 via-white to-transparent opacity-60 blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
        <div className="relative text-center">
          {/* Floating logo/icon */}
          <motion.div
            initial={{ y: -6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-4 py-3 flex items-center justify-center"
          >
            <Image
              src={props.data.logo.src}
              alt={props.data.logo.alt}
              width={props.data.logo.width}
              height={props.data.logo.height}
              className="object-contain"
            />
          </motion.div>

          {/* Superheadline */}
          <p className="text-sm md:text-base text-gray-500 mb-2">
            {props.data.superheadline}
          </p>

          {/* Headline */}
          <motion.h1
            initial={{ scale: 0.995, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight"
          >
            {props.data.headline.beforeHighlight}
            <span className="text-primary-600">
              {props.data.headline.highlight}
            </span>
            {props.data.headline.afterHighlight}
          </motion.h1>

          {/* Underline accent */}
          <div className="mt-3 flex justify-center">
            <span className="inline-block w-16 h-1 rounded-full bg-primary-600/90 shadow-sm" />
          </div>

          {/* Subtext */}
          <motion.p
            initial={{ y: 6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="mt-6 text-gray-600 max-w-3xl mx-auto text-base md:text-lg"
          >
            {props.data.subtext}
          </motion.p>

          {/* CTA buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={props.data.primaryCta.href}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary-600 text-white font-semibold shadow-lg hover:bg-primary-700 transition"
            >
              {props.data.primaryCta.text}
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href={props.data.secondaryCta.href}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/90 border border-gray-200 text-gray-800 font-medium shadow-sm hover:shadow-md transition"
            >
              <Play className="w-4 h-4" /> {props.data.secondaryCta.text}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
