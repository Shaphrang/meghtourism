'use client';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

interface DestinationHeaderClientProps {
  name: string;
  description: string;
}

export default function DestinationHeaderClient({ name, description }: DestinationHeaderClientProps) {
  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator.share) {
      navigator.share({
        title: name,
        text: description,
        url: window.location.href,
      }).then(() => {
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'share', {
            event_category: 'engagement',
            event_label: name,
          });
        }
      });
    }
  };

  return (
    <button onClick={handleShare} className="text-sm text-blue-600 underline">
      Share
    </button>
  );
}
