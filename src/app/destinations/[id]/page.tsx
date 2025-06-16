// ✅ Force Node.js runtime to support Supabase's cookies() API
export const runtime = 'nodejs';
export const revalidate = 60;

import { notFound } from 'next/navigation';
import Header from '@/components/common/header';
import Footer from '@/components/common/footer';
import HorizontalScroll from '@/components/common/horizontalScroll';
import DestinationCard from '@/components/cards/destinationCard';
import ContactForm from '@/components/common/contactForm';
import { createServerSupabaseClient } from '@/lib/supabaseServer';
import { Destination } from '@/types/destination';
import Script from 'next/script';
import { SupabaseImage } from '@/components/common/supabaseImage';
import DestinationHeaderClient from '@/components/common/destinationHeaderClient';
import TrackClickButton from '@/components/common/trackClickButton';
import DescriptionToggle from '@/components/common/descriptionToggle';




export async function generateMetadata({ params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from('destinations')
    .select('name, description')
    .eq('id', params.id)
    .single();

  return {
    title: data?.name || 'Destination',
    description: data?.description || '',
  };
}

export default async function DestinationDetailPage({ params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient();

  const { data: destination, error } = await supabase
    .from('destinations')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!destination || error) notFound();

  const { data: nearbyHomestays } = await supabase
    .from('homestays')
    .select('id, name, description, pricepernight, image')
    .eq('district', destination.district ?? '')
    .limit(5);

  const { data: nearbyAttractions } = await supabase
    .from('destinations')
    .select('id, name, image')
    .eq('district', destination.district ?? '')
    .neq('id', destination.id)
    .limit(10);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: destination.name,
    description: destination.description,
    image: destination.image,
    address: destination.address,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: destination.latitude,
      longitude: destination.longitude,
    },
  };

  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-9DZ19X5X54"
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-9DZ19X5X54');
        `}
      </Script>
      <Header />
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="pt-20 pb-24">
        {/* Carousel */}
          {destination.image && (
            <div className="relative w-full h-48 sm:h-64">
              <SupabaseImage
                src={destination.image}
                alt={destination.name ?? 'Destination'}
                width={800}
                height={400}
                className="w-full h-full object-cover object-center rounded"
              />
            </div>
          )}
        {/* Title & Tags */}
        <div className="px-4 py-6 max-w-screen-lg mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{destination.name}</h1>
          <div className="flex flex-wrap gap-2 mb-4">
            {(destination.tags ?? []).map((tag: string, i: number) => (
              <span key={i} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
          <DescriptionToggle text={destination.description ?? ''} />
        </div>

        {/* Gallery */}
        <div className="px-4 py-6 max-w-screen-lg mx-auto">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Photo Gallery</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {(destination.gallery ?? [null]).map((img: string | null, idx: number) => (
              <SupabaseImage
                key={idx}
                src={img}
                alt={`Gallery image ${idx}`}
                width={400}
                height={300}
                className="w-full h-40 object-cover rounded-lg"
              />
            ))}
          </div>
        </div>

        {/* Nearby Homestays */}
        <div className="px-4 py-6 max-w-screen-lg mx-auto">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Nearby Homestays</h2>
          <div className="flex flex-col gap-4">
            {nearbyHomestays?.map((h, i) => (
              <div key={h.id} className="flex items-start gap-4 border p-3 rounded-md shadow-sm">
                <SupabaseImage src={h.image} alt={h.name} width={96} height={96} className="w-24 h-24 object-cover rounded" />
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm">{h.name}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{h.description}</p>
                  <p className="text-sm font-medium text-green-600 mt-1">₹{h.pricepernight}/night</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nearby Attractions */}
        <div className="px-4 py-6 max-w-screen-lg mx-auto">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Nearby Attractions</h2>
          <div className="flex overflow-x-auto gap-4 pb-4">
            {nearbyAttractions?.map((a, i) => (
              <div key={a.id} className="flex-shrink-0 w-48">
                <SupabaseImage src={a.image} alt={a.name} width={192} height={128} className="w-full h-32 object-cover rounded-md" />
                <p className="mt-2 text-sm text-center font-medium text-gray-700">{a.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="px-4 py-8 bg-gray-100 max-w-screen-lg mx-auto">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Contact Us</h2>
          <ContactForm itemId={destination.id} itemType="destination" />
        </div>
      </main>
      <Footer />
    </>
  );
}
