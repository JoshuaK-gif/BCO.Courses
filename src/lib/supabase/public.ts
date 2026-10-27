import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Cookie-less Supabase client for public read queries.
 * Avoids `cookies()` so pages can be statically rendered / ISR-cached.
 */
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}
