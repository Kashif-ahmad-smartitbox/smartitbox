"use client";
import React, { useMemo, useState } from "react";
import {
  TrendingUp,
  Zap,
  UserCircle,
  Briefcase,
  Package,
  ClipboardList,
  Repeat,
  ShoppingCart,
  Star,
  Users,
  Gift,
  Settings,
  Smartphone,
  Search,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { motion } from "framer-motion";

// Types
type IconName =
  | "TrendingUp"
  | "Zap"
  | "UserCircle"
  | "Briefcase"
  | "Package"
  | "ClipboardList"
  | "Repeat"
  | "ShoppingCart"
  | "Star"
  | "Users"
  | "Gift"
  | "Settings"
  | "Smartphone";

type ModuleItem = {
  icon: IconName;
  title: string;
  description: string;
  learnMoreLink?: string;
};

type ModuleSection = {
  title: string;
  color?: string;
  items: ModuleItem[];
};

type ModulesData = {
  smartitbox360Logo: string;
  title: string;
  description: string;
  sections: ModuleSection[];
};

// Icon mapping
const iconMap: Record<IconName, React.ComponentType<any>> = {
  TrendingUp,
  Zap,
  UserCircle,
  Briefcase,
  Package,
  ClipboardList,
  Repeat,
  ShoppingCart,
  Star,
  Users,
  Gift,
  Settings,
  Smartphone,
};

interface ModulesImprovedProps {
  data: ModulesData;
}

export default function ModulesImproved({ data }: ModulesImprovedProps) {
  const [query, setQuery] = useState("");
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    () => {
      const map: Record<string, boolean> = {};
      data.sections.forEach((s) => (map[s.title] = true));
      return map;
    }
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return data.sections;
    const q = query.toLowerCase();
    return data.sections
      .map((s) => ({
        ...s,
        items: s.items.filter((i) =>
          (i.title + i.description).toLowerCase().includes(q)
        ),
      }))
      .filter((s) => s.items.length > 0);
  }, [query, data.sections]);

  function toggleSection(title: string) {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  }

  function handleLearnMore(item: ModuleItem, sectionTitle: string) {
    if (item.learnMoreLink) {
      window.open(item.learnMoreLink, "_blank");
    } else {
      // Default behavior - you can customize this
      window.open("/contact", "_blank");
      console.log(`Learn more about ${item.title} in ${sectionTitle}`);
    }
  }

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-primary-700 to-primary-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div>
              <div className="bg-white rounded my-3 p-3 shadow-md inline-block">
                <img
                  src={data.smartitbox360Logo}
                  alt="SMARTITBOX360"
                  className="h-6"
                />
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                {data.title}
              </h2>
              <p className="mt-1 text-[#F8EFEF] text-sm sm:text-base max-w-xl">
                {data.description}
              </p>
            </div>
          </div>

          <div className="w-full md:w-1/3">
            <label className="relative block">
              <span className="sr-only">Search modules</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="placeholder:italic placeholder:text-slate-300 block bg-white w-full border border-transparent rounded-xl py-3 pl-12 pr-4 shadow focus:outline-none focus:ring-2 focus:ring-primary-400"
                placeholder="Search modules, e.g. 'inventory'"
                aria-label="Search modules"
              />
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-primary-600" />
            </label>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {filtered.length === 0 ? (
            <div className="bg-white/10 rounded-xl p-8 text-center text-white/90">
              No modules match &ldquo;{query}&ldquo;.
            </div>
          ) : (
            filtered.map((section) => (
              <div key={section.title}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
                      {section.title}
                    </h3>
                    <div className="h-1 w-24 bg-white/40 rounded-full" />
                  </div>

                  <button
                    onClick={() => toggleSection(section.title)}
                    aria-expanded={!!openSections[section.title]}
                    className="inline-flex items-center gap-2 text-sm text-white/90 bg-white/6 hover:bg-white/8 px-3 py-2 rounded-lg transition-colors"
                  >
                    {openSections[section.title] ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                    <span>
                      {openSections[section.title] ? "Collapse" : "Expand"}
                    </span>
                  </button>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="mt-4"
                >
                  <div
                    className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`}
                    aria-live="polite"
                  >
                    {openSections[section.title] &&
                      section.items.map((item) => {
                        const IconComponent = iconMap[item.icon];
                        return (
                          <motion.article
                            key={item.title}
                            layout
                            whileHover={{
                              translateY: -6,
                              boxShadow: "0px 18px 40px rgba(0,0,0,0.18)",
                            }}
                            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all will-change-transform"
                          >
                            <div className="flex items-start gap-4">
                              <div className="flex-none w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow">
                                <IconComponent size={20} aria-hidden />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 mb-1">
                                  {item.title}
                                </h4>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                  {item.description}
                                </p>
                              </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                              <button
                                onClick={() =>
                                  handleLearnMore(item, section.title)
                                }
                                className="text-sm px-3 py-1 rounded-md bg-primary-50 text-primary-700 font-medium hover:bg-primary-100 transition-colors"
                              >
                                Learn More
                              </button>
                            </div>
                          </motion.article>
                        );
                      })}
                  </div>
                </motion.div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
