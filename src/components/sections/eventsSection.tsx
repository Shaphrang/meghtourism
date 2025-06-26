'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useSupabaseList from '@/hooks/useSupabaseList';
import { Event } from '@/types/event';

export default function EventsSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: events, loading } = useSupabaseList<Event>('events', {
    sortBy: 'created_at',
    ascending: false,
    pageSize: 10,
  });

  // Enable mouse wheel horizontal scroll on desktop
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <section className="w-full px-2 sm:px-4 mt-6">
      <div className="flex justify-between items-center px-1 mb-2">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Upcoming Events</h2>
        <Link href="/events" className="text-sm text-emerald-600 hover:underline font-medium">
          View All
        </Link>
      </div>

      {loading ? (
        <div className="text-sm text-gray-500 px-1">Loading events...</div>
      ) : (
        <div
          ref={containerRef}
          className="flex space-x-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth pb-2"
        >
          {events.slice(0, 10).map((event) => (
            <Link
              key={event.id}
              href={`/events/${event.slug ?? event.id}`}
              className="w-[100px] sm:w-[120px] flex flex-col items-center space-y-1 snap-start flex-shrink-0"
            >
              <div className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] rounded-full bg-white shadow-md flex items-center justify-center overflow-hidden relative border">
                {event.image && event.image.startsWith('https') ? (
                  <Image
                    src={event.image}
                    alt={event.name || 'Event'}
                    fill
                    sizes="(max-width: 640px) 100px, 120px"
                    className="object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-[10px] text-gray-500 text-center px-1">
                    {event.name?.slice(0, 20) || 'Unnamed'}
                  </div>
                )}
              </div>

              <div className="w-full text-center">
                <p className="text-[10px] font-semibold text-gray-800 truncate w-full">
                  {event.name?.slice(0, 20)}
                </p>
                {(event.date || event.time) && (
                  <p className="text-[10px] text-gray-600 truncate w-full">
                    {event.date &&
                      new Date(event.date).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })}{' '}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
