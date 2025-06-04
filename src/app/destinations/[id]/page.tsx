import { notFound } from 'next/navigation';
import { Destination } from '@/types/destination';
import path from 'path';
import { promises as fs } from 'fs';

interface Params {
  params: {
    id: string;
  };
}

export default async function DestinationDetailPage({ params }: Params) {
  const filePath = path.join(process.cwd(), 'public/data/destinations.json');
  const fileContent = await fs.readFile(filePath, 'utf-8');
  const destinations: Destination[] = JSON.parse(fileContent);

  const destination = destinations.find(dest => dest.id === params.id);

  if (!destination) return notFound();

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">
      <img
        src={destination.image}
        alt={destination.name}
        className="w-full h-64 object-cover rounded-xl mb-6"
      />
      <h1 className="text-3xl font-bold mb-2">{destination.name}</h1>
      <p className="text-gray-600 mb-4">{destination.description}</p>
      <ul className="list-disc list-inside text-gray-700">
        {destination.highlights.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
