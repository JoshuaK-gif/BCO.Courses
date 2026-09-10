import Link from "next/link";
import { notFound } from "next/navigation";
import CourseForm from "@/components/admin/CourseForm";
import { db } from "@/lib/db";
import { getCategoriesWithCounts, getProviderOptions } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

export default async function EditCoursePage({ params }: { params: Params }) {
  const { id } = await params;

  let course: any = null;
  let categories: any[] = [];
  let providers: any[] = [];
  try {
    [course, categories, providers] = await Promise.all([
      db.course.findUnique({ where: { id } }),
      getCategoriesWithCounts(),
      getProviderOptions(),
    ]);
  } catch {
    // Database not available
  }

  if (!course) notFound();

  return (
    <div>
      <nav className="mb-4 text-sm text-gray-500" aria-label="Breadcrumb">
        <Link href="/admin/courses" className="hover:text-brand-600">Courses</Link>
        <span aria-hidden="true"> / </span>
        <span className="font-medium text-gray-700">{course.title}</span>
      </nav>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-brand-900">Edit Course</h1>
        <Link
          href={`/courses/${course.slug}`}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          View public page ↗
        </Link>
      </div>
      <div className="mt-6 max-w-3xl">
        <CourseForm
          categories={categories}
          providers={providers}
          initial={{
            id: course.id,
            title: course.title,
            slug: course.slug,
            shortDescription: course.shortDescription,
            description: course.description,
            categoryId: course.categoryId,
            providerId: course.providerId,
            level: course.level,
            price: course.price,
            currency: course.currency,
            isFree: course.isFree,
            duration: course.duration,
            certificate: course.certificate,
            language: course.language,
            format: course.format,
            imageUrl: course.imageUrl,
            learningOutcomes: typeof course.learningOutcomes === 'string' ? JSON.parse(course.learningOutcomes) : course.learningOutcomes,
            targetAudience: typeof course.targetAudience === 'string' ? JSON.parse(course.targetAudience) : course.targetAudience,
            whyRecommended: course.whyRecommended,
            affiliateUrl: course.affiliateUrl,
            externalCourseUrl: course.externalCourseUrl,
            rating: course.rating,
            featured: course.featured,
            published: course.published,
            lastVerified: course.lastVerified,
          }}
        />
      </div>
    </div>
  );
}
