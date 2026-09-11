import { saveCategory, deleteCategory } from "@/app/admin/actions";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sortOrder: number;
  showOnHome: boolean;
  courseCount: number;
};

export default function CategoriesClient({
  serverCategories,
}: {
  serverCategories: Category[];
  dbAvailable: boolean;
}) {
  return (
    <div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[380px_1fr]">
        {/* Add form */}
        <section className="h-fit rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="font-semibold text-brand-900">Add Category</h2>
          <form action={saveCategory} className="mt-4 space-y-4">
            <label className="block text-sm">
              <span className="font-medium text-gray-700">Name *</span>
              <input
                name="name"
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-gray-700">Description</span>
              <textarea
                name="description"
                rows={3}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm">
                <span className="font-medium text-gray-700">Icon (emoji)</span>
                <input
                  name="icon"
                  maxLength={10}
                  placeholder="🎓"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium text-gray-700">Sort order</span>
                <input
                  name="sortOrder"
                  type="number"
                  min={0}
                  defaultValue={0}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </label>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="showOnHome"
                defaultChecked
                className="h-4 w-4"
              />
              <span className="font-medium text-gray-700">Show on homepage</span>
            </label>
            <button
              type="submit"
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Add Category
            </button>
          </form>
        </section>

        {/* List */}
        <section className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Courses</th>
                <th className="px-4 py-3 text-right">Manage</th>
              </tr>
            </thead>
            <tbody>
              {serverCategories.map((cat) => (
                <tr key={cat.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {cat.icon && <span aria-hidden="true">{cat.icon}</span>}
                      <span className="font-medium text-brand-800">{cat.name}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-gray-400">/{cat.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{cat.courseCount}</td>
                  <td className="px-4 py-3 text-right">
                    <form action={deleteCategory} className="inline">
                      <input type="hidden" name="id" value={cat.id} />
                      <button
                        type="submit"
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {serverCategories.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-10 text-center text-gray-500">
                    No categories yet. Add your first category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
