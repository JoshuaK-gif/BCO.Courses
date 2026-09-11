"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function str(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}

function optStr(fd: FormData, key: string): string | null {
  const v = str(fd, key);
  return v === "" ? null : v;
}

function bool(fd: FormData, key: string): boolean {
  return fd.get(key) === "on" || fd.get(key) === "true";
}

function lines(fd: FormData, key: string): string[] {
  return str(fd, key)
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

const courseSchema = z.object({
  title: z.string().min(3).max(200),
  slug: z.string().min(3).max(200).regex(/^[a-z0-9-]+$/),
  shortDescription: z.string().min(10).max(300),
  description: z.string().min(20),
  categoryId: z.string().min(1),
  providerId: z.string().min(1),
  level: z.string().max(50).nullable(),
  price: z.number().nonnegative().nullable(),
  currency: z.string().min(3).max(3),
  isFree: z.boolean(),
  duration: z.string().max(100).nullable(),
  certificate: z.boolean(),
  language: z.string().max(50).nullable(),
  format: z.string().max(50).nullable(),
  imageUrl: z.string().max(500).nullable(),
  learningOutcomes: z.array(z.string().max(200)).max(12),
  targetAudience: z.array(z.string().max(200)).max(12),
  whyRecommended: z.string().max(1000).nullable(),
  affiliateUrl: z.string().url().nullable(),
  externalCourseUrl: z.string().url().nullable(),
  rating: z.number().min(0).max(5).nullable(),
  featured: z.boolean(),
  published: z.boolean(),
  lastVerified: z.date().nullable(),
});

function parseCourseForm(fd: FormData) {
  const priceRaw = str(fd, "price");
  const ratingRaw = str(fd, "rating");
  const lastVerifiedRaw = str(fd, "lastVerified");

  return courseSchema.safeParse({
    title: str(fd, "title"),
    slug: slugify(str(fd, "slug") || str(fd, "title")),
    shortDescription: str(fd, "shortDescription"),
    description: str(fd, "description"),
    categoryId: str(fd, "categoryId"),
    providerId: str(fd, "providerId"),
    level: optStr(fd, "level"),
    price: priceRaw === "" ? null : Number(priceRaw),
    currency: str(fd, "currency") || "USD",
    isFree: bool(fd, "isFree"),
    duration: optStr(fd, "duration"),
    certificate: bool(fd, "certificate"),
    language: optStr(fd, "language"),
    format: optStr(fd, "format"),
    imageUrl: optStr(fd, "imageUrl"),
    learningOutcomes: lines(fd, "learningOutcomes"),
    targetAudience: lines(fd, "targetAudience"),
    whyRecommended: optStr(fd, "whyRecommended"),
    affiliateUrl: optStr(fd, "affiliateUrl"),
    externalCourseUrl: optStr(fd, "externalCourseUrl"),
    rating: ratingRaw === "" ? null : Number(ratingRaw),
    featured: bool(fd, "featured"),
    published: bool(fd, "published"),
    lastVerified: lastVerifiedRaw === "" ? null : new Date(lastVerifiedRaw),
  });
}

export type ActionState = { error?: string; ok?: boolean };

export async function saveCourse(formData: FormData): Promise<ActionState> {
  await requireAdmin();

  const parsed = parseCourseForm(formData);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { error: `${issue.path.join(".") || "field"}: ${issue.message}` };
  }
  const data = parsed.data;
  const db = await createClient();

  // Uniqueness check for slug
  const { data: existing } = await db
    .from("courses")
    .select("id")
    .eq("slug", data.slug)
    .single();
  const currentId = str(formData, "id");
  if (existing && existing.id !== currentId) {
    return { error: "A course with this slug already exists." };
  }

  const record = {
    title: data.title,
    slug: data.slug,
    short_description: data.shortDescription,
    description: data.description,
    category_id: data.categoryId,
    provider_id: data.providerId,
    level: data.level,
    price: data.isFree ? 0 : data.price,
    currency: data.currency,
    is_free: data.isFree,
    duration: data.duration,
    certificate: data.certificate,
    language: data.language,
    format: data.format,
    image_url: data.imageUrl,
    learning_outcomes: JSON.stringify(data.learningOutcomes),
    target_audience: JSON.stringify(data.targetAudience),
    why_recommended: data.whyRecommended,
    affiliate_url: data.affiliateUrl,
    external_course_url: data.externalCourseUrl,
    rating: data.rating,
    featured: data.featured,
    published: data.published,
    last_verified: data.lastVerified?.toISOString() ?? null,
  };

  if (currentId) {
    await db.from("courses").update(record).eq("id", currentId);
  } else {
    await db.from("courses").insert(record);
  }

  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  revalidatePath(`/courses/${data.slug}`);
  redirect("/admin/courses");
}

