import Link from "next/link";
import { notFound } from "next/navigation";
import CourseForm from "@/components/admin/CourseForm";
import { createClient } from "@/lib/supabase/server";
import { getCategoriesWithCounts, getProviderOptions } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

export default async function EditCoursePage({ params }: { params: Params }) {
  const { id } = await params;

  let course: any = null;
  let categories: any[] = [];
  let providers: any[] = [];
  try {
    const db = await createClient();
    const [courseResult, catResult, provResult] = await Promise.all([
      db.from("courses").select("*").eq("id", id).single(),
      getCategoriesWithCounts(),
      getProviderOptions(),
    ]);
    course = courseResult.data;
    categories = catResult;
    providers = provResult;
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
            shortDescription: course.short_description,
            description: course.description,
            categoryId: course.category_id,
            providerId: course.provider_id,
            level: course.level,
            price: course.price,
            currency: course.currency,
            isFree: course.is_free,
            duration: course.duration,
            certificate: course.certificate,
            language: course.language,
            format: course.format,
            imageUrl: course.image_url,
            learningOutcomes: typeof course.learning_outcomes === 'string' ? JSON.parse(course.learning_outcomes) : course.learning_outcomes,
            targetAudience: typeof course.target_audience === 'string' ? JSON.parse(course.target_audience) : course.target_audience,
            whyRecommended: course.why_recommended,
            affiliateUrl: course.affiliate_url,
            externalCourseUrl: course.external_course_url,
            rating: course.rating,
            featured: course.featured,
            published: course.published,
            lastVerified: course.last_verified,
          }}
        />
      </div>
    </div>
  );
}
