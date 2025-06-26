import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import ClientPage from './clientPage';

export async function generateMetadata(_: any): Promise<Metadata> {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const url = new URL(_.params?.slug ?? '', 'https://example.com');
  const slug = url.pathname.split('/').pop();
  if (!slug) return { title: 'Blog Not Found' };

  const { data: blog } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!blog) return { title: 'Blog Not Found' };

  return {
    title: `${blog.title} | Meghtourism`,
    description: blog.summary?.slice(0, 150) || '',
    openGraph: {
      title: `${blog.title} | Meghtourism`,
      description: blog.summary?.slice(0, 150) || '',
      images: blog.cover_image ? [{ url: blog.cover_image }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${blog.title} | Meghtourism`,
      description: blog.summary?.slice(0, 150) || '',
      images: blog.cover_image ? [blog.cover_image] : [],
    },
  };
}

export default function Page() {
  return <ClientPage />;
}