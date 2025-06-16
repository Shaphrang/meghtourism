'use client';

interface TrackClickButtonProps {
  label: string;
  children: React.ReactNode;
}

export default function TrackClickButton({ label, children }: TrackClickButtonProps) {
  const trackClick = () => {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'click', {
        event_category: 'engagement',
        event_label: label,
      });
    }
  };

  return (
    <button
      onClick={trackClick}
      className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
    >
      {children}
    </button>
  );
}
