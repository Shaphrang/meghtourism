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
        'block w-full h-64 rounded-xl overflow-hidden border bg-white shadow-md hover:shadow-lg transition cursor-pointer',
        className
      )}
    >
      {/* Top: Image */}
      <div className="relative w-full h-[70%]">
        <Image
          src={homestay.image ?? '/placeholder.jpg'}
          alt={homestay.name ?? 'Homestay'}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
          loading="lazy"
        />
      </div>

      {/* Bottom: Info */}
      <div className="h-[30%] px-3 py-2 flex flex-col justify-between">
        <h3 className="text-sm font-semibold text-gray-800 truncate">
          {homestay.name}
        </h3>
        <p className="text-xs text-gray-500 truncate">
          {homestay.location ?? 'Meghalaya'}
        </p>
        <p className="text-xs font-medium text-blue-600">
          ₹{homestay.pricepernight} / night
        </p>
      </div>
    </Link>
  );
}
