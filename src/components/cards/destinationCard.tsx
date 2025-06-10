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
        'relative block w-full h-64 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition cursor-pointer',
        className
      )}
    >
      {/* Full Image */}
      <Image
        src={destination.image ?? '/placeholder.jpg'}
        alt={destination.name ?? 'Destination'}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 33vw"
        loading="lazy"
      />

      {/* Gradient Overlay */}
      <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-black/80 to-transparent" />

      {/* Text Content */}
      <div className="absolute bottom-0 w-full h-1/3 px-3 py-3 text-white flex flex-col justify-end">
        <h3 className="text-sm sm:text-base font-semibold truncate leading-tight">
          {destination.name}
        </h3>
        <p className="text-xs text-gray-300 truncate">{destination.location ?? 'Meghalaya'}</p>
      </div>
    </Link>
  );
}
