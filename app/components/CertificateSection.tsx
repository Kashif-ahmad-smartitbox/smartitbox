"use client";
import React, { useRef } from "react";
import Image from "next/image";
import { Award, ExternalLink } from "lucide-react";
import { motion, useInView, type Variants } from "framer-motion";

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

const CARD_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const SPRING_CONFIG = {
  stiffness: 300,
  damping: 25,
  mass: 0.5,
};

interface Certificate {
  id: number;
  title: string;
  src: string;
}

interface CertificateSectionProps {
  data: {
    sectionLabel: string;
    headingPart1: string;
    headingPart2: string;
    description: string;
    certificates: Certificate[];
    certificateLabel: string;
  };
}

function CertificateSection({ data }: CertificateSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const handleCertificateClick = (certificate: Certificate) => {
    console.log(`Certificate clicked: ${certificate.title}`);
    // Add analytics or tracking here
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-32 bg-linear-to-b from-white via-gray-50/30 to-white overflow-hidden"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 mb-6 px-4 py-2.5 bg-linear-to-r from-primary-50 to-primary-100 text-secondary-900 text-sm font-semibold rounded-lg border border-primary-200/50"
          >
            <span>{data.sectionLabel}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900"
          >
            {data.headingPart1}{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-primary-500 bg-clip-text">
                {data.headingPart2}
              </span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{
                  delay: 0.8,
                  duration: 0.8,
                  ease: "easeOut",
                }}
                className="absolute bottom-1 left-0 right-0 h-3 bg-primary-100/50 z-0 rounded-lg"
              />
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto"
          >
            {data.description}
          </motion.p>
        </div>

        {/* Grid */}
        <motion.div
          variants={CONTAINER_VARIANTS}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-4 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {data.certificates.map((certificate, index) => (
            <motion.a
              key={certificate.id}
              custom={index}
              variants={CARD_VARIANTS}
              href={certificate.src}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleCertificateClick(certificate)}
              whileHover={{
                boxShadow: "0 20px 40px -10px rgba(59, 130, 246, 0.15)",
              }}
              transition={{
                type: "spring",
                stiffness: SPRING_CONFIG.stiffness,
                damping: SPRING_CONFIG.damping,
                mass: SPRING_CONFIG.mass,
              }}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-primary-200 transition-all duration-300"
            >
              {/* Image Container */}
              <div className="relative h-80 overflow-hidden ">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-full h-full">
                    <Image
                      src={certificate.src}
                      alt={certificate.title}
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-primary-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* External link indicator */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-lg">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 border-t border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-300">
                  {certificate.title}
                </h3>
                <p className="text-sm text-gray-500 font-medium">
                  {data.certificateLabel}
                </p>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default CertificateSection;
