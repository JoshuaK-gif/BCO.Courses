import Link from "next/link";
import { getAdminSession } from "@/lib/auth";

const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/courses", label: "Courses" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/providers", label: "Providers" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/settings", label: "Settings" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let session = null;
  try {
    session = await getAdminSession();
  } catch {
    // Session check failed — render without user info
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-lg font-bold text-brand-800">
              BCO Courses <span className="text-sm font-medium text-gray-400">Admin</span>
            </Link>
            <nav aria-label="Admin navigation" className="hidden gap-1 md:flex">
              {ADMIN_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-brand-700"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            {session && (
              <span className="hidden text-sm text-gray-500 sm:inline">
                Signed in as <strong>{session.email}</strong>
              </span>
            )}
            <form action="/api/admin/logout" method="post">
              <button
                type="submit"
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
        {/* Mobile nav row */}
        <nav aria-label="Admin mobile navigation" className="flex gap-1 overflow-x-auto px-4 pb-2 md:hidden">
          {ADMIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</div>
    </div>
  );
}
