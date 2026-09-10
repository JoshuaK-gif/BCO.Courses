import { getCategoriesWithCounts } from "@/lib/queries";
import CategoriesClient from "@/components/admin/CategoriesClient";

export const dynamic = "force-dynamic";

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminCategoriesPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const error = typeof sp.error === "string" ? sp.error : undefined;

  let categories: any[] = [];
  let dbAvailable = true;
  try {
    categories = await getCategoriesWithCounts();
  } catch {
    dbAvailable = false;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-900">Categories</h1>
      <p className="mt-1 text-sm text-gray-500">
        Categories organize courses and power category SEO pages.
      </p>

      {error && (
        <p role="alert" className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error === "has-courses" &&
            "Cannot delete a category that still has courses. Move or delete its courses first."}
          {error === "duplicate" && "A category with this name already exists."}
          {error === "invalid" && "Invalid category data. Check the name and try again."}
          {error === "database" && "Could not save — database is not running. Start PostgreSQL and try again."}
        </p>
      )}

      <CategoriesClient serverCategories={categories} dbAvailable={dbAvailable} />
    </div>
  );
}
