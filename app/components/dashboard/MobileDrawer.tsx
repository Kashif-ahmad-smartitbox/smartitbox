"use client";

import { X, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import BrandSection from "./BrandSection";
import type { NavigationItem } from "@/app/admin/dashboard/layout";

interface MobileDrawerProps {
  isExpanded: boolean;
  isMobile: boolean;
  activeItem: string;
  onToggle: () => void;
  onItemClick: (id: string, href?: string) => void;
  onClose?: () => void;
  sidebarItems: NavigationItem[];
}

const useBodyScrollLock = (isLocked: boolean) => {
  useEffect(() => {
    document.body.style.overflow = isLocked ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isLocked]);
};

const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isMobile,
  activeItem,
  onItemClick,
  onClose,
  sidebarItems,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const firstDrawerButtonRef = useRef<HTMLButtonElement>(null);
  const [openSubmenus, setOpenSubmenus] = useState<Set<string>>(new Set());

  useBodyScrollLock(isMobile);

  useEffect(() => {
    if (isMobile) {
      firstDrawerButtonRef.current?.focus();
    }
  }, [isMobile]);

  const toggleSubmenu = useCallback((itemId: string) => {
    setOpenSubmenus((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  }, []);

  const handleItemClick = useCallback(
    (itemId: string, href?: string) => {
      const item = sidebarItems.find((it) => it.id === itemId);

      if (item?.children && !href) {
        // If it's a parent item with children and no specific href, toggle submenu
        toggleSubmenu(itemId);
      } else {
        // For regular items or child items with href, call the parent handler
        onItemClick(itemId, href);
        onClose?.();
      }
    },
    [toggleSubmenu, onItemClick, onClose, sidebarItems]
  );

  // Close drawer when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node)
      ) {
        onClose?.();
      }
    };

    if (isMobile) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobile, onClose]);

  if (!isMobile) return null;

  return (
    <div
      className="fixed inset-0 z-40 lg:hidden"
      aria-hidden={!isMobile}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 transition-opacity duration-200 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={drawerRef}
        className="absolute left-0 top-0 bottom-0 w-[var(--sidebar-w)] transform transition-transform duration-300 translate-x-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-full flex flex-col bg-white p-6 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <BrandSection isExpanded={true} />
            <button
              ref={firstDrawerButtonRef}
              onClick={onClose}
              aria-label="Close menu"
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-auto">
            <ul className="space-y-2" role="navigation">
              {sidebarItems.map((item) => (
                <li key={item.id}>
                  {item.children ? (
                    <>
                      <button
                        onClick={() => handleItemClick(item.id)}
                        className={`w-full flex items-center justify-between gap-3 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 outline-none ${
                          activeItem === item.id ||
                          (item.children &&
                            item.children.some(
                              (child) => child.id === activeItem
                            ))
                            ? "bg-blue-50 text-primary-700 border border-blue-100"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <item.Icon className="w-5 h-5" aria-hidden />
                          <span>{item.label}</span>
                          {item.badge && (
                            <span className="ml-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            openSubmenus.has(item.id) ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {openSubmenus.has(item.id) && item.children && (
                        <ul className="ml-6 mt-1 space-y-1 border-l-2 border-gray-200 pl-4">
                          {item.children.map((child) => (
                            <li key={child.id}>
                              <button
                                onClick={() =>
                                  handleItemClick(child.id, child.href)
                                }
                                className={`w-full flex items-center gap-3 py-2 px-4 rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                  activeItem === child.id
                                    ? "bg-blue-50 text-primary-700"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                              >
                                <child.Icon className="w-4 h-4" aria-hidden />
                                <span>{child.label}</span>
                                {child.badge && (
                                  <span className="ml-auto w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                    {child.badge}
                                  </span>
                                )}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <button
                      onClick={() => handleItemClick(item.id, item.href)}
                      className={`w-full flex items-center gap-3 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        activeItem === item.id
                          ? "bg-blue-50 text-primary-700 border border-blue-100"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <item.Icon className="w-5 h-5" aria-hidden />
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default MobileDrawer;
