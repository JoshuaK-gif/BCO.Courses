import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SITE, AFFILIATE_DISCLOSURE_SHORT } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "BCO Courses is the learning platform of the Bridge Collective Opportunities ecosystem. Discover curated courses that prepare you for real-world opportunities.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />
      <h1 className="text-3xl font-bold text-brand-900">About BCO Courses</h1>

      <div className="mt-6 space-y-6 leading-relaxed text-gray-700">
        <p>
          <strong>BCO Courses</strong> is the course discovery platform of{" "}
          <a href={SITE.bcoUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-600 hover:underline">
            Bridge Collective Opportunities
          </a>{" "}
          — a platform that helps people discover jobs, scholarships, grants, fellowships,
          internships, competitions and other life-changing opportunities.
        </p>
        <p>
          We believe that finding an opportunity is only half the journey. The other half is being
          prepared for it. BCO Courses exists to close that gap: we curate and organize online
          courses that build the exact skills opportunity seekers need — writing proposals,
          applying for scholarships, building a CV, preparing for interviews, starting a freelance
          career and more.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 p-5 text-center">
          <p className="text-lg font-bold text-brand-800">Discover</p>
          <p className="mt-1 text-sm text-gray-600">Find curated, relevant courses</p>
        </div>
        <div className="rounded-xl border border-gray-200 p-5 text-center">
          <p className="text-lg font-bold text-brand-800">Learn</p>
          <p className="mt-1 text-sm text-gray-600">Build skills at your own pace</p>
        </div>
        <div className="rounded-xl border border-gray-200 p-5 text-center">
          <p className="text-lg font-bold text-brand-800">Take Action</p>
          <p className="mt-1 text-sm text-gray-600">Pursue your next opportunity</p>
        </div>
      </div>

      <h2 className="mt-12 text-2xl font-bold text-brand-900">How BCO Courses Works</h2>
      <div className="mt-4 space-y-4 leading-relaxed text-gray-700">
        <p>
          We research courses from trusted online learning providers and organize them into
          categories that match the opportunities BCO users pursue. Each course page gives you
          clear, honest information — level, duration, certificate availability, price and our
          editorial take on who the course may suit.
        </p>
        <p>
          When you click “Start Course”, you are taken to the provider's website to enroll. Some
          of those links are affiliate links, meaning BCO may earn a commission at no additional
          cost to you. This supports the maintenance of the platform and keeps it free to use.
        </p>
        <p className="rounded-xl bg-gray-50 p-4 text-sm text-gray-600">{AFFILIATE_DISCLOSURE_SHORT}</p>
      </div>

      <h2 className="mt-12 text-2xl font-bold text-brand-900">Our Promise</h2>
      <ul className="mt-4 space-y-2 leading-relaxed text-gray-700">
        <li className="flex gap-2"><span aria-hidden="true" className="text-teal-600">✓</span> We never invent ratings, reviews or course benefits.</li>
        <li className="flex gap-2"><span aria-hidden="true" className="text-teal-600">✓</span> We never guarantee employment, scholarships or grants.</li>
        <li className="flex gap-2"><span aria-hidden="true" className="text-teal-600">✓</span> We clearly label affiliate links.</li>
        <li className="flex gap-2"><span aria-hidden="true" className="text-teal-600">✓</span> User value always comes before commission.</li>
      </ul>

      <div className="mt-12 rounded-2xl bg-brand-50 p-6 text-center">
        <p className="text-lg font-semibold text-brand-900">
          Bridge Collective Opportunities helps people discover opportunities that can transform
          their lives. BCO Courses helps them build the skills to pursue those opportunities.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link href="/courses" className="rounded-lg bg-brand-600 px-6 py-2.5 font-semibold text-white hover:bg-brand-700">
            Explore Courses
          </Link>
          <a href={SITE.bcoUrl} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-brand-300 px-6 py-2.5 font-semibold text-brand-700 hover:bg-white">
            Find Opportunities
          </a>
        </div>
      </div>
    </div>
  );
}
