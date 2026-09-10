import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import SearchBar from "@/components/SearchBar";
import CourseCard from "@/components/CourseCard";
import {
  getCategoriesWithCounts,
  getFeaturedCourses,
  getFreeCourses,
  getPopularCourses,
} from "@/lib/queries";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "BCO Courses — Learn Skills. Unlock Opportunities.",
  description: SITE.description,
  alternates: { canonical: "/" },
};

const WHY_POINTS = [
  {
    title: "Curated for Opportunity Seekers",
    text: "Every course is organized around the opportunities BCO users pursue — jobs, scholarships, grants, fellowships, internships and freelancing.",
  },
  {
    title: "Clear, Honest Information",
    text: "Level, duration, certificate and price are shown up front. No fake ratings, no invented benefits.",
  },
  {
    title: "Part of the BCO Ecosystem",
    text: "BCO Courses works alongside Bridge Collective Opportunities: find the opportunity, build the skills, take action.",
  },
];

const OPPORTUNITY_SECTIONS = [
  {
    heading: "Applying for a scholarship?",
    text: "Explore courses that can strengthen your application, essay and personal statement skills.",
    href: "/courses/category/scholarships",
  },
  {
    heading: "Looking for a job?",
    text: "Build your CV, cover letter, LinkedIn profile and interview skills.",
    href: "/courses/category/career-development",
  },
  {
    heading: "Starting freelancing?",
    text: "Learn how to find clients, write proposals and grow an online income.",
    href: "/courses/category/freelancing",
  },
  {
    heading: "Writing a grant?",
    text: "Develop grant writing and fundraising skills for your organization or project.",
    href: "/courses/category/grant-writing",
  },
];

const LEARNING_TOPICS = [
  "Grant Writing",
  "Scholarship Applications",
  "CV & Resume Writing",
  "Cover Letters",
  "Interview Preparation",
  "LinkedIn & Networking",
  "Freelancing",
  "Remote Work",
  "Entrepreneurship",
  "Internships",
  "Fellowships",
  "International Opportunities",
];

