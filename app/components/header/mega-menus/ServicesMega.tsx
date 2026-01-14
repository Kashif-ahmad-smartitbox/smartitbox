import React from "react";
import Link from "next/link";
import { MenuItem } from "@/types";
import { getIconComponent } from "@/utils/iconUtils";
import { ArrowRight } from "lucide-react";

interface ServicesMegaProps {
  data: MenuItem[];
}

export function ServicesMega({ data }: ServicesMegaProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 p-4">
      {data.map((service) => {
        const Icon = getIconComponent(service.icon);
        return (
          <ServiceCard key={service.title} service={service} Icon={Icon} />
        );
      })}
    </div>
  );
}

interface ServiceCardProps {
  service: MenuItem;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
}

function ServiceCard({ service, Icon }: ServiceCardProps) {
  return (
    <Link
      href={service.href}
      className="group p-6 rounded-xl bg-white border border-gray-200 hover:border-primary-200 transition-all duration-300 hover:shadow-lg hover:shadow-primary-50/50 hover:-translate-y-1 flex flex-col h-full"
    >
      {/* Header with Icon */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-xl bg-linear-to-br from-primary-50 to-primary-100 group-hover:from-primary-100 group-hover:to-primary-200 text-primary-600 transition-all duration-300 group-hover:scale-105">
          <Icon size={20} />
        </div>
        <h3 className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors duration-300">
          {service.title}
        </h3>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4 grow leading-relaxed">
        {service.description}
      </p>

      {/* Features List */}
      {service.features && <FeaturesList features={service.features} />}

      {/* Learn More Link */}
      <div className="flex items-center gap-2 text-primary-600 font-medium text-sm  pt-4 border-t border-gray-100 group-hover:border-primary-100 transition-colors duration-300 group-hover:gap-3">
        <span>Learn more</span>
        <ArrowRight
          size={14}
          className="group-hover:translate-x-1 transition-transform duration-300"
        />
      </div>
    </Link>
  );
}

interface FeaturesListProps {
  features: (string | { label: string; href: string })[];
}

function FeaturesList({ features }: FeaturesListProps) {
  return (
    <div className="space-y-2 mb-4">
      {features.slice(0, 3).map((feature, idx) => (
        <div
          key={idx}
          className="flex items-center gap-2 text-xs text-gray-600 group-hover:text-gray-700 transition-colors duration-300"
        >
          <div className="w-1.5 h-1.5 bg-primary-500 rounded-full shrink-0 group-hover:bg-primary-600 transition-colors duration-300" />
          <span className="leading-relaxed">
            {typeof feature === "string" ? feature : feature.label}
          </span>
        </div>
      ))}
    </div>
  );
}
