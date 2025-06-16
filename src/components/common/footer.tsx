import { Home, Map, BedDouble, BookOpen, Info } from 'lucide-react';

export default function FooterNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 flex justify-around py-2 shadow-md">
      <a href="/listingPages/destinations" className="flex flex-col items-center justify-center text-xs text-gray-700 hover:text-blue-600 transition">
        <Map size={20} />
        <span className="text-[10px] mt-1">Adventures</span>
      </a>
      <a href="/listingPages/homestays" className="flex flex-col items-center justify-center text-xs text-gray-700 hover:text-blue-600 transition">
        <BedDouble size={20} />
        <span className="text-[10px] mt-1">Homestays</span>
      </a>
      <a href="/itineraries" className="flex flex-col items-center justify-center text-xs text-gray-700 hover:text-blue-600 transition">
        <BookOpen size={20} />
        <span className="text-[10px] mt-1">Itineraries</span>
      </a>
      <a href="/litraveltips" className="flex flex-col items-center justify-center text-xs text-gray-700 hover:text-blue-600 transition">
        <Info size={20} />
        <span className="text-[10px] mt-1">Tips</span>
      </a>
    </nav>
  );
}