export async function deleteCourse(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = str(formData, "id");
  if (!id) return;
  const db = await createClient();
  await db.from("courses").delete().eq("id", id);
  revalidatePath("/admin/courses");
  revalidatePath("/courses");
}

export async function toggleCourseField(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = str(formData, "id");
  const field = str(formData, "field");
  const value = bool(formData, "value");
  if (!id) return;

  const allowedFields = ["published", "featured"] as const;
  if (!allowedFields.includes(field as typeof allowedFields[number])) {
    return;
  }

  const db = await createClient();
  // Map camelCase field names to snake_case column names
  const columnMap: Record<string, string> = {
    published: "published",
    featured: "featured",
  };
  const column = columnMap[field] || field;
  await db.from("courses").update({ [column]: value }).eq("id", id);
  revalidatePath("/admin/courses");
  revalidatePath("/courses");
}

// ---- Categories ----

const categorySchema = z.object({
  name: z.string().min(2).max(80),
  description: z.string().max(500).nullable(),
  icon: z.string().max(10).nullable(),
  sortOrder: z.number().int().min(0).max(999),
  showOnHome: z.boolean(),
});

export async function saveCategory(formData: FormData): Promise<void> {
  await requireAdmin();
  const parsed = categorySchema.safeParse({
    name: str(formData, "name"),
    description: optStr(formData, "description"),
    icon: optStr(formData, "icon"),
    sortOrder: Number(str(formData, "sortOrder") || "0"),
    showOnHome: bool(formData, "showOnHome"),
  });
  const data = parsed.success ? parsed.data : null;
  if (!data) {
    redirect("/admin/categories?error=invalid");
  }
  const id = str(formData, "id");
  const db = await createClient();

  try {
    if (id) {
      await db.from("categories").update({
        name: data.name,
        description: data.description,
        icon: data.icon,
        sort_order: data.sortOrder,
        show_on_home: data.showOnHome,
      }).eq("id", id);
    } else {
      await db.from("categories").insert({
        name: data.name,
        slug: slugify(data.name),
        description: data.description,
        icon: data.icon,
        sort_order: data.sortOrder,
        show_on_home: data.showOnHome,
      });
    }
  } catch (e: any) {
    // Check for unique constraint violation (23505 is PostgreSQL unique_violation)
    if (e?.code === "23505" || e?.message?.includes("unique")) {
      redirect("/admin/categories?error=duplicate");
    }
    redirect("/admin/categories?error=database");
  }

  revalidatePath("/admin/categories");
  revalidatePath("/categories");
}

export async function deleteCategory(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = str(formData, "id");
  if (!id) return;
  const db = await createClient();

  const { count } = await db
    .from("courses")
    .select("id", { count: "exact", head: true })
    .eq("category_id", id);

  if (count && count > 0) {
    redirect("/admin/categories?error=has-courses");
  }
  await db.from("categories").delete().eq("id", id);
  revalidatePath("/admin/categories");
  revalidatePath("/categories");
}

// ---- Providers ----

const providerSchema = z.object({
  name: z.string().min(2).max(100),
  websiteUrl: z.string().url().nullable(),
  logoUrl: z.string().url().nullable(),
  description: z.string().max(500).nullable(),
  commissionNote: z.string().max(500).nullable(),
});

export async function saveProvider(formData: FormData): Promise<void> {
  await requireAdmin();
  const parsed = providerSchema.safeParse({
    name: str(formData, "name"),
    websiteUrl: optStr(formData, "websiteUrl"),
    logoUrl: optStr(formData, "logoUrl"),
    description: optStr(formData, "description"),
    commissionNote: optStr(formData, "commissionNote"),
  });
  const data = parsed.success ? parsed.data : null;
  if (!data) {
    redirect("/admin/providers?error=invalid");
  }
  const id = str(formData, "id");
  const db = await createClient();

  try {
    if (id) {
      await db.from("providers").update({
        name: data.name,
        website_url: data.websiteUrl,
        logo_url: data.logoUrl,
        description: data.description,
        commission_note: data.commissionNote,
      }).eq("id", id);
    } else {
      await db.from("providers").insert({
        name: data.name,
        slug: slugify(data.name),
        website_url: data.websiteUrl,
        logo_url: data.logoUrl,
        description: data.description,
        commission_note: data.commissionNote,
      });
    }
  } catch (e: any) {
    if (e?.code === "23505" || e?.message?.includes("unique")) {
      redirect("/admin/providers?error=duplicate");
    }
    redirect("/admin/providers?error=database");
  }

  revalidatePath("/admin/providers");
}

export async function deleteProvider(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = str(formData, "id");
  if (!id) return;
  const db = await createClient();

  const { count } = await db
    .from("courses")
    .select("id", { count: "exact", head: true })
    .eq("provider_id", id);

  if (count && count > 0) {
    redirect("/admin/providers?error=has-courses");
  }
  await db.from("providers").delete().eq("id", id);
  revalidatePath("/admin/providers");
}
