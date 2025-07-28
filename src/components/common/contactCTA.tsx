'use client';
import { usePathname, useRouter } from 'next/navigation';

export default function ContactCTA() {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === '/contact') return null;

  return (
    <div className="max-w-screen-md mx-auto px-4 mt-3">
      <div className="bg-red-200 text-red-800 rounded-xl text-black text-center py-4 shadow-md">
        <button
          onClick={() => router.push('/contact')}
          className="text-base font-medium active:scale-95 transition-transform"
        >
          Any Query or Want to List Your Business?
        </button>
      </div>
    </div>
  );
}
