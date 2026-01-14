import { ArrowRight, Rocket, Sparkles } from "lucide-react";
import Link from "next/link";

function InnovationCard() {
  return (
    <div className="relative min-h-80 bg-linear-to-br from-primary-500 via-primary-600 to-secondary-500 rounded-2xl p-8 text-white overflow-hidden group border border-primary-400/20">
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center space-y-6">
        {/* Enhanced Icon Section */}
        <div className="relative">
          <div className="p-4 bg-white/15 rounded-2xl shadow-2xl backdrop-blur-lg border border-white/25 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-500">
            <Rocket size={32} className="text-white drop-shadow-lg" />
          </div>
        </div>

        {/* Enhanced Text Section */}
        <div className="space-y-3 max-w-sm">
          <h3 className="text-3xl font-bold bg-linear-to-r from-white to-white/90 bg-clip-text text-transparent">
            Innovation Lab
          </h3>
          <p className="text-primary-100 font-medium text-lg tracking-wide">
            AI-Powered Solutions
          </p>
          <p className="text-white/85 leading-relaxed text-base">
            Experience the future of digital transformation with our{" "}
            <span className="text-white font-semibold bg-white/10 px-1 rounded">
              adaptive AI solutions
            </span>{" "}
            that learn and scale in real-time.
          </p>
        </div>

        {/* Enhanced CTA Button */}
        <Link
          href="/innovation"
          className="group/btn relative inline-flex items-center gap-3 bg-white text-primary-600 px-8 py-4 rounded-xl font-bold hover:shadow-2xl transition-all duration-400 hover:scale-105 overflow-hidden border border-white/20"
        >
          {/* Button content */}
          <span className="relative z-10">Explore Innovation</span>
          <ArrowRight
            size={20}
            className="relative z-10 group-hover/btn:translate-x-2 transition-transform duration-400"
          />

          {/* Button border glow */}
          <div className="absolute inset-0 rounded-xl bg-linear-to-r from-primary-400 to-secondary-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-400 -z-10 blur-md" />
        </Link>
      </div>
    </div>
  );
}

export default InnovationCard;
