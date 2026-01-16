"use client";

import React from "react";
import { ChevronLeft } from "lucide-react";
import { classNames } from "@/lib/classNames";

type Props = {
  isExpanded: boolean;
  onToggle?: () => void;
  ariaLabel?: string;
};

const BrandSection: React.FC<Props> = ({ isExpanded, onToggle, ariaLabel }) => {
  return (
    <div className="px-4 min-h-(--header-h) flex items-center justify-between gap-3 border-b border-gray-100">
      <div className="flex items-center gap-3">
        {isExpanded ? (
          <img className="h-10" src="/logo.png" alt="Smartitbox" />
        ) : (
          <img className="h-10" src="/logo.png" alt="Smartitbox compact" />
        )}
      </div>

      {onToggle && (
        <button
          onClick={onToggle}
          aria-label={
            ariaLabel ?? (isExpanded ? "Collapse sidebar" : "Expand sidebar")
          }
          title={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          aria-expanded={isExpanded}
          className={classNames(
            "p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform",
            "flex items-center justify-center"
          )}
        >
          <ChevronLeft
            className={classNames(
              "w-4 h-4 text-gray-500 transition-transform duration-200",
              !isExpanded && "rotate-180"
            )}
            aria-hidden
          />
        </button>
      )}
    </div>
  );
};

export default BrandSection;
