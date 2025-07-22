'use client';

import { Share2 } from 'lucide-react';

interface ShareBarProps {
  title: string;
  text?: string;
}

export default function ShareBar({ title, text }: ShareBarProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: window.location.href });
      } catch (err) {
        console.error(err);
      }
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard');
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="border-t pt-2 mt-4 flex justify-end">
      <button
        onClick={handleShare}
        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
      >
        <Share2 size={16} /> Share
      </button>
    </div>
  );
}