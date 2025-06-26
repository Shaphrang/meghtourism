import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import ClientPage from './clientPage';

export async function generateMetadata(_: any): Promise<Metadata> {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const url = new URL(_.params?.slug ?? '', 'https://example.com');
  const slug = url.pathname.split('/').pop();
  if (!slug) return { title: 'Event Not Found' };

  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!event) return { title: 'Event Not Found' };

  return {
    title: `${event.name} | Meghtourism`,
    description: event.description?.slice(0, 150) || '',
    openGraph: {
      title: `${event.name} | Meghtourism`,
      description: event.description?.slice(0, 150) || '',
      images: event.image ? [{ url: event.image }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${event.name} | Meghtourism`,
      description: event.description?.slice(0, 150) || '',
      images: event.image ? [event.image] : [],
    },
  };
}
 export default function Page() {
  return <ClientPage />;
}