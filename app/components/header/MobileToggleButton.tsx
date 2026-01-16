import React from "react";
import { Menu, X } from "lucide-react";

interface MobileToggleButtonProps {
  isOpen: boolean;
  onClick: () => void;
  isMobile: boolean;
}

export function MobileToggleButton({
  isOpen,
  onClick,
  isMobile,
}: MobileToggleButtonProps) {
  return (
    <button
      className={`rounded-2xl bg-primary-500 backdrop-blur-sm border border-white/30 hover:bg-primary-400 transition-all duration-500 ${
        isMobile ? "p-2.5" : "p-3"
      }`}
      aria-label="Toggle menu"
      onClick={onClick}
    >
      <div className="relative">
        {isOpen ? (
          <X size={isMobile ? 18 : 20} className="text-white" />
        ) : (
          <Menu size={isMobile ? 18 : 20} className="text-white" />
        )}
      </div>
    </button>
  );
}
