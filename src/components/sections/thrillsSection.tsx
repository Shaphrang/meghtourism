'use client';

import { useEffect, useState } from 'react';
import { fetchData } from '@/lib/fetchData';
import ThrillCard from '@/components/cards/thrillsCard';
import { Activity } from '@/types/activity';
import HorizontalScroll from '@/components/common/horizontalScoll';

export function ThrillsSection() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    fetchData('adventures.json').then(setActivities);
  }, []);

  return (
    <section className="py-6 px-4 bg-gradient-to-r from-blue-50 to-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Adventure & Thrill</h2>
        <a href="/thrills" className="text-blue-500 text-sm">More →</a>
      </div>
     <HorizontalScroll>
          {activities.map((activity, i) => (
            <ThrillCard
              key={i}
              activity={activity}
              className="min-w-[250px] max-w-[250px]"
            />
          ))}
     </HorizontalScroll>
    </section>
  );
}
