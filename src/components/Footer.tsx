import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-gradient-to-b from-brand-800 to-brand-950 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Image
              src="/bridge.png"
              alt="Bridge Collective Opportunities logo"
              width={512}
              height={361}
              className="h-12 w-auto rounded-lg bg-white p-1.5"
            />
            <p className="mt-3 text-xl font-bold text-white">BCO Courses</p>
            <p className="mt-1 text-sm text-teal-400">Part of {SITE.parentBrand}</p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-gray-400">
              BCO Courses helps you build the skills to pursue jobs, scholarships, grants,
              fellowships, internships and other life-changing opportunities.
            </p>
            {/* Connection back to main BCO platform */}
            <p className="mt-6 text-sm font-medium text-white">Looking for opportunities?</p>
            <a
              href={SITE.bcoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-hover-fill mt-2 inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:shadow-md"
            >
              Visit Bridge Collective Opportunities
              <span aria-hidden="true">→</span>
            </a>
          </div>

          {/* Platform links */}
          <nav aria-label="Footer navigation">
            <p className="text-sm font-semibold uppercase tracking-wide text-gray-400">Platform</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/courses" className="transition-colors hover:text-teal-400">All Courses</Link></li>
              <li><Link href="/categories" className="transition-colors hover:text-teal-400">Categories</Link></li>
              <li><Link href="/courses/free" className="transition-colors hover:text-teal-400">Free Courses</Link></li>
              <li><Link href="/about" className="transition-colors hover:text-teal-400">About</Link></li>
              <li><a href={SITE.bcoUrl} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-teal-400">Opportunities</a></li>
            </ul>
          </nav>

          {/* Legal */}
          <nav aria-label="Legal navigation">
            <p className="text-sm font-semibold uppercase tracking-wide text-gray-400">Legal</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/affiliate-disclosure" className="transition-colors hover:text-teal-400">Affiliate Disclosure</Link></li>
              <li><Link href="/privacy" className="transition-colors hover:text-teal-400">Privacy Policy</Link></li>
              <li><Link href="/terms" className="transition-colors hover:text-teal-400">Terms of Use</Link></li>
            </ul>
          </nav>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-xs leading-relaxed text-gray-500">
          <p>
            Affiliate Disclosure: Some links on BCO Courses are affiliate links. We may earn a
            commission if you purchase or enroll through our links, at no additional cost to you.
          </p>
          <p className="mt-2">
            © {new Date().getFullYear()} {SITE.parentBrand}. BCO Courses is an independent platform
            within the Bridge Collective Opportunities ecosystem.
          </p>
        </div>
      </div>
    </footer>
  );
}
