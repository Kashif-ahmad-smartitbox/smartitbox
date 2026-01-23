export type JsonLd = Record<string, any>;

/**
 * Enhanced WebPage schema with @id and isPartOf for homepage
 */
export function webPageSchemaEnhanced(payload: {
  name: string;
  url: string;
  description?: string;
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageAlt?: string;
}): JsonLd {
  const out: any = {
    "@type": "WebPage",
    "@id": `${payload.url}#webpage`,
    url: payload.url,
    name: payload.name,
    isPartOf: {
      "@id": `${payload.url}#website`,
    },
  };

  if (payload.description) out.description = payload.description;

  if (payload.image) {
    out.primaryImageOfPage = {
      "@type": "ImageObject",
      url: payload.image,
      ...(payload.imageWidth && { width: payload.imageWidth }),
      ...(payload.imageHeight && { height: payload.imageHeight }),
      ...(payload.imageAlt && { alt: payload.imageAlt }),
    };
  }

  return out;
}

export function productSchema(payload: {
  name: string;
  url: string;
  image?: string;
  description?: string;
  brand?: string;
  category?: string;
  offers?: {
    url: string;
    availability?: string;
    price?: string;
    priceCurrency?: string;
  };
  relatedSoftware?: {
    name: string;
    operatingSystem?: string;
    applicationCategory?: string;
  };
}): JsonLd {
  const out: any = {
    "@type": "Product",
    name: payload.name,
    url: payload.url,
  };

  if (payload.image) out.image = payload.image;
  if (payload.description) out.description = payload.description;

  if (payload.brand) {
    out.brand = {
      "@type": "Brand",
      name: payload.brand,
    };
  }

  if (payload.offers) {
    out.offers = {
      "@type": "Offer",
      url: payload.offers.url,
      ...(payload.offers.availability && {
        availability: payload.offers.availability,
      }),
      ...(payload.offers.price && { price: payload.offers.price }),
      ...(payload.offers.priceCurrency && {
        priceCurrency: payload.offers.priceCurrency,
      }),
    };
  }

  if (payload.category) out.category = payload.category;

  if (payload.relatedSoftware) {
    out.isRelatedTo = {
      "@type": "SoftwareApplication",
      name: payload.relatedSoftware.name,
      ...(payload.relatedSoftware.operatingSystem && {
        operatingSystem: payload.relatedSoftware.operatingSystem,
      }),
      ...(payload.relatedSoftware.applicationCategory && {
        applicationCategory: payload.relatedSoftware.applicationCategory,
      }),
      url: payload.url,
    };
  }

  return out;
}

export function serviceSchema(payload: {
  name: string;
  url: string;
  description?: string;
  serviceType?: string;
  providerId?: string;
  areaServed?: string;
  offers?: {
    price?: string;
    priceCurrency?: string;
  };
}): JsonLd {
  const out: any = {
    "@type": "Service",
    name: payload.name,
    url: payload.url,
  };

  if (payload.description) out.description = payload.description;
  if (payload.serviceType) out.serviceType = payload.serviceType;
  if (payload.areaServed) out.areaServed = payload.areaServed;

  if (payload.providerId) {
    out.provider = {
      "@id": payload.providerId,
    };
  }

  if (payload.offers) {
    out.offers = {
      "@type": "Offer",
      ...(payload.offers.price && { price: payload.offers.price }),
      ...(payload.offers.priceCurrency && {
        priceCurrency: payload.offers.priceCurrency,
      }),
    };
  }

  return out;
}

export function organizationSchema({
  name,
  url,
  logo,
  sameAs,
  contactPoint,
}: {
  name: string;
  url: string;
  logo?: string;
  sameAs?: string[];
  contactPoint?: {
    telephone: string;
    contactType?: string;
    email?: string;
    areaServed?: string;
    availableLanguage?: string[];
  }[];
}): JsonLd {
  const org: any = {
    "@type": "Organization",
    "@id": `${url}#organization`,
    name,
    url,
  };

  if (logo) org.logo = logo;
  if (sameAs && sameAs.length) org.sameAs = sameAs;
  if (contactPoint && contactPoint.length) {
    org.contactPoint = contactPoint.map((c) => ({
      "@type": "ContactPoint",
      telephone: c.telephone,
      contactType: c.contactType || "customer service",
      areaServed: c.areaServed || undefined,
    }));
  }

  const site = {
    "@type": "WebSite",
    "@id": `${url}#website`,
    url,
    name,
    publisher: { "@id": `${url}#organization` },
  };

  return {
    "@context": "https://schema.org",
    "@graph": [org, site],
  };
}

export function breadcrumbSchema(
  items: { position: number; name: string; item: string }[]
): JsonLd {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it) => ({
      "@type": "ListItem",
      position: it.position,
      name: it.name,
      item: it.item,
    })),
  };
}

export function webPageSchema(payload: {
  name: string;
  url: string;
  description?: string;
}): JsonLd {
  const out: any = {
    "@type": "WebPage",
    url: payload.url,
    name: payload.name,
  };
  if (payload.description) out.description = payload.description;
  return out;
}

/**
 * SoftwareApplication schema producer
 */
export function softwareApplicationSchema(payload: {
  name: string;
  url: string;
  image?: string;
  description?: string;
  operatingSystem?: string;
  applicationCategory?: string;
  publisherName?: string;
}): JsonLd {
  const {
    name,
    url,
    image,
    description,
    operatingSystem,
    applicationCategory,
    publisherName,
  } = payload;
  const out: any = {
    "@type": "SoftwareApplication",
    name,
    url,
  };
  if (image) out.image = image;
  if (description) out.description = description;
  if (operatingSystem) out.operatingSystem = operatingSystem;
  if (applicationCategory) out.applicationCategory = applicationCategory;
  if (publisherName)
    out.publisher = { "@type": "Organization", name: publisherName };
  return out;
}

/**
 * Article schema
 */
export function articleSchema(payload: {
  title: string;
  url: string;
  image?: string;
  description?: string;
  authorName?: string;
  publishedTime?: string;
  modifiedTime?: string;
}): JsonLd {
  const out: any = {
    "@type": "Article",
    headline: payload.title,
    url: payload.url,
  };
  if (payload.image) out.image = payload.image;
  if (payload.description) out.description = payload.description;
  if (payload.authorName)
    out.author = { "@type": "Organization", name: payload.authorName };
  if (payload.publishedTime) out.datePublished = payload.publishedTime;
  if (payload.modifiedTime) out.dateModified = payload.modifiedTime;
  return out;
}
