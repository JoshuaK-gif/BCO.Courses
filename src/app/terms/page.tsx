import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms governing the use of the BCO Courses platform.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Terms of Use" }]} />
      <h1 className="text-3xl font-bold text-brand-900">Terms of Use</h1>
      <div className="mt-6 space-y-5 leading-relaxed text-gray-700">
        <h2 className="text-xl font-bold text-brand-900">1. About the platform</h2>
        <p>
          BCO Courses is a course discovery and referral platform operated as part of the Bridge
          Collective Opportunities ecosystem. We do not host, deliver or sell courses. All
          learning happens on third-party provider websites.
        </p>
        <h2 className="text-xl font-bold text-brand-900">2. No guarantees</h2>
        <p>
          Course information (price, duration, certificate availability) is provided in good faith
          and marked with a “last verified” date, but providers may change their offerings at any
          time. Always confirm details on the provider's website. BCO Courses does not guarantee
          employment, scholarships, grants, admission or any outcome from taking a course.
        </p>
        <h2 className="text-xl font-bold text-brand-900">3. Affiliate relationship</h2>
        <p>
          Some outbound links are affiliate links; see our Affiliate Disclosure. Using them never
          increases your cost.
        </p>
        <h2 className="text-xl font-bold text-brand-900">4. Acceptable use</h2>
        <p>
          You agree not to misuse the platform, attempt to disrupt its operation, or scrape it in
          ways that degrade service for others.
        </p>
        <h2 className="text-xl font-bold text-brand-900">5. Changes</h2>
        <p>These terms may be updated as the platform evolves. Continued use constitutes acceptance.</p>
      </div>
    </div>
  );
}
