// src/app/itineraries/[slug]/clientPage.tsx
"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import AverageRating from "@/components/reviews/averageRating";
import ReviewSection from "@/components/reviews/reviewSection";
import ContactReveal from "@/components/contactReveal";
import { supabase } from "@/lib/supabaseClient"; // safe even if unused at runtime
import {
  CalendarDays, MapPin, Users, Star, Percent,
  Heart, Share2, ChevronLeft, ChevronRight, ImageIcon, Ticket
} from "lucide-react";

type DayPlan = { day?: number; title?: string; locations?: string[]; notes?: string };

function cx(...c: (string | false | null | undefined)[]) { return c.filter(Boolean).join(" "); }

function Header({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b">
      {/* Full-width background; content centered inside */}
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

export default function ClientPage({ initial }: { initial: any }) {
  const i = initial || {};
  const slug = i.slug || i.id || "";

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // --------- Gallery (same pattern as Homestay) ----------
  const gallery: string[] = useMemo(() => {
    const imgs = [
      ...(i.image ? [i.image] : []),                          // main first
      ...(Array.isArray(i.gallery) ? i.gallery : []),         // then gallery
    ].filter(Boolean);

    // de-dupe while preserving order
    const unique = Array.from(new Set(imgs));
    return unique.length ? unique : ["/placeholder.jpg"];
  }, [i.image, i.gallery]);

  useEffect(() => { setLightboxIndex(null); }, [slug]);


  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [wish, setWish] = useState(false);

  // discount from notes (optional)
  const discountPct = (() => {
    const m = (i.estimated_cost?.notes as string | undefined)?.match?.(/(\d{1,2})\s*%/);
    const pct = m ? Number(m[1]) : 0;
    return Number.isFinite(pct) ? Math.max(0, Math.min(99, pct)) : 0;
  })();

  // --- small helpers for new sections ---
  const arr = (v: unknown): string[] => Array.isArray(v) ? v.filter(Boolean) : [];
  const regions = arr(i.regions_covered).length ? arr(i.regions_covered) : arr(i.districts);
  const visitSeasons = arr(i.visit_season);
  const travelModes = arr(i.travel_mode);
  const themes = arr(i.theme);
  const idealFor = arr(i.idealfor);
  const tags = arr(i.tags);

  const hasTips = arr(i.tips).length > 0;
  const hasWarnings = arr(i.warnings).length > 0;
  const faqs = (i.faq_answers && Array.isArray(i.faq_answers)) ? i.faq_answers : [];

  // ---------- UI ----------
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f0f7ff_0%,#ffffff_32%)] text-gray-900">
      <Header title={i.title} />
      <div className="mx-auto w-full max-w-[680px] px-4 md:px-5">

        {/* Hero gallery + thumbnails (tap opens lightbox) */}
        <section className="mt-3">
          <div className="rounded-xl relative overflow-x-auto no-scrollbar snap-x snap-mandatory flex" aria-label="Itinerary images">
            {gallery.map((src, idx) => (
              <div key={`${slug}:${src}`} className="snap-center shrink-0 w-full h-56 sm:h-72 relative">
                <Image
                  src={src}
                  alt={i.title || "Itinerary"}
                  fill
                  className="object-cover"
                  sizes="...(same)..."
                  priority={idx === 0}
                  onClick={() => setLightboxIndex(idx)}
                />
                {/* ... */}
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
                  <ImageIcon size={16}/> No images
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Overview — compact type for PWA feel */}
        <section className="pt-2">
          <div className="flex items-start gap-2">
            <h1 className="text-lg font-semibold leading-snug flex-1">{i.title || "Itinerary"}</h1>
            <button
              onClick={() => setWish((w) => !w)}
              className={cx("p-2 rounded-full bg-white border shadow", wish && "text-rose-600")}
              aria-label="Save"
            >
              <Heart size={18} fill={wish ? "currentColor" : "none"} />
            </button>
            <button
              onClick={() =>
                navigator.share?.({ title: i.title, url: typeof window !== "undefined" ? window.location.href : "" }) ||
                alert("Share")
              }
              className="p-2 rounded-full bg-white border shadow"
              aria-label="Share"
            >
              <Share2 size={18}/>
            </button>
          </div>

          <div className="mt-1 flex flex-wrap gap-2 text-[13px] text-gray-700">
            {typeof i.days === "number" && <span className="inline-flex items-center gap-1 bg-sky-100 text-sky-700 px-3 py-1 rounded-full"><CalendarDays size={14}/> {i.days} Days</span>}
            {i.idealfor?.[0] && <span className="inline-flex items-center gap-1 bg-sky-100 text-sky-700 px-3 py-1 rounded-full"><Users size={14}/>{i.idealfor[0]}</span>}
            {(i.starting_point || i.start) && <span className="inline-flex items-center gap-1 bg-sky-100 text-sky-700 px-3 py-1 rounded-full"><MapPin size={14}/>Start: {i.starting_point || i.start}</span>}
          </div>

          {(i.summary || i.description) && (
            <p className="text-[13px] text-gray-700 leading-relaxed mt-2 text-justify">
              {i.summary || i.description}
            </p>
          )}

          <div className="mt-2 flex flex-wrap gap-2">
            {slug && (
              <span className="inline-flex items-center gap-1 text-[11px] bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                <Star size={12} className="text-amber-500"/>
                <AverageRating category="itinerary" itemId={slug} />
              </span>
            )}
            {discountPct > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                <Percent size={12}/> {discountPct}% off
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-[11px] bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
              <Ticket size={12}/> Flexible rebooking
            </span>
          </div>
        </section>

        {/* ContactReveal — hidden if no data on the itinerary */}
        {(i.contact || i.email || i.website) && (
          <section className="mt-3">
            <ContactReveal
              phone={i.contact || undefined}
              whatsapp={i.contact || undefined}
              email={i.email || undefined}
              website={i.website || undefined}
              message="Want direct organizer contact? No brokers, save money!"
              onReveal={async () => {
                // optional: record reveal on Supabase (fails silently if RPC not present)
                try {
                  await supabase.rpc("increment_click_count", {
                    table_name: "itineraries",
                    row_slug: slug,
                  });
                } catch {}
              }}
            />
          </section>
        )}

        {/* Day-wise plan (simple vertical list; no tabs/rails) */}
        {Array.isArray(i.places_per_day) && i.places_per_day.length > 0 && (
          <section className="pt-3">
            <div className="text-sm font-medium text-gray-800 mb-2">Day-by-day plan</div>
            <div className="space-y-2">
              {i.places_per_day.map((d: any, idx: number) => {
                // 👇 supports either shape saved from admin:
                // { day, places: string[] }  OR  { day, locations: string[] }
                const locs: string[] =
                  Array.isArray(d?.locations) ? d.locations :
                  Array.isArray(d?.places)    ? d.places    :
                  [];

                return (
                  <div key={idx} className="rounded-2xl bg-white border border-gray-100 shadow p-3">
                    <div className="text-sm font-semibold inline-flex items-center gap-2">
                      <CalendarDays size={16}/> Day {d?.day ?? idx + 1}: {d?.title || "Plan"}
                    </div>

                    {locs.length > 0 && (
                      <ul className="mt-2 list-disc list-inside text-sm text-gray-700">
                        {locs.map((loc, i2) => <li key={i2}>{loc}</li>)}
                      </ul>
                    )}

                    {d?.notes && <p className="mt-2 text-sm text-gray-600">{d.notes}</p>}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ===================== NEW SECTIONS (after day-by-day) ===================== */}

        {/* Key Facts grid */}
        {(i.starting_point || i.ending_point || themes.length || idealFor.length || regions.length || travelModes.length || visitSeasons.length || i.season || tags.length) && (
          <section className="pt-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Key facts</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(i.starting_point || i.ending_point) && (
                <div className="rounded-xl border bg-white p-3">
                  <div className="text-xs font-medium text-gray-500 mb-1">From / To</div>
                  <div className="flex flex-wrap gap-2">
                    {i.starting_point && (
                      <span className="px-2 py-1 rounded-full text-xs bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 inline-flex items-center gap-1">
                        <MapPin size={12}/> {i.starting_point}
                      </span>
                    )}
                    {i.ending_point && i.ending_point !== i.starting_point && (
                      <span className="px-2 py-1 rounded-full text-xs bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 inline-flex items-center gap-1">
                        <MapPin size={12}/> {i.ending_point}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {themes.length > 0 && (
                <div className="rounded-xl border bg-white p-3">
                  <div className="text-xs font-medium text-gray-500 mb-1">Themes</div>
                  <div className="flex flex-wrap gap-1.5">
                    {themes.map((t: string) => (
                      <span key={t} className="px-2 py-1 rounded-full text-xs bg-sky-50 text-sky-800 ring-1 ring-sky-200">{t}</span>
                    ))}
                  </div>
                </div>
              )}

              {idealFor.length > 0 && (
                <div className="rounded-xl border bg-white p-3">
                  <div className="text-xs font-medium text-gray-500 mb-1">Ideal for</div>
                  <div className="flex flex-wrap gap-1.5">
                    {idealFor.map((p: string) => (
                      <span key={p} className="px-2 py-1 rounded-full text-xs bg-violet-50 text-violet-800 ring-1 ring-violet-200">{p}</span>
                    ))}
                  </div>
                </div>
              )}

              {regions.length > 0 && (
                <div className="rounded-xl border bg-white p-3">
                  <div className="text-xs font-medium text-gray-500 mb-1">Regions covered</div>
                  <div className="flex flex-wrap gap-1.5">
                    {regions.map((r: string) => (
                      <span key={r} className="px-2 py-1 rounded-full text-xs bg-amber-50 text-amber-800 ring-1 ring-amber-200">{r}</span>
                    ))}
                  </div>
                </div>
              )}

              {travelModes.length > 0 && (
                <div className="rounded-xl border bg-white p-3">
                  <div className="text-xs font-medium text-gray-500 mb-1">Travel mode</div>
                  <div className="flex flex-wrap gap-1.5">
                    {travelModes.map((m: string) => (
                      <span key={m} className="px-2 py-1 rounded-full text-xs bg-teal-50 text-teal-800 ring-1 ring-teal-200">{m}</span>
                    ))}
                  </div>
                </div>
              )}

              {(visitSeasons.length > 0 || i.season) && (
                <div className="rounded-xl border bg-white p-3">
                  <div className="text-xs font-medium text-gray-500 mb-1">Best time</div>
                  <div className="flex flex-wrap gap-1.5">
                    {visitSeasons.length > 0
                      ? visitSeasons.map((s: string) => (
                          <span key={s} className="px-2 py-1 rounded-full text-xs bg-rose-50 text-rose-800 ring-1 ring-rose-200">{s}</span>
                        ))
                      : <span className="px-2 py-1 rounded-full text-xs bg-rose-50 text-rose-800 ring-1 ring-rose-200">{i.season}</span>
                    }
                  </div>
                </div>
              )}

              {tags.length > 0 && (
                <div className="rounded-xl border bg-white p-3 sm:col-span-2">
                  <div className="text-xs font-medium text-gray-500 mb-1">Tags</div>
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((t: string) => (
                      <span key={t} className="px-2 py-1 rounded-full text-xs bg-gray-50 text-gray-800 ring-1 ring-gray-200">{t}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Tips & Warnings */}
        {(hasTips || hasWarnings) && (
          <section className="pt-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Tips & warnings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {hasTips && (
                <div className="rounded-xl border bg-white p-3">
                  <div className="text-xs font-medium text-emerald-700 mb-1">Tips</div>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {arr(i.tips).map((t, idx) => <li key={idx}>{t}</li>)}
                  </ul>
                </div>
              )}
              {hasWarnings && (
                <div className="rounded-xl border bg-white p-3">
                  <div className="text-xs font-medium text-rose-700 mb-1">Warnings</div>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {arr(i.warnings).map((w, idx) => <li key={idx}>{w}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {/* FAQs (accordion) */}
        {mounted && faqs.length > 0 && (
          <section className="pt-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">FAQs</h3>
            <div className="rounded-xl border bg-white divide-y">
              {faqs.map((qa: any, idx: number) => (
                <details key={idx} className="group p-3 open:bg-gray-50">
                  <summary className="cursor-pointer text-sm font-medium list-none">
                    {qa.q || "Question"}
                  </summary>
                  <div className="mt-1 text-sm text-gray-700">
                    {qa.a || ""}
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* =================== END NEW SECTIONS =================== */}

        {/* Reviews */}
        {slug && (
          <section className="pt-4 pb-10">
            <div className="text-sm font-medium text-gray-800 mb-2">Reviews</div>
            <ReviewSection category="itinerary" itemId={slug} />
          </section>
        )}
      </div>

      {/* Lightbox (shared with Homestay UX) */}
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
            {lightboxIndex > 0 && (
              <button
                onClick={() => setLightboxIndex(lightboxIndex - 1)}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/70 text-white rounded-full p-2 z-10"
                aria-label="Previous"
              >
                &#8592;
              </button>
            )}
            {lightboxIndex < gallery.length - 1 && (
              <button
                onClick={() => setLightboxIndex(lightboxIndex + 1)}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/70 text-white rounded-full p-2 z-10"
                aria-label="Next"
              >
                &#8594;
              </button>
            )}
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

      {/* Hide native scrollbars if any rails appear elsewhere */}
      <style jsx global>{`
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </main>
  );
}
