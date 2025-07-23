import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import ClientPage from './clientPage';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const cookieStore = await cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const slug = params.slug;
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