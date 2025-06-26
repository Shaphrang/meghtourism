import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import ClientPage from './clientPage';

export async function generateMetadata(_: any): Promise<Metadata> {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const url = new URL(_.params?.slug ?? '', 'https://example.com');
  const slug = url.pathname.split('/').pop();
  if (!slug) return { title: 'Homestay Not Found' };

  const { data: stay } = await supabase
    .from('homestays')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!stay) return { title: 'Homestay Not Found' };

  return {
    title: `${stay.name} | Meghtourism`,
    description: stay.description?.slice(0, 150) || '',
    openGraph: {
      title: `${stay.name} | Meghtourism`,
      description: stay.description?.slice(0, 150) || '',
      images: stay.image ? [{ url: stay.image }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${stay.name} | Meghtourism`,
      description: stay.description?.slice(0, 150) || '',
      images: stay.image ? [stay.image] : [],
    },
  };
}
export default function Page() {
  return <ClientPage />;
}
