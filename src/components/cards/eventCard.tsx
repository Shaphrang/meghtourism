'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Event } from '@/types/event';

interface Props {
  event: Event;
  className?: string;
}

export default function EventCard({ event, className = '' }: Props) {
  return (
    <Link href={`/events/${event.id}`} className={`block ${className}`}>
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="relative w-full h-36">
          <Image
            src={event.image}
            alt={event.name}
            fill
            className="object-cover"
            loading="lazy"
            sizes="(max-width: 768px) 220px, 240px"
          />
        </div>
        <div className="p-4">
          <h3 className="text-base font-semibold text-gray-800">{event.name}</h3>
          <p className="text-sm text-gray-600">{event.location}</p>
          <p className="text-xs text-gray-500 italic">📅 {event.date}</p>
        </div>
      </div>
    </Link>
  );
}
