'use client';

import { useEffect, useState } from 'react';
import { fetchData } from '@/lib/fetchData';
import ThrillCard from '@/components/cards/thrillsCard';
import { Thrill } from '@/types/thrill';
import HorizontalScroll from '@/components/common/horizontalScoll';

export function ThrillsSection() {
  const [thrills, setThrills] = useState<Thrill[]>([]);

  useEffect(() => {
    fetchData('thrills.json').then(setThrills);
  }, []);

  return (
    <section className="py-6 px-4 bg-gradient-to-r from-blue-50 to-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Adventure & Thrill</h2>
        <a href="/thrills" className="text-blue-500 text-sm">More →</a>
      </div>
      <HorizontalScroll>
        {thrills.map((thrill, i) => (
          <ThrillCard
            key={i}
            thrill={thrill}
            className="min-w-[250px] max-w-[250px]"
          />
        ))}
      </HorizontalScroll>
    </section>
  );
}
