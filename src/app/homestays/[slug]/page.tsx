//src\app\homestays\[slug]\page.tsx
import { createClient } from "@supabase/supabase-js";
import ClientPage from "./clientPage";
import { notFound } from "next/navigation";

export const revalidate = 900;
export const dynamicParams = true;

type Params = { slug?: string };

export default async function Page({ params }: { params: Promise<Params> }) {
  const { slug: slugParam } = await params;
  const slug = decodeURIComponent(slugParam ?? "").toLowerCase();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );

  // 1) Homestay row
  const { data: homestay, error } = await supabase
    .from("homestays")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !homestay) notFound();

  // 2) Related (via your RPC) + 3) Ratings aggregate
const [{ data: relatedData, error: relErr }, { data: agg, error: aggErr }] =
  await Promise.all([
    supabase.rpc("fetch_related_by_area", {
      _location: homestay.location ?? null,   // <-- underscore
      _district: homestay.district ?? null,   // <-- underscore
      _per_type: 8,                            // <-- underscore
    }),
    supabase
      .from("review_aggregate")
      .select("count, avg_rating")
      .eq("category", "homestay")
      .eq("item_id", homestay.slug)
      .maybeSingle(),
  ]);

console.log("[HomestayDetail] related len:", relatedData?.length, "err:", relErr?.message);


  const ratingInitial = {
    count: agg?.count ?? 0,
    avg: Number(agg?.avg_rating ?? 0),
  };

  return (
    <ClientPage
      initial={homestay}
      relatedInitial={relatedData || []}
      ratingInitial={ratingInitial}
    />
  );
}
