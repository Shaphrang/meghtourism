import Header from '@/components/common/header';
import Footer from '@/components/common/footer';
import HomestaysList from '@/components/homestays/homestaysList';

export const metadata = {
  title: 'Homestays in Meghalaya',
  description: 'Find comfortable stays for your trip.',
};

export default function HomestaysPage() {
  return (
    <>
      <Header />
      <main className="pt-20 px-2 sm:px-4 pb-20 max-w-screen-xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold">Homestays</h1>
          <p className="text-gray-600 mt-2">Find comfortable stays for your trip.</p>
        </div>
        <HomestaysList />
      </main>
      <Footer />
    </>
  );
}