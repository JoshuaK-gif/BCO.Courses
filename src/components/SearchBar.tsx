"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SearchBar({
  placeholder = "Search courses, skills or topics...",
  basePath = "/courses",
}: {
  placeholder?: string;
  basePath?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") || "");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    router.push(trimmed ? `${basePath}?q=${encodeURIComponent(trimmed)}` : basePath);
  }

  return (
    <form onSubmit={onSubmit} role="search" className="w-full">
      <label htmlFor="course-search" className="sr-only">
        Search courses
      </label>
      <div className="flex overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm transition-all focus-within:border-brand-400 focus-within:shadow-md">
        <input
          id="course-search"
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 text-sm outline-none"
        />
        <button
          type="submit"
          className="btn-hover-fill shrink-0 bg-gradient-to-r from-brand-600 to-brand-700 px-5 text-sm font-semibold text-white transition-all"
        >
          Search
        </button>
      </div>
    </form>
  );
}
