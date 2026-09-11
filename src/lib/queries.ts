import { createClient } from "@/lib/supabase/server";
import type { CourseWithRelations } from "@/lib/site";

export type CategoryOption = { id: string; name: string; slug: string; icon: string | null; description: string | null };
export type ProviderOption = { id: string; name: string; slug: string };

async function getClient() {
  return createClient();
}

/**
 * Run a DB query, falling back to a safe default when the database is
 * unreachable. Errors are logged so real problems remain visible.
 */
async function safe<T>(fallback: T, fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.error("[Supabase query error]", error);
    return fallback;
  }
}

function mapCourse(row: any): CourseWithRelations {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    shortDescription: row.short_description,
    description: row.description,
    categoryId: row.category_id,
    providerId: row.provider_id,
    level: row.level,
    price: row.price,
    currency: row.currency,
    isFree: row.is_free,
    duration: row.duration,
    certificate: row.certificate,
    language: row.language,
    format: row.format,
    imageUrl: row.image_url,
    learningOutcomes: row.learning_outcomes,
    targetAudience: row.target_audience,
    whyRecommended: row.why_recommended,
    affiliateUrl: row.affiliate_url,
    externalCourseUrl: row.external_course_url,
    rating: row.rating,
    featured: row.featured,
    published: row.published,
    lastVerified: row.last_verified,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    category: row.categories ?? row.category ?? { id: row.category_id, name: "", slug: "" },
    provider: row.providers ?? row.provider ?? { id: row.provider_id, name: "", slug: "" },
  };
}

function applyCourseFilters(query: any, params: {
  where?: Record<string, any>;
  q?: string;
  category?: string;
  provider?: string;
  level?: string;
  isFree?: boolean;
  certificate?: boolean;
  format?: string;
}) {
  if (params.where) {
    for (const [key, value] of Object.entries(params.where)) {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value);
      }
    }
  }
  if (params.q) {
    query = query.or(`title.ilike.%${params.q}%,short_description.ilike.%${params.q}%,description.ilike.%${params.q}%`);
  }
  if (params.category) {
    query = query.eq("categories.slug", params.category);
  }
  if (params.provider) {
    query = query.eq("providers.slug", params.provider);
  }
  if (params.level) {
    query = query.eq("level", params.level);
  }
  if (params.isFree !== undefined) {
    query = query.eq("is_free", params.isFree);
  }
  if (params.certificate !== undefined) {
    query = query.eq("certificate", params.certificate);
  }
  if (params.format) {
    query = query.eq("format", params.format);
  }
  return query;
}

