import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import SearchBar from "@/components/SearchBar";
import CourseFilters from "@/components/CourseFilters";
import CourseCard from "@/components/CourseCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import { PAGE_SIZE } from "@/lib/site";
import {
  getPublishedCourses,
  getCategoriesWithCounts,
  getProviderOptions,
} from "@/lib/queries";

type SP = Promise<Record<string, string | string[] | undefined>>;

export const metadata: Metadata = {
  title: "All Courses",
  description:
    "Browse curated courses in grant writing, scholarships, career development, freelancing, remote work and more.",
  alternates: { canonical: "/courses" },
};

export const dynamic = "force-dynamic";

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default async function CoursesPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const q = first(sp.q);
  const category = first(sp.category);
  const provider = first(sp.provider);
  const level = first(sp.level);
  const price = first(sp.price);
  const cert = first(sp.cert);
  const format = first(sp.format);
  const duration = first(sp.duration);
  const page = Math.max(1, Number(first(sp.page)) || 1);

  const [{ courses, total }, categories, providers] = await Promise.all([
    getPublishedCourses({ q, category, provider, level, price, cert, format, duration, page, pageSize: PAGE_SIZE }),
    getCategoriesWithCounts(),
    getProviderOptions(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function pageHref(p: number): string {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries({ q, category, provider, level, price, cert, format, duration })) {
      if (v) params.set(k, v);
    }
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return `/courses${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Courses" }]} />
      <h1 className="text-3xl font-bold text-brand-900">Explore Courses</h1>
      <p className="mt-2 max-w-2xl text-gray-600">
        Curated courses that help you build skills for jobs, scholarships, grants, fellowships and
        more.
      </p>

      <div className="mt-6 max-w-xl">
        <Suspense fallback={<div className="h-12 rounded-xl bg-gray-100" />}>
          <SearchBar />
        </Suspense>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
        {/* Filters sidebar (desktop) / top (mobile) */}
        <aside aria-label="Course filters" className="lg:order-1">
          <Suspense fallback={<div className="h-40 rounded-xl bg-gray-100" />}>
            <CourseFilters categories={categories} providers={providers} />
          </Suspense>
        </aside>

        {/* Results */}
        <section aria-label="Course results" className="lg:order-2">
          <p className="mb-4 text-sm text-gray-500" role="status">
            {total} course{total === 1 ? "" : "s"} found
            {q ? ` for "${q}"` : ""}
          </p>

          {courses.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center">
              <p className="font-medium text-gray-700">No courses match your filters.</p>
              <Link href="/courses" className="mt-2 inline-block text-sm font-semibold text-teal-700 hover:underline">
                Clear filters and browse all courses
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {courses.map((course, i) => (
                <CourseCard key={course.id} course={course} priority={i < 3} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <nav aria-label="Pagination" className="mt-10 flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={pageHref(p)}
                  aria-current={p === page ? "page" : undefined}
                  className={
                    p === page
                      ? "rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white"
                      : "rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:border-brand-400"
                  }
                >
                  {p}
                </Link>
              ))}
            </nav>
          )}
        </section>
      </div>
    </div>
  );
}
