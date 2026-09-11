import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { SITE } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE.url}/courses`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE.url}/categories`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE.url}/courses/free`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE.url}/learning-paths`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE.url}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE.url}/opportunities`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE.url}/affiliate-disclosure`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE.url}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE.url}/terms`, changeFrequency: "yearly", priority: 0.2 },
  ];

  try {
    const db = await createClient();

    const [catResult, courseResult] = await Promise.all([
      db.from("categories").select("slug, updated_at"),
      db.from("courses").select("slug, updated_at").eq("published", true),
    ]);

    const categories = catResult.data || [];
    const courses = courseResult.data || [];

    return [
      ...staticPages,
      ...categories.map((c) => ({
        url: `${SITE.url}/courses/category/${c.slug}`,
        lastModified: new Date(c.updated_at),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
      ...courses.map((c) => ({
        url: `${SITE.url}/courses/${c.slug}`,
        lastModified: new Date(c.updated_at),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
    ];
  } catch {
    return staticPages;
  }
}
