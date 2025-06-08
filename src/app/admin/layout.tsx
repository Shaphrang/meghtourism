import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // ✅ Safe cookies wrapper
  const getCookies = () => cookies();
  const supabase = createServerComponentClient({ cookies: getCookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/login');
  }

  return (
    <div>
      <header className="p-4 bg-gray-800 text-white">Admin Panel</header>
      <main className="p-6">{children}</main>
    </div>
  );
}
