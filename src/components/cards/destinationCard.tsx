// src/components/cards/DestinationCard.tsx
import { Destination } from '@/types/destination';

interface Props {
  destination: Destination;
}

export default function DestinationCard({ destination }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      <img
        src={destination.image}
        alt={destination.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold">{destination.name}</h3>
        <p className="text-sm text-gray-600">{destination.description}</p>
        <ul className="mt-2 list-disc list-inside text-sm text-gray-500">
          {destination.highlights.map((highlight, idx) => (
            <li key={idx}>{highlight}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
