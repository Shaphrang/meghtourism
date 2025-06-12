'use client';

import { useEffect, useState } from 'react';
import { fetchData } from '@/lib/fetchData';
import { Homestay } from '@/types/homestay';
import HorizontalSection from '@/components/sections/horizontalSection';
import HomestayCard from '@/components/cards/homestayCard';

export function HomestaysSection() {
  const [homestays, setHomestays] = useState<Homestay[]>([]);

  useEffect(() => {
    fetchData('homestays.json')
      .then(setHomestays)
      .catch(console.error);
  }, []);

  return (
    <HorizontalSection
        title="Recommended Homestays"
        items={homestays}
      renderCard={(homestay, index) => (
        <HomestayCard
          key={index}
          homestay={homestay}
          className="w-[200px] flex-shrink-0"
        />
      )}
    />
  );
}
