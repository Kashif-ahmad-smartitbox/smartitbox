"use client";
import React from "react";
import { motion } from "framer-motion";

interface LoadingProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
  overlay?: boolean;
  theme?: "red" | "blue" | "purple" | "green" | "custom";
  customColor?: string;
}

export default function Loading({
  message = "Loading…",
  size = "md",
  fullScreen = true,
  overlay = true,
  theme = "red",
  customColor,
}: LoadingProps) {
  const colorConfig = {
    red: {
      primary: "#fed50a",
      secondary: "oklch(52% 0.03 255)",
      gradient: "from-primary-500 to-primary-600",
    },
    blue: {
      primary: "#3b82f6",
      secondary: "#93c5fd",
      gradient: "from-blue-500 to-blue-600",
    },
    purple: {
      primary: "#8b5cf6",
      secondary: "#c4b5fd",
      gradient: "from-purple-500 to-purple-600",
    },
    green: {
      primary: "#10b981",
      secondary: "#a7f3d0",
      gradient: "from-emerald-500 to-emerald-600",
    },
    custom: {
      primary: customColor || "#3b82f6",
      secondary: customColor ? `${customColor}80` : "#93c5fd",
      gradient: customColor
        ? `from-[${customColor}] to-[${customColor}]`
        : "from-blue-500 to-blue-600",
    },
  };

  const sizeConfig = {
    sm: {
      loader: "w-8 h-8",
      text: "text-sm",
      spacing: "mt-2",
      messageSize: "text-xs",
    },
    md: {
      loader: "w-12 h-12",
      text: "text-base",
      spacing: "mt-3",
      messageSize: "text-sm",
    },
    lg: {
      loader: "w-16 h-16",
      text: "text-lg",
      spacing: "mt-4",
      messageSize: "text-base",
    },
  };

  const currentColor = colorConfig[theme];
  const currentSize = sizeConfig[size];

  const containerClasses = `${fullScreen ? "fixed inset-0" : "relative"} ${
    overlay ? "bg-black/10 backdrop-blur-sm" : ""
  }`;

  return (
    <div className={containerClasses}>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* Floating Background Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full opacity-20"
              style={{
                backgroundColor: currentColor.secondary,
                width: Math.random() * 8 + 4,
                height: Math.random() * 8 + 4,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.1, 0.3, 0.1],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Main Loading Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative flex flex-col items-center justify-center p-8 rounded-2xl bg-white/90 backdrop-blur-lg border border-gray-100 shadow-2xl shadow-black/5"
        >
          {/* Animated Rings */}
          <div className="relative flex items-center justify-center">
            {/* Outer Ring */}
            <motion.div
              className={`absolute ${currentSize.loader} rounded-full border-4 border-transparent`}
              style={{
                borderTopColor: currentColor.primary,
                borderRightColor: currentColor.secondary + "40",
                borderBottomColor: currentColor.secondary + "40",
                borderLeftColor: currentColor.secondary + "40",
              }}
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />

            {/* Middle Ring */}
            <motion.div
              className={`absolute ${currentSize.loader} rounded-full border-4 border-transparent`}
              style={{
                borderTopColor: currentColor.secondary + "80",
                borderRightColor: currentColor.primary,
                borderBottomColor: currentColor.secondary + "80",
                borderLeftColor: currentColor.secondary + "80",
              }}
              animate={{
                rotate: -360,
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
                delay: 0.1,
              }}
            />

            {/* Inner Ring with Pulse Effect */}
            <motion.div
              className={`${currentSize.loader} rounded-full flex items-center justify-center`}
              style={{
                background: `radial-gradient(circle, ${currentColor.secondary}80 0%, transparent 70%)`,
              }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {/* Central Dot */}
              <motion.div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: currentColor.primary }}
                animate={{
                  scale: [1, 1.5, 1],
                  boxShadow: [
                    `0 0 0 0 ${currentColor.primary}40`,
                    `0 0 0 10px ${currentColor.primary}00`,
                    `0 0 0 0 ${currentColor.primary}40`,
                  ],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>

            {/* Floating Orbs */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  backgroundColor: currentColor.primary,
                  width:
                    currentSize.loader === "w-8 h-8"
                      ? 6
                      : currentSize.loader === "w-12 h-12"
                      ? 8
                      : 10,
                  height:
                    currentSize.loader === "w-8 h-8"
                      ? 6
                      : currentSize.loader === "w-12 h-12"
                      ? 8
                      : 10,
                }}
                initial={{
                  x: 0,
                  y:
                    currentSize.loader === "w-8 h-8"
                      ? -20
                      : currentSize.loader === "w-12 h-12"
                      ? -30
                      : -40,
                  opacity: 0,
                }}
                animate={{
                  x: [
                    0,
                    currentSize.loader === "w-8 h-8"
                      ? 20
                      : currentSize.loader === "w-12 h-12"
                      ? 30
                      : 40,
                    0,
                    currentSize.loader === "w-8 h-8"
                      ? -20
                      : currentSize.loader === "w-12 h-12"
                      ? -30
                      : -40,
                    0,
                  ],
                  y: [
                    currentSize.loader === "w-8 h-8"
                      ? -20
                      : currentSize.loader === "w-12 h-12"
                      ? -30
                      : -40,
                    0,
                    currentSize.loader === "w-8 h-8"
                      ? 20
                      : currentSize.loader === "w-12 h-12"
                      ? 30
                      : 40,
                    0,
                    currentSize.loader === "w-8 h-8"
                      ? -20
                      : currentSize.loader === "w-12 h-12"
                      ? -30
                      : -40,
                  ],
                  opacity: [0, 1, 1, 1, 0],
                  scale: [0, 1, 1, 1, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "linear",
                }}
              />
            ))}
          </div>

          {/* Loading Text with Typing Animation */}
          <div className={`${currentSize.spacing} flex items-center gap-2`}>
            <motion.div
              className={`${currentSize.messageSize} font-medium text-gray-700`}
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {message}
            </motion.div>
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 h-1 rounded-full"
                  style={{ backgroundColor: currentColor.primary }}
                  animate={{
                    y: [0, -4, 0],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Progress Bar (Optional) */}
          <motion.div
            className={`${currentSize.spacing} w-32 h-1 bg-gray-100 rounded-full overflow-hidden`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, ${currentColor.secondary}, ${currentColor.primary})`,
              }}
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        </motion.div>

        {/* Background Glow Effect */}
        <motion.div
          className="absolute inset-0 -z-10 flex items-center justify-center"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div
            className="w-64 h-64 rounded-full blur-3xl"
            style={{
              background: `radial-gradient(circle, ${currentColor.secondary}40 0%, transparent 70%)`,
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
