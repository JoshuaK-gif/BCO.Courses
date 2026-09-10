import { AFFILIATE_DISCLOSURE_SHORT, cn } from "@/lib/site";

/**
 * AffiliateCTA — the only place affiliate outbound links are rendered.
 * Links go through /go/[slug] (server-tracked redirect), never directly
 * to the provider URL. Affiliate URLs themselves live only in the DB.
 */
export default function AffiliateCTA({
  slug,
  label = "Start Course",
  size = "lg",
}: {
  slug: string;
  label?: string;
  size?: "lg" | "md";
}) {
  return (
    <div>
      <a
        href={`/go/${slug}`}
        rel="nofollow sponsored noopener"
        className={cn(
          "inline-flex items-center justify-center rounded-lg bg-gold-500 font-semibold text-white shadow-sm transition-colors hover:bg-gold-600",
          size === "lg" ? "px-6 py-3 text-base" : "px-4 py-2 text-sm"
        )}
        data-analytics="affiliate-click-intent"
      >
        {label} <span aria-hidden="true">→</span>
      </a>
      <p className="mt-3 max-w-xl text-xs leading-relaxed text-gray-500">
        {AFFILIATE_DISCLOSURE_SHORT}
      </p>
    </div>
  );
}
