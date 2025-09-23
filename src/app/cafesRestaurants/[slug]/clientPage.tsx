// src/app/cafesRestaurants/[slug]/clientPage.tsx
"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import DescriptionToggle from "@/components/common/descriptionToggle";
import useRelatedForRestaurant from "@/hooks/useRelatedForRestaurant";
import HorizontalSection from "@/components/common/horizonatlSection";
import ReviewSection from "@/components/reviews/reviewSection";
import AverageRating from "@/components/reviews/averageRating";
import type { CafeAndRestaurant } from "@/types/cafeRestaurants";
import {
  MapPin, Clock, Heart, Share2, ImageIcon, Info, IndianRupee
} from "lucide-react";

/* --------------------------------- utils --------------------------------- */
function cx(...c: (string | false | null | undefined)[]) { return c.filter(Boolean).join(" "); }

function Chip({
  children,
  tone = "gray",
}: {
  children: React.ReactNode;
  tone?: "gray" | "orange" | "green" | "blue" | "sky" | "violet" | "amber";
}) {
  const tones: Record<string, string> = {
    gray: "bg-gray-100 text-gray-800 ring-gray-200",
    orange: "bg-orange-100 text-orange-700 ring-orange-200",
    green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    blue: "bg-blue-50 text-blue-800 ring-blue-200",
    sky: "bg-sky-100 text-sky-700 ring-sky-200",
    violet: "bg-violet-50 text-violet-800 ring-violet-200",
    amber: "bg-amber-50 text-amber-800 ring-amber-200",
  };
  return <span className={`px-3 py-1 text-xs rounded-full ring-1 ${tones[tone]}`}>{children}</span>;
}

