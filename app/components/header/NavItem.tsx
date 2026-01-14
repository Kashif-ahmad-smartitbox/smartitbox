import React from "react";
import { ChevronDown } from "lucide-react";

interface NavItemProps {
  label: string;
  menuKey: string;
  isOpen: boolean;
  onToggle: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  isScrolled: boolean;
}

export function NavItem({
  label,
  menuKey,
  isOpen,
  onToggle,
  onMouseEnter,
  onMouseLeave,
  isScrolled,
}: NavItemProps) {
  const colorClass = isScrolled
    ? isOpen
      ? "text-gray-600"
      : "text-gray-800 hover:text-gray-600"
    : isOpen
    ? "text-gray-800"
    : "text-gray-800 hover:text-gray-800";

  const bgClass = isScrolled
    ? isOpen
      ? "bg-gray-50"
      : "hover:bg-gray-100"
    : isOpen
    ? "bg-white/20 backdrop-blur-sm"
    : "hover:bg-white/10 hover:backdrop-blur-sm";

  return (
    <div
      className="relative"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <button
        onClick={onToggle}
        className={`inline-flex items-center gap-2 py-3 px-5 font-semibold rounded-2xl transition-all duration-500 ${colorClass} ${bgClass} ${
          isOpen ? "shadow-lg" : ""
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span>{label}</span>
        <ChevronDown
          className={`transition-transform duration-500 ${
            isOpen ? "rotate-180" : ""
          }`}
          size={16}
        />
      </button>
    </div>
  );
}
