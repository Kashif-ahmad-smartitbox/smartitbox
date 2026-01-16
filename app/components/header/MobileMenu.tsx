import Link from "next/link";
import { HeaderData } from "@/types";
import React, { useState } from "react";
import { getIconComponent } from "@/utils/iconUtils";
import { ChevronDown, X, ArrowRight, Phone, Award } from "lucide-react";
import { CTAButton } from "../global/Buttons";

interface MobileMenuProps {
  data: HeaderData;
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
  isSmallTablet: boolean;
}

export function MobileMenu({
  data,
  isOpen,
  onClose,
  isMobile,
  isSmallTablet,
}: MobileMenuProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  if (!isOpen) return null;

  // Find the certificate navigation item
  const certificateItem = data.navigation.items.find(
    (item) => item.key === "certificate"
  );

  // Create menu items EXCLUDING certificate from dropdowns
  const menuItems = {
    products: data.products.map((s) => ({
      label: s.title,
      icon: s.icon,
      href: s.href,
      description: s.description,
    })),
    services: data.services.map((s) => ({
      label: s.title,
      icon: s.icon,
      href: s.href,
      description: s.description,
    })),
    company: data.companyLinks.map((c) => ({
      label: c.label,
      icon: c.icon,
      href: c.href,
    })),
  };

  const menuWidth = isMobile ? "w-80" : "w-96";
  const padding = isMobile ? "p-5" : "p-6";

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleLinkClick = () => {
    onClose();
    setActiveMenu(null);
  };

  return (
    <div className="fixed inset-0 z-40 backdrop-blur-lg" onClick={onClose}>
      <div
        className={`absolute right-0 top-0 bottom-0 ${menuWidth} max-w-full h-screen bg-white ${padding} overflow-y-auto transform transition-transform duration-500 shadow-2xl`}
        onClick={handleMenuClick}
      >
        <HeaderSection data={data} isMobile={isMobile} onClose={onClose} />

        <NavigationSection
          menuItems={menuItems}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          onLinkClick={handleLinkClick}
          certificateItem={certificateItem}
        />

        <CTAButton className="w-full mt-3" size="lg" onClick={handleLinkClick}>
          {data.cta.text}
        </CTAButton>

        <ContactSection data={data} />
      </div>
    </div>
  );
}

interface HeaderSectionProps {
  data: HeaderData;
  isMobile: boolean;
  onClose: () => void;
}

function HeaderSection({ data, isMobile, onClose }: HeaderSectionProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <img
        src={data.logo.src}
        alt={data.logo.alt}
        className={isMobile ? data.logo.mobileHeight : data.logo.tabletHeight}
      />
      <button
        onClick={onClose}
        className="p-3 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-all duration-300 hover:scale-110"
        aria-label="Close menu"
      >
        <X size={20} />
      </button>
    </div>
  );
}

interface NavigationSectionProps {
  menuItems: any;
  activeMenu: string | null;
  setActiveMenu: (menu: string | null) => void;
  onLinkClick: () => void;
  certificateItem?: {
    label: string;
    href: string;
  };
}

function NavigationSection({
  menuItems,
  activeMenu,
  setActiveMenu,
  onLinkClick,
  certificateItem,
}: NavigationSectionProps) {
  return (
    <nav className="space-y-3">
      {certificateItem && (
        <div className="mb-2">
          <Link
            href={certificateItem.href}
            className="w-full flex items-center gap-4 p-3 rounded-lg bg-linear-to-r from-amber-50 to-amber-100/50 hover:from-amber-100 hover:to-amber-200/50 transition-all duration-500 font-bold text-gray-900 border border-amber-200/60 hover:border-amber-300"
            onClick={onLinkClick}
          >
            <Award size={18} className="text-amber-600" />
            <span>{certificateItem.label}</span>
            <ArrowRight size={16} className="ml-auto text-amber-600" />
          </Link>
        </div>
      )}

      {/* Regular dropdown menus */}
      {Object.entries(menuItems).map(([key, items]) => (
        <MobileMenuSection
          key={key}
          menuKey={key}
          items={items as any[]}
          isActive={activeMenu === key}
          onToggle={() => setActiveMenu(activeMenu === key ? null : key)}
          onLinkClick={onLinkClick}
        />
      ))}
    </nav>
  );
}

interface MobileMenuSectionProps {
  menuKey: string;
  items: Array<{
    label: string;
    icon: string;
    href: string;
    description?: string;
  }>;
  isActive: boolean;
  onToggle: () => void;
  onLinkClick: () => void;
}

function MobileMenuSection({
  menuKey,
  items,
  isActive,
  onToggle,
  onLinkClick,
}: MobileMenuSectionProps) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 rounded-lg bg-linear-to-r from-gray-50 to-gray-100/50 hover:from-emerald-50 hover:to-emerald-100/50 transition-all duration-500 font-bold text-gray-900 border border-gray-200/60"
      >
        <span className="capitalize">{menuKey}</span>
        <ChevronDown
          className={`transition-transform duration-500 ${
            isActive ? "rotate-180" : ""
          }`}
          size={18}
        />
      </button>

      {isActive && (
        <div className="pl-4 mt-3 space-y-2">
          {items.map((item) => {
            const Icon = getIconComponent(item.icon);
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-start gap-4 p-4 rounded-xl text-gray-700 hover:bg-emerald-50 transition-all duration-300 border border-transparent hover:border-emerald-200"
                onClick={onLinkClick}
              >
                <Icon size={18} className="text-emerald-600 mt-0.5" />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 mb-1">
                    {item.label}
                  </div>
                  {item.description && (
                    <div className="text-sm text-gray-600">
                      {item.description}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface ContactSectionProps {
  data: HeaderData;
}

function ContactSection({ data }: ContactSectionProps) {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200/60">
      <div className="text-center">
        <p className="text-sm text-gray-500 mb-3">
          {data.mobileMenu.contact.text}
        </p>
        <Link
          href={`tel:${data.mobileMenu.contact.phone}`}
          className="inline-flex items-center gap-3 text-emerald-600 font-bold hover:gap-4 transition-all duration-500 text-lg"
        >
          <Phone size={18} />
          {data.mobileMenu.contact.phone}
        </Link>
      </div>
    </div>
  );
}
