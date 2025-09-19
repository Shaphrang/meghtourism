// src/app/destinations/[slug]/clientPage.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Head from "next/head";
import { MapPin, Calendar, Ticket, Tag, Star, Info, HomeIcon,Megaphone,User } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

import HorizontalSection from "@/components/common/horizonatlSection";
import ReviewSection from "@/components/reviews/reviewSection";
import DestinationDetailSEO from "@/components/seo/DestinationDetailSEO";
import Link from "next/link";

type FAQ = { question: string; answer: string };

type Destination = {
  id: string;
  slug: string;
  name: string;
  summary?: string;
  description?: string;
  image?: string;
  gallery?: string[];
  location?: string;
  district?: string;
  address?: string;
  visitseason?: string[];
  thingstodo?: string[];
  theme?: string[];
  tags?: string[];
  entryfee?: { amount?: number; notes?: string; type?: string } | null;
  openinghours?: { open?: string; close?: string } | null;
  howtoreach?: string | null;
  highlight?: boolean | null;
  distancefromshillong?: number | string | null;
  distancefromguwahati?: number | string | null;
  latitude?: number | null;
  longitude?: number | null;
  faq_answers?: FAQ[]; // <-- FAQs
};

type RelatedItem = {
  type: "destinations" | "homestays" | "events" | "thrills" | "restaurants" | "itineraries" | "rentals";
  id: string;
  slug: string;
  title: string;
  image?: string | null;
  location?: string | null;
  district?: string | null;
};

function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b">
      <div className="px-3 py-2 flex items-center gap-2">
        <div className="w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold">M</div>
        <div className="flex-1">
          <div className="text-[11px] text-gray-500">Meghtourism</div>
          <div className="text-sm font-semibold">Explore Best Destinations</div>
        </div>
        <Link href="/" className="text-xs text-emerald-700">Home</Link>
      </div>
    </header>
  );
}

