// src/app/components/seo/ItineraryDetailSEO.tsx
"use client";

import Head from "next/head";
import { useMemo } from "react";
import { usePathname } from "next/navigation";

export default function ItineraryDetailSEO({
  name,
  description,
  image,
  canonicalPath,
  days,
  startingPoint,
  theme = [],
  ratingAvg,
  ratingCount,
}: {
  name: string;
  description?: string;
  image?: string;
  canonicalPath: string;
  days?: number;
  startingPoint?: string;
  theme?: string[];
  ratingAvg?: number;
  ratingCount?: number;
}) {
  const path = usePathname() || canonicalPath;
  const canonical = useMemo(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://www.meghtourism.com";
    return `${origin}${canonicalPath || path}`;
  }, [canonicalPath, path]);

  const title = `${name} | Meghtourism`;
  const desc = description || `${name} itinerary in Meghalaya.`;

  // Use a trip-like schema (TouristTrip is niche; fallback to CreativeWork/Trip)
  const ldTrip: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "Trip",
    name,
    description: desc,
    url: canonical,
    image: image ? [image] : undefined,
    itinerary: days ? `${days} day plan` : undefined,
    offers: undefined, // plug in if you expose pricing as an Offer
    keywords: theme.join(", "),
    // Aggregate rating if available
    aggregateRating:
      typeof ratingAvg === "number" && typeof ratingCount === "number" && ratingCount > 0
        ? { "@type": "AggregateRating", ratingValue: Number(ratingAvg.toFixed(1)), ratingCount }
        : undefined,
    // Start location
    startLocation: startingPoint
      ? { "@type": "Place", name: startingPoint }
      : undefined,
  };

  const ldBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.meghtourism.com/" },
      { "@type": "ListItem", position: 2, name: "Itineraries", item: "https://www.meghtourism.com/itineraries" },
      { "@type": "ListItem", position: 3, name, item: canonical },
    ],
  };

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={desc} />
      {image && <meta property="og:image" content={image} />}
      <meta property="og:url" content={canonical} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldTrip) }} />
      <meta name="robots" content="index,follow" />
    </Head>
  );
}
