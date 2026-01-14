import React from "react";
import { Search, X } from "lucide-react";

interface SearchModalProps {
  onClose: () => void;
}

export function SearchModal({ onClose }: SearchModalProps) {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 backdrop-blur-lg flex items-start justify-center pt-20"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-2xl mx-4">
        <div className="bg-white rounded-3xl shadow-2xl p-2">
          <div className="flex items-center gap-3 p-4">
            <Search size={24} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search for solutions, services, or resources..."
              className="flex-1 text-lg outline-none placeholder-gray-400"
              autoFocus
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close search"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
