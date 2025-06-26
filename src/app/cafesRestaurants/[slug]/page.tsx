import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import ClientPage from './clientPage';

export async function generateMetadata(_: any): Promise<Metadata> {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const url = new URL(_.params?.slug ?? '', 'https://example.com');
  const slug = url.pathname.split('/').pop();
  if (!slug) return { title: 'Restaurant Not Found' };

  const { data: cafe } = await supabase
    .from('cafes_and_restaurants')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!cafe) return { title: 'Restaurant Not Found' };

  return {
    title: `${cafe.name} | Meghtourism`,
    description: cafe.description?.slice(0, 150) || '',
    openGraph: {
      title: `${cafe.name} | Meghtourism`,
      description: cafe.description?.slice(0, 150) || '',
      images: cafe.image ? [{ url: cafe.image }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${cafe.name} | Meghtourism`,
      description: cafe.description?.slice(0, 150) || '',
      images: cafe.image ? [cafe.image] : [],
    },
  };
}
export default function Page() {
  return <ClientPage />;
}
