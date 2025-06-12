import Header from '@/components/common/header';
import Footer from '@/components/common/footer';
import ThrillsList from '@/components/thrills/thrillsList';

export const metadata = {
  title: 'Adventure & Thrills',
  description: 'Find exciting activities and adventures.',
};

export default function ThrillsPage() {
  return (
    <>
      <Header />
      <main className="pt-20 px-2 sm:px-4 pb-20 max-w-screen-xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold">Adventure & Thrill</h1>
          <p className="text-gray-600 mt-2">Find exciting activities and adventures.</p>
        </div>
        <ThrillsList />
      </main>
      <Footer />
    </>
  );
}