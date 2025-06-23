'use client';

import useSupabaseList from '@/hooks/useSupabaseList';
import { Homestay } from '@/types/homestay';
import HorizontalSection from '@/components/sections/horizontalSection';
import HomestayCard from '@/components/cards/homestayCard';

export function HomestaysSection() {
  const { data: homestays = [], loading, error } = useSupabaseList<Homestay>('homestays', {
    sortBy: 'created_at',
    ascending: false,
    page: 1,
    pageSize: 6,
  });

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
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
