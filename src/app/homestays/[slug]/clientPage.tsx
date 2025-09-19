"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Head from "next/head";
import {
  MapPin, Star, BadgePercent, Crown, Ticket, Phone,HomeIcon,Megaphone,User,
  MessageCircle, Mail, Users, ShieldCheck, ChevronLeft, ChevronRight, ImageIcon
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import ReviewSection from "@/components/reviews/reviewSection";
import HomestayDetailSEO from "@/components/seo/HomestayDetailSEO";
import ContactReveal from "@/components/contactReveal";
import Link from "next/link";
import HorizontalSection from "@/components/common/horizonatlSection";

/** Minimal shape (align with your DB/type) */
type Room = {
  name: string;
  description?: string;
  pricepernight: number;
  occupancy: number;
  availabilitystatus?: "available" | "full" | "limited";
};

type Homestay = {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  summary?: string | null;
  image?: string | null;
  gallery?: string[] | null;
  location?: string | null;
  district?: string | null;
  area?: string | null;
  address?: string | null;
  pricepernight?: number | null;
  occupancy?: number | null;
  amenities?: string[] | null;
  priceincludes?: string[] | null;
  rooms?: Room[] | null;
  specialoffers?: string | null;
  tabsforads?: string | null;
  checkin_time?: string | null;
  checkout_time?: string | null;
  cancellationpolicy?: string | null;
  house_rules?: string[] | null;
  latitude?: number | null;
  longitude?: number | null;
  contact?: string | null;
  email?: string | null;
  website?: string | null;
  nearby_points_of_interest?: string[] | null;
  distancefromshillong?: string | null;
  distancefromguwahati?: string | null;
  faq_answers?: { question: string; answer: string }[] | null;
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
          <div className="text-sm font-semibold">Explore Best Homestays</div>
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
  initial: Homestay;
  relatedInitial?: RelatedItem[];
  ratingInitial?: { count: number; avg: number };
}) {
  const [homestay, setHomestay] = useState<Homestay | null>(initial);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const related = React.useMemo(() => {
  const b = {
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
        id: String(r.id),
        slug: r.slug,
        name: r.title,
        image: r.image || undefined,
        location: r.location || r.district || undefined,
      };
      if (r.type === "destinations") b.nearbyDestinations.push(card);
      else if (r.type === "homestays") b.homestays.push(card);
      else if (r.type === "events") b.events.push(card);
      else if (r.type === "thrills") b.thrills.push(card);
      else if (r.type === "restaurants") b.restaurants.push(card);
      else if (r.type === "itineraries") b.itineraries.push(card);
      else if (r.type === "rentals") b.rentals.push(card);
    }
    return b;
  }, [relatedInitial]);
  console.log("[HomestayDetail:Client] relatedInitial sample:", relatedInitial?.slice(0,3));

  // Background refresh (keeps page fresh during long sessions)
  useEffect(() => {
    let active = true;
    (async () => {
      if (!initial?.slug) return;
      const { data } = await supabase
        .from("homestays")
        .select("*")
        .eq("slug", initial.slug)
        .single();
      if (active && data) setHomestay(data as Homestay);
    })();
    return () => {
      active = false;
    };
  }, [initial?.slug]);

  if (!homestay) {
    return (
      <>
        <Head><title>Loading… | Meghtourism</title></Head>
        <div className="flex justify-center items-center min-h-screen text-lg text-gray-400">
          Loading homestay…
        </div>
      </>
    );
  }

  // ---------- Data prep ----------
  const gallery = Array.isArray(homestay.gallery) ? homestay.gallery.filter(Boolean) : [];
  if (gallery.length === 0 && homestay.image) gallery.push(homestay.image);
  const heroImages = gallery.length ? gallery : ["/placeholder.jpg"];

  const discount = (() => {
    const s = homestay.specialoffers?.toString() || "";
    const m = s.match(/(\d{1,2})\s*%/);
    return m ? Math.min(99, Math.max(1, parseInt(m[1], 10))) : undefined;
  })();

  const badge = (() => {
    const s = (homestay.tabsforads || "").toLowerCase();
    if (s.includes("best")) return "best";
    if (s.includes("top")) return "top";
    if (s.includes("deal")) return "deals";
    if (s.includes("ad") || s.includes("sponsor")) return "ads";
    return undefined as "best" | "top" | "deals" | "ads" | undefined;
  })();

  const chips: { icon?: React.ReactNode; label: string }[] = [];
  if (typeof homestay.pricepernight === "number")
    chips.push({ icon: <Ticket size={14} className="mr-1" />, label: `From ₹${homestay.pricepernight}/night` });
  if (homestay.area) chips.push({ icon: <MapPin size={14} className="mr-1" />, label: homestay.area });
  (homestay.priceincludes ?? []).forEach((x) => chips.push({ label: x }));
  (homestay.amenities ?? []).slice(0, 3).forEach((x) => chips.push({ label: x }));

  const descShort =
    homestay.description && homestay.description.length > 220 && !showFullDesc
      ? homestay.description.slice(0, 220) + "…"
      : homestay.description || homestay.summary || "";

  const canonicalPath = `/homestays/${homestay.slug}`;

  // Reveal contact (optionally track clicks)
  const onRevealContact = async () => {
    setRevealed(true);
    try {
      await supabase.rpc("increment_click_count", {
        table_name: "homestays",
        row_slug: homestay.slug,
      });
    } catch {}
  };

  return (
    <>
      {/* SEO */}
      <HomestayDetailSEO
        name={homestay.name}
        description={homestay.summary || descShort}
        image={heroImages[0]}
        canonicalPath={canonicalPath}
        location={homestay.location || undefined}
        district={homestay.district || undefined}
        address={homestay.address || undefined}
        latitude={homestay.latitude ?? undefined}
        longitude={homestay.longitude ?? undefined}
        price={homestay.pricepernight ?? undefined}
        tags={homestay.amenities || undefined}
        ratingAvg={ratingInitial?.avg}
        ratingCount={ratingInitial?.count}
      />

      <main className="bg-white min-h-screen text-gray-900">
        {/* Sticky header with name + location */}
        <Header />

        {/* 1) Swipeable hero gallery */}
        <section className="max-w-screen-sm mx-auto px-3 mt-2">
          <div className="rounded-xl relative overflow-x-auto no-scrollbar snap-x snap-mandatory flex" aria-label="Homestay images">
            {heroImages.map((src, i) => (
              <div key={i} className="snap-center shrink-0 w-full h-56 sm:h-72 relative">
                <Image
                  src={src}
                  alt={homestay.name}
                  fill
                  className="object-cover"
                  priority={i === 0}
                  sizes="(max-width: 768px) 100vw, 768px"
                  onClick={() => setLightboxIndex(i)}
                />
                {/* Top badges */}
                <div className="absolute inset-x-0 top-2 px-3 flex justify-between">
                  <div className="flex gap-1">
                    {badge === "best" && (
                      <span className="bg-amber-100 text-amber-800 text-[11px] px-2 py-0.5 rounded-full inline-flex items-center gap-1"><Crown size={12}/> Best</span>
                    )}
                    {badge === "top" && (
                      <span className="bg-white/90 border text-gray-900 text-[11px] px-2 py-0.5 rounded-full inline-flex items-center gap-1"><Star size={12} className="text-amber-500"/> Top rated</span>
                    )}
                    {badge === "deals" && (
                      <span className="bg-emerald-100 text-emerald-800 text-[11px] px-2 py-0.5 rounded-full inline-flex items-center gap-1"><BadgePercent size={12}/> Deal</span>
                    )}
                    {badge === "ads" && (
                      <span className="bg-indigo-100 text-indigo-800 text-[11px] px-2 py-0.5 rounded-full inline-flex items-center gap-1">Ad</span>
                    )}
                  </div>
                  {typeof discount === "number" && (
                    <span className="bg-rose-600 text-white text-[11px] px-2 py-0.5 rounded-full">{discount}% off</span>
                  )}
                </div>

                {/* arrows as visual hint */}
                {i > 0 && <ChevronLeft className="absolute left-2 top-1/2 -translate-y-1/2 text-white/90" size={18}/>}
                {i < heroImages.length - 1 && <ChevronRight className="absolute right-2 top-1/2 -translate-y-1/2 text-white/90" size={18}/>}
              </div>
            ))}
          </div>

          {/* Thumbnails rail */}
          <div className="px-4 py-2">
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {heroImages.map((src, i) => (
                <button
                  key={i}
                  className="relative w-24 h-16 rounded-lg overflow-hidden border"
                  onClick={() => setLightboxIndex(i)}
                  aria-label={`Open image ${i + 1}`}
                >
                  <Image src={src} alt={`Thumbnail ${i + 1}`} fill className="object-cover" sizes="(max-width: 480px) 85vw, (max-width: 768px) 45vw, 33vw"/>
                </button>
              ))}
              {heroImages.length === 0 && (
                <div className="w-24 h-16 rounded-lg border flex items-center justify-center text-xs text-gray-500">
                  <ImageIcon size={16}/> No images
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 2) Title + description + chips */}
        <section className="max-w-screen-sm mx-auto px-4">
            <h1 className="text-lg font-semibold">{homestay.name}</h1>
            {/* rating + address row */}
            <div className="mt-1 flex items-center flex-wrap gap-x-2 gap-y-1 text-[13px] text-gray-700">
              {ratingInitial && ratingInitial.count > 0 && (
                <span className="inline-flex items-center gap-1 text-amber-700">
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  {ratingInitial.avg.toFixed(1)}
                  <span className="text-gray-500">({ratingInitial.count})</span>
                </span>
              )}
              <span className="text-gray-300">•</span>
              <span className="inline-flex items-center gap-1">
                <MapPin size={14} className="text-emerald-700" />
                {homestay.location || homestay.district || "Meghalaya"}
              </span>
            </div>
          {homestay.description && (
            <p className="text-sm text-gray-700 mt-1 text-justify leading-relaxed">
              {showFullDesc ? homestay.description : descShort}
              {homestay.description.length > 220 && (
                <button onClick={() => setShowFullDesc((s) => !s)} className="ml-1 text-emerald-700 text-sm font-medium">
                  {showFullDesc ? "Show less" : "Show more"}
                </button>
              )}
            </p>
          )}
          <div className="mt-2 flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {chips.map((c, idx) => (
              <span key={idx} className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-[12px] whitespace-nowrap">
                {c.icon}{c.label}
              </span>
            ))}
          </div>
        </section>

        {/* Contact */}
        {(homestay.contact || homestay.email || homestay.website) && (
          <section className="max-w-screen-sm mx-auto px-4 mt-3">
            <ContactReveal
              phone={homestay.contact || undefined}   // 👈 pass contact as phone
              whatsapp={homestay.contact || undefined}
              email={homestay.email || undefined}
              website={homestay.website || undefined}
              message="Want direct owner contact? No brokers, save money!"
              onReveal={async () => {
                try {
                  await supabase.rpc("increment_click_count", {
                    table_name: "homestays",
                    row_slug: homestay.slug,
                  });
                } catch {}
              }}
            />
          </section>
        )}

        {/* 4) Rooms */}
        <section className="max-w-screen-sm mx-auto px-4 mt-4">
          <h2 className="text-[15px] font-semibold mb-2">Rooms</h2>
          {(homestay.rooms?.length ?? 0) === 0 ? (
            <div className="text-xs text-gray-500">Room details coming soon.</div>
          ) : (
            <div className="space-y-3">
              {homestay.rooms!.map((r, idx) => (
                <article key={idx} className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
                  {heroImages[0] && (
                    <div className="relative h-32">
                      <Image src={heroImages[0]} alt={r.name} fill className="object-cover" sizes="(max-width: 480px) 85vw, (max-width: 768px) 45vw, 33vw"/>
                    </div>
                  )}
                  <div className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-[13px] font-semibold">{r.name}</div>
                        <div className="text-[11px] text-gray-600 flex items-center gap-2 mt-0.5">
                          <span className="inline-flex items-center gap-1"><Users size={12}/> {r.occupancy} guests</span>
                          {r.availabilitystatus && (
                            <span className="inline-flex items-center gap-1"><ShieldCheck size={12}/> {r.availabilitystatus}</span>
                          )}
                        </div>
                      </div>
                      <div className="text-[13px] font-semibold text-emerald-700">
                        ₹{r.pricepernight.toLocaleString("en-IN")} <span className="text-[11px] text-gray-500 font-normal">/ night</span>
                      </div>
                    </div>
                    {r.description && <p className="text-[12px] text-gray-700 mt-1">{r.description}</p>}
                    <div className="mt-2 flex gap-2">
                      <button className="flex-1 h-9 rounded-full bg-emerald-600 text-white text-[12px] font-medium">Contact to Book</button>
                      <button onClick={() => setLightboxIndex(0)} className="h-9 px-3 rounded-full bg-gray-900 text-white text-[12px]">View Photos</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* 5) Amenities */}
        <section className="max-w-screen-sm mx-auto px-4 mt-5">
          <h2 className="text-[15px] font-semibold mb-2">Amenities</h2>

          <div className="grid grid-cols-3 gap-2">
            {(homestay.amenities ?? ["Wi-Fi", "Breakfast", "Parking"]).map((a, i) => (
              <span
                key={i}
                className="mx-auto inline-flex items-center justify-center w-full max-w-[9rem] px-3 py-1 text-xs text-emerald-700 bg-emerald-50 rounded-full text-center truncate"
                title={a}
              >
                {a}
              </span>
            ))}
          </div>

          {(homestay.distancefromshillong || homestay.distancefromguwahati) && (
            <p className="text-[12px] text-gray-600 mt-2">
              {homestay.distancefromshillong && <>Approx. from Shillong: <strong>{homestay.distancefromshillong}</strong> kms. </>}
              {homestay.distancefromguwahati && <>From Guwahati: <strong>{homestay.distancefromguwahati}</strong> kms.</>}
            </p>
          )}
        </section>


        {/* 6) Policies */}
        <section className="max-w-screen-sm mx-auto px-4 mt-5">
          <h2 className="text-[15px] font-semibold mb-2">Policies & Rules</h2>
          <div className="bg-gray-50 rounded-xl p-3 shadow-sm space-y-3">
            <div>
              <div className="text-[11px] text-gray-700 font-semibold uppercase tracking-wider">Check-in / Check-out</div>
              <div className="text-[12px] text-gray-900 mt-0.5">{homestay.checkin_time || "—"} – {homestay.checkout_time || "—"}</div>
            </div>
            <div>
              <div className="text-[11px] text-gray-700 font-semibold uppercase tracking-wider">Cancellation</div>
              <div className="text-[12px] text-gray-900 mt-0.5">{homestay.cancellationpolicy || "Standard cancellation policy applies."}</div>
            </div>
            <div>
              <div className="text-[11px] text-gray-700 font-semibold uppercase tracking-wider">House rules</div>
              <ul className="list-disc pl-5 text-[12px] text-gray-900 mt-0.5 space-y-1">
                {(homestay.house_rules ?? ["No loud music after 10 PM", "No smoking indoors", "ID required at check-in"]).map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Related sections (same pattern as destination detail) */}
          <section className="max-w-screen-sm mx-auto px-4 mt-6 space-y-6">
          <HorizontalSection title="Nearby Destinations" type="destinations" items={related.nearbyDestinations} />
          <HorizontalSection title="Nearby Homestays"  type="homestays"    items={related.homestays} />
          <HorizontalSection title="🎉 What's Happening" type="events"     items={related.events} />
          <HorizontalSection title="🌄 Adventure Nearby"  type="thrills"    items={related.thrills} />
          <HorizontalSection title="🍴 Places to Eat"     type="cafesRestaurants" items={related.restaurants} />
          <HorizontalSection title="📜 Itineraries"       type="itineraries" items={related.itineraries} />
          <HorizontalSection title="🛵 Get a Rental"      type="rentals"     items={related.rentals} />
        </section>

        {/* 7) Reviews */}
        <section className="max-w-screen-sm mx-auto px-3 mt-5">
          <h2 className="text-[15px] font-semibold">Reviews</h2>
          <ReviewSection category="homestay" itemId={homestay.slug} />
        </section>

        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/95 backdrop-blur border-t z-40">
          <div className="px-6 py-2 grid grid-cols-4 text-xs">
            <Link href="/" className="flex flex-col items-center text-emerald-700"><HomeIcon size={20}/>Home</Link>
            <Link href="/destinations" className="flex flex-col items-center text-gray-600"><Megaphone size={20}/>Scenaries</Link>
            <Link href="/events" className="flex flex-col items-center text-gray-600"><User size={20}/>Events</Link>
            <Link href="/itineraries" className="flex flex-col items-center text-gray-600"><User size={20}/>Itineraries</Link>
          </div>
        </nav>
      </main>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setLightboxIndex(null)}
          style={{ backdropFilter: "blur(4px)" }}
        >
          <div className="relative max-w-[95vw] max-h-[95vh] rounded-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {lightboxIndex > 0 && (
              <button onClick={() => setLightboxIndex(lightboxIndex - 1)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/70 text-white rounded-full p-2 z-10" aria-label="Previous">
                &#8592;
              </button>
            )}
            {lightboxIndex < heroImages.length - 1 && (
              <button onClick={() => setLightboxIndex(lightboxIndex + 1)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/70 text-white rounded-full p-2 z-10" aria-label="Next">
                &#8594;
              </button>
            )}
            <Image
              src={heroImages[lightboxIndex]}
              alt={`Image ${lightboxIndex + 1}`}
              width={900}
              height={600}
              className="object-contain w-full h-full max-h-[90vh]"
              priority
            />
            <button className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-2 text-sm" onClick={() => setLightboxIndex(null)} aria-label="Close">
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Hide native scrollbar on rails */}
      <style jsx global>{`
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </>
  );
}
