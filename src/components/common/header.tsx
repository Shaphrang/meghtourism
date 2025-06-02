'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-green-700">
          Meghtourism
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 text-gray-700 font-medium">
          <Link href="/destinations">Destinations</Link>
          <Link href="/accommodations">Accommodations</Link>
          <Link href="/itineraries">Itineraries</Link>
          <Link href="/cafes">Cafes</Link>
          <Link href="/activities">Activities</Link>
          <Link href="/events">Events</Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-gray-700"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t px-4 pb-4 shadow-md">
          <nav className="flex flex-col gap-3 text-gray-700 font-medium">
            <Link href="/destinations" onClick={() => setIsOpen(false)}>Destinations</Link>
            <Link href="/accommodations" onClick={() => setIsOpen(false)}>Accommodations</Link>
            <Link href="/itineraries" onClick={() => setIsOpen(false)}>Itineraries</Link>
            <Link href="/cafes" onClick={() => setIsOpen(false)}>Cafes</Link>
            <Link href="/activities" onClick={() => setIsOpen(false)}>Activities</Link>
            <Link href="/events" onClick={() => setIsOpen(false)}>Events</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
