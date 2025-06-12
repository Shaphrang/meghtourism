export default function FooterNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 flex justify-around py-2 shadow-sm">
      <a href="/" className="text-center text-xs text-gray-700">Home</a>
      <a href="/listingPages/destinations" className="text-center text-xs text-gray-700">Destinations</a>
      <a href="/listingPages/homestays" className="text-center text-xs text-gray-700">Homestays</a>
      <a href="/assistant" className="text-center text-xs text-gray-700">Ask AI</a>
      <a href="/listingPages/events" className="text-center text-xs text-gray-700">Events</a>
      <a href="/listingPages/thrills" className="text-center text-xs text-gray-700">Thrills</a>
    </nav>
  );
}