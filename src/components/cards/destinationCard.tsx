'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Destination } from '@/types/destination';
import clsx from 'clsx';
import { SupabaseImage } from '@/components/common/supabaseImage';


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
        <SupabaseImage
          src={destination.image}
          alt={destination.name ?? 'Destination'}
          width={600}
          height={300}
          className="object-cover absolute inset-0 w-full h-full"
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
