"use client";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  FileText,
  Image,
  Users,
  LucideIcon,
  UserStar,
  DatabaseBackup,
  FormInput,
} from "lucide-react";
import DashHeader from "@/components/dashboard/DashHeader";
import MobileDrawer from "@/components/dashboard/MobileDrawer";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import DesktopSidebar from "@/components/dashboard/DesktopSidebar";
import ExpandSidebarButton from "@/components/dashboard/ExpandSidebarButton";
import { useAuth } from "@/app/services/context/AuthContext";

const SIDEBAR_W = 280;
const SIDEBAR_COMPACT_W = 72;
const HEADER_H = 70;

export interface NavigationItem {
  id: string;
  label: string;
  Icon: LucideIcon;
  badge?: number;
  href?: string;
  children?: NavigationItem[];
}

interface LayoutProps {
  children: React.ReactNode;
}

// Base sidebar items without role filtering
const BASE_SIDEBAR_ITEMS: NavigationItem[] = [
  { href: "/admin/dashboard", id: "overview", label: "Overview", Icon: Home },
  {
    id: "content",
    label: "Content",
    Icon: FileText,
    badge: 3,
    children: [
      {
        href: "/admin/dashboard/content/pages",
        id: "pages",
        label: "Pages",
        Icon: FileText,
      },
      {
        href: "/admin/dashboard/content/blogs",
        id: "blogs",
        label: "Blogs",
        Icon: FileText,
      },
      {
        href: "/admin/dashboard/content/case-studies",
        id: "case-studies",
        label: "Case Studies",
        Icon: FileText,
      },
    ],
  },
  { href: "/admin/dashboard/media", id: "media", label: "Media", Icon: Image },
  { href: "/admin/dashboard/team", id: "team", label: "Team", Icon: Users },
  {
    href: "/admin/dashboard/subscribers",
    id: "subscribers",
    label: "Subscribers",
    Icon: UserStar,
  },
  {
    href: "/admin/dashboard/forms",
    id: "forms",
    label: "Forms",
    Icon: FormInput,
  },
  {
    href: "/admin/dashboard/backup",
    id: "backup",
    label: "Backup",
    Icon: DatabaseBackup,
  },
];

// Pre-defined menu items for each role
const ADMIN_ITEMS = BASE_SIDEBAR_ITEMS.filter((item) => item.id !== "backup");
const EDITOR_ITEMS = BASE_SIDEBAR_ITEMS.filter(
  (item) =>
    item.id === "overview" || item.id === "content" || item.id === "media"
);

// Hook to get filtered sidebar items based on user role
const useFilteredSidebarItems = () => {
  const { user, loading } = useAuth();

  return useMemo(() => {
    // If still loading, return empty array to prevent flash
    if (loading) {
      return [];
    }

    const userRole = user?.role;

    if (userRole === "admin") {
      return ADMIN_ITEMS;
    } else if (userRole === "editor") {
      return EDITOR_ITEMS;
    }

    // Default for unknown roles or no user
    return BASE_SIDEBAR_ITEMS;
  }, [user?.role, loading]);
};

const useKeyboardShortcuts = (callbacks: { [key: string]: () => void }) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const callback = callbacks[key];

      if (callback && (e.ctrlKey || e.metaKey || e.key === "Escape")) {
        e.preventDefault();
        callback();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [callbacks]);
};

export default function SmartitboxLayout({ children }: LayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const { user, loading } = useAuth();
  const SIDEBAR_ITEMS = useFilteredSidebarItems();

  const getActiveItem = useCallback(() => {
    if (SIDEBAR_ITEMS.length === 0) return "overview";

    // Exact match first
    const exactMatch = SIDEBAR_ITEMS.find((item) => item.href === pathname);
    if (exactMatch) return exactMatch.id;

    // Check children for exact matches
    for (const item of SIDEBAR_ITEMS) {
      if (item.children) {
        const childExactMatch = item.children.find(
          (child) => child.href === pathname
        );
        if (childExactMatch) return childExactMatch.id;
      }
    }

    // Fallback: find by path segment for nested routes
    const pathMatch = SIDEBAR_ITEMS.find(
      (item) => item.href && pathname.startsWith(item.href + "/")
    );
    if (pathMatch) return pathMatch.id;

    // Check children for path matches
    for (const item of SIDEBAR_ITEMS) {
      if (item.children) {
        const childPathMatch = item.children.find(
          (child) => child.href && pathname.startsWith(child.href + "/")
        );
        if (childPathMatch) return childPathMatch.id;
      }
    }

    // Default to overview
    return "overview";
  }, [pathname, SIDEBAR_ITEMS]);

  const activeItem = getActiveItem();

  useKeyboardShortcuts({
    b: () => setSidebarExpanded((s) => !s),
    escape: () => setDrawerOpen(false),
  });

  const handleSidebarToggle = useCallback(() => {
    setSidebarExpanded((s) => !s);
  }, []);

  const handleNavigation = useCallback(
    (href: string | undefined) => {
      if (!href) return;

      // Close drawer if open
      setDrawerOpen(false);

      // Navigate
      router.push(href);
    },
    [router]
  );

  const handleItemClick = useCallback(
    (id: string, href?: string) => {
      console.log("Item clicked:", id, href);
      if (href) {
        handleNavigation(href);
      }
    },
    [handleNavigation]
  );

  const handleMenuOpen = useCallback(() => {
    setDrawerOpen(true);
  }, []);

  const handleDrawerClose = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  // Show loading state while auth is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen antialiased bg-gray-50 text-gray-900"
      style={
        {
          ["--sidebar-w"]: `${SIDEBAR_W}px`,
          ["--sidebar-compact-w"]: `${SIDEBAR_COMPACT_W}px`,
          ["--header-h"]: `${HEADER_H}px`,
        } as React.CSSProperties
      }
    >
      <div className="flex h-screen">
        <DesktopSidebar
          isExpanded={sidebarExpanded}
          isMobile={false}
          activeItem={activeItem}
          onToggle={handleSidebarToggle}
          onItemClick={handleItemClick}
          sidebarItems={SIDEBAR_ITEMS}
        />

        {!sidebarExpanded && (
          <ExpandSidebarButton onExpand={handleSidebarToggle} />
        )}

        <MobileDrawer
          isExpanded={false}
          isMobile={drawerOpen}
          activeItem={activeItem}
          onToggle={handleSidebarToggle}
          onItemClick={handleItemClick}
          onClose={handleDrawerClose}
          sidebarItems={SIDEBAR_ITEMS}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <DashHeader
            onMenuClick={handleMenuOpen}
            activeItem={activeItem}
            sidebarItems={SIDEBAR_ITEMS}
          />

          <main className="flex-1 min-h-0 overflow-auto p-6 bg-gray-50/30">
            {children}
          </main>
          <div className="mt-auto p-4 border-t border-gray-200 flex self-end">
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              Designed with ❤️ and crafted with care by Team{" "}
              <a
                className="font-bold text-yellow-500"
                href="https://smartitbox.in"
              >
                SMART ITBOX
              </a>{" "}
              Your Business Automation Partner
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
