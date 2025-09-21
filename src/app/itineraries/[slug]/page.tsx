// src/app/itineraries/[slug]/page.tsx
import ClientPage from "./clientPage";
import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import ItineraryDetailSEO from "@/components/seo/ItineraryDetailSEO";

export const revalidate = 900; // keep cache/ISR

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params; // ✅ await params

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: itinerary } = await supabase
    .from("itineraries")
    .select("*")
    .eq("slug", slug)                       // ✅ use slug
    .eq("approval_status", "approved")
    .eq("is_active", true)
    .single();

  if (!itinerary) return notFound();

  const ogImage = itinerary.image || itinerary.gallery?.[0] || undefined;

  return (
    <>
      <ItineraryDetailSEO
        name={itinerary.title}
        description={
          itinerary.meta_description ||
          itinerary.summary ||
          itinerary.description ||
          undefined
        }
        image={ogImage}
        canonicalPath={`/itineraries/${slug}`}   // ✅ use awaited slug
        days={itinerary.days ?? undefined}
        startingPoint={itinerary.starting_point ?? undefined}
        theme={Array.isArray(itinerary.theme) ? itinerary.theme : []}
      />
      <ClientPage initial={itinerary} />
    </>
  );
}
