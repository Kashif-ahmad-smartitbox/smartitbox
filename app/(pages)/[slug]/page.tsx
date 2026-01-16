import React from "react";
import { Metadata } from "next";
import ModuleRenderer from "@/components/modules/ModuleRenderer";
import { getPageWithContent } from "@/services/modules/pageModule";
import { notFound } from "next/navigation";
import TeamSection from "@/app/components/TeamSection";

type PageResponse = {
  page?: any;
  message?: string;
};

export const metadataBase = new URL(
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
);

export async function generateMetadata({
  params,
}: {
  params: any;
}): Promise<Metadata> {
  const { slug } = await params;

  // If slug is "home", return 404-like metadata (don't call notFound here)
  if (slug === "home") {
    return {
      title: "Page Not Found | smartitbox",
      description: "This page does not exist.",
      robots: "noindex, nofollow",
      openGraph: {
        title: "Page Not Found | smartitbox",
        description: "This page does not exist.",
        url: `${metadataBase}/${slug}`,
      },
    };
  }

  try {
    const response: PageResponse = await getPageWithContent(slug);

    if (response.message === "Not found" || !response.page) {
      return {
        title: "Page Not Found | smartitbox",
        description: "The page you are looking for does not exist.",
        robots: "noindex, nofollow",
        openGraph: {
          title: "Page Not Found | smartitbox",
          description: "The page you are looking for does not exist.",
          url: `${metadataBase}/${slug}`,
        },
      };
    }

    const page = response.page;
    if ((page.type || "default") !== "default") {
      return {
        title: "Page Not Found | smartitbox",
        description: "The page you are looking for does not exist.",
        robots: "noindex, nofollow",
      };
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || metadataBase.toString();

    return {
      title: page.metaTitle || page.title || "smartitbox",
      description:
        page.metaDescription ||
        page.excerpt ||
        "Discover expert insights and analysis.",
      keywords: page.keywords?.length ? page.keywords.join(", ") : undefined,
      authors: [{ name: "smartitbox" }],
      openGraph: {
        title: page.metaTitle || page.title || "smartitbox",
        description:
          page.metaDescription ||
          page.excerpt ||
          "Discover expert insights and analysis.",
        type: "website",
        url: `${baseUrl}/${slug}`,
        siteName: "smartitbox",
      },
      twitter: {
        card: "summary_large_image",
        title: page.metaTitle || page.title || "smartitbox",
        description:
          page.metaDescription ||
          page.excerpt ||
          "Discover expert insights and analysis.",
      },
      robots:
        page.status === "published" ? "index, follow" : "noindex, nofollow",
      alternates: {
        canonical: page.canonicalUrl || `${baseUrl}/${slug}`,
      },
    };
  } catch (error) {
    console.error("generateMetadata default:", error);
    return {
      title: "Page Not Found",
      description: "The page you are looking for does not exist.",
      robots: "noindex, nofollow",
    };
  }
}

export default async function Page({ params }: { params: any }) {
  const { slug } = await params;

  // If slug is "home", show 404 since homepage is handled by "/" route
  if (slug === "home") {
    notFound();
  }

  const response: PageResponse = await getPageWithContent(slug);

  if (response.message === "Not found" || !response.page) {
    notFound();
  }

  const page = response.page;

  // ensure page type matches default
  if ((page.type || "default") !== "default") {
    notFound();
  }

  if (!page.layout || page.layout.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            No content
          </h1>
          <p className="text-gray-600">This page has no content yet.</p>
        </div>
      </div>
    );
  }

  const layout = (page.layout || [])
    .slice()
    .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));
  return (
    <main>
      {layout.map((item: any, idx: number) => (
        <ModuleRenderer item={item} index={idx} key={item.module?._id ?? idx} />
      ))}
    </main>
  );
}
