export type CourseWithRelations = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  categoryId: string;
  providerId: string;
  level: string | null;
  price: number | null;
  currency: string;
  isFree: boolean;
  duration: string | null;
  certificate: boolean;
  language: string | null;
  format: string | null;
  imageUrl: string | null;
  learningOutcomes: string;
  targetAudience: string;
  whyRecommended: string | null;
  affiliateUrl: string | null;
  externalCourseUrl: string | null;
  rating: number | null;
  featured: boolean;
  published: boolean;
  lastVerified: string | null;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
    sortOrder: number;
    showOnHome: boolean;
  };
  provider: {
    id: string;
    name: string;
    slug: string;
    websiteUrl: string | null;
    logoUrl: string | null;
    description: string | null;
  };
};

export const SITE = {
  name: "BCO Courses",
  tagline: "Learn. Prepare. Take Your Next Opportunity.",
  parentBrand: "Bridge Collective Opportunities",
  parentBrandShort: "BCO",
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

export type CourseFilters = {
  q?: string;
  category?: string;
  provider?: string;
  level?: string;
  price?: string;
  cert?: string;
  format?: string;
  duration?: string;
};

export function buildCourseFilters(params: CourseFilters) {
  return params;
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
