import { notFound } from 'next/navigation';
import { Homestay } from '@/types/homestay';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';

interface Params {
  params: {
    id: string;
  };
}

export default async function HomestayDetailPage({ params }: Params) {
  const { data, error } = await supabase
    .from('homestays')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error) {
    console.error(error);
    return notFound();
  }

  const homestay = data as Homestay | null;

  if (!homestay) return notFound();

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">
      <div className="relative w-full h-64 rounded-xl overflow-hidden mb-6">
        <Image
          src={homestay.image}
          alt={homestay.name}
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>

      <h1 className="text-3xl font-bold mb-2">{homestay.name}</h1>
      <p className="text-lg text-gray-600 mb-2">{homestay.location}</p>
      <p className="text-gray-700 mb-4 font-semibold">{homestay.price}</p>

      {homestay.amenities?.length > 0 && (
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          {homestay.amenities.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
