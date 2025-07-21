"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import useSupabaseList from "@/hooks/useSupabaseList";
import DynamicFilterComponent from "@/components/filters/DynamicFilterComponent";
import { Event } from "@/types/event";
import FeaturedBannerAds from "@/components/ads/featuredBannerAds";

export default function EventsListingPage() {
  const [page, setPage] = useState(1);
  const [events, setEvents] = useState<Event[]>([]);
  const [filter, setFilter] = useState<{ field: string; value: any } | null>(null);
  const { data, totalCount, loading } = useSupabaseList<Event>("events", {
    sortBy: "date",
    ascending: true,
    filter,
    page,
    pageSize: 6,
  });
  const { data: featured } = useSupabaseList<Event>("events", {
    sortBy: "created_at",
    ascending: false,
    pageSize: 10,
  });
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (page === 1) setEvents(data);
    else setEvents((prev) => [...prev, ...data]);
  }, [data]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !loading &&
          events.length < (totalCount ?? 0)
        ) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [events, loading, totalCount]);

  return (
    <main className="w-full min-h-screen bg-white text-gray-800">
      <section className="bg-gradient-to-r from-blue-100 to-green-100 p-6 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-800">What’s Happening in Meghalaya?</h1>
      </section>

      {/* Filter Bar */}
      <DynamicFilterComponent
        table="events"
        filtersConfig={[{ type: "location" }]}
        onFilterChange={(newFilter) => {
          setFilter(newFilter);
          setPage(1);
        }}
      />

      {/* Featured Ads */}
      <section className="p-4">
        <h2 className="text-lg font-semibold mb-2">Featured Events</h2>
        <FeaturedBannerAds category="events"/>
      </section>

      {/* Upcoming Events */}
      <section className="p-4">
        <h2 className="text-lg font-semibold mb-2">Upcoming Events</h2>
        <div className="flex flex-col gap-4">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/events/${event.slug ?? event.id}`}
              className="bg-gray-50 rounded-xl shadow-sm overflow-hidden"
            >
              <div className="h-40 relative bg-gray-100">
                {event.image && event.image.startsWith('https') ? (
                  <Image src={event.image} alt={event.name || "Event"} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No image</div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold truncate">{event.name}</h3>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  {event.date && <><Calendar size={14} /> {event.date}</>}
                  {event.time && <><Clock size={14} /> {event.time}</>}
                </p>
                {event.location && (
                  <p className="text-sm text-gray-500">📍 {event.location}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
                <div ref={observerRef} className="mt-4 text-center">
          {loading && <p className="text-sm text-gray-500">Loading...</p>}
          {events.length >= (totalCount ?? 0) && !loading && (
            <p className="text-sm text-gray-400">No more events.</p>
          )}
        </div>
      </section>
    </main>
  );
}
