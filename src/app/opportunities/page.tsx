import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Opportunities",
  description: "Discover jobs, scholarships, grants, fellowships and other life-changing opportunities through Bridge Collective Opportunities.",
  alternates: { canonical: "/opportunities" },
};

export default function OpportunitiesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Opportunities" }]} />
      <h1 className="text-3xl font-bold text-brand-900">Opportunities</h1>
      <p className="mt-3 max-w-2xl text-gray-600">
        BCO Courses helps you build the skills. For jobs, scholarships, grants, fellowships
        and other life-changing opportunities, visit the main Bridge Collective Opportunities
        platform.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-brand-900">Jobs &amp; Careers</h2>
          <p className="mt-2 text-sm text-gray-600">
            Find job openings, career opportunities and employment resources to advance your
            professional journey.
          </p>
          <a
            href={SITE.bcoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Explore Opportunities →
          </a>
        </div>

        <div className="rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-brand-900">Scholarships &amp; Grants</h2>
          <p className="mt-2 text-sm text-gray-600">
            Access scholarships, grants and financial aid opportunities to fund your education and
            professional development.
          </p>
          <a
            href={SITE.bcoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Explore Opportunities →
          </a>
        </div>

        <div className="rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-brand-900">Fellowships &amp; Internships</h2>
          <p className="mt-2 text-sm text-gray-600">
            Discover fellowships, internships and program opportunities to gain experience and
            grow your network.
          </p>
          <a
            href={SITE.bcoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Explore Opportunities →
          </a>
        </div>

        <div className="rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-brand-900">Community Programs</h2>
          <p className="mt-2 text-sm text-gray-600">
            Connect with community programs, workshops and events designed to help you grow
            personally and professionally.
          </p>
          <a
            href={SITE.bcoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Explore Opportunities →
          </a>
        </div>
      </div>

      <div className="mt-8 rounded-xl bg-brand-50 p-6">
        <h2 className="font-semibold text-brand-900">Ready to take action?</h2>
        <p className="mt-2 text-sm text-gray-600">
          Build your skills with BCO Courses, then find the opportunity that fits your goals on
          the main Bridge Collective Opportunities platform.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={SITE.bcoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Visit Bridge Collective Opportunities →
          </a>
          <a
            href="/courses"
            className="inline-block rounded-lg border border-brand-600 px-5 py-2.5 text-sm font-semibold text-brand-600 hover:bg-brand-50"
          >
            Browse Courses
          </a>
        </div>
      </div>
    </div>
  );
}
