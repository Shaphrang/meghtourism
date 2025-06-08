'use client';

export default function HeroSection() {
  return (
    <section
      className="relative w-full h-[50vh] md:h-[55vh] bg-cover bg-center"
      style={{ backgroundImage: "url('/images/background/bg_Nohkalikai.png')" }}
    >
      {/* Light gradient overlay only */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent z-10" />

      {/* Content */}
      <div className="relative z-20 flex flex-col justify-center items-center h-full text-center text-white px-4">
        <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight drop-shadow-xl">
          <span className="block">Explore</span>
          <span className="block text-white-400">Magical Meghalaya</span>
        </h1>

        <p className="mt-3 text-base md:text-lg font-light text-gray-200 max-w-xl drop-shadow">
          AI-powered travel assistant for Meghalaya
        </p>

        <input
          type="text"
          placeholder="Try: best time to visit Cherrapunjee"
          className="mt-6 w-full max-w-md px-5 py-3 text-sm md:text-base text-gray-900 bg-white/90 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />

        <button className="mt-4 px-6 py-2 text-white font-semibold bg-emerald-500 hover:bg-emerald-600 rounded-full shadow-lg transition">
          Start Exploring →
        </button>
      </div>
    </section>
  );
}
