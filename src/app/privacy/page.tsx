import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How BCO Courses collects, uses and protects information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} />
      <h1 className="text-3xl font-bold text-brand-900">Privacy Policy</h1>
      <div className="mt-6 space-y-5 leading-relaxed text-gray-700">
        <p>
          BCO Courses respects your privacy. This page explains what limited information the
          platform collects and why.
        </p>
        <h2 className="text-xl font-bold text-brand-900">What we collect</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li><strong>Anonymous usage events:</strong> when you open a course page or click an outbound course link, we record the course, a timestamp, and (where available) the referring page and browser type. This data is used in aggregate to understand which courses are useful.</li>
          <li><strong>No accounts, no personal profiles:</strong> BCO Courses v1 does not require user registration and does not build personal profiles.</li>
          <li><strong>Cookies:</strong> we set a single essential cookie only for administrators of the platform. Regular visitors receive no tracking cookies from BCO Courses.</li>
        </ul>
        <h2 className="text-xl font-bold text-brand-900">External websites</h2>
        <p>
          When you click through to a course provider, their own privacy policy applies on their
          website. We encourage you to review it before enrolling or purchasing.
        </p>
        <h2 className="text-xl font-bold text-brand-900">Questions?</h2>
        <p>
          For questions about privacy, visit the{" "}
          <a href={SITE.bcoUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-600 hover:underline">Bridge Collective Opportunities</a> website.
        </p>
      </div>
    </div>
  );
}
