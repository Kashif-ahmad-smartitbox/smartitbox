import React from "react";
import { Metadata } from "next";
import ModuleRenderer from "@/components/modules/ModuleRenderer";
import {
  getPageWithContent,
  PageWithContentResponse,
} from "@/services/modules/pageModule";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const response: PageWithContentResponse = await getPageWithContent("home");

    if (!response.page) {
      return {
        title: "Home | smartitbox",
        description:
          "Welcome to smartitbox - Your platform for insightful content.",
      };
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smartitbox.in";

    return {
      title: response.page.metaTitle || response.page.title || "smartitbox",
      description:
        response.page.metaDescription ||
        response.page.excerpt ||
        "Discover expert insights and analysis.",
      openGraph: {
        title: response.page.metaTitle || response.page.title || "smartitbox",
        description:
          response.page.metaDescription ||
          response.page.excerpt ||
          "Discover expert insights and analysis.",
        type: "website",
        url: baseUrl,
        images: [
          {
            url: "/favicon.png",
            width: 1200,
            height: 630,
            alt: "SMARTITBOX",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: response.page.metaTitle || response.page.title || "smartitbox",
        description:
          response.page.metaDescription ||
          response.page.excerpt ||
          "Discover expert insights and analysis.",
        images: ["/favicon.png"],
      },
      alternates: {
        canonical: "/",
      },
    };
  } catch (error) {
    console.log("error", error);
    return {
      title: "Home | smartitbox",
      description:
        "Welcome to Smart ITBox - Your platform for insightful content.",
    };
  }
}

export default async function HomePage() {
  // ... rest of your component code remains the same
  let response: PageWithContentResponse;

  try {
    response = await getPageWithContent("home");
  } catch (error) {
    console.log("error", error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Failed to load page
          </h1>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  if (response.message === "Not found" || !response.page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Page not found
          </h1>
          <p className="text-gray-600">The home page does not exist.</p>
        </div>
      </div>
    );
  }

  if (!response.page.layout || response.page.layout.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            No content
          </h1>
          <p className="text-gray-600">No modules configured for home page.</p>
        </div>
      </div>
    );
  }

  const layout = response.page.layout
    .slice()
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <main>
      {layout.map((item, index) => (
        <ModuleRenderer
          item={item}
          index={index}
          key={item.module?._id || index}
        />
      ))}
    </main>
  );
}