export default async function HomePage() {
  const [categories, featured, free, popular] = await Promise.all([
    getCategoriesWithCounts(),
    getFeaturedCourses(6),
    getFreeCourses(4),
    getPopularCourses(4),
  ]);

  const homeCategories = categories.filter((c) => c.courseCount > 0).slice(0, 8);

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="relative min-h-[50vh] overflow-hidden text-white sm:min-h-[60vh] lg:min-h-[70vh]">
        {/* Background image — responsive with AVIF/WebP */}
        <picture className="absolute inset-0">
          <source
            type="image/avif"
            srcSet="/hero-classroom-sm.avif 640w, /hero-classroom-md.avif 1024w, /hero-classroom-lg.avif 1920w"
            sizes="100vw"
          />
          <source
            type="image/webp"
            srcSet="/hero-classroom-sm.webp 640w, /hero-classroom-md.webp 1024w, /hero-classroom-lg.webp 1920w"
            sizes="100vw"
          />
          <img
            src="/hero-classroom-md.jpg"
            alt=""
            className="h-full w-full object-cover"
            fetchPriority="high"
            decoding="async"
          />
        </picture>
        {/* Fading overlay - dark from left, transparent to right */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-900/90 via-brand-900/70 to-transparent" />
        {/* Subtle color tint */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "radial-gradient(circle at 80% 20%, #22c55e 0%, transparent 40%), radial-gradient(circle at 20% 80%, #3b82f6 0%, transparent 35%)"
        }} />

        <div className="relative mx-auto flex min-h-[50vh] max-w-7xl items-center px-4 py-12 sm:min-h-[60vh] sm:px-6 sm:py-16 lg:min-h-[70vh] lg:py-20">
          {/* Text column - left aligned */}
          <div className="max-w-2xl">
            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              Learn Skills. Unlock Opportunities.
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/90 sm:text-xl">
              Discover courses that help you build the skills, knowledge and confidence you need to
              pursue jobs, scholarships, grants, fellowships, internships and other opportunities.
            </p>

            <div className="mt-8 max-w-xl">
              <SearchBar />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/courses"
                className="btn-hover-fill rounded-lg bg-teal-600 px-6 py-3 text-base font-semibold text-white shadow-md transition-all hover:shadow-lg sm:px-8 sm:py-4 sm:text-lg"
              >
                Explore Courses
              </Link>
              <Link
                href="/categories"
                className="btn-hover-fill rounded-lg border-2 border-white/30 px-6 py-3 text-base font-semibold text-white transition-all sm:px-8 sm:py-4 sm:text-lg"
              >
                Browse Categories
              </Link>
            </div>

            {/* Learn → Skills → Opportunities → Growth */}
            <div className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-medium text-white/80 sm:text-base" aria-label="Learning leads to growth">
              {["Learn", "Skills", "Opportunities", "Growth"].map((step, i) => (
                <span key={step} className="flex items-center gap-3">
                  {i > 0 && <span aria-hidden="true" className="text-gold-400">→</span>}
                  <span className="rounded-full bg-white/10 px-4 py-1.5">{step}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
        <div aria-hidden="true" className="bridge-arc mx-4" />
      </section>

      {/* ---------- Popular categories ---------- */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6" aria-labelledby="categories-heading">
        <div className="flex items-end justify-between gap-4">
          <h2 id="categories-heading" className="text-2xl font-bold text-brand-900">
            Popular Categories
          </h2>
          <Link href="/categories" className="text-sm font-semibold text-brand-600 hover:text-brand-700 hover:underline">
            View all categories →
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {homeCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/courses/category/${cat.slug}`}
              className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-brand-200"
            >
              <span className="text-3xl" aria-hidden="true">{cat.icon || "🎓"}</span>
              <h3 className="mt-3 font-semibold text-brand-900 group-hover:text-brand-600">{cat.name}</h3>
              <p className="mt-1 text-xs text-gray-500">
                {cat.courseCount} course{cat.courseCount === 1 ? "" : "s"}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- Featured courses ---------- */}
      <section className="bg-gray-50 py-14" aria-labelledby="featured-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <h2 id="featured-heading" className="text-2xl font-bold text-brand-900">
              Featured Courses
            </h2>
            <Link href="/courses" className="text-sm font-semibold text-brand-600 hover:text-brand-700 hover:underline">
              Explore all courses →
            </Link>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Why BCO Courses ---------- */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6" aria-labelledby="why-heading">
        <h2 id="why-heading" className="text-2xl font-bold text-brand-900">
          Learning That Connects You to Opportunity
        </h2>
        <p className="mt-3 max-w-3xl text-gray-600">
          Bridge Collective Courses helps you discover learning programs that can strengthen your
          skills and prepare you for real-world opportunities. We curate and organize courses so
          you can spend less time searching and more time learning.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {WHY_POINTS.map((point) => (
            <div key={point.title} className="rounded-xl border border-gray-200 p-6 transition-all hover:border-teal-200 hover:shadow-sm">
              <h3 className="font-semibold text-brand-800">{point.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{point.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Courses for your next opportunity ---------- */}
      <section className="bg-gradient-to-br from-brand-50 to-teal-50 py-14" aria-labelledby="opportunity-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 id="opportunity-heading" className="text-2xl font-bold text-brand-900">
            Preparing for Your Next Opportunity?
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {OPPORTUNITY_SECTIONS.map((s) => (
              <Link
                key={s.heading}
                href={s.href}
                className="group rounded-xl border border-brand-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-brand-300"
              >
                <h3 className="font-semibold text-brand-800 group-hover:text-brand-600">{s.heading}</h3>
                <p className="mt-2 text-sm text-gray-600">{s.text}</p>
                <span className="mt-3 inline-block text-sm font-semibold text-brand-600">
                  Explore courses →
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-8">
            <Link
              href="/learning-paths"
              className="btn-hover-fill inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-3 font-semibold text-white transition-all shadow-md hover:shadow-lg"
            >
              Explore Learning Paths <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Popular courses (honest fallback) ---------- */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6" aria-labelledby="popular-heading">
        <h2 id="popular-heading" className="text-2xl font-bold text-brand-900">
          Popular Right Now
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Recently updated courses on BCO Courses.
        </p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {popular.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* ---------- Free courses ---------- */}
      <section className="bg-gradient-to-br from-teal-50 to-teal-100/50 py-14" aria-labelledby="free-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 id="free-heading" className="text-2xl font-bold text-brand-900">
                Start With a Free Course
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-gray-600">
                Not ready to pay? These free courses can help you start building skills today.
              </p>
            </div>
            <Link href="/courses/free" className="shrink-0 text-sm font-semibold text-teal-600 hover:text-teal-700 hover:underline">
              All free courses →
            </Link>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {free.courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Popular learning topics ---------- */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6" aria-labelledby="topics-heading">
        <h2 id="topics-heading" className="text-2xl font-bold text-brand-900">
          Popular Learning Topics
        </h2>
        <div className="mt-6 flex flex-wrap gap-2">
          {LEARNING_TOPICS.map((topic) => (
            <Link
              key={topic}
              href={`/courses?q=${encodeURIComponent(topic)}`}
              className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
            >
              {topic}
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- Final CTA ---------- */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-700 via-brand-800 to-teal-800 px-6 py-12 text-center text-white sm:px-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle at 70% 30%, #22c55e 0%, transparent 40%), radial-gradient(circle at 30% 70%, #3b82f6 0%, transparent 35%)",
            }}
          />
          <div className="relative">
            <h2 className="text-2xl font-bold sm:text-3xl">Ready to Build Your Skills?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-brand-100">
              Explore courses that can help you become better prepared for your next opportunity.
            </p>
            <Link
              href="/courses"
              className="btn-hover-fill mt-6 inline-block rounded-lg bg-teal-600 px-8 py-3 font-semibold text-white shadow-md transition-all hover:shadow-lg"
            >
              Explore All Courses
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
