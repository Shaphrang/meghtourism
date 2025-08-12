// src/app/destinations/[slug]/page.tsx
import { createClient } from "@supabase/supabase-js";
import ClientPage from "./clientPage";
import { notFound } from "next/navigation";

export const revalidate = 900;
export const dynamicParams = true;

type Params = { slug?: string };

export default async function Page({ params }: { params: Promise<Params> }) {
  const t0 = Date.now();
  const { slug: slugParam } = await params;
  const slug = decodeURIComponent(slugParam ?? "").toLowerCase();

  console.log("[DestinationDetail] params:", { slugParam, slug });
  console.log("[DestinationDetail] env:", {
    hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasAnon: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );

  // 1) Destination row
  const FIELDS = `
  id, slug, name, summary, description, image, gallery,
  location, district, address,
  visitseason, thingstodo, theme, tags,
  entryfee, openinghours, howtoreach,
  distancefromshillong, distancefromguwahati,
  faq_answers,
  created_at
`;
  const { data, error } = await supabase
    .from("destinations")
    .select(FIELDS)
    .eq("slug", slug)
    .single();

  console.log("[DestinationDetail] query result:", {
    tookMs: Date.now() - t0,
    hasError: !!error,
    errorMessage: error?.message,
    hasData: !!data,
    dataKeys: data ? Object.keys(data) : [],
  });

  if (error || !data) {
    console.error("[DestinationDetail] notFound() due to:", error || "No rows for this slug");
    notFound();
  }

  // 2) Related (single RPC call) + 3) Reviews aggregate
  const [{ data: relatedData, error: relErr }, { data: agg, error: aggErr }] = await Promise.all([
    supabase.rpc("fetch_related_by_area", {
      _location: data.location ?? null,
      _district: data.district ?? null,
      _per_type: 10,
    }),
    supabase
      .from("review_aggregate")
      .select("count, avg_rating")
      .eq("category", "destination")
      .eq("item_id", data.slug)
      .maybeSingle(),
  ]);

  console.log("[DestinationDetail] related error:", relErr?.message);
  console.log("[DestinationDetail] rating error:", aggErr?.message);

  const ratingInitial = {
    count: agg?.count ?? 0,
    avg: Number(agg?.avg_rating ?? 0),
  };

  return (
    <ClientPage
      initial={data}
      relatedInitial={relatedData || []}
      ratingInitial={ratingInitial}
    />
  );
}
