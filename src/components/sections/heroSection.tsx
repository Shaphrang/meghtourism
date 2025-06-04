'use client';

export default function HeroSection() {
  return (
    <section className="relative w-full h-[65vh] md:h-[60vh] overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/images/background/meghtourism_Video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay (semi-transparent, no blur) */}
      <div className="absolute inset-0 bg-black/40 md:bg-black/30 z-10" />

      {/* Content */}
      <div className="relative z-20 flex flex-col justify-center items-center h-full text-center text-white px-4">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight drop-shadow-xl">
          Discover Meghalaya with AI
        </h1>
        <p className="mt-3 text-base md:text-lg font-light text-gray-200 max-w-xl drop-shadow">
          Your smart assistant for destinations, homestays, events & more — all powered by AI.
        </p>
        <input
          type="text"
          placeholder="Try: best time to visit Cherrapunjee"
          className="mt-6 w-full max-w-md px-5 py-3 text-sm md:text-base text-gray-900 bg-white/90 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
      </div>
    </section>
  );
}
