import Link from 'next/link';
import { Thrill } from '@/types/thrill';
import clsx from 'clsx';

interface Props {
  thrill: Thrill;
  className?: string;
}

export default function ThrillCard({ thrill, className = '' }: Props) {
  return (
    <Link
      href={`/thrills/${thrill.id}`}
      className={clsx(
        'block bg-white rounded-xl shadow-md overflow-hidden flex-shrink-0 hover:shadow-lg transition',
        className
      )}
    >
      <div className="relative w-full h-36">
        <img
          src={thrill.image || '/placeholder.jpg'}
          alt={thrill.name || ''}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <h3 className="text-base font-semibold text-gray-800">{thrill.name}</h3>
        <p className="text-sm text-gray-600">{thrill.location}</p>
      </div>
    </Link>
  );
}
