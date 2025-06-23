'use client';

import useSupabaseList from '@/hooks/useSupabaseList';
import EventCard from '@/components/cards/eventCard';
import { Event } from '@/types/event';
import HorizontalScroll from '@/components/common/horizontalScroll';
import Link from 'next/link';

export function EventsSection() {
  const { data: events = [], loading, error } = useSupabaseList<Event>('events', {
    sortBy: 'date',
    ascending: true,
    page: 1,
    pageSize: 6,
  });

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <section className="py-6 px-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Upcoming Events</h2>
        <Link href="/events" className="text-blue-500 text-sm">
          More →
        </Link>
      </div>

      <HorizontalScroll>
        {events.map((event, i) => (
          <EventCard key={i} event={event} />
        ))}
      </HorizontalScroll>
    </section>
  );
}
