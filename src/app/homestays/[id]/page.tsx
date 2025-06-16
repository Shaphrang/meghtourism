import Image from 'next/image';
import { notFound } from 'next/navigation';
import Header from '@/components/common/header';
import Footer from '@/components/common/footer';
import HorizontalScroll from '@/components/common/horizontalScroll';
import HomestayCard from '@/components/cards/homestayCard';
import ContactForm from '@/components/common/contactForm';
import { createServerSupabaseClient } from '@/lib/supabaseServer';
import { Homestay } from '@/types/homestay';
export const runtime = 'nodejs';
export const revalidate = 60;

export async function generateMetadata({ params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from('homestays')
    .select('name, description')
    .eq('id', params.id)
    .single();
  return {
    title: data?.name || 'Homestay',
    description: data?.description || '',
  };
}

export default async function HomestayDetailPage({ params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient();
  const { data: homestay } = await supabase
    .from('homestays')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!homestay) {
    notFound();
  }

  const { data: nearby } = await supabase
    .from('homestays')
    .select('*')
    .eq('location', homestay!.location)
    .neq('id', params.id)
    .limit(10);

  return (
    <>
      <Header />
      <main className="pt-20 pb-24 px-4 max-w-screen-lg mx-auto">
        {homestay?.image && (
          <div className="relative w-full h-64 md:h-80 mb-4">
            <Image
              src={homestay.image}
              alt={homestay.name ?? 'Homestay'}
              fill
              className="object-cover rounded-xl"
            />
          </div>
        )}
        <h1 className="text-3xl font-bold mb-1">{homestay?.name}</h1>
        <p className="text-sm text-gray-600 mb-4">{homestay?.location}</p>
        {homestay?.description && <p className="mb-4 whitespace-pre-line">{homestay.description}</p>}
        {homestay?.amenities && (
          <ul className="list-disc pl-5 mb-4 space-y-1">
            {homestay.amenities.map((a: string) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        )}
        {homestay?.tags && (
          <div className="flex flex-wrap gap-2 mb-4">
            {homestay.tags.map((tag: string) => (
              <span
                key={tag}
                className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        {homestay?.maplink && (
          <div className="mb-6">
            <iframe
              src={homestay.maplink}
              className="w-full h-64 rounded-lg border"
              allowFullScreen
              loading="lazy"
            />
          </div>
        )}
        {nearby && nearby.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Nearby Homestays</h2>
            <HorizontalScroll>
              {nearby.map((h: Homestay) => (
                <HomestayCard key={h.id} homestay={h} className="min-w-[200px] max-w-[200px]" />
              ))}
            </HorizontalScroll>
          </section>
        )}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-2">Have a Question or Review?</h2>
          <ContactForm itemId={homestay!.id} itemType="homestay" />
        </section>
      </main>
      <Footer />
    </>
  );
}