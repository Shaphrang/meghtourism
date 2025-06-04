'use client';

import { useEffect, useState } from 'react';
import { fetchData } from '@/lib/fetchData';
import HomestayCard from '@/components/cards/homestayCard';
import { Homestay } from '@/types/homestay';
import HorizontalScroll from '@/components/common/horizontalScoll';

export function HomestaysSection() {
  const [homestays, setHomestays] = useState<Homestay[]>([]);

  useEffect(() => {
    fetchData('homestays.json').then(setHomestays);
  }, []);

  return (
    <section className="py-6 px-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Recommended Homestays</h2>
        <a href="/homestays" className="text-blue-500 text-sm">More →</a>
      </div>
      <HorizontalScroll>
          {homestays.map((homestay, i) => (
            <HomestayCard key={i} homestay={homestay} className="min-w-[180px] max-w-[180px]" />
          ))}
      </HorizontalScroll> 
    </section>
  );
}
