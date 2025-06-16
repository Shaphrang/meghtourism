import Image from 'next/image';
import { notFound } from 'next/navigation';
import Header from '@/components/common/header';
import Footer from '@/components/common/footer';
import HorizontalScroll from '@/components/common/horizontalScroll';
import ThrillCard from '@/components/cards/thrillsCard';
import ContactForm from '@/components/common/contactForm';
import { createServerSupabaseClient } from '@/lib/supabaseServer';
import { Thrill } from '@/types/thrill';
export const runtime = 'nodejs';
export const revalidate = 60;

export async function generateMetadata({ params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from('thrills')
    .select('name, description')
    .eq('id', params.id)
    .single();
  return {
    title: data?.name || 'Thrill',
    description: data?.description || '',
  };
}

export default async function ThrillDetailPage({ params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient();
  const { data: thrill } = await supabase
    .from('thrills')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!thrill) {
    notFound();
  }

  const { data: nearby } = await supabase
    .from('thrills')
    .select('*')
    .eq('location', thrill!.location)
    .neq('id', params.id)
    .limit(10);

  return (
    <>
      <Header />
      <main className="pt-20 pb-24 px-4 max-w-screen-lg mx-auto">
        {thrill?.image && (
          <div className="relative w-full h-64 md:h-80 mb-4">
            <Image
              src={thrill.image}
              alt={thrill.name ?? 'Thrill'}
              fill
              className="object-cover rounded-xl"
            />
          </div>
        )}
        <h1 className="text-3xl font-bold mb-1">{thrill?.name}</h1>
        <p className="text-sm text-gray-600 mb-4">{thrill?.location}</p>
        {thrill?.description && <p className="mb-4 whitespace-pre-line">{thrill.description}</p>}
        {thrill?.highlights && (
          <ul className="list-disc pl-5 mb-4 space-y-1">
            {thrill.highlights.map((h: string) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        )}
        {thrill?.tags && (
          <div className="flex flex-wrap gap-2 mb-4">
            {thrill.tags.map((tag: string) => (
              <span
                key={tag}
                className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        {thrill?.maplink && (
          <div className="mb-6">
            <iframe
              src={thrill.maplink}
              className="w-full h-64 rounded-lg border"
              allowFullScreen
              loading="lazy"
            />
          </div>
        )}
        {nearby && nearby.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Nearby Thrills</h2>
            <HorizontalScroll>
              {nearby.map((t: Thrill) => (
                <ThrillCard key={t.id} thrill={t} className="min-w-[200px] max-w-[200px]" />
              ))}
            </HorizontalScroll>
          </section>
        )}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-2">Have a Question or Review?</h2>
          <ContactForm itemId={thrill!.id} itemType="thrill" />
        </section>
      </main>
      <Footer />
    </>
  );
}