import { notFound } from 'next/navigation';
import { Destination } from '@/types/destination';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';

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
      <div className="relative w-full h-64 rounded-xl overflow-hidden mb-6">
        <Image
          src={destination.image}
          alt={destination.name}
          layout="fill"
          objectFit="cover"
          priority // boost LCP
        />
      </div>

      <h1 className="text-3xl font-bold mb-2">{destination.name}</h1>
      <p className="text-gray-600 mb-4">{destination.description}</p>

      {destination.highlights?.length > 0 && (
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          {destination.highlights.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
