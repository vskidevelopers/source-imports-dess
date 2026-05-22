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
  let attempts = 0;

  while (attempts < 3) {
    const randomPart = Math.floor(10000 + Math.random() * 90000); // 10000–99999
    const candidateId = `SID-${year}-${randomPart}`;

    // Check if ID already exists
    const { data } = await supabase
      .from("quotes")
      .select("id")
      .eq("quote_id", candidateId)
      .maybeSingle();

    if (!data) return candidateId; // ✅ Unique, safe to use
    attempts++;
  }

  // ️ Fallback (timestamp-based if somehow 3 collisions occur)
  return `SID-${year}-${Date.now().toString().slice(-5)}`;
};
