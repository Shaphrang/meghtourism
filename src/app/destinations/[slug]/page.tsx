import { fetchData } from '@/lib/fetchData';
import { Destination } from '@/types/destination';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = decodeURIComponent(params.slug);
  return {
    title: `${slug.replace(/-/g, ' ')} - Destination in Meghalaya`,
    description: `Explore ${slug.replace(/-/g, ' ')} and other beautiful locations in Meghalaya.`,
  };
}

export default async function DestinationDetailPage(props: Props) {
  const slug = decodeURIComponent(props.params.slug);
  const allDestinations: Destination[] = await fetchData('destinations.json');
  const destination = allDestinations.find((d) => d.id === slug);

  if (!destination) return <div className="p-6 text-red-500">Destination not found.</div>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      {destination.image && (
        <div className="rounded-xl overflow-hidden mb-4">
          <Image
            src={destination.image}
            alt={destination.name || 'Destination Image'}
            width={1200}
            height={600}
            className="w-full h-64 object-cover"
          />
        </div>
      )}

      <h1 className="text-2xl font-bold text-gray-900 mb-1">{destination.name}</h1>
      <p className="text-gray-600 mb-3">{destination.location} • {destination.district}</p>

      {destination.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {destination.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-green-200 text-green-900 px-3 py-1 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {destination.description && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-1">Description</h2>
          <p className="text-gray-800 leading-relaxed">{destination.description}</p>
        </div>
      )}

      {destination.maplink && (
        <div className="mb-6">
          <iframe
            src={destination.maplink}
            width="100%"
            height="250"
            className="rounded-md border"
            loading="lazy"
            allowFullScreen
            aria-hidden="false"
          ></iframe>
          <div className="mt-2">
            <Link
              href={destination.maplink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm text-blue-600 hover:underline"
            >
              View on Google Maps
            </Link>
          </div>
        </div>
      )}

      {destination.nearbydestinations?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Nearby Destinations</h2>
          <div className="flex flex-wrap gap-2">
            {destination.nearbydestinations.map((nearby, index) => (
              <span
                key={index}
                className="bg-green-900 text-white px-3 py-1 rounded-full text-sm"
              >
                {nearby}
              </span>
            ))}
          </div>
        </div>
      )}

      {/*{destination.contact && (
        <div className="text-sm mt-6 text-gray-700">
          📞 Contact: {destination.contact}
        </div>
      )}*/}
    </div>
  );
}
