'use client'

import Image from 'next/image'
import Link from 'next/link'

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
      <div className="grid grid-cols-2 gap-4 px-4">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/${type}/${item.slug ?? item.id}`}
            prefetch
            className="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden"
          >
            <div className="w-full aspect-square relative bg-gray-100">
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
      </div>
    </section>
  )
}