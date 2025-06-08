'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function HorizontalScroll({ children, className = '' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    const el = containerRef.current;
    if (!el) return;
    const scrollAmount = direction === 'left' ? -300 : 300;
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      {/* Left Arrow */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white shadow rounded-full hover:bg-gray-100"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Scrollable Container */}
      <div
        ref={containerRef}
        className={`overflow-x-auto no-scrollbar scroll-smooth pb-4 ${className}`}
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="flex gap-4 min-w-max px-6">{children}</div>
      </div>

      {/* Right Arrow */}
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white shadow rounded-full hover:bg-gray-100"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
