"use client";
import React from "react";
import Link from "next/link";
import { Search } from "lucide-react";

import { HeaderData } from "@/types";
import useWindowSize from "@/app/hooks/useWindowSize";

import {
  useScrolled,
  useClickOutside,
  useHeaderState,
} from "./hooks/useHeader";
import { NavItem } from "./NavItem";
import { MobileMenu } from "./MobileMenu";
import { SearchModal } from "./SearchModal";
import { MobileToggleButton } from "./MobileToggleButton";
import { ProductMega } from "./mega-menus/ProductMega";
import { ServicesMega } from "./mega-menus/ServicesMega";
import { CompanyMega } from "./mega-menus/CompanyMega";
import { CTAButton } from "../global/Buttons";
import DirectLinkItem from "./DirectLinkItem";

interface HeaderProps {
  data: HeaderData;
}

export default function Header({ data }: HeaderProps) {
  const {
    openMenu,
    mobileOpen,
    isHovering,
    searchOpen,
    setOpenMenu,
    setIsHovering,
    handleMenuInteraction,
    handleMobileToggle,
    handleSearchToggle,
  } = useHeaderState();

  const scrolled = useScrolled();
  const { isMobile, isSmallTablet, isTablet, isDesktop } = useWindowSize();
  const containerRef = useClickOutside(() => {
    if (!isHovering) {
      setOpenMenu(null);
    }
  });

  const getHeaderHeight = () => {
    if (isMobile) return "h-16";
    if (isSmallTablet || isTablet) return "h-18";
    return "h-20";
  };

  const getContainerPadding = () => {
    if (isMobile) return "px-4";
    if (isSmallTablet) return "px-5";
    if (isTablet) return "px-6";
    return "px-8";
  };

  const headerBase = "w-full left-0 right-0 z-50";
  const headerPosition = scrolled
    ? "fixed top-0 animate-slideDown"
    : "absolute top-0";

  // Updated: White background with black text when scrolled
  const headerBg = scrolled
    ? "bg-white shadow-md" // Changed to white background
    : "bg-transparent";

  return (
    <header className={`${headerBase} ${headerPosition} ${headerBg}`}>
      <div className={`max-w-7xl mx-auto ${getContainerPadding()}`}>
        <div
          className={`flex items-center justify-between ${getHeaderHeight()}`}
        >
          <Logo
            data={data}
            isMobile={isMobile}
            isSmallTablet={isSmallTablet}
            isTablet={isTablet}
            scrolled={scrolled}
          />

          {/* Desktop Navigation */}
          {isDesktop && (
            <nav className="flex items-center gap-1">
              {data.navigation.items.map((item) => {
                const isCertificate = item.key === "certificate";

                return isCertificate ? (
                  <DirectLinkItem
                    key={item.key}
                    label={item.label}
                    href={item.href}
                    isScrolled={scrolled}
                  />
                ) : (
                  <NavItem
                    key={item.key}
                    label={item.label}
                    menuKey={item.key}
                    isOpen={openMenu === item.key}
                    onToggle={() =>
                      handleMenuInteraction(
                        openMenu === item.key ? null : item.key
                      )
                    }
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    isScrolled={scrolled}
                  />
                );
              })}
            </nav>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            {isDesktop && (
              <SearchButton
                onSearchClick={handleSearchToggle}
                scrolled={scrolled}
              />
            )}

            {!isMobile && (
              <CTAButton href={data.cta.href}>{data.cta.text}</CTAButton>
            )}

            {!isDesktop && (
              <MobileToggleButton
                isOpen={mobileOpen}
                onClick={handleMobileToggle}
                isMobile={isMobile}
              />
            )}
          </div>
        </div>
      </div>

      {/* Desktop Mega Menu */}
      {isDesktop && (
        <MegaMenuContainer
          ref={containerRef}
          openMenu={openMenu}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          padding={getContainerPadding()}
        >
          {openMenu === "products" && <ProductMega data={data} />}
          {openMenu === "services" && <ServicesMega data={data.services} />}
          {openMenu === "company" && <CompanyMega data={data} />}
        </MegaMenuContainer>
      )}

      {/* Search Modal */}
      {searchOpen && <SearchModal onClose={handleSearchToggle} />}

      {/* Mobile Menu */}
      <MobileMenu
        data={data}
        isOpen={mobileOpen}
        onClose={handleMobileToggle}
        isMobile={isMobile}
        isSmallTablet={isSmallTablet}
      />
    </header>
  );
}

// Sub-components for Header
interface LogoProps {
  data: HeaderData;
  isMobile: boolean;
  isSmallTablet: boolean;
  isTablet: boolean;
  scrolled: boolean;
}

function Logo({
  data,
  isMobile,
  isSmallTablet,
  isTablet,
  scrolled,
}: LogoProps) {
  const getLogoHeight = () => {
    if (isMobile) return data.logo.mobileHeight;
    if (isSmallTablet || isTablet) return data.logo.tabletHeight;
    return data.logo.desktopHeight;
  };

  return (
    <div className="flex items-center">
      <Link href="/" className="flex items-center gap-3 group relative">
        <div className="relative">
          <img
            src={data.logo.src}
            alt={data.logo.alt}
            className={`w-auto transition-all duration-500 group-hover:scale-105 ${getLogoHeight()}`}
          />
        </div>
      </Link>
    </div>
  );
}

interface SearchButtonProps {
  onSearchClick: () => void;
  scrolled: boolean; // Added scrolled prop
}

function SearchButton({ onSearchClick, scrolled }: SearchButtonProps) {
  // Updated: Black text when scrolled, white when not
  const iconColorClass = scrolled
    ? "text-gray-800 hover:text-emerald-600 hover:bg-emerald-50"
    : "text-gray-800 hover:text-blue-600 hover:bg-blue-50";

  return (
    <button
      onClick={onSearchClick}
      className={`p-2 rounded-full transition-all duration-300 ${iconColorClass}`}
    >
      <Search size={20} />
    </button>
  );
}

interface MegaMenuContainerProps {
  children: React.ReactNode;
  openMenu: string | null;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  padding: string;
}

const MegaMenuContainer = React.forwardRef<
  HTMLDivElement,
  MegaMenuContainerProps
>(({ children, openMenu, onMouseEnter, onMouseLeave, padding }, ref) => (
  <div
    ref={ref}
    className="absolute left-0 right-0 top-full"
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    <div className={`max-w-7xl mx-auto ${padding}`}>
      <div
        className={`transition-all duration-500 ease-out overflow-hidden ${
          openMenu
            ? "opacity-100 translate-y-0 py-2 pointer-events-auto"
            : "opacity-0 -translate-y-4 py-0 pointer-events-none"
        }`}
      >
        <div className="rounded-3xl border border-gray-200/60 bg-white/95 backdrop-blur-xl p-2 shadow-2xl">
          {children}
        </div>
      </div>
    </div>
  </div>
));

MegaMenuContainer.displayName = "MegaMenuContainer";
