"use client";

import React, { useCallback, useEffect, useState, useRef } from "react";
import { Bell, Menu, Search, User, LogOut } from "lucide-react";
import { useAuth } from "@/app/services/context/AuthContext";
import type { NavigationItem } from "@/app/admin/dashboard/layout";

const cx = (...x: Array<string | false | null | undefined>) =>
  x.filter(Boolean).join(" ");

type DashHeaderProps = {
  onMenuClick: () => void;
  activeItem: string;
  sidebarItems: NavigationItem[];
  notificationsCount?: number;
  onSearchOpen?: () => void;
};

const DashHeader: React.FC<DashHeaderProps> = ({
  onMenuClick,
  activeItem,
  sidebarItems,
  notificationsCount = 0,
  onSearchOpen,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { user, logout, loading } = useAuth();

  const activeItemLabel =
    sidebarItems.find((item) => item.id === activeItem)?.label || "Dashboard";

  // Key shortcut for search (⌘K / Ctrl+K)
  const handleKeydown = useCallback(
    (e: KeyboardEvent) => {
      const isMac = navigator.platform.toLowerCase().includes("mac");
      const combo =
        (isMac && e.metaKey && e.key.toLowerCase() === "k") ||
        (!isMac && e.ctrlKey && e.key.toLowerCase() === "k");
      if (combo) {
        e.preventDefault();
        onSearchOpen?.();
      }
    },
    [onSearchOpen]
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!onSearchOpen) return;
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [handleKeydown, onSearchOpen]);

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    try {
      await logout();
    } catch (err) {
      console.warn("Logout failed", err);
    }
  };

  const displayName = loading
    ? "Loading..."
    : user?.name || user?.email || "Administrator";
  const displayRole = user?.role || "Administrator";

  return (
    <header
      className={cx(
        "sticky top-0 z-10",
        "flex items-center justify-between",
        "px-6 lg:px-8",
        "border-b border-gray-100",
        "bg-white/80 backdrop-blur-sm",
        "shadow-sm"
      )}
      style={{ height: "var(--header-h)" }}
      role="banner"
    >
      {/* Left: menu + breadcrumb */}
      <div className="flex items-center gap-5 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2.5 rounded-xl hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          aria-label="Open menu"
          title="Open menu"
        >
          <Menu className="w-5 h-5 text-gray-700" aria-hidden />
        </button>

        <nav
          aria-label="Breadcrumb"
          className="hidden md:flex items-center text-sm text-gray-500 min-w-0"
        >
          <ol className="inline-flex items-center gap-2 truncate">
            <li className="shrink-0 text-gray-400">Home</li>
            <li className="text-gray-300" aria-hidden>
              /
            </li>
            <li className="shrink min-w-0">
              <span className="text-gray-700 font-semibold truncate">
                {activeItemLabel}
              </span>
            </li>
          </ol>
        </nav>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onSearchOpen}
          className={cx(
            "hidden sm:flex items-center gap-2",
            "border border-gray-200",
            "rounded-xl px-3 py-2",
            "hover:bg-gray-50",
            "focus:outline-none focus:ring-2 focus:ring-blue-500"
          )}
          aria-label="Search"
          title="Search (⌘K / Ctrl+K)"
        >
          <Search className="w-4 h-4 text-gray-500" aria-hidden />
          <span className="text-sm text-gray-500">Search…</span>
          <kbd className="ml-2 hidden lg:inline-flex items-center gap-1 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-700 border border-gray-200">
            <span className="font-sans">
              {navigator.platform.toLowerCase().includes("mac") ? "⌘" : "Ctrl"}
            </span>
            K
          </kbd>
        </button>

        {/* Notifications */}
        <button
          className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
          aria-label={
            notificationsCount > 0
              ? `Notifications: ${notificationsCount} unread`
              : "Notifications"
          }
          title="Notifications"
        >
          <Bell className="w-5 h-5 text-gray-600" aria-hidden />
          {notificationsCount > 0 && (
            <span
              className={cx(
                "absolute top-0.5 right-0.5",
                "min-w-[18px] h-[18px] px-1",
                "bg-primary-500 text-white text-[10px] leading-[18px] text-center",
                "rounded-full ring-2 ring-white"
              )}
              aria-hidden
            >
              {notificationsCount > 9 ? "9+" : notificationsCount}
            </span>
          )}
        </button>

        {/* User chip with dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-3 p-1 rounded-xl hover:bg-gray-50 transition-colors"
            aria-label="User menu"
            aria-expanded={isUserMenuOpen}
          >
            <div className="hidden sm:block text-right leading-4">
              <div className="text-sm font-semibold text-gray-900 truncate capitalize">
                {displayName}
              </div>
              <div className="text-xs text-gray-500 truncate capitalize">
                {displayRole}
              </div>
            </div>
            <div
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center text-white shadow-lg"
              aria-hidden
            >
              <User className="w-5 h-5" />
            </div>
          </button>

          {/* Dropdown menu */}
          {isUserMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20">
              <div className="px-4 py-2 border-b border-gray-100">
                <div className="text-sm font-semibold text-gray-900 truncate capitalize">
                  {displayName}
                </div>
                <div className="text-xs text-gray-500 capitalize">
                  {displayRole}
                </div>
              </div>

              <button
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default React.memo(DashHeader);
