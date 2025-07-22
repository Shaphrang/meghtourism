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
import NearbyListings from "@/components/common/nearbyListings";
import ShareBar from "@/components/common/shareBar";

export default function ClientPage() {
  const { slug } = useParams();
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    async function fetchData() {
      const fixedSlug = normalizeSlug(String(slug));
      const { data: ev } = await supabase
        .from("events")
        .select("*")
        .eq("slug", fixedSlug)
        .single();
      if (ev) {
        setEvent(ev);
      }
    }
    fetchData();
  }, [slug]);

  if (!event) return <p className="p-4">Loading...</p>;

  const gallery = event.gallery?.length
    ? event.gallery
    : event.image
    ? [event.image]
    : [];


  return (
    <main className="w-full min-h-screen bg-white text-gray-800 overflow-x-hidden relative pb-20 px-4">
      {/* Full Width Image Swiper */}
<div className="w-screen h-64 sm:h-80 md:h-96 relative -mx-4">
  <Swiper
    spaceBetween={10}
    slidesPerView={1}
    centeredSlides
    className="w-full h-full"
  >
    {gallery.map((img, idx) => (
      <SwiperSlide
        key={idx}
        className="relative w-full h-full flex items-center justify-center overflow-hidden"
      >
        {img && img.startsWith("https") ? (
          <Image
            src={img}
            alt={event.name || "Event"}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 bg-gray-100">
            No image
          </div>
        )}
      </SwiperSlide>
    ))}
  </Swiper>


      <section className="p-4">
        <h1 className="text-2xl font-bold text-blue-800 mb-2">{event.name}</h1>
{/* Chips Section - Centered */}
<div className="flex flex-wrap justify gap-2 text-sm text-gray-600">
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

        {event.entryfee?.amount && (
          <p className="mt-1 text-sm text-green-700 font-medium">
            {event.entryfee?.type === "Free" ? "Free Entry" : `₹${event.entryfee.amount}`}
          </p>
        )}
      </section>

      {/*<ShareBar title={event.name} text={event.description?.slice(0,80)} />*/}

      {event.highlights?.length ? (
        <section className="p-4">
          <h3 className="font-semibold mb-2">Event Highlights</h3>
          <ul className="list-disc pl-5 text-sm text-gray-700">
            {event.highlights.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {event.description && (
        <section className="p-2">
          <h3 className="font-semibold mb-2">About the Event</h3>
          <DescriptionToggle text={event.description} />
        </section>
      )}

      <NearbyListings
        type="destinations"
        location={event.location ?? null}
        title="Nearby Attractions"
      />
      <NearbyListings
        type="homestays"
        location={event.location ?? null}
        title="Nearby Homestays"
      />

      {Array.isArray((event as any).reviews) && (event as any).reviews.length > 0 && (
        <section className="p-4">
          <h3 className="font-semibold mb-2">Guest Reviews</h3>
          {(event as any).reviews.map((r: any, i: number) => (
            <div key={i} className="mb-2 border-b pb-2">
              <p className="text-sm font-medium">{r.user || r.name}</p>
              <p className="text-xs text-gray-400">{r.date}</p>
              <p className="text-sm">{r.comment}</p>
            </div>
          ))}
        </section>
      )}
      </div>
    </main>
  );
}