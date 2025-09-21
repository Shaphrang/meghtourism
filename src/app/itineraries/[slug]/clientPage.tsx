// src/app/itineraries/[slug]/clientPage.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import DescriptionToggle from "@/components/common/descriptionToggle";
import AverageRating from "@/components/reviews/averageRating";
import useRelatedForItinerary from "@/hooks/useRelatedForItinerary";
import HorizontalSection from "@/components/common/horizonatlSection";
import ReviewSection from "@/components/reviews/reviewSection";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function ClientPage({ initial }: { initial: any }) {
  const itinerary = initial;
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const related = useRelatedForItinerary(itinerary);

  const gallery = itinerary.gallery?.length
    ? itinerary.gallery
    : itinerary.image
    ? [itinerary.image]
    : [];

  const itemSlug = itinerary.slug || itinerary.id;

  return (
    <main className="bg-gradient-to-b from-sky-50 to-white w-full min-h-screen text-charcoal px-4 pb-10 overflow-x-hidden">
      <div className="max-w-screen-md mx-auto">
        {/* Image Swiper */}
        {gallery.length > 0 && (
          <Swiper spaceBetween={10} slidesPerView={1} className="w-full h-64 md:h-96 rounded-xl overflow-hidden">
            {gallery.map((img: string, idx: number) => (
              <SwiperSlide key={idx} className="relative w-full h-full">
                {img?.startsWith("http") ? (
                  <Image
                    src={img}
                    alt={itinerary.title || "Itinerary"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 768px"
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
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-2xl font-bold text-blue-900 leading-snug">
              {itinerary.title}
            </h1>
            <AverageRating category="itinerary" itemId={itemSlug} />
          </div>
          <div className="flex flex-wrap gap-2 text-sm text-gcharcoal mb-2">
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
          {Array.isArray(itinerary.theme) && itinerary.theme.length > 0 && (
            <div className="flex flex-wrap gap-2 text-xs text-blue-800 mb-2">
              {itinerary.theme.map((t: string, i: number) => (
                <span key={i} className="bg-blue-50 px-3 py-1 rounded-full">{t}</span>
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
        {Array.isArray(itinerary.places_per_day) && itinerary.places_per_day.length > 0 && (
          <section className="px-4 pt-2">
            <h2 className="text-lg font-semibold mb-3">Day-wise Plan</h2>
            <div className="flex flex-col gap-3">
              {itinerary.places_per_day.map((day: any, index: number) => (
                <div key={index} className="bg-gray-50 rounded-xl shadow-sm p-4">
                  <button
                    onClick={() => setExpandedDay(expandedDay === index ? null : index)}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <span className="font-semibold">
                      Day {index + 1}: {day.location}
                    </span>
                    {expandedDay === index ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  {expandedDay === index && Array.isArray(day.activities) && (
                    <ul className="mt-2 list-disc list-inside text-sm text-gray-700">
                      {day.activities.map((a: string, i: number) => <li key={i}>{a}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related rails */}
        <div className="pt-6 space-y-6">
          <HorizontalSection title="Nearby Itineraries" type="itineraries" items={related.nearbyItineraries} />
          <HorizontalSection title="Destinations" type="destinations" items={related.destinations} />
          <HorizontalSection title="Places to Stay" type="homestays" items={related.homestays} />
          <HorizontalSection title="🎉 What's Happening" type="events" items={related.events} />
          <HorizontalSection title="🌄 Adventure Nearby" type="thrills" items={related.thrills} />
          <HorizontalSection title="🍴 Places to Eat" type="cafesRestaurants" items={related.restaurants} />
          <HorizontalSection title="🛵 Get a Rental" type="rentals" items={related.rentals} />
        </div>

        {/* Reviews */}
        <ReviewSection category="itinerary" itemId={itemSlug} />
      </div>
    </main>
  );
}
