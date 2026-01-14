import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Zap, Shield, Clock } from "lucide-react";

export type LogoEntry = {
  url: string;
  alt?: string;
};

export type IntegrationSlot = {
  id: string;
  name?: string;
  description?: string;
  logos: LogoEntry[];
  intervalMs?: number;
};

export type IntegrationsData = {
  heading?: string;
  subheading?: string;
  description?: string;
  items: IntegrationSlot[];
  features?: {
    title: string;
    description: string;
    icon: string;
  }[];
};

export type SmartitboxIntegrationsRotatingSectionProps = {
  data: IntegrationsData;
  className?: string;
  defaultIntervalMs?: number;
};

function useStableRandomSeed() {
  const ref = useRef<number | null>(null);
  if (ref.current == null) ref.current = Math.floor(Math.random() * 600);
  return ref.current;
}

function RotatingLogo({
  logos,
  intervalMs = 3000,
  pauseOnHover = true,
}: {
  logos: LogoEntry[];
  intervalMs?: number;
  pauseOnHover?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const runningRef = useRef(true);
  const jitter = useStableRandomSeed();
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    runningRef.current = true;
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (!logos || logos.length <= 1) {
      setIndex(0);
      return () => {};
    }
    const startTimeout = window.setTimeout(() => {
      intervalRef.current = window.setInterval(() => {
        if (!runningRef.current) return;
        setIndex((i) => (i + 1) % logos.length);
      }, intervalMs);
    }, jitter);

    return () => {
      window.clearTimeout(startTimeout);
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [logos, intervalMs, jitter]);

  const onMouseEnter = () => {
    if (pauseOnHover) runningRef.current = false;
  };
  const onMouseLeave = () => {
    if (pauseOnHover) runningRef.current = true;
  };

  return (
    <div
      className="relative w-full h-full flex items-center justify-center"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {logos.map((l, i) => {
        const isActive = i === index;
        return (
          <div
            key={i}
            className={
              "absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out " +
              (isActive
                ? "opacity-100 translate-y-0 scale-100 z-10"
                : "opacity-0 -translate-y-3 scale-95 z-0 pointer-events-none")
            }
            aria-hidden={!isActive}
            style={{ willChange: "transform, opacity" }}
          >
            <div className="w-full max-w-40 px-4">
              <img
                src={l.url}
                alt={isActive ? l.alt ?? "" : ""}
                loading="lazy"
                className="block mx-auto object-contain w-full h-12 transition-all duration-300 hover:scale-110"
                width={160}
                height={48}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

const FeatureCard: React.FC<{
  title: string;
  description: string;
  icon: string;
  index: number;
}> = ({ title, description, icon, index }) => {
  const IconComponent =
    {
      zap: Zap,
      shield: Shield,
      clock: Clock,
    }[icon] || Zap;

  return (
    <div
      className="text-center p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-primary-100 hover:shadow-lg hover:border-primary-200 transition-all duration-300 group"
      style={{ animationDelay: `${index * 200}ms` }}
    >
      <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-primary-500 to-primary-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
        <IconComponent className="w-8 h-8 text-white" />
      </div>
      <h4 className="text-lg font-bold text-primary-900 mb-2">{title}</h4>
      <p className="text-primary-700 text-sm leading-relaxed">{description}</p>
    </div>
  );
};

export default function SmartitboxIntegrationsRotatingSection({
  data,
  className = "",
  defaultIntervalMs = 3000,
}: SmartitboxIntegrationsRotatingSectionProps) {
  const {
    heading = "Seamless Integrations",
    subheading = "Connect with Your Favorite Tools",
    description = "Experience effortless integration with our extensive ecosystem of partners and platforms",
    items = [],
  } = data ?? {};

  const slots = useMemo(() => (items ?? []).slice(), [items]);

  return (
    <section className={`relative py-20 lg:py-28 overflow-hidden ${className}`}>
      {/* Vibrant Background */}
      <div className="absolute inset-0 bg-linear-to-br from-primary-500 via-primary-600 to-primary-700">
        {/* Animated background elements */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute bottom-10 left-1/2 w-72 h-72 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 mb-6">
            <div className="w-2 h-2 rounded-full bg-black animate-pulse" />
            <span className="text-sm font-semibold uppercase tracking-wide text-black">
              Integrations
            </span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            {heading}
          </h2>
          <p className="text-xl lg:text-2xl text-primary-100 mb-6 max-w-3xl mx-auto">
            {subheading}
          </p>
          <p className="text-lg text-primary-200 max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 lg:gap-8 mb-16 lg:mb-20">
          {slots.map((slot) => {
            const ms = slot.intervalMs ?? defaultIntervalMs;

            return (
              <div key={slot.id} className="relative group">
                <div
                  className="relative flex items-center justify-center h-32 rounded-3xl bg-white backdrop-blur-sm border border-white/20 hover:border-white/30 transition-all duration-500 overflow-hidden"
                  aria-label={slot.name ?? slot.id}
                  role="group"
                >
                  {/* Hover effect background */}
                  <div className="absolute inset-0 bg-linear-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Logo container */}
                  <div className="relative z-10 w-full px-4">
                    <RotatingLogo logos={slot.logos} intervalMs={ms} />
                  </div>

                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>

                {/* Slot name */}
                {slot.name && (
                  <div className="mt-3 text-center">
                    <h4 className="text-white font-medium text-sm">
                      {slot.name}
                    </h4>
                    {slot.description && (
                      <p className="text-primary-200 text-xs mt-1">
                        {slot.description}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
}
