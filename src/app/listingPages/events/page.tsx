import Header from '@/components/common/header';
import Footer from '@/components/common/footer';
import EventsList from '@/components/events/eventsList';

export const metadata = {
  title: 'Events in Meghalaya',
  description: 'Discover cultural and local events happening around you.',
};

export default function EventsPage() {
  return (
    <>
      <Header />
      <main className="pt-20 px-2 sm:px-4 pb-20 max-w-screen-xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold">Events</h1>
          <p className="text-gray-600 mt-2">Discover cultural and local events happening around you.</p>
        </div>
        <EventsList />
      </main>
      <Footer />
    </>
  );
}