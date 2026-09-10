import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import type { CourseWithRelations } from "@/lib/site";

export type CategoryOption = { id: string; name: string; slug: string; icon: string | null; description: string | null };
export type ProviderOption = { id: string; name: string; slug: string };

const courseInclude = { category: true, provider: true } satisfies Prisma.CourseInclude;

/**
 * Run a DB query, falling back to a safe default when the database is
 * unreachable (e.g. during local preview before DATABASE_URL is configured).
 * Errors are logged so real problems remain visible in server logs.
 */
async function safe<T>(fallback: T, fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    return fallback;
  }
}

export async function getPublishedCourses(params: {
  where: Prisma.CourseWhereInput;
  orderBy?: Prisma.CourseOrderByWithRelationInput;
  page?: number;
  pageSize?: number;
}): Promise<{ courses: CourseWithRelations[]; total: number }> {
  return safe({ courses: [] as CourseWithRelations[], total: 0 }, async () => {
    const page = Math.max(1, params.page || 1);
    const pageSize = params.pageSize || 12;
    const [courses, total] = await Promise.all([
      db.course.findMany({
        where: params.where,
        include: courseInclude,
        orderBy: params.orderBy || { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      db.course.count({ where: params.where }),
    ]);
    return { courses, total };
  });
}

export async function getFeaturedCourses(limit = 6): Promise<CourseWithRelations[]> {
  return safe([], () =>
    db.course.findMany({
      where: { published: true, featured: true },
      include: courseInclude,
      orderBy: { updatedAt: "desc" },
      take: limit,
    })
  );
}

export async function getFreeCourses(limit = 6, page = 1): Promise<{ courses: CourseWithRelations[]; total: number }> {
  return getPublishedCourses({
    where: { published: true, isFree: true },
    orderBy: { updatedAt: "desc" },
    page,
    pageSize: limit,
  });
}

/**
 * Popular courses. v1: no fake popularity — if there is insufficient
 * engagement data (fewer than 20 total clicks), fall back to recently
 * updated courses instead of pretending popularity exists.
 */
export async function getPopularCourses(limit = 6): Promise<CourseWithRelations[]> {
  return safe([], async () => {
    const cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000); // 90 days
    const grouped = await db.courseClick.groupBy({
      by: ["courseId"],
      where: { createdAt: { gte: cutoff } },
      _count: { courseId: true },
      having: { courseId: { _count: { gte: 3 } } },
      orderBy: { _count: { courseId: "desc" } },
      take: limit,
    });

    if (grouped.length < 3) {
      // Not enough data yet — show recently updated published courses instead.
      return db.course.findMany({
        where: { published: true },
        include: courseInclude,
        orderBy: { updatedAt: "desc" },
        take: limit,
      });
    }

    const ids = grouped.map((g) => g.courseId);
    const courses = await db.course.findMany({
      where: { id: { in: ids }, published: true },
      include: courseInclude,
    });
    // Preserve click order
    return ids
      .map((id) => courses.find((c) => c.id === id))
      .filter((c): c is CourseWithRelations => Boolean(c));
  });
}

export async function getCategoriesWithCounts(): Promise<(CategoryOption & { courseCount: number })[]> {
  return safe([], () =>
    db.category
      .findMany({
        orderBy: { sortOrder: "asc" },
        include: { _count: { select: { courses: { where: { published: true } } } } },
      })
      .then((categories) =>
        categories.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          icon: c.icon,
          description: c.description,
          courseCount: c._count.courses,
        }))
      )
  );
}

export async function getCategoryBySlug(slug: string) {
  return safe(null, () => db.category.findUnique({ where: { slug } }));
}

export async function getProviderOptions(): Promise<ProviderOption[]> {
  return safe([], () =>
    db.provider.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true },
    })
  );
}

export async function getCourseBySlug(slug: string): Promise<CourseWithRelations | null> {
  return safe(null, () =>
    db.course.findFirst({
      where: { slug, published: true },
      include: courseInclude,
    })
  );
}

export async function getRelatedCourses(course: CourseWithRelations, limit = 6): Promise<CourseWithRelations[]> {
  return safe([], () =>
    db.course.findMany({
      where: {
        published: true,
        id: { not: course.id },
        OR: [{ categoryId: course.categoryId }, { providerId: course.providerId }],
      },
      include: courseInclude,
      take: limit,
      orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
    })
  );
}

// ---- Admin-side queries ----

export async function getAdminStats() {
  return safe(
    { published: 0, drafts: 0, featured: 0, categories: 0, providers: 0, clicks: 0, views: 0 },
    async () => {
      const [published, drafts, featured, categories, providers, clicks, views] = await Promise.all([
        db.course.count({ where: { published: true } }),
        db.course.count({ where: { published: false } }),
        db.course.count({ where: { featured: true } }),
        db.category.count(),
        db.provider.count(),
        db.courseClick.count(),
        db.courseView.count(),
      ]);
      return { published, drafts, featured, categories, providers, clicks, views };
    }
  );
}

export async function getAdminCourses(opts: { q?: string; page?: number; pageSize?: number }) {
  return safe({ courses: [] as AdminCourseRow[], total: 0, page: opts.page || 1, pageSize: opts.pageSize || 20 }, async () => {
    const page = Math.max(1, opts.page || 1);
    const pageSize = opts.pageSize || 20;
    const where: Prisma.CourseWhereInput = opts.q
      ? { title: { contains: opts.q, mode: "insensitive" } }
      : {};
    const [courses, total] = await Promise.all([
      db.course.findMany({
        where,
        include: { category: true, provider: true, _count: { select: { clicks: true, views: true } } },
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      db.course.count({ where }),
    ]);
    return { courses, total, page, pageSize };
  });
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

export async function getTopCoursesByClicks(limit = 10) {
  return safe([], async () => {
    const grouped = await db.courseClick.groupBy({
      by: ["courseId"],
      _count: { courseId: true },
      orderBy: { _count: { courseId: "desc" } },
      take: limit,
    });
    const ids = grouped.map((g) => g.courseId);
    const courses = await db.course.findMany({
      where: { id: { in: ids } },
      select: { id: true, title: true, slug: true, _count: { select: { views: true, clicks: true } } },
    });
    return courses
      .map((c) => {
        const views = c._count.views;
        const clicks = c._count.clicks;
        return {
          title: c.title,
          slug: c.slug,
          views,
          clicks,
          ctr: views > 0 ? (clicks / views) * 100 : 0,
        };
      })
      .sort((a, b) => b.clicks - a.clicks);
  });
}

export async function getTopCategoriesByClicks(limit = 6) {
  return safe([], async () => {
    const rows = await db.courseClick.findMany({
      select: { course: { select: { category: { select: { name: true, slug: true } } } } },
    });
    const counts = new Map<string, number>();
    for (const row of rows) {
      const key = row.course.category.name;
      counts.set(key, (counts.get(key) || 0) + 1);
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([name, clicks]) => ({ name, clicks }));
  });
}

export async function getTopProvidersByClicks(limit = 6) {
  return safe([], async () => {
    const rows = await db.courseClick.findMany({
      select: { course: { select: { provider: { select: { name: true, slug: true } } } } },
    });
    const counts = new Map<string, number>();
    for (const row of rows) {
      const key = row.course.provider.name;
      counts.set(key, (counts.get(key) || 0) + 1);
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([name, clicks]) => ({ name, clicks }));
  });
}
