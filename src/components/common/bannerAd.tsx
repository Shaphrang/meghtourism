// src/components/common/BannerAd.tsx
'use client';

import { useRef } from 'react';

const bannerCards = [
  {
    title: 'Book Early & Save!',
    description: 'Get up to 20% off on selected homestays.',
    bgColor: 'bg-orange-100',
  },
  {
    title: 'Local Experiences',
    description: 'Book guided tours and adventure packages.',
    bgColor: 'bg-blue-100',
  },
  {
    title: 'Taste Meghalaya',
    description: 'Explore top-rated cafés and restaurants.',
    bgColor: 'bg-green-100',
  },
  {
    title: 'Festive Season Deals',
    description: 'Cherry Blossom Festival offers inside.',
    bgColor: 'bg-pink-100',
  },
  {
    title: 'Plan with AI',
    description: 'Try our smart trip designer – it’s free!',
    bgColor: 'bg-yellow-100',
  },
];

export default function BannerAd() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section className="w-full px-2 sm:px-4 mt-4">
      <div className="relative">
        <div
          ref={containerRef}
          className="flex space-x-3 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth pb-2"
        >
          {bannerCards.map((card, i) => (
            <div
              key={i}
              className={`min-w-[85%] sm:min-w-[320px] max-w-sm rounded-xl p-4 snap-start shadow-md ${card.bgColor}`}
            >
              <h3 className="text-lg font-bold text-gray-800 mb-1">{card.title}</h3>
              <p className="text-sm text-gray-700">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
