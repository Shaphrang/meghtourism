"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Event } from "@/types/event";
import { Destination } from "@/types/destination";
import { Homestay } from "@/types/homestay";
import Image from "next/image";
import { Share2, MapPin, Calendar, Clock } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import DescriptionToggle from "@/components/common/descriptionToggle";

export default function ClientPage() {
  const { slug } = useParams();
  const supabase = createClientComponentClient();
  const [event, setEvent] = useState<Event | null>(null);
  const [attractions, setAttractions] = useState<Destination[]>([]);
  const [homestays, setHomestays] = useState<Homestay[]>([]);

  useEffect(() => {
    async function fetchData() {
      const rawSlug = String(slug);
      const fixedSlug = rawSlug.replace(/_/g, "-");
      const { data: ev } = await supabase
        .from("events")
        .select("*")
        .eq("slug", fixedSlug)
        .single();
      if (ev) {
        setEvent(ev);
        const { data: dest } = await supabase
          .from("destinations")
          .select("*")
          .limit(4);
        setAttractions(dest || []);
        const { data: stays } = await supabase
          .from("homestays")
          .select("*")
          .limit(4);
        setHomestays(stays || []);
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
            <Image src={img} alt={event.name || "Event"} fill className="object-cover" />
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

      {attractions.length > 0 && (
        <section className="p-4">
          <h3 className="font-semibold mb-2">Nearby Attractions</h3>
          <div className="flex gap-3 overflow-x-auto">
            {attractions.map((a) => (
              <div key={a.id} className="min-w-[150px] rounded-xl shadow overflow-hidden">
                <div className="relative w-full h-24">
                  {a.image ? (
                    <Image src={a.image} alt={a.name || "Attraction"} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xs text-gray-400">No image</div>
                  )}
                </div>
                <p className="p-2 text-sm font-medium truncate">{a.name}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {homestays.length > 0 && (
        <section className="p-4">
          <h3 className="font-semibold mb-2">Nearby Homestays</h3>
          <div className="flex flex-col gap-3">
            {homestays.map((stay) => (
              <div key={stay.id} className="flex gap-3 bg-gray-50 rounded-xl shadow p-3">
                <div className="relative w-20 h-20 rounded-md overflow-hidden">
                  {stay.image ? (
                    <Image src={stay.image} alt={stay.name || "Stay"} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No image</div>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-sm">{stay.name}</p>
                  {stay.location && <p className="text-xs text-gray-500">{stay.location}</p>}
                  {stay.pricepernight && (
                    <p className="text-green-700 text-sm">₹{stay.pricepernight.toLocaleString()}/night</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

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