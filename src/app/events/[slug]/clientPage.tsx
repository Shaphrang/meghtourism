"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Event } from "@/types/event";
import Image from "next/image";
import { MapPin, Calendar, Clock } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import DescriptionToggle from "@/components/common/descriptionToggle";
import { supabase } from "@/lib/supabaseClient";
import { normalizeSlug } from "@/lib/utils";
import useRelatedForEvent from "@/hooks/useRelatedForEvent";
import HorizontalSection from "@/components/common/horizonatlSection";
import VerticalSection from "@/components/common/verticalSection";
import ReviewSection from "@/components/reviews/reviewSection";
import AverageRating from "@/components/reviews/averageRating";
import Head from "next/head";

export default function ClientPage() {
  const { slug } = useParams();
  const itemSlug = normalizeSlug(String(slug));
  const [event, setEvent] = useState<Event | null>(null);
  const related = useRelatedForEvent(event);

  useEffect(() => {
    async function fetchData() {
      const { data: ev } = await supabase
        .from("events")
        .select("*")
        .eq("slug", itemSlug)
        .single();
      if (ev) {
        setEvent(ev);
      }
    }
    fetchData();
  }, [itemSlug]);

  if (!event)
    return (
      <>
        <Head>
          <title>Loading Event... | Meghtourism</title>
        </Head>
        <p className="p-4">Loading...</p>
      </>
    );

  const gallery = event.gallery?.length
    ? event.gallery
    : event.image
    ? [event.image]
    : [];

  const desc = event.description?.slice(0, 150) || "";
  const img = event.image || event.gallery?.[0] || "";

  return (
    <>
      <Head>
        <title>{event.name} | Meghtourism</title>
        <meta name="description" content={desc} />
        <meta property="og:title" content={`${event.name} | Meghtourism`} />
        <meta property="og:description" content={desc} />
        {img && <meta property="og:image" content={img} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${event.name} | Meghtourism`} />
        <meta name="twitter:description" content={desc} />
        {img && <meta name="twitter:image" content={img} />}
      </Head>

      <main className="bg-gradient-to-b from-emerald-50 to-white text-gray-800 w-full min-h-screen pb-10">
        {/* Full-width image swiper */}
        <div className="w-screen h-64 sm:h-80 md:h-96 relative -mx-[calc((100vw-100%)/2)]">
          <Swiper spaceBetween={10} slidesPerView={1} centeredSlides className="w-full h-full">
            {gallery.map((img, idx) => (
              <SwiperSlide
                key={idx}
                className="relative w-full h-full flex items-center justify-center overflow-hidden"
              >
                {img && img.startsWith("https") ? (
                  <Image src={img} alt={event.name || "Event"} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 bg-gray-100">
                    No image
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Main content */}
        <div className="max-w-screen-md mx-auto px-4">
          <div className="flex items-center justify-between mt-5">
            <h1 className="text-2xl font-bold text-gray-800">{event.name}</h1>
            <AverageRating category="event" itemId={itemSlug} />
          </div>

          {/* Centered chips */}
          <div className="flex flex-wrap gap-2 mt-2 text-sm text-gray-600">
            {event.date && (
              <span className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                <Calendar size={14} /> {event.date}
              </span>
            )}
            {event.time && (
              <span className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                <Clock size={14} /> {event.time}
              </span>
            )}
            {event.location && (
              <span className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                <MapPin size={14} /> {event.location}
              </span>
            )}
          </div>

          {/* Entry fee */}
          {event.entryfee?.amount && (
            <p className="mt-1 text-sm text-green-700 font-medium">
              {event.entryfee?.type === "Free" ? "Free Entry" : `₹${event.entryfee.amount}`}
            </p>
          )}

          {/* Description */}
          {event.description && (
            <section className="mt-6">
              <h3 className="font-semibold mb-2">About the Event</h3>
              <DescriptionToggle text={event.description} />
            </section>
          )}

          {/* Related sections */}
          <div className="pt-6 space-y-6">
            <VerticalSection
              title="Nearby Attractions"
              type="events"
              items={related.nearbyEvents}
            />
            <HorizontalSection
              title="Nearby Attractions"
              type="destinations"
              items={related.destinations}
            />
            <HorizontalSection
              title="Nearby Homestays"
              type="homestays"
              items={related.homestays}
            />
            <HorizontalSection
              title="🌄 Adventure Nearby"
              type="thrills"
              items={related.thrills}
            />
            <HorizontalSection
              title="🍴 Places to Eat"
              type="cafesRestaurants"
              items={related.restaurants}
            />
            <HorizontalSection
              title="📜 Itineraries"
              type="itineraries"
              items={related.itineraries}
            />
            <HorizontalSection
              title="🛵 Get a Rental"
              type="rentals"
              items={related.rentals}
            />
          </div>

          {/* Reviews */}
          <ReviewSection category="event" itemId={itemSlug} />
        </div>
      </main>
    </>
  );
}
