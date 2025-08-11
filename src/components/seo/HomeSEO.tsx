"use client";
import Head from "next/head";

export default function HomeSEO() {
  const title = "Meghtourism — Discover Meghalaya your way";
  const description = "Plan with smart lists, find authentic stays, and book experiences across Meghalaya in a fast, app-like site.";
  const url = "https://www.meghtourism.com/"; // update if different
  const ogImage = "/og-home.jpg"; // add a static image or CDN

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Meghtourism",
    "url": url,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${url}search?q={query}`,
      "query-input": "required name=query"
    }
  };

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description}/>
      <link rel="canonical" href={url}/>
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website"/>
      <meta property="og:title" content={title}/>
      <meta property="og:description" content={description}/>
      <meta property="og:url" content={url}/>
      <meta property="og:image" content={ogImage}/>
      {/* Instagram/FB use OG tags; Twitter optional */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </Head>
  );
}
