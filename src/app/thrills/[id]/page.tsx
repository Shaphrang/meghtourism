import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Thrill } from '@/types/thrill';
import Image from 'next/image';

type Props = {
  params: { id: string };
};

export default async function Page({ params }: Props) {
  // 🔐 Safely check params
  if (typeof params === 'undefined' || typeof params.id === 'undefined') return notFound();

  const { data, error } = await supabase
    .from('thrills')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error) {
    console.error(error);
    return notFound();
  }

  const thrill = data as Thrill | null;

  if (!thrill) return notFound();

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">
      <div className="relative w-full h-64 rounded-xl overflow-hidden mb-6">
        <Image
          src={thrill.image}
          alt={thrill.name}
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>

      <h1 className="text-3xl font-bold mb-2">{thrill.name}</h1>
      <p className="text-gray-600 mb-2">{thrill.location}</p>
      <p className="text-gray-700 mb-4">{thrill.description}</p>

      {thrill.highlights?.length > 0 && (
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          {thrill.highlights.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
