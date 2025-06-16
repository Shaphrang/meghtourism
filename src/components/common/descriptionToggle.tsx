'use client';

import { useState } from 'react';

interface Props {
  text: string;
}

export default function DescriptionToggle({ text }: Props) {
  const [expanded, setExpanded] = useState(false);

  const toggle = () => setExpanded(!expanded);

  return (
    <div className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">
      {expanded ? text : text.split(' ').slice(0, 30).join(' ') + '...'}
      <button onClick={toggle} className="ml-2 text-blue-600 text-sm underline">
        {expanded ? 'Show less' : 'Show more'}
      </button>
    </div>
  );
}
