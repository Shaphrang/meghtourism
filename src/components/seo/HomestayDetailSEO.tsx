// src/app/components/seo/HomestayDetailSEO.tsx
"use client";

import Head from "next/head";
import { useMemo } from "react";
import { usePathname } from "next/navigation";

export default function HomestayDetailSEO({
  name,
  description,
  image,
  canonicalPath,
  location,
  district,
  address,
  latitude,
  longitude,
  price,
  tags = [],
  ratingAvg,
  ratingCount,
}: {
  name: string;
  description?: string;
  image?: string;
  canonicalPath: string;
  location?: string;
  district?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  price?: number;
  tags?: string[];
  ratingAvg?: number;
  ratingCount?: number;
}) {
  const path = usePathname() || canonicalPath;
  const canonical = useMemo(() => {
    const origin =
      typeof window !== "undefined" ? window.location.origin : "https://www.meghtourism.com";
    return `${origin}${canonicalPath || path}`;
  }, [canonicalPath, path]);

  const title = `${name} | Meghtourism`;
  const desc = description || `Stay at ${name} in Meghalaya.`;

  // Lodging schema (works well for homestays/guest houses)
  const ldLodging: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name,
    description: desc,
    url: canonical,
    image: image ? [image] : undefined,
    address: address
      ? {
          "@type": "PostalAddress",
          streetAddress: address,
          addressRegion: district || "Meghalaya",
          addressLocality: location || undefined,
          addressCountry: "IN",
        }
      : undefined,
    geo:
      latitude != null && longitude != null
        ? { "@type": "GeoCoordinates", latitude, longitude }
        : undefined,
    priceRange: price ? `₹${price}` : undefined,
    keywords: tags.join(", "),
    aggregateRating:
      typeof ratingAvg === "number" && typeof ratingCount === "number" && ratingCount > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: Number(ratingAvg.toFixed(1)),
            ratingCount,
          }
        : undefined,
  };

  const ldBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.meghtourism.com/" },
      { "@type": "ListItem", position: 2, name: "Homestays", item: "https://www.meghtourism.com/homestays" },
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldLodging) }} />
      <meta name="robots" content="index,follow" />
    </Head>
  );
}
