import { supabase } from './supabaseClient';

export async function fetchData(source: string) {
  // Try fetching from Supabase first
  if (process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const table = source.replace('.json', '');
    const { data, error } = await supabase.from(table).select('*');
    if (error) throw error;
    if (data) return data;
  }

  // Fallback to static JSON files in /public if Supabase isn't configured
  const res = await fetch(`/data/${source}`);
  if (!res.ok) throw new Error('Failed to load data');
  return res.json();
}