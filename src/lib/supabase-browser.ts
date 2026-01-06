"use client";

import { createBrowserClient } from "@supabase/ssr";

// Browser client for client-side authentication
// This properly sets cookies that the middleware can read
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
