// src/lib/supabaseServer.ts
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

export function createServerSupabaseClient() {
    const cookieStore = cookies();        // await if Promise
    return createServerComponentClient({
      cookies: () => cookieStore,
    });
  }

