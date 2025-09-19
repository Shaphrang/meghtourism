//src\lib\deleteImageFromSupabase.ts

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export async function deleteImageFromSupabase(path: string): Promise<boolean> {
  const supabase = createClientComponentClient();
  const { error } = await supabase.storage.from('images').remove([path]);
  if (error) {
    console.error('Delete error:', error.message);
    return false;
  }
  return true;
}
