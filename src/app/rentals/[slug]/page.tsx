import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import ClientPage from './clientPage';

export async function generateMetadata(_: any): Promise<Metadata> {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const url = new URL(_.params?.slug ?? '', 'https://example.com');
  const slug = url.pathname.split('/').pop();
  if (!slug) return { title: 'Rental Not Found' };

  const { data: rental } = await supabase
    .from('rentals')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!rental) return { title: 'Rental Not Found' };

  const name = rental.title || rental.type || 'Rental';

  return {
    title: `${name} | Meghtourism`,
    description: rental.description?.slice(0, 150) || '',
    openGraph: {
      title: `${name} | Meghtourism`,
      description: rental.description?.slice(0, 150) || '',
      images: rental.image ? [{ url: rental.image }] : [],
    },

    twitter: {
      card: 'summary_large_image',
      title: `${name} | Meghtourism`,
      description: rental.description?.slice(0, 150) || '',
      images: rental.image ? [rental.image] : [],
    },
  };
}
export default function Page() {
  return <ClientPage />;
}
