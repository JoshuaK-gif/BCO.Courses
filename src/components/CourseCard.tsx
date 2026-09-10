import Image from "next/image";
import Link from "next/link";
import type { CourseWithRelations } from "@/lib/site";
import { formatPrice, cn } from "@/lib/site";

export default function CourseCard({
  course,
  priority = false,
}: {
  course: CourseWithRelations;
  priority?: boolean;
}) {
  const price = formatPrice(course.price, course.currency, course.isFree);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg hover:border-brand-200">
      <Link href={`/courses/${course.slug}`} className="relative block aspect-video overflow-hidden bg-brand-50">
        {course.imageUrl ? (
          <Image
            src={course.imageUrl}
            alt={course.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform group-hover:scale-[1.03]"
            priority={priority}
          />
        ) : (
          <span className="flex h-full items-center justify-center text-4xl" aria-hidden="true">
            {course.category.icon || "🎓"}
          </span>
        )}
        {course.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 px-2.5 py-1 text-xs font-bold text-white shadow">
            BCO Featured
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-2 text-xs">
          <Link
            href={`/courses/category/${course.category.slug}`}
            className="rounded-full bg-brand-100 px-2.5 py-1 font-semibold text-brand-700 transition-colors hover:bg-brand-200"
          >
            {course.category.name}
          </Link>
          {course.level && (
            <span className="rounded-full bg-gray-100 px-2.5 py-1 font-medium text-gray-600">
              {course.level}
            </span>
          )}
        </div>

        <h3 className="mt-3 text-base font-semibold leading-snug text-brand-900">
          <Link href={`/courses/${course.slug}`} className="transition-colors hover:text-brand-600">
            {course.title}
          </Link>
        </h3>

        <p className="mt-2 line-clamp-2 text-sm text-gray-600">{course.shortDescription}</p>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
          <span className="font-medium text-gray-700">{course.provider.name}</span>
          {course.duration && <span>· {course.duration}</span>}
          {course.certificate && <span className="text-teal-600">· Certificate</span>}
          {course.rating != null && <span>· ⭐ {course.rating.toFixed(1)}</span>}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
          <span className={cn("text-lg font-bold", course.isFree ? "text-teal-600" : "text-brand-800")}>
            {price}
          </span>
          <Link
            href={`/courses/${course.slug}`}
            className="btn-hover-fill rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:shadow-md"
          >
            View Course
          </Link>
        </div>
      </div>
    </article>
  );
}
