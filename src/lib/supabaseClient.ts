"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
// import type { Database } from "@/lib/types"; // optional

/**
 * A single shared client instance for Client Components.
 * Works with existing imports: { supabase } and { supabaseBrowser }.
 */
export const supabase = createClientComponentClient/*<Database>*/();
export const supabaseBrowser = supabase;

/**
 * If you prefer a fresh client per call (rarely needed), use this.
 * Example: const sb = getSupabaseBrowser();
 */
export function getSupabaseBrowser() {
  return createClientComponentClient/*<Database>*/();
}
