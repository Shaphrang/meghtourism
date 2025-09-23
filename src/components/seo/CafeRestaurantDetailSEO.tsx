// 6) src/app/components/seo/CafeRestaurantDetailSEO.tsx (Detail SEO)
//
"use client";
import Head from "next/head";
import { useMemo } from "react";
import { usePathname } from "next/navigation";

export default function CafeRestaurantDetailSEO({
  name,
  description,
  image,
  canonicalPath,
  ratingAvg,
  ratingCount,
}: {
  name: string;
  description?: string;
  image?: string;
  canonicalPath: string;
  ratingAvg?: number;
  ratingCount?: number;
}) {
  const path = usePathname() || canonicalPath;
  const canonical = useMemo(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://www.meghtourism.com";
    return `${origin}${canonicalPath || path}`;
  }, [canonicalPath, path]);

  const title = `${name} | Meghtourism`;
  const desc = description || `${name} — cafe/restaurant in Meghalaya.`;

  const ldPlace: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name,
    description: desc,
    url: canonical,
    image: image ? [image] : undefined,
    aggregateRating:
      typeof ratingAvg === "number" && typeof ratingCount === "number" && ratingCount > 0
        ? { "@type": "AggregateRating", ratingValue: Number(ratingAvg.toFixed(1)), ratingCount }
        : undefined,
  };

  const ldBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.meghtourism.com/" },
      { "@type": "ListItem", position: 2, name: "Cafes & Restaurants", item: "https://www.meghtourism.com/cafesRestaurants" },
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldPlace) }} />
      <meta name="robots" content="index,follow" />
    </Head>
  );
}