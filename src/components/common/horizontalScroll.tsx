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
    <div className="relative w-full">
      {/* Scrollable Container */}
      <div
        ref={containerRef}
        className={`
          overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar
          ${className}
        `}
        style={{
          WebkitOverflowScrolling: 'touch',
          overflowY: 'hidden',
        }}
      >
        <div className="flex gap-3 min-w-max px-3">{children}</div>
      </div>

      {/* Scroll Arrows - Only on desktop */}
      <button
        onClick={() => scroll('left')}
        className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-white shadow rounded-full hover:bg-gray-100"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={() => scroll('right')}
        className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-white shadow rounded-full hover:bg-gray-100"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
