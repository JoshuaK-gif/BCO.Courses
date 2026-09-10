import { Prisma } from "@prisma/client";

export type CourseWithRelations = Prisma.CourseGetPayload<{
  include: { category: true; provider: true };
}>;

export const SITE = {
  name: "BCO Courses",
  tagline: "Learn. Prepare. Take Your Next Opportunity.",
  parentBrand: "Bridge Collective Opportunities",
  parentBrandShort: "BCO",
  // Main BCO platform — the only connection between the two products
  bcoUrl: "https://www.bridgecollectiveopport.org/",
  description:
    "Discover courses that help you build the skills, knowledge and confidence you need to pursue jobs, scholarships, grants, fellowships, internships and other opportunities.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://courses.bridgecollectiveopport.org",
};

export const AFFILIATE_DISCLOSURE_SHORT =
  "Affiliate Disclosure: Some links on BCO Courses are affiliate links. We may earn a commission if you purchase or enroll through our links, at no additional cost to you.";

export const LEVELS = ["Beginner", "Intermediate", "Advanced", "All Levels"] as const;
export const FORMATS = ["Self-paced", "Instructor-led", "Online"] as const;

export const DURATION_FILTERS = [
  { value: "short", label: "Under 5 hours" },
  { value: "medium", label: "5–20 hours" },
  { value: "long", label: "20+ hours" },
] as const;

export const PAGE_SIZE = 12;

export function formatPrice(price: number | null | undefined, currency: string, isFree: boolean): string {
  if (isFree || price === 0) return "Free";
  if (price == null) return "See provider";
  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency: currency || "USD",
      maximumFractionDigits: price % 1 === 0 ? 0 : 2,
    }).format(price);
  } catch {
    return `${currency} ${price}`;
  }
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function buildCourseWhere(params: {
  q?: string;
  category?: string;
  provider?: string;
  level?: string;
  price?: string;
  cert?: string;
  format?: string;
  duration?: string;
}): Prisma.CourseWhereInput {
  const where: Prisma.CourseWhereInput = { published: true };

  if (params.q?.trim()) {
    const q = params.q.trim();
    where.OR = [
      { title: { contains: q } },
      { shortDescription: { contains: q } },
      { description: { contains: q } },
      { category: { name: { contains: q } } },
      { provider: { name: { contains: q } } },
    ];
  }
  if (params.category) where.category = { slug: params.category };
  if (params.provider) where.provider = { slug: params.provider };
  if (params.level) where.level = params.level;
  if (params.price === "free") where.isFree = true;
  if (params.price === "paid") where.isFree = false;
  if (params.cert === "yes") where.certificate = true;
  if (params.cert === "no") where.certificate = false;
  if (params.format) where.format = params.format;
  if (params.duration === "short") {
    // Under 5 hours: match durations containing "hour" but exclude "20" or higher numbers
    where.duration = { contains: "hour" };
    where.AND = [
      { duration: { not: { contains: "20" } } },
      { duration: { not: { contains: "30" } } },
      { duration: { not: { contains: "40" } } },
      { duration: { not: { contains: "50" } } },
    ];
  } else if (params.duration === "medium") {
    // 5-20 hours: match durations containing "5" through "19" hours
    where.duration = { contains: "hour" };
    where.AND = [
      { duration: { not: { contains: "20" } } },
      { duration: { not: { contains: "30" } } },
      { duration: { not: { contains: "40" } } },
      { duration: { not: { contains: "50" } } },
    ];
  } else if (params.duration === "long") {
    // 20+ hours: match durations containing "20" or higher numbers
    where.OR = [
      { duration: { contains: "20 hour" } },
      { duration: { contains: "30 hour" } },
      { duration: { contains: "40 hour" } },
      { duration: { contains: "50 hour" } },
    ];
  }

  return where;
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
