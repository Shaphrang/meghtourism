//src\components\common\horizonatlSection.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import HorizontalScroll from './horizontalScroll';
import { MapPin } from 'lucide-react';

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
            className={`rounded-xl shadow-sm transition overflow-hidden snap-start bg-white
              ${type === 'cafesRestaurants' ? 'min-w-[280px] max-w-[280px]' : 'min-w-[160px] max-w-[160px]'}`}
          >
            {renderCard(type, item)}
          </Link>

        ))}
      </HorizontalScroll>
    </section>
  );
}

function renderCard(type: string, item: any) {
  switch (type) {
    case 'homestays':
      return (
        <div>
          <div className="w-full h-28 relative bg-gray-100">
            {item.image ? (
              <Image src={item.image} alt={item.name} fill className="object-cover" />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-xs text-gray-400">No image</div>
            )}
          </div>
          <div className="p-2">
            <p className="text-sm font-medium truncate">{item.name}</p>
            {item.location && (
              <p className="text-xs text-gray-500 truncate flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {item.location}
              </p>
            )}
            {item.pricepernight && (
              <p className="text-xs text-emerald-600 mt-0.5">₹{item.pricepernight.toLocaleString()}/night</p>
            )}
          </div>
        </div>
      );
    case 'events':
      return (
        <div>
          <div className="w-full h-28 relative bg-gray-100">
            {item.image ? (
              <Image src={item.image} alt={item.name} fill className="object-cover" />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-xs text-gray-400">No image</div>
            )}
          </div>
          <div className="p-2">
            <p className="text-sm font-medium truncate">{item.name}</p>
            {item.location && (
              <p className="text-xs text-gray-500 truncate flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {item.location}
              </p>
            )}
            {item.date && (
              <p className="text-xs text-gray-500 mt-0.5">
                {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </p>
            )}
          </div>
        </div>
      );
    case 'thrills':
      return (
        <div>
          <div className="w-full h-28 relative bg-gray-100">
            {item.image ? (
              <Image src={item.image} alt={item.name} fill className="object-cover" />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-xs text-gray-400">No image</div>
            )}
          </div>
          <div className="p-2">
            <p className="text-sm font-medium truncate">{item.name}</p>
            {item.location && (
              <p className="text-xs text-gray-500 truncate flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {item.location}
              </p>
            )}
            {item.priceperperson && (
              <p className="text-xs text-emerald-600 mt-0.5">₹{item.priceperperson.toLocaleString()}</p>
            )}
          </div>
        </div>
      );
case 'cafesRestaurants':
  return (
    <div className="flex gap-3 w-[280px] bg-zinc-50 border border-zinc-200 rounded-xl shadow-sm p-3">
      {/* Image */}
      <div className="relative w-[90px] h-[90px] bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name || 'Cafe'}
            fill
            sizes="90px"
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-xs text-gray-400">No Image</div>
        )}
      </div>

      {/* Text Content */}
      <div className="flex flex-col justify-between w-full min-w-0">
        <div>
          {/* Name */}
          <p className="text-sm font-semibold text-gray-800 truncate">{item.name || 'Untitled'}</p>

          {/* Description */}
          {item.description && (
            <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
              {item.description}
            </p>
          )}

          {/* Location */}
          {item.location && (
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span className="truncate">{item.location}</span>
            </p>
          )}
        </div>

        {/* Footer Info */}
        <p className="text-xs text-gray-500 mt-2 truncate">
          {(item.cuisine?.length ? item.cuisine.join(', ') : 'No cuisine')} • ⭐ {item.ratings ?? 'N/A'}
        </p>
      </div>
    </div>
  );

    case 'itineraries':
      return (
        <div>
          <div className="w-full h-28 relative bg-gray-100">
            {item.image ? (
              <Image src={item.image} alt={item.title || item.name} fill className="object-cover" />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-xs text-gray-400">No image</div>
            )}
          </div>
          <div className="p-2">
            <p className="text-sm font-medium truncate">{item.title || item.name}</p>
            {item.starting_point && (
              <p className="text-xs text-gray-500 truncate flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {item.starting_point}
              </p>
            )}
          </div>
        </div>
      );
    default:
      return (
        <div>
          <div className="w-full h-28 relative bg-gray-100">
            {item.image ? (
              <Image src={item.image} alt={item.name} fill className="object-cover" />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-xs text-gray-400">No image</div>
            )}
          </div>
          <div className="p-2">
            <p className="text-sm font-medium truncate">{item.name}</p>
            {item.location && (
              <p className="text-xs text-gray-500 truncate flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {item.location}
              </p>
            )}
          </div>
        </div>
      );
  }
}