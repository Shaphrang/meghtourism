// src/components/sections/HeroSection.tsx
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="relative w-full h-[25vh] md:h-[40vh] overflow-hidden shadow-sm">
      {/* Background Image */}
      <Image
        src="https://dsvndsiallxdncdkcagj.supabase.co/storage/v1/object/public/images/backgrounds/bg_Nohkalikai.png"
        alt="Scenic Meghalaya"
        fill
        className="object-cover object-center"
        priority
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center h-full px-4">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-white text-xl sm:text-2xl md:text-4xl font-semibold drop-shadow-md"
        >
          Discover Meghalaya
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-2"
        >
          <button className="bg-white text-gray-800 font-medium px-4 py-1.5 rounded-full text-xs sm:text-sm md:text-base shadow hover:bg-gray-100 transition">
            Explore Now
          </button>
        </motion.div>
      </div>
    </section>
  );
}