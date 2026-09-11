import { createClient } from "@/lib/supabase/server";
import { saveProvider, deleteProvider } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminProvidersPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const error = typeof sp.error === "string" ? sp.error : undefined;

  let providers: any[] = [];
  try {
    const db = await createClient();
    const { data } = await db
      .from("providers")
      .select("*")
      .order("name", { ascending: true });

    if (data) {
      // Get course counts for each provider
      providers = await Promise.all(
        data.map(async (p: any) => {
          const { count } = await db
            .from("courses")
            .select("id", { count: "exact", head: true })
            .eq("provider_id", p.id);
          return { ...p, _count: { courses: count || 0 } };
        })
      );
    }
  } catch {
    // Database not available
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-900">Providers</h1>
      <p className="mt-1 text-sm text-gray-500">
        Course providers and affiliate networks. Commission notes are private admin data — never
        shown publicly.
      </p>

      {error && (
        <p role="alert" className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error === "has-courses" &&
            "Cannot delete a provider that still has courses. Move or delete its courses first."}
          {error === "duplicate" && "A provider with this name already exists."}
          {error === "invalid" && "Invalid provider data. Check the fields and try again."}
          {error === "database" && "Could not save — database is not running. Start PostgreSQL and try again."}
        </p>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[380px_1fr]">
        {/* Add form */}
        <section className="h-fit rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="font-semibold text-brand-900">Add Provider</h2>
          <form action={saveProvider} className="mt-4 space-y-4">
            <label className="block text-sm">
              <span className="font-medium text-gray-700">Name *</span>
              <input name="name" required className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-gray-700">Website URL</span>
              <input name="websiteUrl" type="url" placeholder="https://..." className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-gray-700">Description</span>
              <textarea name="description" rows={2} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-gray-700">Commission note (private)</span>
              <textarea name="commissionNote" rows={2} placeholder="e.g. 30% CPA via network X — admin only" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            </label>
            <button type="submit" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
              Add Provider
            </button>
          </form>
        </section>

        {/* List */}
        <section className="space-y-3">
          {providers.map((p) => (
            <details key={p.id} className="rounded-xl border border-gray-200 bg-white p-4">
              <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-2">
                <span className="font-medium text-brand-800">{p.name}</span>
                <span className="text-xs text-gray-400">
                  {p._count.courses} course{p._count.courses === 1 ? "" : "s"} · /{p.slug}
                </span>
              </summary>
              <form action={saveProvider} className="mt-4 space-y-3">
                <input type="hidden" name="id" value={p.id} />
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block text-sm">
                    <span className="font-medium text-gray-700">Name</span>
                    <input name="name" defaultValue={p.name} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                  </label>
                  <label className="block text-sm">
                    <span className="font-medium text-gray-700">Website URL</span>
                    <input name="websiteUrl" type="url" defaultValue={p.website_url ?? ""} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                  </label>
                </div>
                <label className="block text-sm">
                  <span className="font-medium text-gray-700">Description</span>
                  <textarea name="description" rows={2} defaultValue={p.description ?? ""} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                </label>
                <label className="block text-sm">
                  <span className="font-medium text-gray-700">Commission note (private)</span>
                  <textarea name="commissionNote" rows={2} defaultValue={p.commission_note ?? ""} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                </label>
                <div className="flex gap-2">
                  <button type="submit" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
                    Save
                  </button>
                </div>
              </form>
              <form action={deleteProvider} className="mt-2">
                <input type="hidden" name="id" value={p.id} />
                <button type="submit" className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50">
                  Delete provider
                </button>
              </form>
            </details>
          ))}
          {providers.length === 0 && (
            <p className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
              No providers yet. Add your first provider to start listing courses.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
