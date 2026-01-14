import React from "react";
import Link from "next/link";
import { HeaderData } from "@/types";
import { getIconComponent } from "@/utils/iconUtils";
import { ArrowRight } from "lucide-react";

import InnovationCard from "./InnovationCard";

interface ProductMegaProps {
  data: HeaderData;
}

export function ProductMega({ data }: ProductMegaProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 p-4">
      {/* Solutions Grid */}
      <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-2">
        {data.products.map((product) => {
          const Icon = getIconComponent(product.icon);
          return (
            <Link
              key={product.title}
              href={product.href}
              className="group p-6 rounded-xl bg-white border border-gray-200 hover:border-primary-200 transition-all duration-300 hover:shadow-lg hover:shadow-primary-50/50 hover:-translate-y-1"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-linear-to-br from-primary-50 to-primary-100 group-hover:from-primary-100 group-hover:to-primary-200 text-primary-600 transition-all duration-300 group-hover:scale-105">
                  <Icon size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors duration-300">
                      {product.title}
                    </h3>
                    {product.badge && (
                      <span className="px-2 py-1 text-xs font-medium bg-primary-50 text-primary-700 rounded-full border border-primary-200 group-hover:bg-primary-100 transition-colors duration-300">
                        {product.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    {product.description}
                  </p>
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
        })}
      </div>

      {/* Innovation Card */}
      <div className="flex items-stretch">
        <InnovationCard />
      </div>
    </div>
  );
}
