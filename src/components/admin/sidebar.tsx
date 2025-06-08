'use client';

import { useState } from 'react';
import clsx from 'clsx';

interface Props {
  current: string;
  onSelect: (category: string) => void;
}

const categories = [
  { key: 'destinations', label: 'Destinations' },
  { key: 'homestays', label: 'Homestays' },
  { key: 'events', label: 'Events' },
  { key: 'thrills', label: 'Thrills' }
];

export default function Sidebar({ current, onSelect }: Props) {
  return (
    <aside className="w-full md:w-56 border-r bg-white h-full">
      <div className="p-4 text-lg font-bold text-gray-800">Admin Panel</div>
      <nav className="flex flex-col">
        {categories.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className={clsx(
              'text-left px-4 py-2 text-sm font-medium hover:bg-emerald-50 border-l-4',
              current === key ? 'bg-emerald-100 border-emerald-500 text-emerald-700' : 'border-transparent text-gray-700'
            )}
          >
            {label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
