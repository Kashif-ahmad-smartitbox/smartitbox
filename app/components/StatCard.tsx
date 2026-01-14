import React, {
  ReactElement,
  ReactNode,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";

export type StatCardProps = {
  label: string;
  value: number | string | null;
  sub?: string;
  icon?: ReactNode;
  ariaLabel?: string;
  variant?: "neutral" | "accent" | "success" | "danger";
  compact?: boolean;
  className?: string;
  prefix?: string;
  suffix?: string;
  precision?: number;
  showTrend?: boolean;
  onClick?: () => void;
};

function useAnimatedNumber(target: number | null, duration = 900) {
  const [display, setDisplay] = useState<number>(target || 0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const startValRef = useRef<number>(target || 0);

  useEffect(() => {
    // If target is null or not a number, don't animate
    if (target === null || typeof target !== "number") {
      setDisplay(0);
      return;
    }

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setDisplay(target);
      return;
    }

    // start from previous display for smooth transitions
    startValRef.current = display;
    startRef.current = performance.now();

    const step = (now: number) => {
      if (startRef.current === null) return;
      const progress = Math.min((now - startRef.current) / duration, 1);
      const eased =
        progress < 0.5
          ? 2 * progress * progress
          : -1 + (4 - 2 * progress) * progress; // easeInOut quad-ish
      const value =
        startValRef.current + (target - startValRef.current) * eased;
      setDisplay(Math.round(value));
      if (progress < 1) rafRef.current = window.requestAnimationFrame(step);
    };

    rafRef.current = window.requestAnimationFrame(step);

    return () => {
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      startRef.current = null;
    };
  }, [target, duration]);

  return display;
}

function formatNumber(value: number, precision = 0) {
  // choose compact notation for large numbers
  const abs = Math.abs(value);
  const opts: Intl.NumberFormatOptions =
    abs >= 1000
      ? { notation: "compact", maximumFractionDigits: precision }
      : { maximumFractionDigits: precision };
  return new Intl.NumberFormat(undefined, opts).format(value);
}

export default function StatCard({
  label,
  value,
  sub,
  icon,
  ariaLabel,
  variant = "neutral",
  compact = false,
  className = "",
  prefix = "",
  suffix = "",
  precision = 0,
  showTrend = false,
  onClick,
}: StatCardProps): ReactElement {
  const isLoading = value === null;

  // Always call the hook unconditionally
  const numericValue = typeof value === "number" ? value : 0;
  const animatedValue = useAnimatedNumber(numericValue, 900);

  const variantColors: Record<string, string> = {
    neutral: "bg-white text-gray-900",
    accent: "bg-gradient-to-br from-indigo-600 to-violet-600 text-white",
    success: "bg-gradient-to-br from-emerald-500 to-green-600 text-white",
    danger: "bg-gradient-to-br from-primary-500 to-red-600 text-white",
  };

  const borderColors: Record<string, string> = {
    neutral: "ring-1 ring-gray-100",
    accent: "ring-1 ring-indigo-200/30",
    success: "ring-1 ring-emerald-200/30",
    danger: "ring-1 ring-primary-200/30",
  };

  const textColors: Record<string, string> = {
    neutral: "text-gray-900",
    accent: "text-white",
    success: "text-white",
    danger: "text-white",
  };

  const isAccent = variant !== "neutral";

  const displayed = useMemo(() => {
    if (isLoading) return "";
    if (typeof value === "number") {
      return `${prefix}${formatNumber(animatedValue, precision)}${suffix}`;
    }
    // non-numeric value (string)
    return `${prefix}${value}${suffix}`;
  }, [isLoading, animatedValue, prefix, suffix, precision, value]);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      role="group"
      aria-label={ariaLabel ?? `${label} stat`}
      className={`group w-full text-left rounded-2xl p-4 sm:p-5 shadow-2xl transition-all duration-500 transform hover:-translate-y-0.5 hover:scale-105 hover:bg-[#a53d96] bg-white border-gray-400 cursor-pointer`}
    >
      <div className={`flex items-center ${compact ? "gap-3" : "gap-4"}`}>
        {icon ? (
          <div
            className={`flex-none rounded-full p-2 ${
              isAccent ? "bg-white/12" : "bg-gray-100"
            }`}
            aria-hidden
          >
            {icon}
          </div>
        ) : null}

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div
              className={`text-lg font-bold ${
                isAccent
                  ? "text-white/90"
                  : "text-gray-600 group-hover:text-white/90"
              }`}
            >
              {label}
            </div>

            {showTrend && sub ? (
              <div
                className={`ml-3 text-xs font-medium px-2 py-0.5 rounded-full ${
                  isAccent
                    ? "bg-white/12 text-white/95 "
                    : "bg-gray-100 text-gray-700"
                }`}
                aria-hidden
              >
                {sub}
              </div>
            ) : null}
          </div>

          <div
            className={`mt-1 flex items-end gap-3 ${
              compact ? "flex-row" : "flex-col sm:flex-row sm:items-baseline"
            }`}
          >
            <div
              className={`font-extrabold leading-tight ${
                compact ? "text-lg md:text-xl" : "text-2xl md:text-3xl"
              } ${textColors[variant]}`}
              aria-live={isLoading ? undefined : "polite"}
            >
              {isLoading ? (
                <div
                  className={`h-8 ${
                    compact ? "w-24" : "w-40"
                  } rounded-md animate-pulse bg-gray-200/60 ${
                    isAccent ? "bg-white/12" : ""
                  }`}
                />
              ) : (
                <span className="group-hover:text-white/90">{displayed}</span>
              )}
            </div>

            {!compact && !showTrend && sub ? (
              <div
                className={`text-sm ${
                  isAccent
                    ? "text-white/90"
                    : "text-gray-500 group-hover:text-white/90"
                }`}
              >
                {sub}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* subtle footer */}
      <div className="w-full mt-3" aria-hidden>
        <div className="h-0.5 rounded-full bg-linear-to-r from-transparent via-black/5 to-transparent dark:via-white/5" />
      </div>
    </button>
  );
}
