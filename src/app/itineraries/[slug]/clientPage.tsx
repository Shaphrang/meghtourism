"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Itinerary } from "@/types/itineraries";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import DescriptionToggle from "@/components/common/descriptionToggle";
import { supabase } from "@/lib/supabaseClient";
import { normalizeSlug } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function ClientPage() {
  const { slug } = useParams();
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      const fixedSlug = normalizeSlug(String(slug));
      const { data } = await supabase
        .from("itineraries")
        .select("*")
        .eq("slug", fixedSlug)
        .single();
      setItinerary(data);
    }
    fetchData();
  }, [slug]);

  if (!itinerary) return <p className="p-4">Loading...</p>;

  const gallery = itinerary.gallery?.length
    ? itinerary.gallery
    : itinerary.image
    ? [itinerary.image]
    : [];

  return (
    <main className="bg-gradient-to-b from-sky-50 to-white w-full min-h-screen text-gray-800 px-4 pb-10 overflow-x-hidden">
      <div className="max-w-screen-md mx-auto">

        {/* Image Swiper */}
        {gallery.length > 0 && (
          <Swiper spaceBetween={10} slidesPerView={1} className="w-full h-64 md:h-96 rounded-xl overflow-hidden">
            {gallery.map((img, idx) => (
              <SwiperSlide key={idx} className="relative w-full h-full">
                {img && img.startsWith("https") ? (
                  <Image
                    src={img}
                    alt={itinerary.title || "Itinerary"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                    No image
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        {/* Title and Chips */}
        <section className="px-2 pt-4">
          <h1 className="text-2xl font-bold text-blue-900 mb-1 leading-snug">
            {itinerary.title}
          </h1>
          <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-2">
            {itinerary.days && (
              <span className="bg-sky-100 text-sky-700 px-3 py-1 rounded-full">
                {itinerary.days} Days
              </span>
            )}
            {itinerary.starting_point && (
              <span className="bg-sky-100 text-sky-700 px-3 py-1 rounded-full">
                Start: {itinerary.starting_point}
              </span>
            )}
            {itinerary.season && (
              <span className="bg-sky-100 text-sky-700 px-3 py-1 rounded-full">
                Season: {itinerary.season}
              </span>
            )}
          </div>
          {itinerary.theme?.length > 0 && (
            <div className="flex flex-wrap gap-2 text-xs text-blue-800 mb-2">
              {itinerary.theme.map((t, i) => (
                <span
                  key={i}
                  className="bg-blue-50 px-3 py-1 rounded-full"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </section>

        {/* Description */}
        {itinerary.description && (
          <section className="p-4 pt-2">
            <DescriptionToggle text={itinerary.description} />
          </section>
        )}

        {/* Day-wise plan */}
        {Array.isArray(itinerary.places_per_day) &&
          itinerary.places_per_day.length > 0 && (
            <section className="px-4 pt-2">
              <h2 className="text-lg font-semibold mb-3">Day-wise Plan</h2>
              <div className="flex flex-col gap-3">
                {itinerary.places_per_day.map((day: any, index: number) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-xl shadow-sm p-4"
                  >
                    <button
                      onClick={() =>
                        setExpandedDay(expandedDay === index ? null : index)
                      }
                      className="flex items-center justify-between w-full text-left"
                    >
                      <span className="font-semibold">
                        Day {index + 1}: {day.location}
                      </span>
                      {expandedDay === index ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </button>
                    {expandedDay === index &&
                      Array.isArray(day.activities) && (
                        <ul className="mt-2 list-disc list-inside text-sm text-gray-700">
                          {day.activities.map((a: string, i: number) => (
                            <li key={i}>{a}</li>
                          ))}
                        </ul>
                      )}
                  </div>
                ))}
              </div>
            </section>
          )}

        {/* Travel Tips */}
        {itinerary.tips?.length > 0 && (
          <section className="p-4">
            <h2 className="text-lg font-semibold mb-2">Travel Tips</h2>
            <ul className="list-disc list-inside text-sm text-gray-700">
              {itinerary.tips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Reviews */}
        {Array.isArray((itinerary as any).reviews) &&
          (itinerary as any).reviews.length > 0 && (
            <section className="p-4">
              <h2 className="text-lg font-semibold mb-2">Reviews</h2>
              {(itinerary as any).reviews.map((rev: any, i: number) => (
                <div
                  key={i}
                  className="mb-3 bg-gray-50 p-3 rounded-lg shadow-sm"
                >
                  <p className="text-sm">{rev.comment || rev}</p>
                </div>
              ))}
            </section>
          )}
      </div>
    </main>
  );
}
