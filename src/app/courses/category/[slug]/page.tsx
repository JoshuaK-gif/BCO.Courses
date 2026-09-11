import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import SearchBar from "@/components/SearchBar";
import CourseFilters from "@/components/CourseFilters";
import CourseCard from "@/components/CourseCard";
import { PAGE_SIZE } from "@/lib/site";
import {
  getPublishedCourses,
  getCategoryBySlug,
  getCategoriesWithCounts,
  getProviderOptions,
} from "@/lib/queries";

type Params = Promise<{ slug: string }>;
type SP = Promise<Record<string, string | string[] | undefined>>;

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Category Not Found" };
  return {
    title: `${category.name} Courses`,
    description:
      category.description ||
      `Curated ${category.name.toLowerCase()} courses that help you build skills for real-world opportunities.`,
    alternates: { canonical: `/courses/category/${category.slug}` },
  };
}

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SP;
}) {
  const { slug } = await params;
  const sp = await searchParams;

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const q = first(sp.q);
  const provider = first(sp.provider);
  const level = first(sp.level);
  const price = first(sp.price);
  const cert = first(sp.cert);
  const format = first(sp.format);
  const duration = first(sp.duration);
  const page = Math.max(1, Number(first(sp.page)) || 1);

  const [{ courses, total }, categories, providers] = await Promise.all([
    getPublishedCourses({ category: slug, q, provider, level, price, cert, format, duration, page, pageSize: PAGE_SIZE }),
    getCategoriesWithCounts(),
    getProviderOptions(),
  ]);

  const otherCategories = categories.filter((c) => c.slug !== slug).slice(0, 6);
  const isFiltered = Boolean(q || provider || level || price || cert || format || duration);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Courses", href: "/courses" },
          { label: category.name },
        ]}
      />

      {/* Category introduction (SEO) */}
      <header className="rounded-2xl bg-brand-50 p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Category</p>
        <h1 className="mt-1 text-3xl font-bold text-brand-900">
          {category.icon && <span aria-hidden="true" className="mr-2">{category.icon}</span>}
          {category.name} Courses
        </h1>
        {category.description && (
          <p className="mt-3 max-w-3xl leading-relaxed text-gray-700">{category.description}</p>
        )}
      </header>

      <div className="mt-6 max-w-xl">
        <SearchBar basePath={`/courses/category/${slug}`} />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside aria-label="Course filters">
          <CourseFilters
            categories={categories}
            providers={providers}
          />
        </aside>

        <section aria-label={`${category.name} courses`}>
          <p className="mb-4 text-sm text-gray-500" role="status">
            {total} course{total === 1 ? "" : "s"}
            {q ? ` matching "${q}"` : ""}
          </p>

          {courses.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center">
              <p className="font-medium text-gray-700">No courses match your filters yet.</p>
              <Link href={`/courses/category/${slug}`} className="mt-2 inline-block text-sm font-semibold text-teal-700 hover:underline">
                Clear filters
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {courses.map((course, i) => (
                <CourseCard key={course.id} course={course} priority={i < 3} />
              ))}
            </div>
          )}

          {isFiltered && (
            <Link
              href={`/courses/category/${slug}`}
              className="mt-6 inline-block text-sm font-semibold text-teal-700 hover:underline"
            >
              Clear filters and see all {category.name.toLowerCase()} courses
            </Link>
          )}
        </section>
      </div>

      {/* Related categories — internal linking for SEO */}
      <section className="mt-16" aria-labelledby="related-cats">
        <h2 id="related-cats" className="text-xl font-bold text-brand-900">Related Categories</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {otherCategories.map((c) => (
            <Link
              key={c.id}
              href={`/courses/category/${c.slug}`}
              className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:border-brand-400 hover:text-brand-700"
            >
              {c.icon && <span aria-hidden="true" className="mr-1">{c.icon}</span>}
              {c.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
