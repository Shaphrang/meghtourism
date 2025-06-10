import Link from 'next/link';
import Image from 'next/image';
import { Destination } from '@/types/destination';
import { Star } from 'lucide-react';

interface Props {
  destination: Destination;
}

export default function DestinationListingCard({ destination }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition flex flex-col">
      <div className="relative w-full h-48">
        {destination.image ? (
          <Image
            src={destination.image}
            alt={destination.name ?? 'Destination'}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
            loading="lazy"
          />
        ) : null}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-lg mb-1">{destination.name}</h3>
        <p className="text-sm text-gray-600 line-clamp-2 mb-2 flex-grow">{destination.description}</p>
        {destination.rating && (
          <div className="flex items-center text-sm text-yellow-600 mb-2">
            <Star className="w-4 h-4 fill-yellow-500 mr-1" /> {destination.rating.toFixed(1)}
          </div>
        )}
        {destination.tags && (
          <div className="flex flex-wrap gap-1 mb-3">
            {destination.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="bg-emerald-50 text-emerald-700 text-xs px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
        <Link
          href={`/destinations/${destination.id}`}
          className="mt-auto text-center bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700"
        >
          More Info
        </Link>
      </div>
    </div>
  );
}