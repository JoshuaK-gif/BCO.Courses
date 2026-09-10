"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

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

const STORAGE_KEY = "bco_categories";

function loadCategories(): Category[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveCategories(cats: Category[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cats));
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function CategoriesClient({
  serverCategories,
  dbAvailable,
}: {
  serverCategories: Category[];
  dbAvailable: boolean;
}) {
  const [categories, setCategories] = useState<Category[]>(serverCategories);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [showOnHome, setShowOnHome] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!dbAvailable) {
      const stored = loadCategories();
      if (stored.length > 0) setCategories(stored);
    }
  }, [dbAvailable]);

  function addCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setError(null);

    const newCat: Category = {
      id: crypto.randomUUID(),
      name: name.trim(),
      slug: slugify(name),
      description: description || null,
      icon: icon || null,
      sortOrder,
      showOnHome,
      courseCount: 0,
    };

    const updated = [...categories, newCat].sort((a, b) => a.sortOrder - b.sortOrder);
    setCategories(updated);
    saveCategories(updated);
    setName("");
    setDescription("");
    setIcon("");
    setSortOrder(0);
    setShowOnHome(true);
  }

  function deleteCategory(id: string) {
    const updated = categories.filter((c) => c.id !== id);
    setCategories(updated);
    saveCategories(updated);
  }

  function renameCategory(id: string, newName: string) {
    const updated = categories.map((c) =>
      c.id === id ? { ...c, name: newName, slug: slugify(newName) } : c
    );
    setCategories(updated);
    saveCategories(updated);
  }

  return (
    <div>
      {!dbAvailable && (
        <p className="mb-4 rounded-lg bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
          Database is not running. Categories are saved to localStorage (browser only).
        </p>
      )}

      {error && (
        <p role="alert" className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[380px_1fr]">
        {/* Add form */}
        <section className="h-fit rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="font-semibold text-brand-900">Add Category</h2>
          <form onSubmit={addCategory} className="mt-4 space-y-4">
            <label className="block text-sm">
              <span className="font-medium text-gray-700">Name *</span>
              <input
                name="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-gray-700">Description</span>
              <textarea
                name="description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium text-gray-700">Sort order</span>
                <input
                  name="sortOrder"
                  type="number"
                  min={0}
                  value={sortOrder}
                  onChange={(e) => setSortOrder(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </label>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showOnHome}
                onChange={(e) => setShowOnHome(e.target.checked)}
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
              {categories.map((cat) => (
                <tr key={cat.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {cat.icon && <span aria-hidden="true">{cat.icon}</span>}
                      <input
                        defaultValue={cat.name}
                        onBlur={(e) => renameCategory(cat.id, e.target.value)}
                        aria-label={`Rename ${cat.name}`}
                        className="w-44 rounded-md border border-transparent px-2 py-1 font-medium text-brand-800 hover:border-gray-300 focus:border-brand-400 focus:outline-none"
                      />
                    </div>
                    <p className="mt-0.5 text-xs text-gray-400">/{cat.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{cat.courseCount}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => deleteCategory(cat.id)}
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
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
