// src/app/itineraries/[slug]/page.tsx
import ClientPage from "./clientPage";
import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import ItineraryDetailSEO from "@/app/components/seo/ItineraryDetailSEO";

export const revalidate = 900;

type Itinerary = {
  id: string;
  slug?: string;
  title: string;
  description?: string | null;
  image?: string | null;
  gallery?: string[] | null;
  days?: number | null;
  starting_point?: string | null;
  season?: string | null;
  theme?: string[] | null;
};

export default async function Page({ params }: { params: { slug: string } }) {
  // 1) Create Supabase client with env vars
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const slug = params.slug;

  // 2) Fetch itinerary by slug (narrow fields if you want)
  const { data: itinerary, error } = await supabase
    .from("itineraries")
    .select("*")
    .eq("slug", slug)
    .single<Itinerary>();

  if (error || !itinerary) return notFound();

  // 3) Rating aggregate (optional) — guard for nulls
  const { data: agg } = await supabase
    .from("review_aggregate")
    .select("count, avg_rating")
    .eq("category", "itinerary")
    .eq("item_id", slug)
    .maybeSingle<{ count: number | null; avg_rating: number | string | null }>();

  const ratingAvg =
    agg?.avg_rating == null ? undefined : Number(agg.avg_rating);
  const ratingCount = agg?.count ?? undefined;

  const ogImage = itinerary.image || itinerary.gallery?.[0] || undefined;

  return (
    <>
      <ItineraryDetailSEO
        name={itinerary.title}
        description={itinerary.description ?? undefined}
        image={ogImage}
        canonicalPath={`/itineraries/${slug}`}
        days={itinerary.days ?? undefined}
        startingPoint={itinerary.starting_point ?? undefined}
        theme={itinerary.theme ?? []}
        ratingAvg={ratingAvg}
        ratingCount={ratingCount}
      />
      <ClientPage initial={itinerary} />
    </>
  );
}
