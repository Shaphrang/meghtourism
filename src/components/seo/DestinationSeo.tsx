// src/app/components/seo/DestinationsSEO.tsx
"use client";
import Head from "next/head";
import { usePathname, useSearchParams } from "next/navigation";
import { useMemo } from "react";

export default function DestinationsSEO({
  total,
  location,
  district,
}: {
  total: number;
  location?: string;
  district?: string;
}) {
  const path = usePathname() || "/destinations";
  const params = useSearchParams();

  const canonical = useMemo(() => {
    const p = new URLSearchParams(params?.toString() || "");
    if (p.get("page") === "1") p.delete("page");
    return `https://www.meghtourism.com${path}${p.toString() ? `?${p}` : ""}`;
  }, [params, path]);

  const titleBase = "Destinations in Meghalaya";
  const title =
    location ? `${titleBase} — ${location}` :
    district ? `${titleBase} — ${district} District` :
    titleBase;

  const description = `Browse ${total}+ destinations across Meghalaya${location ? ` in ${location}` : district ? ` in ${district} district` : ""}. Filter fast, scroll smoothly, and explore in an app-like experience.`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": title,
    "description": description,
  };

  return (
    <Head>
      <title>{title} | Meghtourism</title>
      <meta name="description" content={description}/>
      <link rel="canonical" href={canonical}/>
      <meta property="og:type" content="website"/>
      <meta property="og:title" content={`${title} | Meghtourism`}/>
      <meta property="og:description" content={description}/>
      <meta property="og:url" content={canonical}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </Head>
  );
}
