import Link from "next/link";
import { getAdminStats, getTopCoursesByClicks } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  let stats = { published: 0, drafts: 0, featured: 0, categories: 0, providers: 0, clicks: 0, views: 0 };
  let topCourses: { slug: string; title: string; clicks: number }[] = [];

  try {
    [stats, topCourses] = await Promise.all([
      getAdminStats(),
      getTopCoursesByClicks(5),
    ]);
  } catch {
    // Database not available — show zeroed stats
  }

  const cards = [
    { label: "Published Courses", value: stats.published, href: "/admin/courses" },
    { label: "Drafts", value: stats.drafts, href: "/admin/courses" },
    { label: "Featured", value: stats.featured, href: "/admin/courses" },
    { label: "Categories", value: stats.categories, href: "/admin/categories" },
    { label: "Providers", value: stats.providers, href: "/admin/providers" },
    { label: "Affiliate Clicks", value: stats.clicks, href: "/admin/analytics" },
    { label: "Course Views", value: stats.views, href: "/admin/analytics" },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Overview of the BCO Courses platform.
          </p>
        </div>
        <Link
          href="/admin/courses/new"
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          + Add Course
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md"
          >
            <p className="text-sm font-medium text-gray-500">{card.label}</p>
            <p className="mt-1 text-3xl font-bold text-brand-800">{card.value.toLocaleString()}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-brand-900">Top Courses (by affiliate clicks)</h2>
            <Link href="/admin/analytics" className="text-sm font-medium text-teal-700 hover:underline">
              Full analytics →
            </Link>
          </div>
          {topCourses.length === 0 ? (
            <p className="mt-4 text-sm text-gray-500">
              No click data yet. Analytics will appear as visitors engage with course pages.
            </p>
          ) : (
            <table className="mt-4 w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs uppercase text-gray-400">
                  <th className="pb-2">Course</th>
                  <th className="pb-2 text-right">Clicks</th>
                </tr>
              </thead>
              <tbody>
                {topCourses.map((c) => (
                  <tr key={c.slug} className="border-b border-gray-50 last:border-0">
                    <td className="py-2 pr-2">
                      <Link href={`/courses/${c.slug}`} className="font-medium text-gray-800 hover:text-brand-600">
                        {c.title}
                      </Link>
                    </td>
                    <td className="py-2 text-right font-semibold text-gray-700">{c.clicks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="font-semibold text-brand-900">Quick Checklist</h2>
          <ul className="mt-4 space-y-3 text-sm text-gray-700">
            <li className="flex gap-2">
              <span aria-hidden="true">🔐</span>
              <span>
                Set <code className="rounded bg-gray-100 px-1">ADMIN_PASSWORD</code> and{" "}
                <code className="rounded bg-gray-100 px-1">AUTH_SECRET</code> env vars before deploying.
              </span>
            </li>
            <li className="flex gap-2">
              <span aria-hidden="true">🎓</span>
              <span>
                Replace sample courses with real affiliate links via{" "}
                <Link href="/admin/courses" className="font-medium text-brand-600 hover:underline">Courses</Link>.
              </span>
            </li>
            <li className="flex gap-2">
              <span aria-hidden="true">📊</span>
              <span>
                Verify courses regularly and set the <em>Last Verified</em> date to keep listings honest.
              </span>
            </li>
            <li className="flex gap-2">
              <span aria-hidden="true">🔗</span>
              <span>
                Point the main BCO website's Courses button at this domain when ready.
              </span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
