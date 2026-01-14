import React from "react";
import {
  ArrowRight,
  TrendingUp,
  Users,
  Target,
  Cloud,
  Package,
  Wrench,
  Trophy,
  Zap,
  BookOpen,
} from "lucide-react";

// Types
export type MetricCardData = {
  icon: string;
  label: string;
  value: string;
  delay?: string;
};

export type ModuleData = {
  name: string;
  icon: string;
};

export type StatPillData = {
  icon: string;
  label: string;
  value: string;
  color: "rose" | "amber" | "blue";
  delay?: string;
};

export type SmartitboxCardProps = {
  title: string;
  description: string;
  highlightedText: string;
  logoUrl: string;
  metrics: MetricCardData[];
  modules: ModuleData[];
  stats: StatPillData[];
  cta: {
    text: string;
    link: string;
  };
};

// Icon mapping
const ICON_MAP: Record<string, React.ComponentType<any>> = {
  TrendingUp,
  Users,
  Target,
  Cloud,
  Package,
  Wrench,
  Trophy,
  Zap,
  BookOpen,
  ArrowRight,
};

export default function SmartitboxCard({
  title = "Unified Cloud Solution",
  description = "All cloud modules integrating complete supply chain and producing",
  highlightedText = "measurable results",
  logoUrl = "/smartitbox360.png",
  metrics = [],
  modules = [],
  stats = [],
  cta = { text: "View Case Study", link: "/case-studies" },
}: SmartitboxCardProps) {
  return (
    <div className="group relative">
      <div className="relative rounded-2xl bg-white/80 backdrop-blur-sm ring-1 ring-white/20 border border-gray-100 overflow-hidden transition-all duration-500 group-hover:scale-[1.02] group-hover:ring-primary-100/50">
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Header Section */}
          <div className="flex flex-col xs:flex-row items-start justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
            <img
              className="w-33 py-5"
              src={logoUrl}
              alt="Smartitbox 360 Logo"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 leading-tight">
                {title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {description}
                <span className="font-semibold text-gray-700">
                  {" "}
                  {highlightedText}
                </span>
              </p>
            </div>
          </div>

          {/* Key metrics grid */}
          <div className="grid grid-cols-3 gap-2 mb-4 sm:mb-6 lg:mb-8">
            {metrics.map((metric, index) => (
              <MetricCard
                key={index}
                icon={metric.icon}
                label={metric.label}
                value={metric.value}
                delay={metric.delay || "0"}
              />
            ))}
          </div>

          {/* Modules section */}
          <div className="mb-4 sm:mb-6 lg:mb-8">
            <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-3 sm:mb-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-linear-to-r from-primary-500 to-amber-500 rounded-full shrink-0"></div>
              Integrated Modules
            </h4>
            <div className="flex flex-wrap gap-2">
              {modules.map((module, index) => (
                <ModulePill
                  key={index}
                  name={module.name}
                  icon={module.icon}
                  index={index}
                />
              ))}
            </div>
          </div>

          {/* Bottom stats and CTA */}
          <div className="pt-4 sm:pt-6 border-t border-gray-100">
            <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 sm:gap-4">
              <div className="flex flex-wrap gap-2">
                {stats.map((stat, index) => (
                  <StatPill
                    key={index}
                    icon={stat.icon}
                    label={stat.label}
                    value={stat.value}
                    color={stat.color}
                    delay={stat.delay || "0"}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Metric Card Component */
function MetricCard({ icon, label, value, delay }: MetricCardData) {
  const IconComponent = ICON_MAP[icon] || TrendingUp;

  return (
    <div
      className="text-center p-2 sm:p-3 rounded-xl bg-white border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-md group/metric"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className={`inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-linear-to-r from-primary-500 to-primary-600 text-white mb-1 sm:mb-2 group-hover/metric:scale-110 transition-transform duration-300 mx-auto`}
      >
        <IconComponent className="w-3 h-3 sm:w-4 sm:h-4" />
      </div>
      <div className="text-sm sm:text-lg font-bold text-gray-900 mb-0.5 sm:mb-1 leading-none sm:leading-tight">
        {value}
      </div>
      <div className="text-[10px] sm:text-xs text-gray-600 leading-tight line-clamp-2">
        {label}
      </div>
    </div>
  );
}

/* Module Pill Component */
function ModulePill({
  name,
  icon,
  index,
}: {
  name: string;
  icon: string;
  index: number;
}) {
  const IconComponent = ICON_MAP[icon] || Package;

  return (
    <div
      className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-white text-gray-700 text-xs font-medium border border-gray-100 hover:border-gray-200 hover:scale-105 transition-all duration-300 cursor-pointer group/module shrink-0 min-w-0"
      style={{
        flex: "1 1 auto",
        maxWidth: "calc(50% - 0.75rem)",
        minWidth: "140px",
      }}
    >
      <div className="flex items-center gap-1.5 sm:gap-2 w-full">
        <div
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
            index % 3 === 0
              ? "bg-primary-400"
              : index % 3 === 1
              ? "bg-amber-400"
              : "bg-blue-400"
          }`}
        ></div>
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <IconComponent className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
          <span className="truncate text-xs sm:text-xs">{name}</span>
        </div>
      </div>
    </div>
  );
}

/* Stat Pill Component */
function StatPill({ icon, label, value, color, delay }: StatPillData) {
  const colorClasses = {
    rose: "bg-primary-50 text-primary-700 border-primary-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
  };

  return (
    <div
      className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border ${colorClasses[color]} transition-all duration-300 hover:scale-105 hover:shadow-sm shrink-0`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className="font-bold text-xs sm:text-sm">{icon}</span>
      <div className="min-w-0">
        <div className="text-xs font-medium whitespace-nowrap">{value}</div>
        <div className="text-[10px] text-gray-600 whitespace-nowrap truncate">
          {label}
        </div>
      </div>
    </div>
  );
}
