'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-sm border-b' : 'bg-black/40'
      }`}
    >
      <div
        className={`max-w-screen-xl mx-auto px-4 py-3 flex justify-between items-center ${
          scrolled ? 'text-gray-800' : 'text-white'
        }`}
      >
        {/* Logo */}
        <Link
          href="/"
          className={`text-lg sm:text-xl font-extrabold tracking-wide ${
            scrolled ? 'text-green-600' : 'text-white'
          }`}
        >
          Meghtourism
        </Link>

        {/* Desktop Menu */}
        <nav
          className={`hidden md:flex gap-4 sm:gap-6 items-center font-medium ${
            scrolled ? 'text-gray-700' : 'text-white/90'
          }`}
        >
          <Link href="/events" className="text-sm sm:text-base hover:text-emerald-400 transition">
            Events
          </Link>
          <Link href="/cafesRestaurants" className="text-sm sm:text-base hover:text-emerald-400 transition">
            Cafes
          </Link>
          <Link href="/blogs" className="text-sm sm:text-base hover:text-emerald-400 transition">
            Blogs
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button
          onClick={toggleMenu}
          className={`md:hidden ${scrolled ? 'text-gray-700' : 'text-white'}`}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t px-4 pb-4 shadow-md">
          <nav className="flex flex-col gap-3 text-gray-800 font-medium text-sm">
            <Link href="/events" onClick={() => setIsOpen(false)} className="hover:text-green-600">
              Events
            </Link>
            <Link href="/cafesRestaurants" onClick={() => setIsOpen(false)} className="hover:text-green-600">
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
