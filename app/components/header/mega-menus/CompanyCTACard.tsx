import { HeaderData } from "@/types";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

interface CompanyCTACardProps {
  data: HeaderData;
}

function CompanyCTACard({ data }: CompanyCTACardProps) {
  return (
    <div className="relative bg-linear-to-br from-primary-500 via-primary-600 to-secondary-500 rounded-2xl p-6 text-white overflow-hidden group h-full flex items-center border border-primary-400/20">
      <div className="relative z-10 w-full text-center space-y-4">
        {/* Enhanced Icon & Title */}
        <div className="flex flex-col items-center gap-3">
          <div className="p-2.5 bg-white/15 rounded-xl backdrop-blur-lg border border-white/25 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-500">
            <Sparkles size={20} className="text-white drop-shadow-lg" />
          </div>
          <h3 className="text-xl font-bold bg-linear-to-r from-white to-white/90 bg-clip-text text-transparent">
            {data.companyMega.title}
          </h3>
        </div>

        {/* Compact Description */}
        <p className="text-white/85 leading-relaxed text-sm px-1 line-clamp-3">
          {data.companyMega.description}
        </p>

        {/* Enhanced CTA Button */}
        <div className="flex justify-center pt-2">
          <Link
            href={data.companyMega.cta.href}
            className="group/btn relative inline-flex items-center gap-2 bg-white text-primary-600 px-5 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:gap-3 overflow-hidden border border-white/20"
          >
            {/* Button content */}
            <span className="relative z-10 text-sm">
              {data.companyMega.cta.text}
            </span>
            <ArrowRight
              size={14}
              className="relative z-10 group-hover/btn:translate-x-1 transition-transform duration-300"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CompanyCTACard;
