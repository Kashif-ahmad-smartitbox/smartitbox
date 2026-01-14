"use client";

import React, { useMemo } from "react";
import { usePathname } from "next/navigation";
import BrandSection from "./BrandSection";
import NavigationItemWrapper from "./NavigationItemWrapper";
import { classNames } from "@/lib/classNames";
import type { NavigationItem as NavItemType } from "@/app/admin/dashboard/layout";

interface DesktopSidebarProps {
  isExpanded: boolean;
  isMobile?: boolean;
  activeItem?: string;
  onToggle: () => void;
  onItemClick: (id: string, href?: string) => void;
  onClose?: () => void;
  sidebarItems: NavItemType[];
}

const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  isExpanded,
  isMobile = false,
  activeItem,
  onToggle,
  onItemClick,
  sidebarItems,
}) => {
  const pathname = usePathname() || "/";

  // Enhanced active item detection that checks children too
  const currentActiveId = useMemo(() => {
    if (activeItem) return activeItem;

    // Check exact matches first
    const exactMatch = sidebarItems.find((it) => it.href === pathname);
    if (exactMatch) return exactMatch.id;

    // Check children for exact matches
    for (const item of sidebarItems) {
      if (item.children) {
        const childMatch = item.children.find(
          (child) => child.href === pathname
        );
        if (childMatch) return childMatch.id;
      }
    }

    // Fallback to startsWith matches
    const startsWithMatch = sidebarItems.find(
      (it) => it.href && pathname.startsWith(it.href)
    );
    if (startsWithMatch) return startsWithMatch.id;

    // Check children for startsWith matches
    for (const item of sidebarItems) {
      if (item.children) {
        const childStartsWithMatch = item.children.find(
          (child) => child.href && pathname.startsWith(child.href)
        );
        if (childStartsWithMatch) return childStartsWithMatch.id;
      }
    }

    return sidebarItems[0]?.id || "";
  }, [activeItem, pathname, sidebarItems]);

  return (
    <aside
      className={classNames(
        "hidden lg:flex lg:flex-col border-r transition-all duration-300 bg-white border-gray-100 shadow-sm",
        isExpanded ? "w-[var(--sidebar-w)]" : "w-[var(--sidebar-compact-w)]"
      )}
      aria-label="Main navigation"
    >
      <BrandSection
        isExpanded={isExpanded}
        onToggle={onToggle}
        ariaLabel="Toggle sidebar"
      />

      <nav className="px-3 py-6 flex-1 overflow-auto" aria-label="Sidebar">
        <ul className="space-y-1" role="menubar" aria-orientation="vertical">
          {sidebarItems.map((item) => (
            <NavigationItemWrapper
              key={item.id}
              item={item as NavItemType}
              activeItemId={currentActiveId}
              isExpanded={isExpanded}
              onClick={onItemClick}
            />
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default DesktopSidebar;