export async function getPublishedCourses(params: {
  q?: string;
  category?: string;
  provider?: string;
  level?: string;
  price?: string;
  cert?: string;
  format?: string;
  duration?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ courses: CourseWithRelations[]; total: number }> {
  return safe({ courses: [] as CourseWithRelations[], total: 0 }, async () => {
    const db = await getClient();
    const page = Math.max(1, params.page || 1);
    const pageSize = params.pageSize || 12;

    let query = db
      .from("courses")
      .select("*, categories(*), providers(*)", { count: "exact" })
      .eq("published", true);

    if (params.q?.trim()) {
      const q = params.q.trim();
      query = query.or(`title.ilike.%${q}%,short_description.ilike.%${q}%,description.ilike.%${q}%`);
    }
    if (params.category) {
      query = query.eq("categories.slug", params.category);
    }
    if (params.provider) {
      query = query.eq("providers.slug", params.provider);
    }
    if (params.level) {
      query = query.eq("level", params.level);
    }
    if (params.price === "free") {
      query = query.eq("is_free", true);
    } else if (params.price === "paid") {
      query = query.eq("is_free", false);
    }
    if (params.cert === "yes") {
      query = query.eq("certificate", true);
    } else if (params.cert === "no") {
      query = query.eq("certificate", false);
    }
    if (params.format) {
      query = query.eq("format", params.format);
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, count, error } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;
    return {
      courses: (data || []).map(mapCourse),
      total: count || 0,
    };
  });
}

export async function getFeaturedCourses(limit = 6): Promise<CourseWithRelations[]> {
  return safe([], async () => {
    const db = await getClient();
    const { data, error } = await db
      .from("courses")
      .select("*, categories(*), providers(*)")
      .eq("published", true)
      .eq("featured", true)
      .order("updated_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data || []).map(mapCourse);
  });
}

export async function getFreeCourses(limit = 6, page = 1): Promise<{ courses: CourseWithRelations[]; total: number }> {
  return getPublishedCourses({ price: "free", page, pageSize: limit });
}

export async function getPopularCourses(limit = 6): Promise<CourseWithRelations[]> {
  return safe([], async () => {
    const db = await getClient();
    const cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();

    // Get courses with most clicks in last 90 days
    const { data: clicks, error: clicksError } = await db
      .from("course_clicks")
      .select("course_id")
      .gte("created_at", cutoff);

    if (clicksError) throw clicksError;

    // Count clicks per course
    const counts = new Map<string, number>();
    for (const c of clicks || []) {
      counts.set(c.course_id, (counts.get(c.course_id) || 0) + 1);
    }

    // Sort by click count, take top IDs
    const sortedIds = [...counts.entries()]
      .filter(([, count]) => count >= 3)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([id]) => id);

    if (sortedIds.length < 3) {
      // Not enough data — fall back to recently updated published courses
      const { data, error } = await db
        .from("courses")
        .select("*, categories(*), providers(*)")
        .eq("published", true)
        .order("updated_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return (data || []).map(mapCourse);
    }

    const { data, error } = await db
      .from("courses")
      .select("*, categories(*), providers(*)")
      .in("id", sortedIds)
      .eq("published", true);
    if (error) throw error;

    const courseMap = new Map((data || []).map((c) => [c.id, mapCourse(c)]));
    return sortedIds.map((id) => courseMap.get(id)).filter(Boolean) as CourseWithRelations[];
  });
}

export async function getCategoriesWithCounts(): Promise<(CategoryOption & { courseCount: number })[]> {
  return safe([], async () => {
    const db = await getClient();
    const { data, error } = await db
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;

    const results = await Promise.all(
      (data || []).map(async (cat) => {
        const { count } = await db
          .from("courses")
          .select("id", { count: "exact", head: true })
          .eq("category_id", cat.id)
          .eq("published", true);
        return {
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          icon: cat.icon,
          description: cat.description,
          courseCount: count || 0,
        };
      })
    );
    return results;
  });
}

export async function getCategoryBySlug(slug: string) {
  return safe(null, async () => {
    const db = await getClient();
    const { data, error } = await db
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .single();
    if (error) return null;
    return data;
  });
}

export async function getProviderOptions(): Promise<ProviderOption[]> {
  return safe([], async () => {
    const db = await getClient();
    const { data, error } = await db
      .from("providers")
      .select("id, name, slug")
      .order("name", { ascending: true });
    if (error) throw error;
    return data || [];
  });
}

export async function getCourseBySlug(slug: string): Promise<CourseWithRelations | null> {
  return safe(null, async () => {
    const db = await getClient();
    const { data, error } = await db
      .from("courses")
      .select("*, categories(*), providers(*)")
      .eq("slug", slug)
      .eq("published", true)
      .single();
    if (error) return null;
    return mapCourse(data);
  });
}

export async function getRelatedCourses(course: CourseWithRelations, limit = 6): Promise<CourseWithRelations[]> {
  return safe([], async () => {
    const db = await getClient();
    const { data, error } = await db
      .from("courses")
      .select("*, categories(*), providers(*)")
      .eq("published", true)
      .neq("id", course.id)
      .or(`category_id.eq.${course.categoryId},provider_id.eq.${course.providerId}`)
      .order("featured", { ascending: false })
      .order("updated_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data || []).map(mapCourse);
  });
}

// ---- Admin-side queries ----

export async function getAdminStats() {
  return safe(
    { published: 0, drafts: 0, featured: 0, categories: 0, providers: 0, clicks: 0, views: 0 },
    async () => {
      const db = await getClient();

      const [published, drafts, featured, categories, providers, clicks, views] = await Promise.all([
        db.from("courses").select("id", { count: "exact", head: true }).eq("published", true),
        db.from("courses").select("id", { count: "exact", head: true }).eq("published", false),
        db.from("courses").select("id", { count: "exact", head: true }).eq("featured", true),
        db.from("categories").select("id", { count: "exact", head: true }),
        db.from("providers").select("id", { count: "exact", head: true }),
        db.from("course_clicks").select("id", { count: "exact", head: true }),
        db.from("course_views").select("id", { count: "exact", head: true }),
      ]);

      return {
        published: published.count || 0,
        drafts: drafts.count || 0,
        featured: featured.count || 0,
        categories: categories.count || 0,
        providers: providers.count || 0,
        clicks: clicks.count || 0,
        views: views.count || 0,
      };
    }
  );
}

export type AdminCourseRow = {
  id: string;
  title: string;
  slug: string;
  isFree: boolean;
  price: number | null;
  currency: string;
  published: boolean;
  featured: boolean;
  category: { name: string };
  provider: { name: string };
  _count: { clicks: number; views: number };
};

export async function getAdminCourses(opts: { q?: string; page?: number; pageSize?: number }) {
  return safe({ courses: [] as AdminCourseRow[], total: 0, page: opts.page || 1, pageSize: opts.pageSize || 20 }, async () => {
    const db = await getClient();
    const page = Math.max(1, opts.page || 1);
    const pageSize = opts.pageSize || 20;

    let query = db
      .from("courses")
      .select("*, categories(name), providers(name)", { count: "exact" });

    if (opts.q?.trim()) {
      query = query.ilike("title", `%${opts.q.trim()}%`);
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, count, error } = await query
      .order("updated_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    // Get click/view counts for each course
    const courses: AdminCourseRow[] = await Promise.all(
      (data || []).map(async (c: any) => {
        const [clicksResult, viewsResult] = await Promise.all([
          db.from("course_clicks").select("id", { count: "exact", head: true }).eq("course_id", c.id),
          db.from("course_views").select("id", { count: "exact", head: true }).eq("course_id", c.id),
        ]);
        return {
          id: c.id,
          title: c.title,
          slug: c.slug,
          isFree: c.is_free,
          price: c.price,
          currency: c.currency,
          published: c.published,
          featured: c.featured,
          category: { name: c.categories?.name || "" },
          provider: { name: c.providers?.name || "" },
          _count: { clicks: clicksResult.count || 0, views: viewsResult.count || 0 },
        };
      })
    );

    return { courses, total: count || 0, page, pageSize };
  });
}

export async function getTopCoursesByClicks(limit = 10) {
  return safe([], async () => {
    const db = await getClient();

    const { data: clicks, error } = await db
      .from("course_clicks")
      .select("course_id");
    if (error) throw error;

    // Count per course
    const counts = new Map<string, number>();
    for (const c of clicks || []) {
      counts.set(c.course_id, (counts.get(c.course_id) || 0) + 1);
    }

    const sorted = [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit);

    if (sorted.length === 0) return [];

    const ids = sorted.map(([id]) => id);
    const { data: courses } = await db
      .from("courses")
      .select("id, title, slug")
      .in("id", ids);

    // Get view counts
    const results = await Promise.all(
      (courses || []).map(async (c) => {
        const { count: views } = await db
          .from("course_views")
          .select("id", { count: "exact", head: true })
          .eq("course_id", c.id);
        const clicksForCourse = counts.get(c.id) || 0;
        const viewCount = views || 0;
        return {
          title: c.title,
          slug: c.slug,
          views: viewCount,
          clicks: clicksForCourse,
          ctr: viewCount > 0 ? (clicksForCourse / viewCount) * 100 : 0,
        };
      })
    );

    return results.sort((a, b) => b.clicks - a.clicks);
  });
}

export async function getTopCategoriesByClicks(limit = 6) {
  return safe([], async () => {
    const db = await getClient();

    const { data: clicks } = await db
      .from("course_clicks")
      .select("course_id, courses(category_id, categories(name, slug))");
    if (!clicks) return [];

    const counts = new Map<string, { name: string; slug: string; clicks: number }>();
    for (const row of clicks) {
      const cat = (row as any).courses?.categories;
      if (!cat) continue;
      const existing = counts.get(cat.name);
      if (existing) {
        existing.clicks += 1;
      } else {
        counts.set(cat.name, { name: cat.name, slug: cat.slug, clicks: 1 });
      }
    }

    return [...counts.values()]
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, limit);
  });
}

export async function getTopProvidersByClicks(limit = 6) {
  return safe([], async () => {
    const db = await getClient();

    const { data: clicks } = await db
      .from("course_clicks")
      .select("course_id, courses(provider_id, providers(name, slug))");
    if (!clicks) return [];

    const counts = new Map<string, { name: string; slug: string; clicks: number }>();
    for (const row of clicks) {
      const prov = (row as any).courses?.providers;
      if (!prov) continue;
      const existing = counts.get(prov.name);
      if (existing) {
        existing.clicks += 1;
      } else {
        counts.set(prov.name, { name: prov.name, slug: prov.slug, clicks: 1 });
      }
    }

    return [...counts.values()]
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, limit);
  });
}
