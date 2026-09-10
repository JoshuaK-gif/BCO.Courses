"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
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

  // Uniqueness check for slug
  const existing = await db.course.findUnique({ where: { slug: data.slug } });
  const currentId = str(formData, "id");
  if (existing && existing.id !== currentId) {
    return { error: "A course with this slug already exists." };
  }

  const record = {
    title: data.title,
    slug: data.slug,
    shortDescription: data.shortDescription,
    description: data.description,
    categoryId: data.categoryId,
    providerId: data.providerId,
    level: data.level,
    price: data.isFree ? 0 : data.price,
    currency: data.currency,
    isFree: data.isFree,
    duration: data.duration,
    certificate: data.certificate,
    language: data.language,
    format: data.format,
    imageUrl: data.imageUrl,
    learningOutcomes: JSON.stringify(data.learningOutcomes),
    targetAudience: JSON.stringify(data.targetAudience),
    whyRecommended: data.whyRecommended,
    affiliateUrl: data.affiliateUrl,
    externalCourseUrl: data.externalCourseUrl,
    rating: data.rating,
    featured: data.featured,
    published: data.published,
    lastVerified: data.lastVerified,
  };

  if (currentId) {
    await db.course.update({ where: { id: currentId }, data: record });
  } else {
    await db.course.create({ data: record });
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
  await db.course.delete({ where: { id } });
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
  
  await db.course.update({ where: { id }, data: { [field]: value } });
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

  try {
    if (id) {
      await db.category.update({ where: { id }, data });
    } else {
      await db.category.create({ data: { ...data, slug: slugify(data.name) } });
    }
  } catch (e: any) {
    if (e?.code === "P2002") {
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
  const count = await db.course.count({ where: { categoryId: id } });
  if (count > 0) {
    // Block deletion while courses reference it — safe default.
    redirect("/admin/categories?error=has-courses");
  }
  await db.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
  revalidatePath("/categories");
}

// ---- Providers ----

const providerSchema = z.object({
  name: z.string().min(2).max(100),
  websiteUrl: z.string().url().nullable(),
  logoUrl: z.string().url().nullable(),
  description: z.string().max(500).nullable(),
  commissionNote: z.string().max(500).nullable(), // admin-only data
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

  try {
    if (id) {
      await db.provider.update({ where: { id }, data });
    } else {
      await db.provider.create({ data: { ...data, slug: slugify(data.name) } });
    }
  } catch (e: any) {
    if (e?.code === "P2002") {
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
  const count = await db.course.count({ where: { providerId: id } });
  if (count > 0) {
    redirect("/admin/providers?error=has-courses");
  }
  await db.provider.delete({ where: { id } });
  revalidatePath("/admin/providers");
}
