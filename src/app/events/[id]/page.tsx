import { notFound } from 'next/navigation';
import { Event } from '@/types/event';
import { supabase } from '@/lib/supabaseClient';

interface Params {
  params: {
    id: string;
  };
}

export default async function EventDetailPage({ params }: Params) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error) {
    console.error(error);
    return notFound();
  }
  const event = data as Event | null;

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
