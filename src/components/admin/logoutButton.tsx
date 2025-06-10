'use client';

import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="px-3 py-1 text-sm bg-emerald-600 text-white rounded"
    >
      Logout
    </button>
  );
}