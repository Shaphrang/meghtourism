'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return alert(error.message);
    router.push('/admin');
  };

  return (
    <div className="p-6 max-w-md mx-auto mt-20">
      <h1 className="text-xl font-bold mb-4">Admin Login</h1>
      <input
        className="border px-3 py-2 w-full mb-3"
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="border px-3 py-2 w-full mb-3"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin} className="bg-emerald-600 text-white px-4 py-2 rounded w-full">
        Login
      </button>
    </div>
  );
}
