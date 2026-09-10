import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Learning Paths",
  description:
    "Step-by-step course paths for job seekers, grant writers and freelancers. Build skills in a logical order — at your own pace.",
  alternates: { canonical: "/learning-paths" },
};

const PATHS: {
  title: string;
  description: string;
  steps: { label: string; href: string }[];
}[] = [
  {
    title: "Job Seeker Path",
    description: "For people preparing to apply for jobs, internships and graduate programs.",
    steps: [
      { label: "Build a Professional CV", href: "/courses?q=CV%20resume%20writing" },
      { label: "Write a Cover Letter", href: "/courses?q=cover%20letter" },
      { label: "Build a LinkedIn Profile", href: "/courses?q=LinkedIn" },
      { label: "Prepare for Interviews", href: "/courses?q=interview%20preparation" },
      { label: "Develop Professional Skills", href: "/courses/category/career-development" },
    ],
  },
  {
    title: "Grant Writer Path",
    description: "For NGO workers, founders and researchers seeking funding.",
    steps: [
      { label: "Learn Grant Writing", href: "/courses/category/grant-writing" },
      { label: "Learn Proposal Development", href: "/courses?q=proposal" },
      { label: "Learn Fundraising", href: "/courses?q=fundraising" },
      { label: "Learn Project Management", href: "/courses?q=project%20management" },
    ],
  },
  {
    title: "Freelancer Path",
    description: "For people building an independent online income.",
    steps: [
      { label: "Learn Freelancing", href: "/courses/category/freelancing" },
      { label: "Build a Portfolio", href: "/courses?q=portfolio" },
      { label: "Learn Client Acquisition", href: "/courses?q=finding%20clients" },
      { label: "Learn Proposal Writing", href: "/courses?q=proposal" },
    ],
  },
  {
    title: "Scholarship Applicant Path",
    description: "For students targeting scholarships and international study.",
    steps: [
      { label: "Master Scholarship Applications", href: "/courses/category/scholarships" },
      { label: "Write a Strong Personal Statement", href: "/courses?q=personal%20statement" },
      { label: "Improve Academic Communication", href: "/courses?q=academic%20writing" },
      { label: "Explore International Opportunities", href: "/courses/category/international-opportunities" },
    ],
  },
];

export default function LearningPathsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Learning Paths" }]} />
      <h1 className="text-3xl font-bold text-brand-900">Learning Paths</h1>
      <p className="mt-2 max-w-2xl text-gray-600">
        Follow a guided sequence of skills. Each step links to relevant courses — take them in
        order or pick only what you need. You are never required to purchase anything.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {PATHS.map((path) => (
          <section key={path.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-brand-900">{path.title}</h2>
            <p className="mt-1 text-sm text-gray-600">{path.description}</p>
            <ol className="mt-5 space-y-3">
              {path.steps.map((step, i) => (
                <li key={step.label} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white"
                  >
                    {i + 1}
                  </span>
                  <Link
                    href={step.href}
                    className="pt-1 font-medium text-gray-800 hover:text-brand-600"
                  >
                    {step.label}
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>

      <div className="mt-10 rounded-2xl bg-brand-800 px-6 py-10 text-center text-white">
        <h2 className="text-2xl font-bold">Not Sure Where to Start?</h2>
        <p className="mx-auto mt-2 max-w-xl text-brand-100">
          Browse all courses and filter by what you want to achieve.
        </p>
        <Link
          href="/courses"
          className="mt-5 inline-block rounded-lg bg-gold-500 px-8 py-3 font-semibold text-white transition-colors hover:bg-gold-600"
        >
          Explore All Courses
        </Link>
      </div>
    </div>
  );
}
