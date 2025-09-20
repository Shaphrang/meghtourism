// src/lib/uploadToSupabase.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import imageCompression from 'browser-image-compression';
import { slugify } from '@/lib/utils';

export async function uploadImageToSupabase({
  file,
  category,
  id,
  type, // 'main' | 'gallery'
  name = '',
}: {
  file: File;
  category: string;
  id: string;
  type: 'main' | 'gallery';
  name?: string;
}): Promise<string | null> {
  const supabase = createClientComponentClient();

  try {
    const compressed = await imageCompression(file, {
      maxSizeMB: 1,
      maxWidthOrHeight: 1200,
      useWebWorker: true,
    });

    // Preserve original extension (fallback to jpg)
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const safeName = name ? slugify(name) : id;

    const filename =
      type === 'main'
        ? `main-${safeName}.${ext}`
        : `gallery-${safeName}-${Date.now()}.${ext}`;

    const path = `${category}/${id}/${filename}`;

    const { error } = await supabase.storage
      .from('images')
      .upload(path, compressed, {
        upsert: true,
        contentType: file.type || `image/${ext}`,
      });

    if (error) {
      console.error('[uploadImageToSupabase] Upload error:', error.message);
      return null;
    }

    const { data } = supabase.storage.from('images').getPublicUrl(path);

    // Keep cache-busting for UI freshness; delete() will strip it safely.
    return data?.publicUrl ? `${data.publicUrl}?v=${Date.now()}` : null;
  } catch (err) {
    console.error('[uploadImageToSupabase] Compression/upload failed:', err);
    return null;
  }
}
