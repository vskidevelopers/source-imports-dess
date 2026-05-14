// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

if (
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: { persistSession: false }, // No auth needed for public quote forms
  },
);

// Helper: Generate quote ID like SID-2026-00142
export const generateQuoteId = async (): Promise<string> => {
  const year = new Date().getFullYear();
  // Simple counter approach - in production, use Supabase RPC for atomic increment
  const { count } = await supabase
    .from("quotes")
    .select("*", { count: "exact", head: true })
    .eq("quote_id", `SID-${year}-*`); // Fallback: just use timestamp + random
  const nextNum = String((count || 0) + 1).padStart(5, "0");
  return `SID-${year}-${nextNum}`;
};
