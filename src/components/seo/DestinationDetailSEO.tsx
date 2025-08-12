// src/app/components/seo/DestinationDetailSEO.tsx
"use client";

import Head from "next/head";
import { useMemo } from "react";
import { usePathname } from "next/navigation";

type Props = {
  name: string;
  description?: string;
  image?: string;
  canonicalPath: string; // e.g. "/destinations/umiam-lake"
  location?: string;
  district?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  openingHours?: string;
  price?: number;
  tags?: string[];
  // Optional review aggregate (for richer SEO)
  ratingCount?: number;
  ratingAvg?: number;
};

export default function DestinationDetailSEO({
  name,
  description,
  image,
  canonicalPath,
  location,
  district,
  address,
  latitude,
  longitude,
  openingHours,
  price,
  tags = [],
  ratingCount,
  ratingAvg,
}: Props) {
  const path = usePathname() || canonicalPath;

  const canonical = useMemo(() => {
    // Prefer canonicalPath if provided; fall back to current path
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://www.meghtourism.com";
    const clean = (p: string) => p.replace(/\/{2,}/g, "/");
    return origin.replace(/\/$/, "") + clean(canonicalPath || path);
  }, [canonicalPath, path]);

  const title = `${name} | Meghtourism`;
  const desc = description || `Explore ${name} in Meghalaya.`;

  // ── Structured Data: Breadcrumbs
  const ldBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.meghtourism.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Destinations",
        item: "https://www.meghtourism.com/destinations",
      },
      {
        "@type": "ListItem",
        position: 3,
        name,
        item: canonical,
      },
    ],
  };

  // ── Structured Data: TouristAttraction (+ optional AggregateRating)
  const ldAttraction: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name,
    description: desc,
    url: canonical,
    image: image ? [image] : undefined,
    address: address
      ? {
        "@type": "PostalAddress",
        streetAddress: address,
        addressRegion: district || "Meghalaya",
      }
      : undefined,
    areaServed: location || district || "Meghalaya",
    geo:
      latitude != null && longitude != null
        ? { "@type": "GeoCoordinates", latitude, longitude }
        : undefined,
    openingHours,
    priceRange: typeof price === "number" ? `₹${price}` : undefined,
    keywords: tags.length ? tags.join(", ") : undefined,
    aggregateRating:
      typeof ratingCount === "number" &&
      ratingCount > 0 &&
      typeof ratingAvg === "number"
        ? {
            "@type": "AggregateRating",
            ratingValue: Number(ratingAvg.toFixed(1)),
            reviewCount: ratingCount,
          }
        : undefined,
  };

  return (
    <Head>
      {/* Primary */}
      <title>{title}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Meghtourism" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={canonical} />
      {image && <meta property="og:image" content={image} />}
      {image && <meta property="og:image:alt" content={name} />}

      {/* Twitter */}
      <meta name="twitter:card" content={image ? "summary_large_image" : "summary"} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={desc} />
      {image && <meta name="twitter:image" content={image} />}

      {/* Robots */}
      <meta name="robots" content="index,follow" />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldBreadcrumb) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldAttraction) }}
      />
    </Head>
  );
}
