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
    });

    // Extract the file extension from the original file
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';

    // Use correct filename with original extension
    const safeName = name ? slugify(name) : id;
    const filename =
      type === 'main'
        ? `main-${safeName}.${ext}`
        : `gallery-${safeName}-${Date.now()}.${ext}`;
    const path = `${category}/${id}/${filename}`;


    const { error } = await supabase.storage
      .from('images')
      .upload(path, compressed, { upsert: true });

    if (error) {
      console.error('Upload error:', error.message);
      return null;
    }

    const { data } = supabase.storage.from('images').getPublicUrl(path);

    // ✅ Add cache-busting query param so updated images are not cached
    return data?.publicUrl ? `${data.publicUrl}?v=${Date.now()}` : null;
  } catch (err) {
    console.error('Image compression or upload failed:', err);
    return null;
  }
}
