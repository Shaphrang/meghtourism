import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 300; // cache 5m

export async function GET(req: Request) {
  const url = new URL(req.url);
  const category = url.searchParams.get("category") || "destination";
  const itemId = url.searchParams.get("itemId") || "";

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from("review_aggregate")
    .select("count, avg_rating")
    .eq("category", category)
    .eq("item_id", itemId)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ count: data?.count ?? 0, avg: Number(data?.avg_rating ?? 0) });
}
