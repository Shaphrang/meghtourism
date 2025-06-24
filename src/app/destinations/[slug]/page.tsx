// src/app/destinations/[slug]/page.tsx
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import DestinationDetailPage from './clientPage';

export async function generateMetadata(_: any): Promise<Metadata> {
  const cookieStore = cookies(); // you must await cookies or call it before passing to supabase client
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const url = new URL(_.params?.slug ?? '', 'https://example.com'); // ensure params is accessed safely
  const slug = url.pathname.split('/').pop(); // fallback if slug is malformed

  if (!slug) {
    return { title: 'Destination Not Found' };
  }

  const { data: dest } = await supabase
    .from('destinations')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!dest) {
    return { title: 'Destination Not Found' };
  }

  return {
    title: `${dest.name} | Meghtourism`,
    description: dest.description?.slice(0, 150) || '',
    openGraph: {
      title: `${dest.name} | Meghtourism`,
      description: dest.description?.slice(0, 150) || '',
      images: dest.image ? [{ url: dest.image }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${dest.name} | Meghtourism`,
      description: dest.description?.slice(0, 150) || '',
      images: dest.image ? [dest.image] : [],
    },
    other: {
      'script:type': 'application/ld+json',
      'script:content': JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'TouristDestination',
        name: dest.name,
        description: dest.description?.slice(0, 300),
        image: dest.image,
        address: dest.address,
        geo: {
          '@type': 'GeoCoordinates',
          latitude: dest.latitude,
          longitude: dest.longitude,
        },
        url: `https://megthourism.com/destinations/${dest.slug}`,
        sameAs: [`https://megthourism.com/destinations/${dest.slug}`],
      }),
    },
  };
}

export default function Page() {
  return <DestinationDetailPage />;
}
