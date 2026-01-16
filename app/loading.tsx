"use client";
import React from "react";

interface LoadingProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
  overlay?: boolean;
}

export default function Loading({
  message = "Loading…",
  size = "md",
  fullScreen = true,
  overlay = true,
}: LoadingProps) {
  const sizeConfig = {
    sm: { container: "p-2", spinner: "h-4 w-4", text: "text-xs" },
    md: { container: "p-3", spinner: "h-6 w-6", text: "text-sm" },
    lg: { container: "p-4", spinner: "h-8 w-8", text: "text-base" },
  };

  const { container, spinner, text } = sizeConfig[size];

  const LoadingContent = () => (
    <>
      {/* Enhanced Top Progress Bar - Red Theme */}
      <div className="absolute left-0 right-0 top-0 z-10">
        <div className="h-1 w-full overflow-hidden bg-gradient-to-r from-red-100 via-red-300 to-red-100">
          <div className="h-full w-full relative overflow-hidden">
            <div
              className="h-full w-1/4 bg-gradient-to-r from-transparent via-primary-500 to-transparent animate-[shimmer_1.5s_ease-in-out_infinite]"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.8), transparent)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Enhanced Centered Content */}
      <div
        className={`z-20 rounded-2xl bg-white/95 backdrop-blur-md border border-gray-200/50 ${container} shadow-xl flex items-center gap-3`}
      >
        {/* Modern Spinner - Red Theme */}
        <div className="relative">
          <svg
            className={`${spinner} animate-spin text-primary-600`}
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient
                id="spinner-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
                <stop offset="50%" stopColor="currentColor" stopOpacity="0.8" />
                <stop
                  offset="100%"
                  stopColor="currentColor"
                  stopOpacity="0.3"
                />
              </linearGradient>
            </defs>
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="url(#spinner-gradient)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M12 2a10 10 0 0 1 10 10"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              className="text-primary-600"
            />
          </svg>

          {/* Pulsing dot - Red */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1 h-1 bg-primary-600 rounded-full animate-pulse" />
          </div>
        </div>

        <span className={`font-medium text-gray-700 ${text}`}>{message}</span>
      </div>

      {/* Floating particles - Red Theme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-red-400/30 rounded-full animate-float"
            style={{
              left: `${20 + i * 30}%`,
              top: `${30 + i * 20}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i}s`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(-15deg);
          }
          100% {
            transform: translateX(200%) skewX(-15deg);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px) scale(1.1);
            opacity: 0.6;
          }
        }

        .animate-float {
          animation: float ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-\\[shimmer_1.5s_ease-in-out_infinite\\],
          .animate-spin,
          .animate-pulse,
          .animate-float {
            animation: none;
          }
        }
      `}</style>
    </>
  );

  if (!fullScreen) {
    return (
      <div aria-hidden="true" className="relative inline-block">
        <LoadingContent />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[1000] flex items-center justify-center ${
        overlay ? "bg-white/90 backdrop-blur-lg" : "bg-transparent"
      }`}
    >
      <LoadingContent />
    </div>
  );
}
