'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Destination } from '@/types/destination';
import clsx from 'clsx';

interface Props {
  destination: Destination;
  className?: string;
}

export default function DestinationCard({ destination, className = '' }: Props) {
  return (
    <Link
      href={`/destinations/${destination.id}`}
      className={clsx(
        'block bg-white rounded-xl shadow-md overflow-hidden flex-shrink-0 cursor-pointer hover:shadow-lg transition',
        className
      )}
    >
      <div className="relative w-full h-36">
        <Image
          src={destination.image}
          alt={destination.name}
          fill
          className="object-cover rounded-t-xl"
          sizes="(max-width: 768px) 220px, 240px"
          loading="lazy"
        />
      </div>

      <div className="p-4">
        <h3 className="text-base font-semibold text-gray-800">{destination.name}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{destination.description}</p>
        <ul className="mt-2 text-sm text-gray-500 list-disc list-inside">
          {destination.highlights.slice(0, 2).map((highlight, idx) => (
            <li key={idx}>{highlight}</li>
          ))}
        </ul>
      </div>
    </Link>
  );
}
