import { Suspense } from "react";
import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[70vh] items-center justify-center text-sm text-gray-400">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}
