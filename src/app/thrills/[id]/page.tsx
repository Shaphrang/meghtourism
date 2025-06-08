import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Thrill } from '@/types/thrill';

type Props = {
  params: { id: string };
};

export default async function Page({ params }: Props) {
  // 🔐 SAFELY check params
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
      <img
        src={thrill.image}
        alt={thrill.name}
        className="w-full h-64 object-cover rounded-xl mb-6"
      />
      <h1 className="text-3xl font-bold mb-2">{thrill.name}</h1>
      <p className="text-gray-600 mb-2">{thrill.location}</p>
      <p className="text-gray-700 mb-4">{thrill.description}</p>
      <ul className="list-disc list-inside text-gray-700">
        {thrill.highlights.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

// ✅ Tell Next to statically pre-generate pages for each ID
export async function generateStaticParams() {
  const { data } = await supabase.from('thrills').select('id');
  return (data || []).map((thrill) => ({
    id: (thrill as { id: string }).id,
  }));
}
