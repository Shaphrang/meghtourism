'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props<T> {
  title: string;
  items: T[];
  renderCard: (item: T, index: number) => React.ReactNode;
}

export default function HorizontalSection<T>({
  title,
  items,
  renderCard,
}: Props<T>) {
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    const el = containerRef.current;
    if (!el) return;
    const scrollAmount = direction === 'left' ? -300 : 300;
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <section className="w-full">
      {/* Title */}
      <div className="flex justify-between items-center px-3">
        <h2 className="text-sm sm:text-base font-semibold text-gray-800">
          {title}
        </h2>
      </div>

      {/* Scrollable Row with Arrows (desktop only) */}
      <div className="relative">
        {/* ← Scroll Left (Desktop only) */}
        <button
          onClick={() => scroll('left')}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white shadow rounded-full hover:bg-gray-100"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Scrollable container */}
        <div
          ref={containerRef}
          className="overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar w-full"
          style={{ overflowY: 'hidden', WebkitOverflowScrolling: 'touch' }}
        >
          <div className="flex gap-3 px-3 py-2">
            {items.map((item, i) => (
              <div key={i} className="w-[180px] shrink-0">
                {renderCard(item, i)}
              </div>
            ))}
          </div>
        </div>

        {/* → Scroll Right (Desktop only) */}
        <button
          onClick={() => scroll('right')}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white shadow rounded-full hover:bg-gray-100"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
