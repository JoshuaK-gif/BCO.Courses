"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { saveCourse, type ActionState } from "@/app/admin/actions";
import type { CategoryOption, ProviderOption } from "@/lib/queries";
import { LEVELS, FORMATS } from "@/lib/site";

export type CourseFormData = {
  id?: string;
  title?: string;
  slug?: string;
  shortDescription?: string;
  description?: string;
  categoryId?: string;
  providerId?: string;
  level?: string | null;
  price?: number | null;
  currency?: string;
  isFree?: boolean;
  duration?: string | null;
  certificate?: boolean;
  language?: string | null;
  format?: string | null;
  imageUrl?: string | null;
  learningOutcomes?: string[];
  targetAudience?: string[];
  whyRecommended?: string | null;
  affiliateUrl?: string | null;
  externalCourseUrl?: string | null;
  rating?: number | null;
  featured?: boolean;
  published?: boolean;
  lastVerified?: Date | string | null;
};

const inputCls =
  "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none";

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-gray-700">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-gray-400">{hint}</span>}
    </label>
  );
}

export default function CourseForm({
  categories,
  providers,
  initial,
}: {
  categories: CategoryOption[];
  providers: ProviderOption[];
  initial?: CourseFormData;
}) {
  const [result, setResult] = useState<ActionState | null>(null);
  const [pending, setPending] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(initial?.imageUrl ?? null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localCategories, setLocalCategories] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    if (categories.length === 0) {
      try {
        const stored = JSON.parse(localStorage.getItem("bco_categories") || "[]");
        setLocalCategories(stored.map((c: any) => ({ id: c.id, name: c.name })));
      } catch {}
    }
  }, [categories]);

  const displayCategories = categories.length > 0 ? categories : localCategories;

  async function handleImageUpload(file: File): Promise<string | null> {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok && data.url) {
        return data.url;
      }
      setResult({ error: data.error || "Upload failed" });
      return null;
    } catch {
      setResult({ error: "Upload failed. Please try again." });
      return null;
    } finally {
      setUploading(false);
    }
  }

  function onImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setImagePreview(preview);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setResult(null);
    const fd = new FormData(e.currentTarget);

    // Handle file upload
    const file = fd.get("imageFile") as File | null;
    if (file && file.size > 0) {
      const url = await handleImageUpload(file);
      if (url) {
        fd.set("imageUrl", url);
      } else {
        setPending(false);
        return;
      }
    }
    fd.delete("imageFile");

    const res = await saveCourse(fd);
    if (res && res.error) {
      setResult(res);
      setPending(false);
    }
  }

  const toDateInput = (d: Date | string | null | undefined) => {
    if (!d) return "";
    return new Date(d).toISOString().slice(0, 10);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {initial?.id && <input type="hidden" name="id" value={initial.id} />}

      {result?.error && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {result.error}
        </p>
      )}

      {/* Basics */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="font-semibold text-brand-900">Course Basics</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="Title *">
              <input name="title" required defaultValue={initial?.title} className={inputCls} />
            </Field>
          </div>
          <Field label="Slug" hint="Leave empty to auto-generate from title">
            <input name="slug" defaultValue={initial?.slug} className={inputCls} placeholder="grant-writing-for-beginners" />
          </Field>
          <Field label="Image" hint="Upload a file or enter a URL">
            <div className="mt-1 space-y-3">
              {imagePreview && (
                <div className="relative h-40 w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                  <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => { setImagePreview(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                    className="absolute top-2 right-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                name="imageFile"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={onImageChange}
                className="w-full text-sm text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand-700 hover:file:bg-brand-100"
              />
              <input name="imageUrl" type="url" defaultValue={initial?.imageUrl ?? ""} className={inputCls} placeholder="Or paste image URL..." />
            </div>
          </Field>
          <div className="sm:col-span-2">
            <Field label="Short description *" hint="1–2 sentences shown on cards (max 300 chars)">
              <textarea name="shortDescription" required maxLength={300} rows={2} defaultValue={initial?.shortDescription} className={inputCls} />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Full description *" hint="Use blank lines between paragraphs">
              <textarea name="description" required rows={6} defaultValue={initial?.description} className={inputCls} />
            </Field>
          </div>
        </div>
      </section>

      {/* Classification */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="font-semibold text-brand-900">Classification</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Category *">
            <select name="categoryId" required defaultValue={initial?.categoryId} className={inputCls}>
              <option value="">Select category…</option>
              {displayCategories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Provider *">
            <select name="providerId" required defaultValue={initial?.providerId} className={inputCls}>
              <option value="">Select provider…</option>
              {providers.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Level">
            <select name="level" defaultValue={initial?.level ?? ""} className={inputCls}>
              <option value="">Not specified</option>
              {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </Field>
          <Field label="Format">
            <select name="format" defaultValue={initial?.format ?? ""} className={inputCls}>
              <option value="">Not specified</option>
              {FORMATS.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </Field>
          <Field label="Duration" hint='e.g. "6 hours total" — only if known'>
            <input name="duration" defaultValue={initial?.duration ?? ""} className={inputCls} />
          </Field>
          <Field label="Language">
            <input name="language" defaultValue={initial?.language ?? ""} placeholder="English" className={inputCls} />
          </Field>
        </div>
      </section>

      {/* Pricing */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="font-semibold text-brand-900">Pricing & Certificate</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <label className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2.5 text-sm">
            <input type="checkbox" name="isFree" defaultChecked={initial?.isFree} className="h-4 w-4" />
            <span className="font-medium text-gray-700">This course is free</span>
          </label>
          <Field label="Price" hint="Ignored if free">
            <input name="price" type="number" step="0.01" min="0" defaultValue={initial?.price ?? ""} className={inputCls} />
          </Field>
          <Field label="Currency">
            <select name="currency" defaultValue={initial?.currency || "USD"} className={inputCls}>
              {["USD", "EUR", "GBP", "UGX", "KES", "ZAR", "NGN", "CAD", "AUD"].map((cur) => (
                <option key={cur} value={cur}>{cur}</option>
              ))}
            </select>
          </Field>
          <label className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2.5 text-sm">
            <input type="checkbox" name="certificate" defaultChecked={initial?.certificate} className="h-4 w-4" />
            <span className="font-medium text-gray-700">Certificate available</span>
          </label>
          <Field label="Rating (0–5)" hint="Only if provided by the provider — never invent">
            <input name="rating" type="number" step="0.1" min="0" max="5" defaultValue={initial?.rating ?? ""} className={inputCls} />
          </Field>
        </div>
      </section>

      {/* Editorial content */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="font-semibold text-brand-900">Editorial Content</h2>
        <div className="mt-4 space-y-4">
          <Field label="What you'll learn" hint="One bullet per line">
            <textarea name="learningOutcomes" rows={5} defaultValue={initial?.learningOutcomes?.join("\n")} className={inputCls} />
          </Field>
          <Field label="Who this course is for" hint="One bullet per line">
            <textarea name="targetAudience" rows={4} defaultValue={initial?.targetAudience?.join("\n")} className={inputCls} />
          </Field>
          <Field label="Why BCO recommends this course" hint="Editorial note shown publicly">
            <textarea name="whyRecommended" rows={3} defaultValue={initial?.whyRecommended ?? ""} className={inputCls} />
          </Field>
        </div>
      </section>

      {/* Links (sensitive) */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="font-semibold text-brand-900">Links & Tracking</h2>
        <p className="mt-1 text-xs text-gray-400">
          Affiliate URLs are stored in the database only and served through the tracked
          <code className="mx-1 rounded bg-gray-100 px-1">/go/[slug]</code> redirect.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Affiliate URL" hint="Where /go/[slug] redirects to">
            <input name="affiliateUrl" type="url" defaultValue={initial?.affiliateUrl ?? ""} className={inputCls} placeholder="https://provider.com/course?aff=..." />
          </Field>
          <Field label="External course URL (optional)" hint="Public non-affiliate info link">
            <input name="externalCourseUrl" type="url" defaultValue={initial?.externalCourseUrl ?? ""} className={inputCls} />
          </Field>
          <Field label="Last verified date" hint="When you last confirmed the course details">
            <input name="lastVerified" type="date" defaultValue={toDateInput(initial?.lastVerified)} className={inputCls} />
          </Field>
        </div>
      </section>

      {/* Status */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="font-semibold text-brand-900">Status</h2>
        <div className="mt-4 flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="published" defaultChecked={initial?.published ?? false} className="h-4 w-4" />
            <span className="font-medium text-gray-700">Published (visible to the public)</span>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="featured" defaultChecked={initial?.featured ?? false} className="h-4 w-4" />
            <span className="font-medium text-gray-700">Featured (BCO Featured badge)</span>
          </label>
        </div>
      </section>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {pending ? "Saving..." : initial?.id ? "Save Changes" : "Create Course"}
        </button>
        <a href="/admin/courses" className="text-sm font-medium text-gray-500 hover:text-gray-700">
          Cancel
        </a>
      </div>
    </form>
  );
}
