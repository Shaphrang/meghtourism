// src/app/components/seo/ItinerariesSEO.tsx
"use client";

import Head from "next/head";
import { useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function ItinerariesSEO({ total }: { total: number }) {
  const pathname = usePathname() || "/itineraries";
  const sp = useSearchParams();
  const canonical = useMemo(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://www.meghtourism.com";
    const qs = sp?.toString() ? `?${sp!.toString()}` : "";
    return origin.replace(/\/$/, "") + pathname + qs;
  }, [pathname, sp]);

  const title = "Itineraries in Meghalaya | Meghtourism";
  const desc = `Explore ${total} ready-made Meghalaya itineraries—top picks, sponsored plans, and best deals.`;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={canonical} />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={desc} />

      <meta name="robots" content="index,follow" />
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
