'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import useFilteredList from '@/hooks/useFilteredList'
import { cn } from '@/lib/utils'
import { useState } from 'react'

export type FeaturedCategory =
  | 'destinations'
  | 'homestays'
  | 'events'
  | 'thrills'
  | 'cafesRestaurants'
  | 'itineraries'

interface BannerProps {
  category: FeaturedCategory
  className?: string
}

function useFeaturedAds(category: FeaturedCategory) {
  const config = categoryConfig[category]
  const { data, loading } = useFilteredList<any>(config.table, {
    filters: [
      { field: 'adslot', op: 'eq', value: 'homepage' },
      { field: 'adactive', op: 'eq', value: true },
    ],
    sort: { field: 'created_at', ascending: false },
    pageSize: 10,
  })
  return { data: data || [], loading, Card: config.Card }
  console.log("Part 1: ", data)
}

const categoryConfig: Record<
  FeaturedCategory,
  { table: string; Card: (props: { item: any }) => React.ReactElement }
> = {
  destinations: {
    table: 'destinations',
    Card: ({ item }) => (
      console.log("Featured Data: ", item),
      <div className="min-w-[160px] max-w-[180px] bg-white rounded-xl shadow-md overflow-hidden flex-shrink-0 flex flex-col">
        <div className="relative w-full h-28 bg-gray-100">
          {item.image ? (
            <Image src={item.image} alt={item.name || 'Destination'} fill sizes="180px" className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No image</div>
          )}
        </div>
        <div className="flex flex-col flex-1 p-2">
          <h3 className="text-sm font-semibold text-gray-800 truncate">{item.name || 'Untitled'}</h3>
          {item.location && (
            <p className="text-xs text-gray-600 mt-1 line-clamp-2 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-gray-500 shrink-0" />
              {item.location}
            </p>
          )}
        </div>
      </div>
    ),
  },
  homestays: {
    table: 'homestays',
    Card: ({ item }) => (
      <div className="min-w-[160px] max-w-[180px] bg-white rounded-xl shadow-md overflow-hidden flex-shrink-0 flex flex-col">
        <div className="relative w-full h-28 bg-gray-100">
          {item.image ? (
            <Image src={item.image} alt={item.name || 'Homestay'} fill sizes="180px" className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No image</div>
          )}
        </div>
        <div className="flex flex-col flex-1 p-2">
          <h3 className="text-sm font-semibold text-gray-800 truncate">{item.name || 'Untitled'}</h3>
          {item.location && (
            <p className="text-xs text-gray-600 mt-1 line-clamp-2 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-gray-500 shrink-0" />
              {item.location}
            </p>
          )}
          {item.pricepernight && (
            <p className="text-xs text-emerald-600 mt-1">₹{item.pricepernight.toLocaleString()}/night</p>
          )}
        </div>
      </div>
    ),
  },
  events: {
    table: 'events',
    Card: ({ item }) => (
      <div className="w-[100px] sm:w-[120px] flex flex-col items-center space-y-1 flex-shrink-0">
        <div className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] rounded-full bg-white shadow-md overflow-hidden relative border">
          {item.image ? (
            <Image src={item.image} alt={item.name || 'Event'} fill sizes="(max-width: 640px) 100px, 120px" className="object-cover rounded-full" />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-[10px] text-gray-500 text-center px-1">
              {item.name?.slice(0, 20) || 'Unnamed'}
            </div>
          )}
        </div>
        <div className="w-full text-center">
          <p className="text-[10px] font-semibold text-gray-800 truncate w-full">{item.name?.slice(0, 20)}</p>
          {item.date && (
            <p className="text-[10px] text-gray-600 truncate w-full">
              {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </p>
          )}
        </div>
      </div>
    ),
  },
  thrills: {
    table: 'thrills',
    Card: ({ item }) => (
      <div className="min-w-[160px] max-w-[180px] bg-white rounded-xl shadow-md overflow-hidden flex-shrink-0 flex flex-col">
        <div className="relative w-full h-28 bg-gray-100">
          {item.image ? (
            <Image src={item.image} alt={item.name || 'Thrill'} fill sizes="180px" className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No image</div>
          )}
        </div>
        <div className="flex flex-col flex-1 p-2">
          <h3 className="text-sm font-semibold text-gray-800 truncate">{item.name || 'Untitled'}</h3>
          {item.location && (
            <p className="text-xs text-gray-600 mt-1 line-clamp-2 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-gray-500 shrink-0" />
              {item.location}
            </p>
          )}
          {item.priceperperson && (
            <p className="text-xs text-emerald-600 mt-1">₹{item.priceperperson.toLocaleString()} per person</p>
          )}
        </div>
      </div>
    ),
  },
  cafesRestaurants: {
    table: 'cafes_and_restaurants',
    Card: ({ item }) => {
      const [expanded, setExpanded] = useState(false)
      return (
        <div className="flex gap-3 bg-white rounded-xl shadow-md overflow-hidden p-2 flex-shrink-0">
          <div className="relative w-[100px] h-[100px] flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
            {item.image ? (
              <Image src={item.image} alt={item.name || 'Cafe'} fill sizes="100px" className="object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-gray-400">No Image</div>
            )}
          </div>
          <div className="flex flex-col justify-between py-1 pr-1">
            <div>
              <h3 className="text-sm font-semibold text-gray-800 truncate">{item.name || 'Untitled'}</h3>
              <p className="text-xs text-gray-600">
                {expanded
                  ? item.description
                  : `${item.description?.slice(0, 100)}${item.description && item.description.length > 100 ? '...' : ''}`}
                {item.description && item.description.length > 100 && (
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="ml-1 text-emerald-600 text-[11px] font-medium"
                  >
                    {expanded ? 'Show less' : 'Show more'}
                  </button>
                )}
              </p>
              <p className="text-xs text-gray-500 mt-1 flex items-center">
                <MapPin size={12} className="mr-1" />
                {item.location}
              </p>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {(item.cuisine?.length ? item.cuisine.join(', ') : 'No cuisine')} • {item.type} • ⭐ {item.ratings ?? 'N/A'}
            </div>
          </div>
        </div>
      )
    },
  },
  itineraries: {
    table: 'itineraries',
    Card: ({ item }) => (
      <div className="min-w-[160px] max-w-[180px] bg-white rounded-xl shadow-md overflow-hidden flex-shrink-0 flex flex-col">
        <div className="relative w-full h-28 bg-gray-100">
          {item.image ? (
            <Image src={item.image} alt={item.title || 'Itinerary'} fill sizes="180px" className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No image</div>
          )}
        </div>
        <div className="flex flex-col flex-1 p-2">
          <h3 className="text-sm font-semibold text-gray-800 truncate">{item.title || 'Untitled'}</h3>
          {item.starting_point && <p className="text-xs text-gray-600 mt-1 line-clamp-2">{item.starting_point}</p>}
          {item.estimated_cost?.min && (
            <p className="text-xs text-emerald-600 mt-1">₹{item.estimated_cost.min.toLocaleString()}</p>
          )}
        </div>
      </div>
    ),
  },
}

export default function FeaturedBannerAds({ category, className }: BannerProps) {
  const { data, loading, Card } = useFeaturedAds(category)
    console.log("Poi hangne: ", data)

  if (loading) {
    return <p className="text-sm text-gray-500 px-2">Loading Data...</p>
  }
  if (!data.length) {
    return <p className="text-sm text-gray-500 px-2">No Data available.</p>
  }

  const hrefMap: Record<FeaturedCategory, (item: any) => string> = {
    destinations: (i) => `/destinations/${i.slug ?? i.id}`,
    homestays: (i) => `/homestays/${i.slug ?? i.id}`,
    events: (i) => `/events/${i.slug ?? i.id}`,
    thrills: (i) => `/thrills/${i.slug ?? i.id}`,
    cafesRestaurants: (i) => `/cafesRestaurants/${i.slug ?? i.id}`,
    itineraries: (i) => `/itineraries/${i.slug ?? i.id}`,
  }
return (
    <div className={cn('flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2', className)}>
      {data.map((item) => (
        <Link key={item.id} href={hrefMap[category](item)} className="shrink-0">
          <Card item={item} />
        </Link>
      ))}
    </div>
  )
}
