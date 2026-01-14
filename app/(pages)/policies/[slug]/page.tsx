import React from "react";
import { Metadata } from "next";
import ModuleRenderer from "@/components/modules/ModuleRenderer";
import { getPageWithContent } from "@/services/modules/pageModule";
import { notFound } from "next/navigation";

type PageResponse = {
  page?: any;
  message?: string;
};

export async function generateMetadata({
  params,
}: {
  params: any;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const response: PageResponse = await getPageWithContent(slug);

    if (response.message === "Not found" || !response.page) {
      return {
        title: "Page Not Found",
        description: "The page you are looking for does not exist.",
      };
    }

    const page = response.page;
    // ensure this is a policies page
    if (page.type !== "policies") {
      notFound();
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smartitbox.in";

    return {
      title: page.metaTitle || page.title || "Smart ITBox",
      description:
        page.metaDescription ||
        page.excerpt ||
        "Discover expert insights and analysis.",
      keywords: page.keywords?.length ? page.keywords.join(", ") : undefined,
      authors: [{ name: "Smart ITBox" }],
      openGraph: {
        title: page.metaTitle || page.title || "Smart ITBox",
        description:
          page.metaDescription ||
          page.excerpt ||
          "Discover expert insights and analysis.",
        type: "website",
        url: `${baseUrl}/policies/${slug}`,
        siteName: "Smart ITBox",
      },
      twitter: {
        card: "summary_large_image",
        title: page.metaTitle || page.title || "Smart ITBox",
        description:
          page.metaDescription ||
          page.excerpt ||
          "Discover expert insights and analysis.",
      },
      robots:
        page.status === "published" ? "index, follow" : "noindex, nofollow",
      alternates: {
        canonical: page.canonicalUrl || `${baseUrl}/policies/${slug}`,
      },
    };
  } catch (error) {
    console.error("generateMetadata policies:", error);
    return {
      title: "Page Not Found",
      description: "The page you are looking for does not exist.",
    };
  }
}

export default async function Page({ params }: { params: any }) {
  const { slug } = await params;

  const response: PageResponse = await getPageWithContent(slug);

  if (response.message === "Not found" || !response.page) {
    notFound();
  }

  const page = response.page;

  // require policies type
  if (page.type !== "policies") {
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
