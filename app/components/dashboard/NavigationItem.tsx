"use client";

import React, { useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import { classNames } from "@/lib/classNames";
import type { NavigationItem as NavItemType } from "@/app/admin/dashboard/layout";

type Props = {
  item: NavItemType;
  isActive: boolean; // This should be boolean
  isExpanded: boolean;
  onClick: (id: string, href?: string) => void;
};

const NavigationItem: React.FC<Props> = ({
  item,
  isActive, // This is now boolean
  isExpanded,
  onClick,
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleNavigation = useCallback(
    (href: string | undefined, e?: React.MouseEvent | React.KeyboardEvent) => {
      if (!href) return;
      // open in new tab: ctrl/meta/middle click
      const mouseEvent = e as React.MouseEvent | undefined;
      const isModifier =
        mouseEvent &&
        (mouseEvent.metaKey || mouseEvent.ctrlKey || mouseEvent.button === 1);
      if (isModifier) {
        window.open(href, "_blank", "noopener,noreferrer");
        return;
      }
      // client-side push wrapped in startTransition
      startTransition(() => {
        router.push(href);
      });
    },
    [router]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      onClick(item.id, item.href);
      if (item.href) {
        handleNavigation(item.href, e);
      }
    },
    [item, onClick, handleNavigation]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      // Space or Enter to activate
      if ((e.key === "Enter" || e.key === " ") && item.href) {
        e.preventDefault();
        onClick(item.id, item.href);
        handleNavigation(item.href, e);
      }
    },
    [item, onClick, handleNavigation]
  );

  return (
    <li role="none">
      <button
        type="button"
        role="menuitem"
        title={item.label}
        aria-current={isActive ? "page" : undefined}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={classNames(
          "w-full flex items-center gap-3 py-3 px-3 rounded-lg text-left transition-colors",
          isActive
            ? "bg-primary-50 text-primary-700"
            : "hover:bg-gray-50 text-gray-600 hover:text-gray-900",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        )}
      >
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

        {isExpanded ? (
          <span className="truncate text-sm font-medium">{item.label}</span>
        ) : (
          <span className="sr-only">{item.label}</span>
        )}
      </button>
    </li>
  );
};

export default React.memo(NavigationItem);
