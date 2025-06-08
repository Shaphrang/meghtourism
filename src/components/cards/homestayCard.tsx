'use client';

import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';
import { Homestay } from '@/types/homestay';

interface Props {
  homestay: Homestay;
  className?: string;
}

export default function HomestayCard({ homestay, className = '' }: Props) {
  return (
    <Link
      href={`/homestays/${homestay.id}`}
      className={clsx(
        'block bg-white rounded-xl shadow-md overflow-hidden flex-shrink-0 cursor-pointer hover:shadow-lg transition',
        className
      )}
    >
      <div className="relative w-full h-36">
        <Image
          src={homestay.image}
          alt={homestay.name}
          fill
          className="object-cover rounded-t-xl"
          sizes="(max-width: 768px) 180px, 200px"
          loading="lazy"
        />
      </div>

      <div className="p-4">
        <h3 className="text-base font-semibold text-gray-800">{homestay.name}</h3>
        <p className="text-sm text-gray-600">{homestay.location}</p>
        <p className="text-sm text-gray-600 mb-2">{homestay.price}</p>

        {Array.isArray(homestay.amenities) && (
          <ul className="text-sm text-gray-500 list-disc list-inside">
            {homestay.amenities.slice(0, 2).map((amenity, idx) => (
              <li key={idx}>{amenity}</li>
            ))}
          </ul>
        )}
      </div>
    </Link>
  );
}
