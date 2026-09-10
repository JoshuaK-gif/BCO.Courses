import Link from "next/link";
import { getAdminCourses } from "@/lib/queries";
import { toggleCourseField, deleteCourse } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminCoursesPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : undefined;
  const page = Math.max(1, Number(typeof sp.page === "string" ? sp.page : "1") || 1);

  let courses: any[] = [];
  let total = 0;
  let pageSize = 20;

  try {
    const result = await getAdminCourses({ q, page });
    courses = result.courses;
    total = result.total;
    pageSize = result.pageSize;
  } catch {
    // Database not available
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-900">Courses</h1>
          <p className="mt-1 text-sm text-gray-500">{total} courses total</p>
        </div>
        <Link
          href="/admin/courses/new"
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          + Add Course
        </Link>
      </div>

      <form method="get" className="mt-6 flex max-w-md gap-2">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search courses..."
          aria-label="Search courses"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none"
        />
        <button type="submit" className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white">
          Search
        </button>
      </form>

      <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full min-w-[800px] text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Clicks / Views</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c.id} className="border-b border-gray-100 last:border-0">
                <td className="px-4 py-3">
                  <Link href={`/admin/courses/${c.id}`} className="font-medium text-brand-800 hover:text-brand-600">
                    {c.title}
                  </Link>
                  <p className="text-xs text-gray-400">/{c.slug} · {c.provider.name}</p>
                </td>
                <td className="px-4 py-3 text-gray-600">{c.category.name}</td>
                <td className="px-4 py-3 text-gray-600">
                  {c.isFree ? "Free" : c.price != null ? `${c.currency} ${c.price}` : "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1">
                    <form action={toggleCourseField}>
                      <input type="hidden" name="id" value={c.id} />
                      <input type="hidden" name="field" value="published" />
                      <input type="hidden" name="value" value={c.published ? "false" : "true"} />
                      <button
                        type="submit"
                        className={
                          c.published
                            ? "rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-semibold text-teal-800"
                            : "rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-semibold text-gray-600"
                        }
                      >
                        {c.published ? "Published" : "Draft"}
                      </button>
                    </form>
                    <form action={toggleCourseField}>
                      <input type="hidden" name="id" value={c.id} />
                      <input type="hidden" name="field" value="featured" />
                      <input type="hidden" name="value" value={c.featured ? "false" : "true"} />
                      <button
                        type="submit"
                        className={
                          c.featured
                            ? "rounded-full bg-gold-100 px-2.5 py-0.5 text-xs font-semibold text-gold-800"
                            : "rounded-full border border-gray-200 px-2.5 py-0.5 text-xs text-gray-500"
                        }
                      >
                        {c.featured ? "★ Featured" : "☆ Feature"}
                      </button>
                    </form>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {c._count.clicks} / {c._count.views}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/courses/${c.slug}`}
                      className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/courses/${c.id}`}
                      className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700"
                    >
                      Edit
                    </Link>
                    <form action={deleteCourse}>
                      <input type="hidden" name="id" value={c.id} />
                      <button
                        type="submit"
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {courses.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-gray-500">
                  No courses found. Add your first course.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <nav aria-label="Pagination" className="mt-6 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/courses?${q ? `q=${encodeURIComponent(q)}&` : ""}page=${p}`}
              aria-current={p === page ? "page" : undefined}
              className={
                p === page
                  ? "rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white"
                  : "rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:border-brand-400"
              }
            >
              {p}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
