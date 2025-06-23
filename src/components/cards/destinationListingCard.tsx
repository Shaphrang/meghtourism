'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Destination } from '@/types/destination';
import { Star, MapPin } from 'lucide-react';

interface Props {
  destination: Destination;
}

export default function DestinationListingCard({ destination }: Props) {
  return (
    <div className="flex flex-col bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden w-full max-w-full">
      {/* Image Section */}
      <div className="relative w-full aspect-[4/3]">
        <Image
          src={destination.image || '/placeholder.jpg'}
          alt={destination.name || 'Destination'}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
          loading="lazy"
        />
        {/* Rating Badge */}
        {destination.rating && (
          <div className="absolute top-2 right-2 bg-white bg-opacity-90 px-2 py-0.5 rounded-full text-xs text-yellow-700 font-medium shadow">
            ⭐ {destination.rating.toFixed(1)}
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="flex flex-col px-3 py-2 flex-grow">
        <h3 className="text-sm font-semibold text-gray-800 truncate mb-1">
          {destination.name}
        </h3>

        {destination.district && (
          <p className="flex items-center text-xs text-gray-500 mb-1 truncate">
            <MapPin className="w-3.5 h-3.5 mr-1" />
            {destination.district}
          </p>
        )}

        {Array.isArray(destination.tags) && destination.tags.length > 0 && (
          <div className="flex gap-1 flex-wrap mb-2">
            {destination.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <Link
          href={`/destinations/${destination.id}`}
          className="mt-auto text-center text-[13px] font-medium bg-emerald-600 text-white py-1.5 rounded-md hover:bg-emerald-700 transition"
        >
          Explore
        </Link>
      </div>
    </div>
  );
}
