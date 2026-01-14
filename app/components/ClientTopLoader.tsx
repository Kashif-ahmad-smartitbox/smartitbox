"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface ClientTopLoaderProps {
  minimumDuration?: number;
  hideDelay?: number;
  showProgressBar?: boolean;
  showSpinner?: boolean;
}

export default function ClientTopLoader({
  minimumDuration = 400,
  hideDelay = 100,
  showProgressBar = true,
  showSpinner = true,
}: ClientTopLoaderProps) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const prevPathRef = useRef<string | null>(null);
  const showStartedAt = useRef<number | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Simulate progress for better UX
  const startProgress = () => {
    setProgress(0);
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
          }
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
  };

  const completeProgress = () => {
    setProgress(100);
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
  };

  // Show/hide loader on pathname change
  useEffect(() => {
    const prev = prevPathRef.current;

    if (prev === null) {
      prevPathRef.current = pathname;
      return;
    }

    if (pathname !== prev) {
      // Navigation started
      showStartedAt.current = Date.now();
      setVisible(true);
      startProgress();
      prevPathRef.current = pathname;

      // Hide loader after content loads
      const hideLoader = () => {
        completeProgress();
        const elapsed = Date.now() - (showStartedAt.current ?? 0);
        const remaining = Math.max(0, minimumDuration - elapsed) + hideDelay;

        setTimeout(() => {
          setVisible(false);
          setTimeout(() => setProgress(0), 300); // Reset progress after hide
        }, remaining);
      };

      // Use double RAF to ensure DOM is painted
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          hideLoader();
        });
      });
    }
  }, [pathname, minimumDuration, hideDelay]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  return (
    <div
      aria-hidden={!visible}
      aria-label="Page loading indicator"
      className={`fixed inset-0 z-[1000] transition-all duration-500 ${
        visible
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Enhanced Backdrop */}
      <div
        className={`absolute inset-0 transition-all duration-500 ${
          visible ? "bg-white/95 backdrop-blur-xl" : "bg-transparent"
        }`}
      />

      {/* Enhanced Progress Bar - Red Theme */}
      {showProgressBar && (
        <div
          className={`absolute left-0 right-0 top-0 z-[1001] transition-transform duration-500 ${
            visible ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <div className="h-1.5 w-full bg-gray-200/50 overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-red-500 via-red-600 to-red-500 transition-all duration-300 ease-out"
              style={{
                width: `${progress}%`,
                background:
                  progress === 100
                    ? "linear-gradient(90deg, #dc2626, #b91c1c, #991b1b)"
                    : "linear-gradient(90deg, #ef4444, #dc2626, #b91c1c)",
              }}
            >
              {/* Shimmer effect */}
              <div
                className="h-full w-20 bg-linear-to-r from-transparent via-white/30 to-transparent animate-[shimmer_1s_ease-in-out_infinite]"
                style={{
                  transform: `translateX(${progress === 100 ? 200 : 0}%)`,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Center Content */}
      <div className="relative z-[1002] flex h-full w-full items-center justify-center p-6">
        <div
          className={`flex items-center gap-4 rounded-2xl bg-white/90 backdrop-blur-md border border-gray-200/60 p-4 shadow-2xl transition-all duration-500 ${
            visible
              ? "scale-100 opacity-100 translate-y-0"
              : "scale-95 opacity-0 -translate-y-4"
          }`}
        >
          {showSpinner && (
            <div className="relative">
              {/* Outer spinner - Red Theme */}
              <svg
                className="h-8 w-8 animate-spin text-red-600"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient
                    id="loader-gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop
                      offset="0%"
                      stopColor="currentColor"
                      stopOpacity="0.4"
                    />
                    <stop
                      offset="50%"
                      stopColor="currentColor"
                      stopOpacity="0.8"
                    />
                    <stop
                      offset="100%"
                      stopColor="currentColor"
                      stopOpacity="0.4"
                    />
                  </linearGradient>
                </defs>
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="url(#loader-gradient)"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M12 3a9 9 0 0 1 9 9"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  className="text-red-600"
                />
              </svg>

              {/* Inner pulsing dot - Red */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className={`w-1.5 h-1.5 bg-red-600 rounded-full transition-all duration-300 ${
                    progress === 100 ? "scale-150 bg-red-700" : "animate-pulse"
                  }`}
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-gray-800">
              {progress === 100 ? "Almost there!" : "Loading..."}
            </span>
            {showProgressBar && (
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-600 transition-all duration-300 ease-out rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-600 min-w-8">
                  {Math.round(progress)}%
                </span>
              </div>
            )}
          </div>
        </div>
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

        @media (prefers-reduced-motion: reduce) {
          .animate-\\[shimmer_1s_ease-in-out_infinite\\],
          .animate-spin,
          .animate-pulse {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
