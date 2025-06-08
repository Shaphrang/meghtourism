import { notFound } from 'next/navigation';
import { Destination } from '@/types/destination';
import { supabase } from '@/lib/supabaseClient';

interface Params {
  params: {
    id: string;
  };
}

export default async function DestinationDetailPage({ params }: Params) {
  const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error) {
    console.error(error);
    return notFound();
  }
  const destination = data as Destination | null;

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
