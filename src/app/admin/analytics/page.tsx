import Link from "next/link";
import {
  getAdminStats,
  getTopCoursesByClicks,
  getTopCategoriesByClicks,
  getTopProvidersByClicks,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  let stats = { published: 0, drafts: 0, featured: 0, categories: 0, providers: 0, clicks: 0, views: 0 };
  let topCourses: any[] = [];
  let topCategories: any[] = [];
  let topProviders: any[] = [];

  try {
    [stats, topCourses, topCategories, topProviders] = await Promise.all([
      getAdminStats(),
      getTopCoursesByClicks(10),
      getTopCategoriesByClicks(6),
      getTopProvidersByClicks(6),
    ]);
  } catch {
    // Database not available
  }

  const overallCtr = stats.views > 0 ? (stats.clicks / stats.views) * 100 : 0;

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-900">Analytics</h1>
      <p className="mt-1 text-sm text-gray-500">
        Engagement and affiliate click performance. Clicks are recorded on this platform; only
        your affiliate networks can confirm actual sales/conversions.
      </p>

      {/* Summary cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm font-medium text-gray-500">Course Views</p>
          <p className="mt-1 text-3xl font-bold text-brand-800">{stats.views.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm font-medium text-gray-500">Affiliate Clicks</p>
          <p className="mt-1 text-3xl font-bold text-teal-700">{stats.clicks.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm font-medium text-gray-500">Overall CTR</p>
          <p className="mt-1 text-3xl font-bold text-brand-800">{overallCtr.toFixed(1)}%</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm font-medium text-gray-500">Confirmed Sales</p>
          <p className="mt-1 text-lg font-semibold text-gray-600">
            Not tracked here
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Verify conversions in your affiliate network dashboards.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Top courses */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 lg:col-span-2">
          <h2 className="font-semibold text-brand-900">Top Courses</h2>
          {topCourses.length === 0 ? (
            <p className="mt-3 text-sm text-gray-500">
              No data yet. Views and clicks appear here as visitors engage with course pages.
            </p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[560px] text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-xs uppercase text-gray-400">
                    <th className="pb-2">Course</th>
                    <th className="pb-2 text-right">Views</th>
                    <th className="pb-2 text-right">Affiliate Clicks</th>
                    <th className="pb-2 text-right">CTR</th>
                  </tr>
                </thead>
                <tbody>
                  {topCourses.map((c) => (
                    <tr key={c.slug} className="border-b border-gray-50 last:border-0">
                      <td className="py-2.5 pr-2">
                        <Link href={`/courses/${c.slug}`} className="font-medium text-gray-800 hover:text-brand-600">
                          {c.title}
                        </Link>
                      </td>
                      <td className="py-2.5 text-right text-gray-600">{c.views.toLocaleString()}</td>
                      <td className="py-2.5 text-right font-semibold text-gray-700">{c.clicks.toLocaleString()}</td>
                      <td className="py-2.5 text-right text-gray-600">{c.ctr.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Top categories */}
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="font-semibold text-brand-900">Top Categories (by clicks)</h2>
          {topCategories.length === 0 ? (
            <p className="mt-3 text-sm text-gray-500">No click data yet.</p>
          ) : (
            <ul className="mt-4 space-y-2.5">
              {topCategories.map((c) => (
                <li key={c.name} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">{c.name}</span>
                  <span className="font-semibold text-gray-800">{c.clicks.toLocaleString()} clicks</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Top providers */}
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="font-semibold text-brand-900">Top Providers (by clicks)</h2>
          {topProviders.length === 0 ? (
            <p className="mt-3 text-sm text-gray-500">No click data yet.</p>
          ) : (
            <ul className="mt-4 space-y-2.5">
              {topProviders.map((p) => (
                <li key={p.name} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">{p.name}</span>
                  <span className="font-semibold text-gray-800">{p.clicks.toLocaleString()} clicks</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
