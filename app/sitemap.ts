import type { MetadataRoute } from "next";
import { getPages } from "./services/modules/pageModule";
import { getBlogs } from "./services/modules/blog";
import { getStories } from "./services/modules/stories";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const FEBaseUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  const pagesRes = await getPages({ limit: 2000 });
  const blogsRes = await getBlogs({ limit: 2000 });
  const storiesRes = await getStories({ limit: 2000 });

  const sitemapEntries: MetadataRoute.Sitemap = [];

  const staticPages = [
    {
      url: `${FEBaseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
  ];

  sitemapEntries.push(...staticPages);

  if (pagesRes && Array.isArray(pagesRes.items)) {
    pagesRes.items.forEach((page: any) => {
      if (page.status === "published") {
        let url = `${FEBaseUrl}`;

        if (page.type === "solutions") {
          url = `${FEBaseUrl}/solutions/${page.slug}`;
        } else if (page.type === "services") {
          url = `${FEBaseUrl}/services/${page.slug}`;
        } else if (page.type === "policies") {
          url = `${FEBaseUrl}/policies/${page.slug}`;
        } else {
          url = `${FEBaseUrl}/${page.slug}`;
        }

        if (url === `${FEBaseUrl}/home` || url === `${FEBaseUrl}`) {
          return;
        }

        const entry = {
          url,
          lastModified: new Date(
            page.updatedAt || page.publishedAt || Date.now()
          ),
          changeFrequency: "weekly" as const,
          priority: 0.7,
        };

        sitemapEntries.push(entry);
      }
    });
  }

  if (blogsRes && Array.isArray(blogsRes.items)) {
    blogsRes.items.forEach((blog: any) => {
      if (blog.status === "published") {
        const blogUrl = `${FEBaseUrl}/blog/${blog.slug}`;

        const entry = {
          url: blogUrl,
          lastModified: new Date(
            blog.updatedAt || blog.publishedAt || Date.now()
          ),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        };

        sitemapEntries.push(entry);
      }
    });
  }

  if (storiesRes && Array.isArray(storiesRes.items)) {
    storiesRes.items.forEach((story: any) => {
      if (story.status === "published") {
        const storyUrl = `${FEBaseUrl}/case-studies/${story.slug}`;

        const entry = {
          url: storyUrl,
          lastModified: new Date(
            story.updatedAt || story.publishedAt || Date.now()
          ),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        };

        sitemapEntries.push(entry);
      }
    });
  }

  console.log(`Generated sitemap with ${sitemapEntries.length} entries`);

  return sitemapEntries;
}
