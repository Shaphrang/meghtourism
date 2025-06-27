"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Event } from "@/types/event";
import { Destination } from "@/types/destination";
import { Homestay } from "@/types/homestay";
import Image from "next/image";
import { Share2, MapPin, Calendar, Clock } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import DescriptionToggle from "@/components/common/descriptionToggle";
import { supabase } from "@/lib/supabaseClient";
import { normalizeSlug } from "@/lib/utils";
import NearbyListings from "@/components/common/nearbyListings";

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

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: event.name || "Event", url: window.location.href });
    } else {
      alert("Sharing not supported on this device");
    }
  };

  return (
    <main className="w-full min-h-screen bg-white text-gray-800">
      <Swiper spaceBetween={10} slidesPerView={1.2} className="w-full h-64 md:h-96">
        {gallery.map((img, idx) => (
          <SwiperSlide key={idx} className="relative w-full h-full rounded-lg overflow-hidden">
            {img && img.startsWith('https') ? (
              <Image src={img} alt={event.name || "Event"} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No image</div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      <section className="p-4">
        <h1 className="text-2xl font-bold text-blue-800">{event.name}</h1>
        <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
          {event.date && <><Calendar size={16} /> {event.date}</>}
          {event.time && <><Clock size={16} /> {event.time}</>}
        </p>
        {event.location && (
          <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
            <MapPin size={16} /> {event.location}
          </p>
        )}
        {event.entryfee?.amount && (
          <p className="mt-1 text-sm text-green-700 font-medium">
            {event.entryfee?.type === "Free" ? "Free Entry" : `₹${event.entryfee.amount}`}
          </p>
        )}
        <button
          onClick={handleShare}
          className="mt-3 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-full shadow"
        >
          <Share2 size={16} /> Share Event
        </button>
      </section>

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
        <section className="p-4">
          <h3 className="font-semibold mb-2">About the Event</h3>
          <DescriptionToggle text={event.description} />
        </section>
      )}

      <NearbyListings
        type="destinations"
        filterBy="district"
        matchValue={event.district}
        title="Nearby Attractions"
      />
            <NearbyListings
        type="homestays"
        filterBy="district"
        matchValue={event.district}
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
    </main>
  );
}