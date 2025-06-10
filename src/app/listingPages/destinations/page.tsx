import Header from '@/components/common/header';
import Footer from '@/components/common/footer';
import DestinationsList from '@/components/destinations/destinationsList';

export const metadata = {
  title: 'Explore Meghalaya',
  description: 'Discover scenic spots, hidden gems, and cultural wonders.',
};

export default function DestinationsPage() {
  return (
    <>
      <Header />
      <main className="pt-20 px-2 sm:px-4 pb-20 max-w-screen-xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold">Explore Meghalaya</h1>
          <p className="text-gray-600 mt-2">
            Discover scenic spots, hidden gems, and cultural wonders.
          </p>
        </div>
        <DestinationsList />
      </main>
      <Footer />
    </>
  );
}
