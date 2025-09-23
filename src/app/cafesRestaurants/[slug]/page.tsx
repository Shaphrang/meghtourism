// src/app/cafesRestaurants/[slug]/page.tsx
import { createClient as createSb } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import CafeRestaurantDetailSEO from "@/components/seo/CafeRestaurantDetailSEO";
import CafeClient from "./clientPage";
import type { CafeAndRestaurant } from "@/types/cafeRestaurants";

export const revalidate = 900; // 15 min ISR

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; // Next.js version where params is a Promise

  const sb = createSb(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Select only fields defined in your CafeAndRestaurant interface
  const select = `
    id, name, slug, description,
    location, area, district, address,
    image, gallery, cover_image_alt, media,
    type, cuisine, tags, theme, visitseason, features, dietaryoptions, accessibility, isfamilyfriendly,
    menu, popularitems,
    pricelevel, averagecost,
    timing, season, isrecurring, frequency,
    distancefromshillong, distancefromguwahati,
    contact, email, website, socialmedia,
    tips, warnings,
    viewcount, view_count, click_count,
    meta_title, meta_description, popularityindex, visibilitystatus, highlight, sponsoredby,
    adslot, adactive, isfeaturedforhome,
    ai_score, search_keywords, searchboost, summary, include_in_ai_search, faq_answers,
    created_at
  `;

  // Try with visibilitystatus visible first; fall back to any
  let { data, error } = await sb
    .from("cafes_and_restaurants")
    .select(select)
    .eq("slug", slug)
    .eq("visibilitystatus", "visible")
    .maybeSingle<CafeAndRestaurant>();

  if (!data) {
    const res2 = await sb
      .from("cafes_and_restaurants")
      .select(select)
      .eq("slug", slug)
      .maybeSingle<CafeAndRestaurant>();
    error = res2.error;
    data = res2.data ?? null;
  }

  if (!data) return notFound();

  const ogImage = data.image || data.gallery?.[0] || undefined;

  return (
    <>
      <CafeRestaurantDetailSEO
        name={data.meta_title || data.name || "Cafe/Restaurant"}
        description={data.meta_description || data.summary || data.description || undefined}
        image={ogImage}
        canonicalPath={`/cafesRestaurants/${slug}`}
        // no ratingAvg/Count in your interface; AverageRating widget still works separately
      />
      {/* Narrow type to your interface for the client */}
      <CafeClient initial={data as CafeAndRestaurant} />
    </>
  );
}
