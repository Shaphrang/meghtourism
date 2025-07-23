'use client';

import Image from 'next/image';
import Link from 'next/link';
import HorizontalScroll from './horizontalScroll';

interface Props {
  title: string;
  type: string;
  items: any[];
}

export default function HorizontalSection({ title, type, items }: Props) {
  if (!items || items.length === 0) return null;

  return (
    <section className="mt-6 w-full">
      <h2 className="text-lg font-semibold px-4 mb-2">{title}</h2>
      <HorizontalScroll className="px-4 pb-2">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/${type}/${item.slug ?? item.id}`}
            prefetch
            className="min-w-[160px] max-w-[160px] bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden snap-start"
          >
            <div className="w-full h-28 relative bg-gray-100">
              {item.image && item.image.startsWith('https') ? (
                <Image src={item.image} alt={item.name || 'Listing'} fill className="object-cover" />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-xs text-gray-400">No image</div>
              )}
            </div>
            <div className="p-2">
              <p className="text-sm font-medium truncate">{item.name}</p>
              {(item.location || item.district) && (
                <p className="text-xs text-gray-500 truncate">{item.location || item.district}</p>
              )}
            </div>
          </Link>
        ))}
      </HorizontalScroll>
    </section>
  );
}