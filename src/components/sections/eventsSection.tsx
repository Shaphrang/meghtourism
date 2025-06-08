'use client';

import { useEffect, useState } from 'react';
import { fetchData } from '@/lib/fetchData';
import EventCard from '@/components/cards/eventCard';
import { Event } from '@/types/event';
import HorizontalScroll from '@/components/common/horizontalScroll';
import Link from 'next/link';

export function EventsSection() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetchData('events.json').then(setEvents).catch(console.error);
  }, []);

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
