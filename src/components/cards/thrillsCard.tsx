import Link from 'next/link';
import { Thrill } from '@/types/thrill';

interface Props {
  thrill: Thrill;
  className?: string;
}

export default function ThrillCard({ thrill, className = '' }: Props) {
  return (
    <Link href={`/thrills/${thrill.id}`} className={`block ${className}`}>
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <img src={thrill.image} alt={thrill.name} className="w-full h-36 object-cover" />
        <div className="p-4">
          <h3 className="text-base font-semibold text-gray-800">{thrill.name}</h3>
          <p className="text-sm text-gray-600">{thrill.location}</p>
        </div>
      </div>
    </Link>
  );
}
