import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import ClientPage from './clientPage';

export async function generateMetadata(_: any): Promise<Metadata> {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const url = new URL(_.params?.slug ?? '', 'https://example.com');
  const slug = url.pathname.split('/').pop();
  if (!slug) return { title: 'Adventure Not Found' };

  const { data: thrill } = await supabase
    .from('thrills')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!thrill) return { title: 'Adventure Not Found' };

  return {
    title: `${thrill.name} | Meghtourism`,
    description: thrill.description?.slice(0, 150) || '',
    openGraph: {
      title: `${thrill.name} | Meghtourism`,
      description: thrill.description?.slice(0, 150) || '',
      images: thrill.image ? [{ url: thrill.image }] : [],
    },
        twitter: {
      card: 'summary_large_image',
      title: `${thrill.name} | Meghtourism`,
      description: thrill.description?.slice(0, 150) || '',
      images: thrill.image ? [thrill.image] : [],
    },
  };
}
export default function Page() {
  return <ClientPage />;
}