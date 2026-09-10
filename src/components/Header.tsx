"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/site";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/categories", label: "Categories" },
  { href: "/courses/free", label: "Free Courses" },
  { href: "/learning-paths", label: "Learning Paths" },
  { href: "/about", label: "About Us" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const drawerRef = useRef<HTMLElement>(null);

  useEffect(() => setMounted(true), []);

  if (pathname.startsWith("/admin")) return null;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const startClose = useCallback(() => {
    setClosing(true);
  }, []);

  // Body scroll lock
  useEffect(() => {
    if (open || closing) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open, closing]);

  // Escape key to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && startClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, startClose]);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3" aria-label={`${SITE.name} home`}>
          <span className="flex h-11 w-16 items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-gray-200">
            <Image
              src="/bridge.png"
              alt="Bridge Collective Opportunities logo"
              width={512}
              height={361}
              priority
              className="h-9 w-auto"
            />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-semibold text-brand-800">Courses</span>
            <span className="block text-[11px] font-medium text-gray-500">
              {SITE.parentBrand}
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive(link.href)
                  ? "bg-brand-100 text-brand-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-brand-600"
              )}
              aria-current={isActive(link.href) ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={SITE.bcoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-hover-fill ml-3 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md"
          >
            Opportunities
          </a>
          <Link
            href="/courses"
            className="btn-hover-fill ml-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md"
          >
            Explore Courses
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => (open ? startClose() : setOpen(true))}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile nav - Slide-out drawer from left (ported to body to escape backdrop-blur containment) */}
      {mounted && (open || closing) && createPortal(
        <>
          {/* Backdrop */}
          <div
            className={cn(
              "fixed inset-0 bg-black/50 lg:hidden",
              closing ? "mobile-backdrop-exit" : "mobile-backdrop-enter"
            )}
            style={{ zIndex: 9998 }}
            onClick={startClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <nav
            ref={drawerRef}
            className={cn(
              "fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white shadow-2xl lg:hidden overflow-y-auto",
              closing ? "mobile-drawer-exit" : "mobile-drawer-enter"
            )}
            style={{ zIndex: 9999 }}
            aria-label="Mobile navigation"
            onAnimationEnd={() => {
              if (closing) {
                setOpen(false);
                setClosing(false);
              }
            }}
          >
            {/* Decorative top accent */}
            <div className="h-1 w-full bg-gradient-to-r from-brand-600 via-teal-500 to-gold-500" />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <Link href="/" className="flex items-center gap-3" onClick={startClose}>
                <Image
                  src="/bridge.png"
                  alt="BCO"
                  width={512}
                  height={361}
                  className="h-10 w-auto"
                />
              </Link>
              <button
                type="button"
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 transition-colors"
                onClick={startClose}
                aria-label="Close menu"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Nav links */}
            <div className="px-5 py-3">
              <ul className="space-y-0.5">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={startClose}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-4 py-2.5 text-lg font-medium transition-colors",
                        isActive(link.href)
                          ? "bg-brand-50 text-brand-700"
                          : "text-gray-700 hover:bg-gray-50"
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Divider */}
              <div className="my-3 border-t border-gray-100" />

              {/* CTA Buttons */}
              <div className="space-y-2">
                <a
                  href={SITE.bcoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={startClose}
                  className="flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-5 py-2 text-base font-semibold text-white transition-all hover:bg-teal-700 hover:shadow-md"
                >
                  Opportunities
                </a>
                <Link
                  href="/courses"
                  onClick={startClose}
                  className="flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 py-2 text-base font-semibold text-white transition-all hover:bg-brand-700 hover:shadow-md"
                >
                  Explore Courses
                </Link>
              </div>
            </div>
          </nav>
        </>,
        document.body
      )}
    </header>
  );
}
