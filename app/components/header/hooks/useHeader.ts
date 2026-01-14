import { useState, useEffect, useRef, useCallback } from "react";
import { SCROLL_THRESHOLD } from "@/types";

const isBrowser = (): boolean => typeof window !== "undefined";

export const useScrolled = (threshold = SCROLL_THRESHOLD) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!isBrowser()) return;

    const onScroll = () => setScrolled(window.scrollY > threshold);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
};

export const useClickOutside = (handler: () => void) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        handler();
      }
    };

    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [handler]);

  return ref;
};

export const useHeaderState = () => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleMenuInteraction = useCallback((menuKey: string | null) => {
    setOpenMenu(menuKey);
  }, []);

  const handleMobileToggle = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  const handleSearchToggle = useCallback(() => {
    setSearchOpen((prev) => !prev);
  }, []);

  return {
    openMenu,
    mobileOpen,
    isHovering,
    searchOpen,
    setOpenMenu,
    setMobileOpen,
    setIsHovering,
    setSearchOpen,
    handleMenuInteraction,
    handleMobileToggle,
    handleSearchToggle,
  };
};
