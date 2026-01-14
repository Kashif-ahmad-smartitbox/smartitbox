import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const FEBaseUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin"],
      },
    ],
    sitemap: `${FEBaseUrl}/sitemap.xml`,
    host: FEBaseUrl,
  };
}
