"use client";

import React, { useState, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import { classNames } from "@/lib/classNames";
import type { NavigationItem as NavItemType } from "@/app/admin/dashboard/layout";
import NavigationItem from "./NavigationItem";

type Props = {
  item: NavItemType;
  isActive: boolean;
  isExpanded: boolean;
  onClick: (id: string, href?: string) => void;
};

const NavigationItemWithSubmenu: React.FC<Props> = ({
  item,
  isActive,
  isExpanded,
  onClick,
}) => {
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  const handleToggleSubmenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSubmenuOpen((prev) => !prev);
  }, []);

  const handleItemClick = useCallback(
    (id: string, href?: string) => {
      if (hasChildren && !href) {
        setIsSubmenuOpen((prev) => !prev);
      } else {
        onClick(id, href);
      }
    },
    [hasChildren, onClick]
  );

  if (!hasChildren) {
    return (
      <NavigationItem
        item={item}
        isActive={isActive}
        isExpanded={isExpanded}
        onClick={onClick}
      />
    );
  }

  return (
    <li role="none" className="space-y-1">
      <button
        type="button"
        role="menuitem"
        title={item.label}
        aria-expanded={isSubmenuOpen}
        onClick={handleToggleSubmenu}
        className={classNames(
          "w-full flex items-center justify-between gap-3 py-3 px-3 rounded-lg text-left transition-colors",
          isActive
            ? "bg-primary-50 text-primary-700"
            : "hover:bg-gray-50 text-gray-600 hover:text-gray-900",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        )}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="relative flex-shrink-0">
            <item.Icon
              className={classNames(
                "transition-colors",
                isActive ? "text-primary-600" : "text-gray-400"
              )}
              style={{ width: 20, height: 20 }}
              aria-hidden
            />
            {item.badge && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
                {item.badge}
              </span>
            )}
          </div>

          {isExpanded && (
            <span className="truncate text-sm font-medium flex-1">
              {item.label}
            </span>
          )}
        </div>

        {isExpanded && (
          <ChevronDown
            className={classNames(
              "w-4 h-4 transition-transform duration-200 flex-shrink-0",
              isSubmenuOpen ? "rotate-180" : ""
            )}
          />
        )}
      </button>

      {/* Submenu Items */}
      {isExpanded && isSubmenuOpen && item.children && (
        <ul
          className="ml-6 space-y-1 border-l-2 border-gray-100 pl-3"
          role="menu"
          aria-label={`${item.label} submenu`}
        >
          {item.children.map((child) => (
            <NavigationItem
              key={child.id}
              item={child}
              isActive={false}
              isExpanded={isExpanded}
              onClick={onClick}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export default React.memo(NavigationItemWithSubmenu);
