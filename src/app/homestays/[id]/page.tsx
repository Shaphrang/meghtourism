import { notFound } from 'next/navigation';
import { Homestay } from '@/types/homestay';
import path from 'path';
import { promises as fs } from 'fs';

interface Params {
  params: {
    id: string;
  };
}

export default async function HomestayDetailPage({ params }: Params) {
  const filePath = path.join(process.cwd(), 'public/data/homestays.json');
  const fileContent = await fs.readFile(filePath, 'utf-8');
  const homestays: Homestay[] = JSON.parse(fileContent);

  const homestay = homestays.find(h => h.id === params.id);

  if (!homestay) return notFound();

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">
      <img
        src={homestay.image}
        alt={homestay.name}
        className="w-full h-64 object-cover rounded-xl mb-6"
      />
      <h1 className="text-3xl font-bold mb-2">{homestay.name}</h1>
      <p className="text-lg text-gray-600 mb-2">{homestay.location}</p>
      <p className="text-gray-700 mb-4 font-semibold">{homestay.price}</p>
      <ul className="list-disc list-inside text-gray-700">
        {homestay.amenities.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
