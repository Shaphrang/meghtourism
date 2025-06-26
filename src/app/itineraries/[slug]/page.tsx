import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import ClientPage from './clientPage';

export async function generateMetadata(_: any): Promise<Metadata> {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const url = new URL(_.params?.slug ?? '', 'https://example.com');
  const slug = url.pathname.split('/').pop();
  if (!slug) return { title: 'Itinerary Not Found' };

  const { data: itin } = await supabase
    .from('itineraries')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!itin) return { title: 'Itinerary Not Found' };

  return {
    title: `${itin.title} | Meghtourism`,
    description: itin.description?.slice(0, 150) || '',
    openGraph: {
      title: `${itin.title} | Meghtourism`,
      description: itin.description?.slice(0, 150) || '',
      images: itin.image ? [{ url: itin.image }] : [],
    },
      };
}
export default function Page() {
  return <ClientPage />;
}