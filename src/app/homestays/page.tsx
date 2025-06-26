import Image from 'next/image';
import { Filter, MapPin, SlidersHorizontal, SortAsc } from 'lucide-react';

export default function HomestayListingPage() {
  return (
    <main className="w-full min-h-screen bg-white text-gray-800 overflow-x-hidden">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-100 to-blue-100 p-6 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-800">
          Find Homestays in Meghalaya
        </h1>
        <p className="text-sm text-gray-700 mt-1">Explore cozy and affordable stays across the state</p>
      </section>

      {/* Action Bar */}
      <section className="bg-white shadow-md border-b">
        <div className="flex justify-center gap-6 px-4 py-3">
          <details className="relative">
            <summary className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-800 font-medium text-sm shadow hover:bg-green-200 transition cursor-pointer">
              <SortAsc size={16} /> Sort
            </summary>
            <ul className="absolute left-0 mt-2 w-40 bg-white border rounded-lg shadow text-sm z-50">
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Price: Low to High</li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Price: High to Low</li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Top Rated</li>
            </ul>
          </details>

          <details className="relative">
            <summary className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-800 font-medium text-sm shadow hover:bg-blue-200 transition cursor-pointer">
              <SlidersHorizontal size={16} /> Price
            </summary>
            <ul className="absolute left-0 mt-2 w-40 bg-white border rounded-lg shadow text-sm z-50">
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Under ₹1000</li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">₹1000 - ₹2000</li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">₹2000+</li>
            </ul>
          </details>

          <details className="relative">
            <summary className="flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-100 text-yellow-800 font-medium text-sm shadow hover:bg-yellow-200 transition cursor-pointer">
              <Filter size={16} /> Location
            </summary>
            <ul className="absolute left-0 mt-2 w-44 bg-white border rounded-lg shadow text-sm z-50">
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Shillong</li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Cherrapunji</li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Mawlynnong</li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Dawki</li>
            </ul>
          </details>
        </div>
      </section>

      {/* Popular Stays */}
      <section className="p-4">
        <h2 className="text-lg font-semibold mb-2">Popular Stays</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="min-w-[160px] bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="h-24 relative">
                <Image src={`/demo/homestay${i}.jpg`} alt="Popular Stay" fill className="object-cover" />
              </div>
              <div className="p-2">
                <p className="text-sm font-semibold">Highland Inn</p>
                <p className="text-xs text-gray-500">₹1500 • Shillong</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Attractive Stays */}
      <section className="p-4">
        <h2 className="text-lg font-semibold mb-2">Attractive Stays</h2>
        <div className="flex flex-col gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-50 rounded-xl shadow-md overflow-hidden">
              <div className="relative w-full h-40">
                <Image src={`/demo/homestay${i}.jpg`} alt="Stay" fill className="object-cover" />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold">Evergreen Cottage</h3>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <MapPin size={14} className="mr-1" />
                  Police Bazar, Shillong
                </div>
                <p className="text-green-700 font-semibold mt-1">From ₹1300/night</p>
                <p className="text-sm text-gray-700 mt-2">Comfortable rooms with easy access to city center and markets.</p>
                <div className="flex justify-center gap-4 mt-4">
                  <button className="px-5 py-2 text-sm bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition">
                    More Details
                  </button>
                  <button className="px-5 py-2 text-sm bg-green-600 text-white rounded-full shadow hover:bg-green-700 transition">
                    Get Contact
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
