// src/lib/deleteImageFromSupabase.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

function toStoragePath(input: string): string | null {
  if (!input) return null;

  // Strip query/hash if present
  const noQuery = input.split('?')[0].split('#')[0];

  // If it's already a storage path (e.g., "images/itineraries/.."), return as-is (trim leading slash)
  if (!noQuery.includes('/storage/v1/object/public/')) {
    return noQuery.replace(/^\/+/, '');
  }

  // Extract the part after the public marker
  const marker = '/storage/v1/object/public/';
  const idx = noQuery.indexOf(marker);
  if (idx === -1) return null;

  const path = noQuery.slice(idx + marker.length).replace(/^\/+/, '');
  return path || null;
}

export async function deleteImageFromSupabase(urlOrPath: string): Promise<boolean> {
  const supabase = createClientComponentClient();
  const path = toStoragePath(urlOrPath);

  if (!path) {
    console.error('[deleteImageFromSupabase] Invalid URL/path:', urlOrPath);
    return false;
  }

  const { error } = await supabase.storage.from('images').remove([path]);

  if (error) {
    console.error('[deleteImageFromSupabase] Delete error:', error.message, 'path:', path);
    return false;
  }
  return true;
}
