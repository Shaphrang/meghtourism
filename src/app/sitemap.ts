export default async function sitemap() {
  const base = "https://www.meghtourism.com";
  const staticUrls = ["", "/destinations", "/homestays", "/events", "/thrills", "/cafesRestaurants", "/itineraries", "/rentals", "/blogs", "/travelTips", "/faqs"];
  return staticUrls.map((p) => ({ url: `${base}${p}`, changeFrequency: "weekly", priority: p ? 0.6 : 1.0 }));
}
