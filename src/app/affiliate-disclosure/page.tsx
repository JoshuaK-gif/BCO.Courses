import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description:
    "How BCO Courses uses affiliate links, and what that means for you. Transparency about how the platform is funded.",
  alternates: { canonical: "/affiliate-disclosure" },
};

export default function AffiliateDisclosurePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Affiliate Disclosure" }]} />
      <h1 className="text-3xl font-bold text-brand-900">Affiliate Disclosure</h1>
      <div className="mt-6 space-y-5 leading-relaxed text-gray-700">
        <p className="rounded-xl bg-brand-50 p-4 font-medium text-brand-900">
          Some links on BCO Courses are affiliate links. We may earn a commission if you purchase
          or enroll through our links, at no additional cost to you.
        </p>
        <h2 className="text-xl font-bold text-brand-900">What this means</h2>
        <p>
          BCO Courses is a course discovery platform. When you find a course here and click
          “Start Course”, you are redirected to the course provider's website. For some courses,
          that link is an affiliate link — if you enroll or purchase, the provider pays BCO a
          commission. The price you pay is exactly the same.
        </p>
        <h2 className="text-xl font-bold text-brand-900">Why we use affiliate links</h2>
        <p>
          Affiliate commissions fund the research, curation and maintenance of this platform, and
          keep it free for users. BCO is part of the Bridge Collective Opportunities ecosystem,
          whose mission is connecting people to life-changing opportunities.
        </p>
        <h2 className="text-xl font-bold text-brand-900">Our editorial standards</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Courses are selected for relevance and potential user value first — never commission alone.</li>
          <li>We do not invent ratings, reviews, student numbers or outcomes.</li>
          <li>We do not guarantee employment, scholarships, grants or any result from a course.</li>
          <li>Affiliate links are clearly marked, and a disclosure appears near every affiliate button.</li>
          <li>Course details change over time; we mark when each course was last verified by our team.</li>
        </ul>
        <h2 className="text-xl font-bold text-brand-900">Questions?</h2>
        <p>
          Visit the main <a href={SITE.bcoUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-600 hover:underline">Bridge Collective Opportunities</a> website for more information.
        </p>
      </div>
    </div>
  );
}
