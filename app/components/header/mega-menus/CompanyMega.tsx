import React from "react";
import Link from "next/link";
import { HeaderData } from "@/types";
import { ArrowRight } from "lucide-react";
import { getIconComponent } from "@/utils/iconUtils";

import CompanyCTACard from "./CompanyCTACard";

interface CompanyMegaProps {
  data: HeaderData;
}

export function CompanyMega({ data }: CompanyMegaProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 p-4">
      <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {data.companyLinks.map((link) => {
          const Icon = getIconComponent(link.icon);
          return <CompanyLinkCard key={link.label} link={link} Icon={Icon} />;
        })}
      </div>

      <CompanyCTACard data={data} />
    </div>
  );
}

interface CompanyLinkCardProps {
  link: { label: string; href: string };
  Icon: React.ComponentType<{ size?: number; className?: string }>;
}

function CompanyLinkCard({ link, Icon }: CompanyLinkCardProps) {
  return (
    <Link
      href={link.href}
      className="group p-6 rounded-xl bg-white border border-gray-200 hover:border-primary-200 transition-all duration-300 hover:shadow-lg hover:shadow-primary-50/50 hover:-translate-y-1 flex items-start h-full"
    >
      <div className="flex items-start gap-4 w-full">
        <div className="shrink-0 p-3 rounded-xl bg-linear-to-br from-primary-50 to-primary-100 group-hover:from-primary-100 group-hover:to-primary-200 text-primary-600 transition-all duration-300 group-hover:scale-105 mt-0.5">
          <Icon size={20} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors duration-300 mb-3 text-base leading-snug">
            {link.label}
          </h3>
          <div className="flex items-center gap-1 text-primary-600 text-sm font-medium group-hover:gap-2 transition-all duration-300">
            <span>Learn more</span>
            <ArrowRight
              size={14}
              className="group-hover:translate-x-1 transition-transform duration-300"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
