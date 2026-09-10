import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { SITE } from "@/lib/site";

export const revalidate = 3600; // refresh hourly

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
    const [categories, courses] = await Promise.all([
      db.category.findMany({ select: { slug: true, updatedAt: true } }),
      db.course.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    return [
      ...staticPages,
      ...categories.map((c) => ({
        url: `${SITE.url}/courses/category/${c.slug}`,
        lastModified: c.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
      ...courses.map((c) => ({
        url: `${SITE.url}/courses/${c.slug}`,
        lastModified: c.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
    ];
  } catch {
    // DB unavailable (e.g. build time) — still emit static pages
    return staticPages;
  }
}
