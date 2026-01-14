// Header type
export interface FeatureLink {
  label: string;
  href: string;
}

export type Feature = string | FeatureLink;

export interface MenuItem {
  icon: string;
  title: string;
  description?: string;
  href: string;
  gradient?: string;
  features?: Feature[];
  badge?: string;
}

export interface CompanyLink {
  icon: string;
  label: string;
  href: string;
}

export interface HeaderData {
  logo: {
    src: string;
    alt: string;
    mobileHeight: string;
    tabletHeight: string;
    desktopHeight: string;
  };
  navigation: {
    items: Array<{
      key: string;
      label: string;
      href: string;
    }>;
  };
  products: MenuItem[];
  services: MenuItem[];
  companyLinks: CompanyLink[];
  cta: {
    text: string;
    href: string;
  };
  companyMega: {
    title: string;
    description: string;
    cta: {
      text: string;
      href: string;
    };
  };
  mobileMenu: {
    contact: {
      text: string;
      phone: string;
    };
  };
}

export const SCROLL_THRESHOLD = 5;
