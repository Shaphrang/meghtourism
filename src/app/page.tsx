'use client';

import Header from "@/components/common/header";
import PopularDestinations from '@/components/sections/popularDestinations';

export default function HomePage() {
  return (
    <>
      <Header />

      <main className="pt-20 px-6 py-10 font-sans">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Welcome to Meghtourism.com 🌿</h1>
          <p className="text-lg text-gray-600">
            AI-powered travel assistant for Meghalaya
          </p>

          {/* AI Chat Box */}
          <div className="mt-6">
            <input
              type="text"
              placeholder="Ask anything about Meghalaya (e.g., best time to visit Cherrapunjee)"
              className="w-full max-w-xl px-4 py-3 text-base border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
        </section>

        {/* Dynamic Popular Destinations Component */}
        <PopularDestinations />

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-gray-500">
          <p>Made with ❤️ in Meghalaya | Meghtourism.com</p>
        </footer>
      </main>
    </>
  );
}
