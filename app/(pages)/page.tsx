import React from "react";
import { Metadata } from "next";
import ModuleRenderer from "@/components/modules/ModuleRenderer";
import {
  getPageWithContent,
  PageWithContentResponse,
} from "@/services/modules/pageModule";
import { breadcrumbSchema, webPageSchemaEnhanced } from "@/lib/schema";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const response: PageWithContentResponse = await getPageWithContent("home");

    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://www.smartitbox.in";
    const canonicalUrl = `${baseUrl}/`;
    const ogImage = "/opengraph.webp";
    const defaultTitle = "Home | SmartITbox";
    const defaultDescription =
      "Welcome to smartitbox - Your Business Process automation Partner.";

    const title =
      response.page?.metaTitle || response.page?.title || defaultTitle;
    const description =
      response.page?.metaDescription ||
      response.page?.excerpt ||
      defaultDescription;

    if (!response.page) {
      return {
        title: defaultTitle,
        description: defaultDescription,
        alternates: {
          canonical: canonicalUrl,
        },
        openGraph: {
          type: "website",
          siteName: "SMARTITBOX",
          title: defaultTitle,
          description: defaultDescription,
          url: canonicalUrl,
          images: [
            {
              url: ogImage,
              width: 1200,
              height: 630,
              alt: "SMARTITBOX Image",
            },
          ],
          locale: "en_IN",
        },
        twitter: {
          card: "summary_large_image",
          site: "@Smartitboxopl",
          creator: "@Smartitboxopl",
          title: defaultTitle,
          description: defaultDescription,
          images: [ogImage],
        },
        other: {
          "og:image:alt": "Your Business Process automation Partner.",
        },
      };
    }

    return {
      title: title,
      description: description,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        type: "website",
        siteName: "IMAST",
        title: title,
        description: description,
        url: canonicalUrl,
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: "Your Business Process automation Partner.",
          },
        ],
        locale: "en_IN",
      },
      twitter: {
        card: "summary_large_image",
        site: "@Smartitboxopl",
        creator: "@Smartitboxopl",
        title: title,
        description: description,
        images: [ogImage],
      },
      other: {
        "og:image:alt":
          "Smart ITBox - Your Business Process automation Partner",
      },
    };
  } catch (error) {
    console.log("error", error);
    return {
      title: "SmartITBOX - Your Business Process automation Partner",
      description:
        "Welcome to smartitbox - Your Business Process automation Partner.",
    };
  }
}

export default async function HomePage() {
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

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.smartitbox.in";
  const canonical = `${baseUrl}/`;
  const ogImage = "/opengraph.webp";

  const defaultTitle = "Home | smartitbox";
  const defaultDescription =
    "Welcome to smartitbox - Your Business Process automation Partner.";

  const title = response.page.metaTitle || response.page.title || defaultTitle;
  const description =
    response.page.metaDescription ||
    response.page.excerpt ||
    defaultDescription;

  // Build page-specific schemas
  const breadcrumb = breadcrumbSchema([
    {
      position: 1,
      name: "Home",
      item: canonical,
    },
  ]);

  const webPage = webPageSchemaEnhanced({
    name: title,
    url: canonical,
    description: description,
    image: ogImage,
    imageWidth: 1200,
    imageHeight: 630,
    imageAlt: "Your Business Process automation Partner",
  });

  // Combine page-specific schemas
  const pageSchema = {
    "@context": "https://schema.org",
    "@graph": [breadcrumb, webPage],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />

      <main>
        {layout.map((item, index) => (
          <ModuleRenderer
            item={item}
            index={index}
            key={item.module?._id || index}
          />
        ))}
      </main>
    </>
  );
}
