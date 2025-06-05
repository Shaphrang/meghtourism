import { notFound } from 'next/navigation';
import { Event } from '@/types/event';
import path from 'path';
import { promises as fs } from 'fs';

interface Params {
  params: {
    id: string;
  };
}

export default async function EventDetailPage({ params }: Params) {
  const filePath = path.join(process.cwd(), 'public/data/events.json');
  const fileContent = await fs.readFile(filePath, 'utf-8');
  const events: Event[] = JSON.parse(fileContent);

  const event = events.find(e => e.id === params.id);

  if (!event) return notFound();

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">
      <img
        src={event.image}
        alt={event.name}
        className="w-full h-64 object-cover rounded-xl mb-6"
      />
      <h1 className="text-3xl font-bold mb-2">{event.name}</h1>
      <p className="text-gray-600 mb-1">{event.location}</p>
      <p className="text-gray-500 mb-4 italic">📅 {event.date}</p>
      <p className="text-gray-700 mb-4">{event.description}</p>
      <ul className="list-disc list-inside text-gray-700">
        {event.highlights.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
