"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { LEVELS, FORMATS, DURATION_FILTERS } from "@/lib/site";
import type { CategoryOption, ProviderOption } from "@/lib/queries";

const PRICE_OPTIONS = [
  { value: "free", label: "Free" },
  { value: "paid", label: "Paid" },
];

const CERT_OPTIONS = [
  { value: "yes", label: "Certificate available" },
  { value: "no", label: "No certificate" },
];

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="border-b border-gray-100 pb-4">
      <legend className="mb-2 text-sm font-semibold text-brand-900">{label}</legend>
      {children}
    </fieldset>
  );
}

function Select({
  label,
  param,
  options,
  value,
  onChange,
  allLabel = "All",
}: {
  label: string;
  param: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (param: string, newValue: string) => void;
  allLabel?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="sr-only">{label}</span>
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(param, e.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-brand-400 focus:outline-none"
      >
        <option value="">{allLabel}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function CourseFilters({
  categories,
  providers,
}: {
  categories: CategoryOption[];
  providers: ProviderOption[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setParam(param: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(param, value);
    else params.delete(param);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const current = (key: string) => searchParams.get(key) || "";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500">Filters</h2>
        {searchParams.toString() && (
          <button
            type="button"
            onClick={() => router.push(pathname)}
            className="text-xs font-medium text-teal-700 hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      <FilterGroup label="Category">
        <Select
          label="Category"
          param="category"
          options={categories.map((c) => ({ value: c.slug, label: c.name }))}
          value={current("category")}
          onChange={setParam}
          allLabel="All categories"
        />
      </FilterGroup>

      <FilterGroup label="Level">
        <Select
          label="Level"
          param="level"
          options={LEVELS.map((l) => ({ value: l, label: l }))}
          value={current("level")}
          onChange={setParam}
          allLabel="All levels"
        />
      </FilterGroup>

      <FilterGroup label="Price">
        <Select
          label="Price"
          param="price"
          options={[...PRICE_OPTIONS]}
          value={current("price")}
          onChange={setParam}
          allLabel="Free & paid"
        />
      </FilterGroup>

      <FilterGroup label="Certificate">
        <Select
          label="Certificate"
          param="cert"
          options={[...CERT_OPTIONS]}
          value={current("cert")}
          onChange={setParam}
          allLabel="All"
        />
      </FilterGroup>

      <FilterGroup label="Duration">
        <Select
          label="Duration"
          param="duration"
          options={[...DURATION_FILTERS]}
          value={current("duration")}
          onChange={setParam}
          allLabel="Any duration"
        />
      </FilterGroup>

      <FilterGroup label="Format">
        <Select
          label="Format"
          param="format"
          options={FORMATS.map((f) => ({ value: f, label: f }))}
          value={current("format")}
          onChange={setParam}
          allLabel="All formats"
        />
      </FilterGroup>

      <FilterGroup label="Provider">
        <Select
          label="Provider"
          param="provider"
          options={providers.map((p) => ({ value: p.slug, label: p.name }))}
          value={current("provider")}
          onChange={setParam}
          allLabel="All providers"
        />
      </FilterGroup>
    </div>
  );
}
