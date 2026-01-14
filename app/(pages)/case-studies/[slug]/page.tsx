import React from "react";
import { Metadata } from "next";
import SingleStories from "@/app/components/pages/SingleStories";
import { getStory } from "@/app/services/modules/stories";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = (await params) as { slug: string };

  try {
    const response = await getStory(slug);
    const story = response.story;

    if (!story || story.status === "draft") {
      return {
        title: "Story Not Found | smartitbox",
        description:
          "The story you're looking for doesn't exist or may have been moved.",
        robots: "noindex, nofollow",
      };
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smartitbox.in";
    const canonicalUrl = `${baseUrl}/case-studies/${slug}`;

    const metaDescription =
      story.metaDescription ||
      story.excerpt ||
      story.body
        ?.replace(/<[^>]*>/g, "")
        .substring(0, 160)
        .trim() + "..." ||
      "Read this captivating story on Smart ITBox";

    const openGraph: any = {
      type: "article",
      url: canonicalUrl,
      title: story.title,
      description: metaDescription,
      siteName: "Smart ITBox",
      images: [story.image || `${baseUrl}/og-image.jpg`],
    };

    if (story.publishedAt) openGraph.publishedTime = story.publishedAt;
    if (story.updatedAt) openGraph.modifiedTime = story.updatedAt;
    if (story.tags?.length) openGraph.tags = story.tags;

    return {
      title: `${story.title} | Smart ITBox Stories`,
      description: metaDescription,
      keywords: story.tags?.join(", "),
      alternates: { canonical: canonicalUrl },
      openGraph,
      twitter: {
        card: "summary_large_image",
        title: story.title,
        description: metaDescription,
        images: [story.image || `${baseUrl}/twitter-image.jpg`],
      },
      ...(story.publishedAt && {
        publishedTime: story.publishedAt,
      }),
      ...(story.updatedAt && {
        modifiedTime: story.updatedAt,
      }),
      ...(story.tags?.length && {
        keywords: story.tags.join(", "),
      }),
    };
  } catch (error) {
    console.error("Error generating metadata for story:", error);
    return {
      title: "Error Loading Story | Smart ITBox",
      description:
        "There was an error loading this story. Please try again later.",
      robots: "noindex, nofollow",
    };
  }
}

function SingleStoriesPage({ params }: Props) {
  return <SingleStories />;
}

export default SingleStoriesPage;
