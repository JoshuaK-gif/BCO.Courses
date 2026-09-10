"use client";

import { useEffect, useRef } from "react";

/**
 * Fire-and-forget course view tracking.
 * Keeps the course page a server component while still recording analytics.
 */
export default function TrackView({ slug }: { slug: string }) {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    // sendBeacon survives page navigation; fall back to keepalive fetch
    const payload = JSON.stringify({ slug, referrer: document.referrer || undefined });
    if (typeof navigator.sendBeacon === "function") {
      navigator.sendBeacon("/api/track/view", new Blob([payload], { type: "application/json" }));
    } else {
      fetch("/api/track/view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  }, [slug]);

  return null;
}