export default function ClientPage({
  initial,
  relatedInitial = [],
  ratingInitial,
}: {
  initial: Destination;
  relatedInitial?: RelatedItem[];
  ratingInitial?: { count: number; avg: number };
}) {
  // Hydrate from SSR payload
  const [destination, setDestination] = useState<Destination | null>(initial);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Debug (optional)
  console.log("[Detail:Client] initial:", {
    slug: initial?.slug,
    name: initial?.name,
    faqCount: initial?.faq_answers?.length || 0,
  });

  // Background refresh (keeps long sessions fresh; doesn’t block paint)
  useEffect(() => {
    let active = true;
    (async () => {
      if (!initial?.slug) return;
      const { data, error } = await supabase
        .from("destinations")
        .select("*")
        .eq("slug", initial.slug)
        .single();
      if (active && data && !error) setDestination(data as Destination);
    })();
    return () => {
      active = false;
    };
  }, [initial?.slug]);

  if (!destination) {
    return (
      <>
        <Head><title>Loading… | Meghtourism</title></Head>
        <div className="flex justify-center items-center min-h-screen text-lg text-gray-400">
          Loading destination…
        </div>
      </>
    );
  }

  // ----- Prep UI data (no visual changes) -----
  const gallery = Array.isArray(destination.gallery) ? destination.gallery.filter(Boolean) : [];
  if (gallery.length === 0 && destination.image) gallery.push(destination.image);

  const chips: { icon: React.ReactNode; label: string }[] = [];
  if (destination.visitseason?.length) chips.push({ icon: <Calendar size={15} className="mr-1" />, label: destination.visitseason.join(", ") });
  if (destination.entryfee?.amount)     chips.push({ icon: <Ticket   size={15} className="mr-1" />, label: `₹${destination.entryfee.amount}` });
  if (destination.highlight)            chips.push({ icon: <Star     size={15} className="mr-1" />, label: "Offbeat" });
  if (destination.theme?.length)        destination.theme.forEach((t) => chips.push({ icon: <Tag  size={15} className="mr-1" />, label: t }));
  if (destination.tags?.length)         destination.tags.forEach((t) => chips.push({ icon: <Info size={15} className="mr-1" />, label: t }));

  const distanceChips: { place: string; value: any }[] = [];
  if (destination.distancefromshillong) distanceChips.push({ place: "Shillong", value: destination.distancefromshillong });
  if (destination.distancefromguwahati) distanceChips.push({ place: "Guwahati", value: destination.distancefromguwahati });

  const descShort =
    destination.description && destination.description.length > 180 && !showFullDesc
      ? destination.description.slice(0, 180) + "…"
      : destination.description || destination.summary || "";

  // Build related buckets from SSR data (fast; no waterfalls)
  const related = (() => {
    const bucket = {
      nearbyDestinations: [] as any[],
      homestays: [] as any[],
      events: [] as any[],
      thrills: [] as any[],
      restaurants: [] as any[],
      itineraries: [] as any[],
      rentals: [] as any[],
    };
    for (const r of relatedInitial) {
      const card = {
        id: r.id,
        slug: r.slug,
        name: r.title,
        image: r.image || undefined,
        location: r.location || r.district || undefined,
      };
      if (r.type === "destinations") bucket.nearbyDestinations.push(card);
      else if (r.type === "homestays") bucket.homestays.push(card);
      else if (r.type === "events") bucket.events.push(card);
      else if (r.type === "thrills") bucket.thrills.push(card);
      else if (r.type === "restaurants") bucket.restaurants.push(card);
      else if (r.type === "itineraries") bucket.itineraries.push(card);
      else if (r.type === "rentals") bucket.rentals.push(card);
    }
    return bucket;
  })();

  const canonicalPath = `/destinations/${destination.slug}`;

  return (
    <>
      {/* SEO (Head-based, same strategy as listing) */}
      <DestinationDetailSEO
        name={destination.name}
        description={destination.summary || descShort}
        image={destination.image || gallery[0]}
        canonicalPath={canonicalPath}
        location={destination.location}
        district={destination.district}
        address={destination.address}
        latitude={destination.latitude ?? undefined}
        longitude={destination.longitude ?? undefined}
        openingHours={
          destination.openinghours?.open && destination.openinghours?.close
            ? `${destination.openinghours.open}-${destination.openinghours.close}`
            : undefined
        }
        price={destination.entryfee?.amount}
        tags={(destination.theme || []).concat(destination.tags || [])}
        // If you updated DestinationDetailSEO to accept rating, also pass:
        ratingCount={ratingInitial?.count}
        ratingAvg={ratingInitial?.avg}
      />

      {/* ===== Layout (unchanged visuals) ===== */}
      <main className="bg-white min-h-screen text-gray-900 pb-2">
        <Header />
        {/* 1) Hero */}
        <div className="px-4 pt-4">
          <div className="relative w-full h-52 sm:h-72 rounded-2xl overflow-hidden shadow">
            <Image
              src={destination.image || "/default-hero.jpg"}
              alt={destination.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 768px"
            />
            <div className="absolute left-3 bottom-3 bg-white/70 backdrop-blur-md rounded-lg px-3 py-2 shadow-sm flex flex-col max-w-[85vw]">
              <span className="text-sm font-semibold text-gray-900">
                {destination.name}
              </span>
              <span className="flex items-center text-xs text-gray-600 mt-0.5">
                {destination.location && (<><MapPin size={13} className="mr-1" />{destination.location}</>)}
                {destination.highlight && (
                  <span className="ml-2 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-[11px] font-medium">
                    Must Visit
                  </span>
                )}
                                {ratingInitial && ratingInitial.count > 0 && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px]">
                    ★ {ratingInitial.avg.toFixed(1)} ({ratingInitial.count})
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* 2) Gallery strip */}
        <section className="max-w-screen-sm mx-auto px-4 pt-1">
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {gallery.map((imgUrl, i) => (
              <div
                key={i}
                className="min-w-[90px] h-[66px] rounded-lg overflow-hidden shadow cursor-pointer"
                onClick={() => setLightboxIndex(i)}
                role="button"
                tabIndex={0}
                aria-label={`Preview image ${i + 1}`}
              >
                <Image
                  src={imgUrl}
                  alt={`Gallery ${i + 1}`}
                  width={100}
                  height={66}
                  className="object-cover w-full h-full"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </section>

        {/* 3) Chips */}
        <div className="px-4 pt-2">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {chips.map((chip, i) => (
              <span key={i} className="flex items-center px-3 py-1 bg-gray-100 text-xs rounded-full shadow whitespace-nowrap" style={{ minHeight: 32 }}>
                {chip.icon}
                {chip.label}
              </span>
            ))}
          </div>
        </div>

        {/* 4) Description */}
        <section className="max-w-screen-sm mx-auto px-4 mt-2">
          <h2 className="text-[16px] font-semibold mb-2">Description</h2>
          {destination.theme?.length ? (
            <div className="flex flex-wrap gap-2 mb-2">
              {destination.theme.map((t, i) => (
                <span key={i} className="px-3 py-1 text-xs bg-emerald-100 text-emerald-700 rounded-full">{t}</span>
              ))}
            </div>
          ) : null}
          <div
            className={
              "text-justify text-sm leading-relaxed transition-all duration-300 " +
              (!showFullDesc && destination.description && destination.description.length > 180 ? "line-clamp-4" : "")
            }
          >
            {descShort}
          </div>
          {destination.description && destination.description.length > 180 && (
            <button onClick={() => setShowFullDesc((s) => !s)} className="text-emerald-600 text-sm mt-1 hover:underline">
              {showFullDesc ? "Show Less" : "Show More"}
            </button>
          )}
        </section>

        {/* 5) Things to Do */}
        {destination.thingstodo?.length ? (
          <section className="max-w-screen-sm mx-auto px-4 mt-3">
            <h3 className="text-[16px] font-semibold mb-2">Things to Do</h3>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
              {destination.thingstodo.map((activity, idx) => (
                <span key={idx} className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full shadow whitespace-nowrap">
                  {activity}
                </span>
              ))}
            </div>
          </section>
        ) : null}

        {/* 6) Info blocks */}
        <section className="max-w-screen-sm mx-auto px-4 mt-6">
          <div className="bg-gray-50 rounded-xl p-4 shadow-sm flex flex-col gap-4">
            {/* How to Reach */}
            <div>
              <div className="mb-2 text-xs text-gray-700 font-semibold uppercase tracking-wider">How to Reach</div>
              <div className="text-gray-900 text-xs">
                {destination.howtoreach ? (
                  destination.howtoreach.includes("\n") || destination.howtoreach.includes(". ") ? (
                    <ul className="list-disc space-y-2 pl-5">
                      {(destination.howtoreach.includes("\n") ? destination.howtoreach.split("\n") : destination.howtoreach.split(". ")).map((line, idx) =>
                        !!line.trim() && (
                          <li key={idx} className="text-justify" style={{ textIndent: "-0em", paddingLeft: "0.2em", marginLeft: "0" }}>
                            <span className="block">{line.trim()}</span>
                          </li>
                        )
                      )}
                    </ul>
                  ) : (
                    <span className="text-justify">{destination.howtoreach}</span>
                  )
                ) : (
                  <span>Travel details coming soon.</span>
                )}
              </div>
            </div>

            {/* Opening Hours */}
            <div>
              <div className="flex items-center gap-1 mb-1 text-xs text-gray-700 font-semibold uppercase tracking-wider">
                <Calendar size={13} className="mr-1 inline" />
                <span>Opening Hours</span>
              </div>
              <div className="text-gray-900 text-xs ml-5">
                {destination.openinghours?.open && destination.openinghours?.close
                  ? `${destination.openinghours.open}–${destination.openinghours.close}`
                  : "N/A"}
              </div>
            </div>

            {/* Entry Fee */}
            <div>
              <div className="flex items-center gap-1 mb-1 text-xs text-gray-700 font-semibold uppercase tracking-wider">
                <Ticket size={13} className="mr-1 inline" />
                <span>Entry Fee</span>
              </div>
              <div className="text-gray-900 text-xs">
                {destination.entryfee?.notes ? (
                  <ul className="list-disc space-y-2 pl-5">
                    {destination.entryfee.notes.split(/[\n\.•]/).map((line, idx) =>
                      !!line.trim() && (
                        <li key={idx} className="text-justify" style={{ textIndent: "-0em", paddingLeft: "0.2em", marginLeft: "0" }}>
                          <span className="block">{line.trim()}</span>
                        </li>
                      )
                    )}
                  </ul>
                ) : destination.entryfee?.amount ? (
                  `₹${destination.entryfee.amount}`
                ) : destination.entryfee?.type === "Free" ? (
                  "Free"
                ) : (
                  "N/A"
                )}
              </div>
            </div>

            {/* Distance From */}
            <div>
              <div className="mb-1 text-xs text-gray-700 font-semibold uppercase tracking-wider">Distance from</div>
              <div className="text-gray-900 text-xs flex flex-col gap-0.5 ml-5">
                {distanceChips.length ? (
                  distanceChips.map((dist, idx) => (
                    <span key={idx}>
                      <span className="font-semibold">{dist.place}:</span> {dist.value} kms
                    </span>
                  ))
                ) : (
                  <span>N/A</span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 7) Address */}
        <section className="max-w-screen-sm mx-auto px-4 mt-6">
          <h3 className="text-[15px] font-semibold mb-2">Address</h3>
          <div className="flex items-center gap-2 text-gray-700">
            <MapPin size={15} className="text-emerald-600" />
            <span className="text-xs">{destination.address || "Address not available"}</span>
          </div>
        </section>

        {/* 7. FAQs Accordion */}
        {destination.faq_answers && destination.faq_answers.length > 0 && (
          <section className="max-w-screen-sm mx-auto px-4 mt-8">
            <h3 className="text-[15px] font-semibold mb-2">FAQs</h3>
            <div className="space-y-2">
              {destination.faq_answers.map((faq, i) => (
                <div key={i} className="bg-gray-50 rounded-xl shadow-sm px-4 py-3">
                  <button
                    className="w-full flex justify-between items-center text-left font-medium text-gray-800 text-xs"
                    onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  >
                    <span>{faq.question}</span>
                    <span className="ml-2">{faqOpen === i ? "▲" : "▼"}</span>
                  </button>
                  {faqOpen === i && (
                    <div className="mt-2 text-gray-700 text-xs">{faq.answer}</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 8) Related + Reviews */}
        <section className="max-w-screen-sm mx-auto px-4 pt-2 space-y-6">
          <HorizontalSection title="Nearby Destinations" type="destinations" items={related.nearbyDestinations} />
          <HorizontalSection title="Nearby Homestays"  type="homestays"    items={related.homestays} />
          <HorizontalSection title="🎉 What's Happening" type="events"     items={related.events} />
          <HorizontalSection title="🌄 Adventure Nearby"  type="thrills"     items={related.thrills} />
          <HorizontalSection title="🍴 Places to Eat"     type="cafesRestaurants" items={related.restaurants} />
          <HorizontalSection title="📜 Itineraries"       type="itineraries" items={related.itineraries} />
          <HorizontalSection title="🛵 Get a Rental"      type="rentals"     items={related.rentals} />
          <ReviewSection category="destination" itemId={destination.slug} />
        </section>

        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/95 backdrop-blur border-t z-40">
          <div className="px-6 py-2 grid grid-cols-4 text-xs">
            <Link href="/" className="flex flex-col items-center text-emerald-700"><HomeIcon size={20}/>Home</Link>
            <Link href="/destinations" className="flex flex-col items-center text-gray-600"><Megaphone size={20}/>Scenaries</Link>
            <Link href="/events" className="flex flex-col items-center text-gray-600"><User size={20}/>Events</Link>
            <Link href="/itineraries" className="flex flex-col items-center text-gray-600"><User size={20}/>Itineraries</Link>
          </div>
        </nav>

        {/* 9) Lightbox */}
        {lightboxIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={() => setLightboxIndex(null)} style={{ backdropFilter: "blur(4px)" }}>
            <div className="relative max-w-[95vw] max-h-[95vh] rounded-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
              {lightboxIndex > 0 && (
                <button onClick={() => setLightboxIndex(lightboxIndex - 1)} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/70 text-white rounded-full p-2 z-10" aria-label="Previous">
                  &#8592;
                </button>
              )}
              {lightboxIndex < gallery.length - 1 && (
                <button onClick={() => setLightboxIndex(lightboxIndex + 1)} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/70 text-white rounded-full p-2 z-10" aria-label="Next">
                  &#8594;
                </button>
              )}
              <Image
                src={gallery[lightboxIndex]}
                alt={`Gallery Preview ${lightboxIndex + 1}`}
                width={600}
                height={400}
                className="object-contain w-full h-full max-h-[90vh]"
                priority
              />
              <button className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-2 text-sm" onClick={() => setLightboxIndex(null)} aria-label="Close">
                ✕
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
