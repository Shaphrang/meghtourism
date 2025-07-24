'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MapPin } from 'lucide-react'

interface Props {
  title: string
  type: string
  items: any[]
}

export default function VerticalSection({ title, type, items }: Props) {
  if (!items || items.length === 0) return null

  return (
    <section className="mt-6 w-full">
      <h2 className="text-lg font-semibold px-4 mb-2">{title}</h2>
        <div className="flex flex-col space-y-4 px-4">
          {items.slice(0, 5).map((item) => (
            <Link
              key={item.id}
              href={`/${type}/${item.slug ?? item.id}`}
              className="block"
            >
              {renderCard(type, item)}
            </Link>
          ))}
        </div>

    </section>
  )
}

function renderCard(type: string, item: any) {
  switch (type) {
    case 'homestays':
      return (
        <div>
          <div className="w-full aspect-square relative bg-gray-100">
            {item.image ? (
              <Image src={item.image} alt={item.name} fill className="object-cover" />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-xs text-gray-400">No image</div>
            )}
          </div>
          <div className="p-3">
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
      )
    case 'events':
      return (
        <div>
          <div className="w-full aspect-square relative bg-gray-100">
            {item.image ? (
              <Image src={item.image} alt={item.name} fill className="object-cover" />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-xs text-gray-400">No image</div>
            )}
          </div>
          <div className="p-3">
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
      )
    case 'thrills':
      return (
        <div>
          <div className="w-full aspect-square relative bg-gray-100">
            {item.image ? (
              <Image src={item.image} alt={item.name} fill className="object-cover" />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-xs text-gray-400">No image</div>
            )}
          </div>
          <div className="p-3">
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
      )
case 'cafesRestaurants':
  return (
    <div className="w-full bg-zinc-50 border border-zinc-200 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.05)] p-4 flex gap-4 mb-4">
      {/* Image */}
      <div className="relative w-[100px] h-[100px] flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name || 'Cafe'}
            fill
            sizes="100px"
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-xs text-gray-400">No Image</div>
        )}
      </div>

      {/* Text Content */}
      <div className="flex flex-col justify-between w-full py-1 pr-1">
        <div>
          {/* Name */}
          <h3 className="text-base font-semibold text-gray-800 leading-tight truncate">
            {item.name || 'Untitled'}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 mt-1 leading-snug line-clamp-2">
            {item.description
              ? `${item.description.slice(0, 120)}${item.description.length > 120 ? '...' : ''}`
              : 'No description available'}
          </p>

          {/* Location */}
          {item.location && (
            <p className="text-sm text-gray-500 mt-2 flex items-center">
              <MapPin size={14} className="mr-1" />
              {item.location}
            </p>
          )}
        </div>

        {/* Footer Info */}
        <div className="text-sm text-gray-500 mt-3 truncate">
          {(item.cuisine?.length ? item.cuisine.join(', ') : 'No cuisine')} • {item.type ?? 'Type'} • ⭐ {item.ratings ?? 'N/A'}
        </div>
      </div>
    </div>
  );


    case 'itineraries':
      return (
        <div>
          <div className="w-full aspect-square relative bg-gray-100">
            {item.image ? (
              <Image src={item.image} alt={item.title || item.name} fill className="object-cover" />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-xs text-gray-400">No image</div>
            )}
          </div>
          <div className="p-3">
            <p className="text-sm font-medium truncate">{item.title || item.name}</p>
            {item.starting_point && (
              <p className="text-xs text-gray-500 truncate flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {item.starting_point}
              </p>
            )}
          </div>
        </div>
      )
    default:
      return (
        <div>
          <div className="w-full aspect-square relative bg-gray-100">
            {item.image ? (
              <Image src={item.image} alt={item.name} fill className="object-cover" />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-xs text-gray-400">No image</div>
            )}
          </div>
          <div className="p-3">
            <p className="text-sm font-medium truncate">{item.name}</p>
            {item.location && (
              <p className="text-xs text-gray-500 truncate flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {item.location}
              </p>
            )}
          </div>
        </div>
      )
  }
}