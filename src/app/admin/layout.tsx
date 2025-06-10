import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import LogoutButton from '@/components/admin/logoutButton';

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
      <header className="flex items-center justify-between p-4 bg-gray-800 text-white">
        <span>Admin Panel</span>
        <LogoutButton />
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