/* -------------------------------- Header --------------------------------- */
function Header({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b">
      <div className="mx-auto w-full max-w-[680px] px-4 md:px-5">
        <div className="py-2 flex items-center gap-2">
          <div className="w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold">
            M
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] text-gray-500 truncate">Meghtourism</div>
            <div className="text-sm font-semibold truncate">{title || "Explore Meghalaya"}</div>
          </div>
          <button
            onClick={() => alert("PWA: Add to Home Screen")}
            className="px-3 py-1.5 rounded-xl bg-gray-900 text-white text-xs"
          >
            Install
          </button>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------ Client Page ------------------------------ */
export default function ClientPage({ initial }: { initial: CafeAndRestaurant }) {
  const cafe = initial;
  const slug = cafe.slug || cafe.id;

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const [wish, setWish] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  useEffect(() => setLightboxIndex(null), [slug]);

  /* --------- Gallery (same behavior as itineraries) ---------- */
  const gallery: string[] = useMemo(() => {
    const imgs = [
      ...(cafe.image ? [cafe.image] : []),
      ...(Array.isArray(cafe.gallery) ? cafe.gallery : []),
    ].filter(Boolean);
    const unique = Array.from(new Set(imgs));
    return unique.length ? unique : ["/placeholder.jpg"];
  }, [cafe.image, cafe.gallery]);

  /* --------------------------- Related (rails) ---------------------------- */
  const related = useRelatedForRestaurant({
    area: cafe.area,
    location: cafe.location,
    district: cafe.district,
    id: cafe.id,
    slug: cafe.slug,
    type: cafe.type,
  } as any);

  /* -------------------------------- Share -------------------------------- */
  const onShare = () => {
    const shareData = {
      title: cafe.name,
      text: cafe.summary || cafe.description?.slice?.(0, 140) || "",
      url: typeof window !== "undefined" ? window.location.href : "",
    };
    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href).then(() => alert("Link copied"));
    }
  };

  /* --------------------------------- UI ---------------------------------- */
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f0f7ff_0%,#ffffff_32%)] text-gray-900">
      <Header title={cafe.name} />

      <div className="mx-auto w-full max-w-[680px] px-4 md:px-5">
        {/* ----------------------- Hero gallery + thumbs ---------------------- */}
        <section className="mt-3">
          <div className="rounded-xl relative overflow-x-auto no-scrollbar snap-x snap-mandatory flex" aria-label="Cafe images">
            {gallery.map((src, idx) => (
              <div key={`${slug}:${src}`} className="snap-center shrink-0 w-full h-56 sm:h-72 relative">
                <Image
                  src={src}
                  alt={cafe.cover_image_alt || cafe.name}
                  fill
                  className="object-cover"
                  sizes="(max-width:768px) 100vw, 960px"
                  priority={idx === 0}
                  onClick={() => setLightboxIndex(idx)}
                />
              </div>
            ))}
          </div>

          <div className="px-1 py-2">
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {gallery.map((src, idx) => (
                <button
                  key={`${slug}:thumb:${src}`}
                  className="relative w-24 h-16 rounded-lg overflow-hidden border"
                  onClick={() => setLightboxIndex(idx)}
                  aria-label={`Open image ${idx + 1}`}
                >
                  <Image src={src} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" sizes="96px" />
                </button>
              ))}
              {gallery.length === 0 && (
                <div className="w-24 h-16 rounded-lg border flex items-center justify-center text-xs text-gray-500">
                  <ImageIcon size={16} /> No images
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ----------------- Overview — compact like itineraries ---------------- */}
        <section className="pt-2">
          <div className="flex items-start gap-2">
            <h1 className="text-lg font-semibold leading-snug flex-1">{cafe.name || "Cafe/Restaurant"}</h1>

            <button
              onClick={() => setWish((w) => !w)}
              className={cx("p-2 rounded-full bg-white border shadow", wish && "text-rose-600")}
              aria-label="Save"
            >
              <Heart size={18} fill={wish ? "currentColor" : "none"} />
            </button>

            <button onClick={onShare} className="p-2 rounded-full bg-white border shadow" aria-label="Share">
              <Share2 size={18} />
            </button>
          </div>

          {/* Address + rating chip */}
          <div className="mt-1 flex flex-wrap gap-2 text-[13px] text-gray-700">
            {cafe.address && (
              <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                <MapPin size={12} />
                {cafe.address}
              </span>
            )}
            {slug && (
              <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                <AverageRating category="cafeRestaurant" itemId={slug} />
              </span>
            )}
          </div>

          {/* Cuisine chips */}
          {Array.isArray(cafe.cuisine) && cafe.cuisine.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {cafe.cuisine.map((c) => (
                <Chip key={c} tone="orange">
                  {c}
                </Chip>
              ))}
            </div>
          )}

          {/* Summary / Description */}
          {(cafe.summary || cafe.description) && (
            <p className="text-[13px] text-gray-700 leading-relaxed mt-2 text-justify">
              {cafe.summary || <DescriptionToggle text={cafe.description} />}
            </p>
          )}
        </section>

        {/* -------- Timing • Avg cost (per person) • Promos/season note -------- */}
        {(cafe.timing ||
          typeof cafe.averagecost === "number" ||
          cafe.pricelevel ||
          cafe.highlight ||
          cafe.sponsoredby ||
          cafe.season) && (
          <section className="pt-3">
            <div className="rounded-2xl bg-white border border-gray-100 shadow p-3 text-sm flex flex-wrap items-center gap-3">
              {cafe.timing && (
                <span className="inline-flex items-center gap-1">
                  <Clock size={14} /> {cafe.timing}
                </span>
              )}
              {typeof cafe.averagecost === "number" && (
                <span className="inline-flex items-center gap-1">
                  <IndianRupee size={14} /> ₹{cafe.averagecost} per person
                </span>
              )}
              {cafe.pricelevel && <Chip tone="green">Price level: {cafe.pricelevel}</Chip>}
              {cafe.highlight && <Chip tone="blue">Featured</Chip>}
              {cafe.sponsoredby && <Chip tone="blue">Sponsored by {cafe.sponsoredby}</Chip>}
              {cafe.season && (
                <div className="basis-full text-xs text-gray-600 flex items-center gap-1 mt-1">
                  <Info size={12} /> {cafe.season}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ---------------------- Menu + Popular items ----------------------- */}
        {(Array.isArray(cafe.menu) && cafe.menu.length > 0) ||
        (Array.isArray(cafe.popularitems) && cafe.popularitems.length > 0) ? (
          <section className="pt-3">
            {Array.isArray(cafe.menu) && cafe.menu.length > 0 && (
              <div className="mb-3">
                <div className="text-sm font-medium text-gray-800 mb-2">Menu</div>
                <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                  {cafe.menu.map((dish, i) => (
                    <li key={i}>{dish}</li>
                  ))}
                </ul>
              </div>
            )}
            {Array.isArray(cafe.popularitems) && cafe.popularitems.length > 0 && (
              <div>
                <div className="text-sm font-medium text-gray-800 mb-1">Popular items</div>
                <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                  {cafe.popularitems.map((it, i) => (
                    <li key={i}>{it}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        ) : null}

        {/* --------------------- Amenities & extra chips --------------------- */}
        {(cafe.features?.length ||
          cafe.dietaryoptions?.length ||
          cafe.accessibility?.length ||
          cafe.theme?.length ||
          cafe.visitseason?.length) && (
          <section className="pt-3">
            {Array.isArray(cafe.features) && cafe.features.length > 0 && (
              <>
                <h2 className="text-sm font-semibold text-gray-800 mb-1">Amenities</h2>
                <div className="flex flex-wrap gap-2 mb-2">
                  {cafe.features.map((f) => (
                    <Chip key={f} tone="green">
                      {f}
                    </Chip>
                  ))}
                </div>
              </>
            )}
            <div className="flex flex-wrap gap-2">
              {Array.isArray(cafe.dietaryoptions) &&
                cafe.dietaryoptions.map((d) => <Chip key={d}>Dietary: {d}</Chip>)}
              {Array.isArray(cafe.accessibility) &&
                cafe.accessibility.map((a) => <Chip key={a}>Access: {a}</Chip>)}
              {Array.isArray(cafe.theme) && cafe.theme.map((t) => <Chip key={t}>Theme: {t}</Chip>)}
              {Array.isArray(cafe.visitseason) &&
                cafe.visitseason.map((s) => <Chip key={s}>Best: {s}</Chip>)}
            </div>
          </section>
        )}

        {/* ------------------------- Tips & warnings ------------------------- */}
        {(Array.isArray(cafe.tips) && cafe.tips.length > 0) ||
        (Array.isArray(cafe.warnings) && cafe.warnings.length > 0) ? (
          <section className="pt-3">
            <h2 className="text-sm font-semibold text-gray-800 mb-2">Tips & warnings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Array.isArray(cafe.tips) && cafe.tips.length > 0 && (
                <div className="rounded-2xl border bg-white p-3">
                  <div className="text-xs font-medium text-emerald-700 mb-1">Tips</div>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {cafe.tips.map((t, idx) => (
                      <li key={idx}>{t}</li>
                    ))}
                  </ul>
                </div>
              )}
              {Array.isArray(cafe.warnings) && cafe.warnings.length > 0 && (
                <div className="rounded-2xl border bg-white p-3">
                  <div className="text-xs font-medium text-rose-700 mb-1">Warnings</div>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {cafe.warnings.map((w, idx) => (
                      <li key={idx}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        ) : null}

        {/* ---------------------------- Nearby rails ---------------------------- */}
        <section className="pt-6 space-y-6">
          <HorizontalSection title="Nearby Restaurants" type="cafesRestaurants" items={related.nearbyRestaurants} />
          <HorizontalSection title="Nearby Attractions" type="destinations" items={related.destinations} />
          <HorizontalSection title="Nearby Stays" type="homestays" items={related.homestays} />
          <HorizontalSection title="🎉 What's Happening" type="events" items={related.events} />
          <HorizontalSection title="🌄 Adventure Nearby" type="thrills" items={related.thrills} />
          <HorizontalSection title="📜 Itineraries" type="itineraries" items={related.itineraries} />
          <HorizontalSection title="🛵 Get a Rental" type="rentals" items={related.rentals} />
        </section>

        {/* ------------------------------ Reviews ------------------------------ */}
        {slug && (
          <section className="pt-4 pb-10">
            <div className="text-sm font-medium text-gray-800 mb-2">Reviews</div>
            <ReviewSection category="cafeRestaurant" itemId={slug} />
          </section>
        )}
      </div>

      {/* ------------------------------- Lightbox ------------------------------ */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setLightboxIndex(null)}
          style={{ backdropFilter: "blur(4px)" }}
        >
          <div
            className="relative max-w-[95vw] max-h-[95vh] rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={gallery[lightboxIndex]}
              alt={`Image ${lightboxIndex + 1}`}
              width={900}
              height={600}
              className="object-contain w-full h-full max-h-[90vh]"
              priority
            />
            <button
              className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-2 text-sm"
              onClick={() => setLightboxIndex(null)}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Hide native scrollbars for rails */}
      <style jsx global>{`
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </main>
  );
}
