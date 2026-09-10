import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getCategoriesWithCounts } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Course Categories",
  description:
    "Explore course categories: grant writing, scholarships, career development, freelancing, remote work, entrepreneurship and more.",
  alternates: { canonical: "/categories" },
};

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await getCategoriesWithCounts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Categories" }]} />
      <h1 className="text-3xl font-bold text-brand-900">Browse by Category</h1>
      <p className="mt-2 max-w-2xl text-gray-600">
        Every category is organized around opportunities BCO users pursue. Pick the skill you want
        to build next.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/courses/category/${cat.slug}`}
            className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <span className="text-3xl" aria-hidden="true">{cat.icon || "🎓"}</span>
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                {cat.courseCount} course{cat.courseCount === 1 ? "" : "s"}
              </span>
            </div>
            <h2 className="mt-4 text-lg font-semibold text-brand-900 group-hover:text-brand-600">
              {cat.name}
            </h2>
            {cat.description && (
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-600">
                {cat.description}
              </p>
            )}
            <span className="mt-4 inline-block text-sm font-semibold text-teal-700">
              Explore {cat.name} courses →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
