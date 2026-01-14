import React from "react";
import { Metadata } from "next";
import SingleBlog from "@/components/pages/SingleBlog";
import { getBlogBySlug } from "@/app/services/modules/blog";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = (await params) as { slug: string };

  try {
    const response = await getBlogBySlug(slug);
    const blog = response.blog;

    if (!blog) {
      return {
        title: "Article Not Found | smartitbox",
        description: "The article you're looking for doesn't exist.",
        robots: "noindex, nofollow",
      };
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smartitbox.in";
    const canonicalUrl = `${baseUrl}/blog/${slug}`;

    const metaDescription =
      blog.metaDescription ||
      blog.excerpt ||
      blog.body
        ?.replace(/<[^>]*>/g, "")
        .substring(0, 160)
        .trim() + "..." ||
      "Read this insightful article on smartitbox";

    const openGraph: any = {
      type: "article",
      url: canonicalUrl,
      title: blog.title,
      description: metaDescription,
      siteName: "smartitbox",
      images: [blog.cover || `${baseUrl}/og-image.jpg`],
    };

    // Add optional properties only if they exist
    if (blog.publishedAt) openGraph.publishedTime = blog.publishedAt;
    if (blog.updatedAt) openGraph.modifiedTime = blog.updatedAt;
    if (blog.tags?.length) openGraph.tags = blog.tags;

    return {
      title: `${blog.title} | Smart ITBox`,
      description: metaDescription,
      keywords: blog.tags?.join(", "),
      authors: [{ name: "Smart ITBox" }],
      alternates: { canonical: canonicalUrl },
      openGraph,
      twitter: {
        card: "summary_large_image",
        title: blog.title,
        description: metaDescription,
        images: [blog.cover || `${baseUrl}/twitter-image.jpg`],
      },
    };
  } catch (error) {
    console.log("error", error);
    return {
      title: "Error | smartitbox",
      description: "Error loading article",
      robots: "noindex, nofollow",
    };
  }
}

function SingleBlogPage({ params }: Props) {
  return <SingleBlog />;
}

export default SingleBlogPage;
