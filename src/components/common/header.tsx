'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="bg-white fixed top-0 left-0 right-0 z-50 shadow-sm border-b">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-xl font-extrabold text-green-600 tracking-wide">
          Meghtourism
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-6 items-center font-medium text-gray-700">
          <Link href="/events" className="hover:text-green-600">Events</Link>
          <Link href="/cafes" className="hover:text-green-600">Cafes</Link>
          <Link href="/blogs" className="hover:text-green-600">Blogs</Link>
        </nav>

        {/* Mobile Toggle */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-gray-700"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t px-4 pb-4 shadow-md">
          <nav className="flex flex-col gap-3 text-gray-700 font-medium">
            <Link href="/events" onClick={() => setIsOpen(false)} className="hover:text-green-600">
              Events
            </Link>
            <Link href="/cafes" onClick={() => setIsOpen(false)} className="hover:text-green-600">
              Cafes
            </Link>
            <Link href="/blogs" onClick={() => setIsOpen(false)} className="hover:text-green-600">
              Blogs
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
