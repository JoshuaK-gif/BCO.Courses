import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
      <p className="text-6xl" aria-hidden="true">🌉</p>
      <h1 className="mt-6 text-3xl font-bold text-brand-900">Page Not Found</h1>
      <p className="mt-3 text-gray-600">
        The page you are looking for doesn't exist or may have moved.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700">
          Go Home
        </Link>
        <Link href="/courses" className="rounded-lg border border-brand-300 px-6 py-3 font-semibold text-brand-700 hover:bg-brand-50">
          Explore Courses
        </Link>
      </div>
    </div>
  );
}
