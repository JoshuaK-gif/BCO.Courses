import Link from "next/link";
import CourseForm from "@/components/admin/CourseForm";
import { getCategoriesWithCounts, getProviderOptions } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function NewCoursePage() {
  let categories: any[] = [];
  let providers: any[] = [];
  try {
    [categories, providers] = await Promise.all([
      getCategoriesWithCounts(),
      getProviderOptions(),
    ]);
  } catch {
    // Database not available
  }

  return (
    <div>
      <nav className="mb-4 text-sm text-gray-500" aria-label="Breadcrumb">
        <Link href="/admin/courses" className="hover:text-brand-600">Courses</Link>
        <span aria-hidden="true"> / </span>
        <span className="font-medium text-gray-700">New Course</span>
      </nav>
      <h1 className="text-2xl font-bold text-brand-900">Add New Course</h1>
      <p className="mt-1 text-sm text-gray-500">
        Fill in verified details only. Leave fields empty when information is unavailable —
        nothing fake is shown to users.
      </p>
      <div className="mt-6 max-w-3xl">
        <CourseForm categories={categories} providers={providers} />
      </div>
    </div>
  );
}
