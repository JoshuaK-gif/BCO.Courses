import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

export default function AdminSettingsPage() {
  const rows = [
    { key: "NEXT_PUBLIC_SUPABASE_URL", desc: "Supabase project URL.", example: "https://your-project.supabase.co" },
    { key: "NEXT_PUBLIC_SUPABASE_ANON_KEY", desc: "Supabase anonymous/public key.", example: "eyJhbGciOi..." },
    { key: "SUPABASE_SERVICE_ROLE_KEY", desc: "Supabase service role key (server-side only, never exposed to browser).", example: "eyJhbGciOi..." },
    { key: "ADMIN_USERNAME", desc: "Admin login username.", example: "bcoadmin" },
    { key: "ADMIN_PASSWORD", desc: "Admin login password (or use ADMIN_PASSWORD_HASH for a bcrypt hash).", example: "a-strong-password" },
    { key: "AUTH_SECRET", desc: "Secret used to sign admin session cookies. Use a long random string.", example: "openssl rand -hex 32" },
    { key: "NEXT_PUBLIC_SITE_URL", desc: "Public base URL used for SEO canonicals and sitemap.", example: SITE.url },
  ];

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-brand-900">Settings</h1>
      <p className="mt-1 text-sm text-gray-500">
        BCO Courses v1 is configured through environment variables — no secrets are stored in the
        database.
      </p>

      <section className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
              <th className="px-4 py-3">Environment Variable</th>
              <th className="px-4 py-3">Purpose</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key} className="border-b border-gray-100 last:border-0">
                <td className="px-4 py-3">
                  <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-semibold text-brand-800">{row.key}</code>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {row.desc}
                  <span className="mt-0.5 block text-xs text-gray-400">e.g. {row.example}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mt-8 rounded-xl border border-brand-100 bg-brand-50 p-6">
        <h2 className="font-semibold text-brand-900">Deployment Checklist</h2>
        <ul className="mt-3 space-y-2 text-sm text-gray-700">
          <li>1. Create a Supabase project and set <code className="rounded bg-white px-1">NEXT_PUBLIC_SUPABASE_URL</code> and <code className="rounded bg-white px-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.</li>
          <li>2. Run the SQL migration in the Supabase SQL Editor (see <code className="rounded bg-white px-1">supabase/migrations/001_initial_schema.sql</code>).</li>
          <li>3. Set <code className="rounded bg-white px-1">ADMIN_USERNAME</code>, <code className="rounded bg-white px-1">ADMIN_PASSWORD</code> and a strong <code className="rounded bg-white px-1">AUTH_SECRET</code>.</li>
          <li>4. Set <code className="rounded bg-white px-1">NEXT_PUBLIC_SITE_URL</code> to the final domain (e.g. https://courses.bridgecollectiveopport.org).</li>
          <li>5. Replace seeded sample courses with real courses and verified affiliate URLs.</li>
          <li>6. Add the &quot;Courses&quot; button on the main BCO website linking here.</li>
        </ul>
      </section>
    </div>
  );
}
