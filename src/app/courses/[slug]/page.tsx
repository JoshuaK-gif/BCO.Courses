import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import AffiliateCTA from "@/components/AffiliateCTA";
import CourseCard from "@/components/CourseCard";
import TrackView from "@/components/TrackView";
import { getCourseBySlug, getRelatedCourses } from "@/lib/queries";
import { SITE, formatPrice, formatDate } from "@/lib/site";

type Params = Promise<{ slug: string }>;

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return { title: "Course Not Found" };

  const title = `${course.title} — ${course.provider.name}`;
  const description =
    course.shortDescription ||
    `${course.title} course by ${course.provider.name}. See level, duration, certificate, price and whether BCO recommends it.`;

  return {
    title,
    description,
    alternates: { canonical: `/courses/${course.slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      url: `${SITE.url}/courses/${course.slug}`,
      images: course.imageUrl ? [{ url: course.imageUrl }] : undefined,
    },
  };
}

export default async function CoursePage({ params }: { params: Params }) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const related = await getRelatedCourses(course, 6);
  const price = formatPrice(course.price, course.currency, course.isFree);

  // Structured data (only verifiable fields — never invent ratings)
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.shortDescription || course.description.slice(0, 300),
    provider: {
      "@type": "Organization",
      name: course.provider.name,
      ...(course.provider.websiteUrl ? { sameAs: course.provider.websiteUrl } : {}),
    },
    ...(course.level ? { educationalLevel: course.level } : {}),
    ...(course.isFree
      ? { offers: { "@type": "Offer", price: 0, priceCurrency: course.currency } }
      : course.price != null
        ? { offers: { "@type": "Offer", price: course.price, priceCurrency: course.currency } }
        : {}),
  };

  const infoRows: { label: string; value: string | null }[] = [
    { label: "Provider", value: course.provider.name },
    { label: "Level", value: course.level },
    { label: "Duration", value: course.duration },
    { label: "Language", value: course.language },
    { label: "Format", value: course.format },
    { label: "Certificate", value: course.certificate ? "Certificate available" : null },
    { label: "Price", value: price },
    { label: "Last Verified", value: course.lastVerified ? formatDate(course.lastVerified) : null },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <TrackView slug={course.slug} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Courses", href: "/courses" },
          { label: course.category.name, href: `/courses/category/${course.category.slug}` },
          { label: course.title },
        ]}
      />

      {/* ---------- Hero ---------- */}
      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Link
              href={`/courses/category/${course.category.slug}`}
              className="rounded-full bg-teal-50 px-3 py-1 font-semibold text-teal-700 hover:bg-teal-100"
            >
              {course.category.name}
            </Link>
            {course.level && (
              <span className="rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-600">
                {course.level}
              </span>
            )}
            {course.featured && (
              <span className="rounded-full bg-gold-500 px-3 py-1 font-bold text-white">
                BCO Featured
              </span>
            )}
          </div>

          <h1 className="mt-4 text-3xl font-extrabold leading-tight text-brand-900 sm:text-4xl">
            {course.title}
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-gray-600">{course.shortDescription}</p>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
            <span className="font-semibold text-gray-700">{course.provider.name}</span>
            {course.rating != null && <span>⭐ {course.rating.toFixed(1)}</span>}
            {course.duration && <span>· {course.duration}</span>}
            {course.certificate && <span>· Certificate available</span>}
          </div>

          {/* Mobile CTA (below hero text) */}
          <div className="mt-6 lg:hidden">
            <AffiliateCTA slug={course.slug} label="Start Course" />
          </div>
        </div>

        {/* ---------- Info panel + CTA ---------- */}
        <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
          <div className="flex items-center justify-between">
            <span className={course.isFree ? "text-3xl font-extrabold text-teal-600" : "text-3xl font-extrabold text-brand-800"}>
              {price}
            </span>
          </div>

          <dl className="mt-5 space-y-2.5 border-t border-gray-100 pt-4 text-sm">
            {infoRows
              .filter((row) => row.value) // never display empty/fake info
              .map((row) => (
                <div key={row.label} className="flex justify-between gap-4">
                  <dt className="text-gray-500">{row.label}</dt>
                  <dd className="text-right font-medium text-gray-800">{row.value}</dd>
                </div>
              ))}
          </dl>

          <div className="mt-5 hidden lg:block">
            <AffiliateCTA slug={course.slug} label="Start Course" />
          </div>

          {course.externalCourseUrl && (
            <p className="mt-4 text-center text-xs text-gray-500">
              Prefer to learn more first?{" "}
              <a
                href={course.externalCourseUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="font-medium text-teal-700 hover:underline"
              >
                Visit the provider's page
              </a>
            </p>
          )}
        </aside>
      </div>

      {/* ---------- Body sections ---------- */}
      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_340px]">
        <div className="space-y-10">
          <section aria-labelledby="about-course">
            <h2 id="about-course" className="text-xl font-bold text-brand-900">About This Course</h2>
            <div className="mt-3 space-y-3 leading-relaxed text-gray-700">
              {course.description.split("\n").filter(Boolean).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </section>

          {(() => {
            const outcomes = typeof course.learningOutcomes === 'string' ? JSON.parse(course.learningOutcomes) : course.learningOutcomes;
            return outcomes.length > 0 && (
              <section aria-labelledby="learn-heading">
                <h2 id="learn-heading" className="text-xl font-bold text-brand-900">What You'll Learn</h2>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {outcomes.map((outcome: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700">
                      <span aria-hidden="true" className="mt-0.5 text-teal-600">✓</span>
                      {outcome}
                    </li>
                  ))}
                </ul>
              </section>
            );
          })()}

          {(() => {
            const audience = typeof course.targetAudience === 'string' ? JSON.parse(course.targetAudience) : course.targetAudience;
            return audience.length > 0 && (
              <section aria-labelledby="audience-heading">
                <h2 id="audience-heading" className="text-xl font-bold text-brand-900">Who This Course Is For</h2>
                <ul className="mt-3 space-y-2">
                  {audience.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700">
                      <span aria-hidden="true" className="mt-0.5 text-brand-500">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            );
          })()}

          {course.whyRecommended && (
            <section aria-labelledby="recommend-heading" className="rounded-xl border border-brand-100 bg-brand-50 p-6">
              <h2 id="recommend-heading" className="text-xl font-bold text-brand-900">
                Why We Recommend This Course
              </h2>
              <p className="mt-3 leading-relaxed text-gray-700">{course.whyRecommended}</p>
              <p className="mt-3 text-xs text-gray-500">
                This is an editorial note from the BCO Courses team. It does not guarantee course
                quality or outcomes.
              </p>
            </section>
          )}
        </div>

        {/* Sidebar visual (desktop) */}
        <aside className="hidden lg:block">
          {course.imageUrl ? (
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-gray-200">
              <Image
                src={course.imageUrl}
                alt={course.title}
                fill
                sizes="340px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex aspect-video items-center justify-center rounded-2xl bg-brand-50 text-5xl" aria-hidden="true">
              {course.category.icon || "🎓"}
            </div>
          )}
        </aside>
      </div>

      {/* ---------- Related courses ---------- */}
      {related.length > 0 && (
        <section className="mt-16" aria-labelledby="related-heading">
          <h2 id="related-heading" className="text-2xl font-bold text-brand-900">You May Also Like</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((rel) => (
              <CourseCard key={rel.id} course={rel} />
            ))}
          </div>
        </section>
      )}

      {/* ---------- Final CTA ---------- */}
      <section className="mt-16 rounded-2xl bg-brand-800 px-6 py-10 text-center text-white sm:px-12">
        <h2 className="text-2xl font-bold">Ready to Build Your Skills?</h2>
        <p className="mx-auto mt-2 max-w-xl text-brand-100">
          Explore courses that can help you become better prepared for your next opportunity.
        </p>
        <Link
          href="/courses"
          className="mt-5 inline-block rounded-lg bg-gold-500 px-8 py-3 font-semibold text-white transition-colors hover:bg-gold-600"
        >
          Explore All Courses
        </Link>
      </section>
    </div>
  );
}
