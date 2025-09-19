// src/app/components/seo/HomestaysSeo.tsx
"use client";

import Head from "next/head";
import { useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function HomestaysSEO({
  total,
  location,
  priceOp,
  price,
}: {
  total: number;
  location?: string;
  priceOp?: "lt" | "gt";
  price?: number;
}) {
  const pathname = usePathname() || "/homestays";
  const sp = useSearchParams();
  const canonical = useMemo(() => {
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://www.meghtourism.com";
    const qs = sp?.toString() ? `?${sp!.toString()}` : "";
    return origin.replace(/\/$/, "") + pathname + qs;
  }, [pathname, sp]);

  const title =
    location
      ? `Homestays in ${location} | Meghtourism`
      : "Homestays in Meghalaya | Meghtourism";

  const parts: string[] = [];
  if (location) parts.push(`Location: ${location}`);
  if (priceOp && price) parts.push(`Price ${priceOp === "lt" ? "<" : ">"} ₹${price}`);
  const desc =
    parts.length > 0
      ? `Explore ${total} homestays. ${parts.join(" • ")}.`
      : `Explore ${total} homestays across Meghalaya—best picks, top rated, deals, and more.`;

  const ogImage = undefined; // plug in a default image if you have one

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={desc} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta property="og:url" content={canonical} />

      <meta name="twitter:card" content={ogImage ? "summary_large_image" : "summary"} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={desc} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      <meta name="robots" content="index,follow" />
      {/* Minimal JSON-LD List page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: title,
            description: desc,
            url: canonical,
          }),
        }}
      />
    </Head>
  );
}
