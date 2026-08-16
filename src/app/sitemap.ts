import { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/data/blog";

const baseUrl = "https://casabombora.com";

const staticRoutes = [
  { path: "", changeFrequency: "weekly" as const, priority: 1.0 },
  { path: "/villas/one-level", changeFrequency: "monthly" as const, priority: 0.9 },
  { path: "/villas/mezzanine", changeFrequency: "monthly" as const, priority: 0.9 },
  { path: "/villas/two-levels", changeFrequency: "monthly" as const, priority: 0.9 },
  { path: "/blog", changeFrequency: "weekly" as const, priority: 0.9 },
  { path: "/privacy-policy", changeFrequency: "yearly" as const, priority: 0.3 },
  { path: "/terms-of-service", changeFrequency: "yearly" as const, priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = staticRoutes.map(({ path, changeFrequency, priority }) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));

  const posts = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "yearly" as const,
    priority: 0.8,
  }));

  return [...pages, ...posts];
}
