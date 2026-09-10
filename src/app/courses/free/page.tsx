import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import CourseCard from "@/components/CourseCard";
import { getFreeCourses } from "@/lib/queries";
import { PAGE_SIZE } from "@/lib/site";

type SP = Promise<Record<string, string | string[] | undefined>>;

export const metadata: Metadata = {
  title: "Free Courses",
  description:
    "Start learning for free. Browse free courses that build skills for jobs, scholarships, grants, fellowships and more.",
  alternates: { canonical: "/courses/free" },
};

export const dynamic = "force-dynamic";

export default async function FreeCoursesPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const page = Math.max(1, Number(Array.isArray(sp.page) ? sp.page[0] : sp.page) || 1);
  const { courses, total } = await getFreeCourses(PAGE_SIZE, page);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Courses", href: "/courses" }, { label: "Free Courses" }]} />
      <h1 className="text-3xl font-bold text-brand-900">Free Courses</h1>
      <p className="mt-2 max-w-2xl text-gray-600">
        Not ready to invest yet? Start with a free course and begin building the skills you need
        for your next opportunity. All courses listed here are genuinely free to take.
      </p>

      {courses.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-gray-300 p-10 text-center text-gray-600">
          No free courses have been added yet. Check back soon.
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, i) => (
            <CourseCard key={course.id} course={course} priority={i < 3} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav aria-label="Pagination" className="mt-10 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`/courses/free?page=${p}`}
              aria-current={p === page ? "page" : undefined}
              className={
                p === page
                  ? "rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white"
                  : "rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:border-brand-400"
              }
            >
              {p}
            </a>
          ))}
        </nav>
      )}
    </div>
  );
}
