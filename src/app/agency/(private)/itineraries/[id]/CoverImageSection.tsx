// path: <your agency module>/CoverImageSection.tsx
'use client';

import { useMemo, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import AgencyImageUploader from '@/components/agencyImageUploader';
import { deleteImageFromSupabase } from '@/lib/deleteImageFromSupabase';

function publicImageUrl(path?: string | null) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  return `${base}/storage/v1/object/public/images/${encodeURI(path)}`;
}

export default function CoverImageSection({
  agencyId,
  itineraryId,
  title,
  coverImagePath, // storage path or full URL
}: {
  agencyId: string;
  itineraryId: string;
  title: string;
  coverImagePath: string | null;
}) {
  const supabase = createClientComponentClient();
  const [busy, setBusy] = useState(false);
  const [currentPath, setCurrentPath] = useState<string | null>(coverImagePath);

  const imgUrl = useMemo(() => publicImageUrl(currentPath), [currentPath]);

  const saveImagePath = async (path: string | null) => {
    setBusy(true);
    const { error } = await supabase
      .from('itineraries')
      .update({ image: path }) // image column stores either storage path or full URL (both OK)
      .eq('id', itineraryId);

    setBusy(false);

    if (error) {
      console.error('[CoverImageSection] save image error:', error);
      return false;
    }
    setCurrentPath(path);
    return true;
  };

  // MUST match: (url: string | null, path: string) => void
  const onUploaded = (url: string | null, path: string) => {
    // AgencyImageUploader gives us both. We persist the storage path.
    // Do not make this function async — the prop expects a void return.
    void saveImagePath(path).catch((e) => {
      console.error('[CoverImageSection] onUploaded save error:', e);
    });
  };

  const removeImage = async () => {
    if (!currentPath || busy) return;
    setBusy(true);

    // Best-effort delete in storage; works for both URL and storage path (per your util).
    try {
      await deleteImageFromSupabase(currentPath);
    } catch (e) {
      console.warn('[CoverImageSection] storage delete warning:', e);
    }

    await saveImagePath(null);
    setBusy(false);
  };

  return (
    <section className="rounded-2xl border p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-lg">Cover Image</h3>
        {busy && <span className="text-xs text-gray-500">Saving…</span>}
      </div>

      <div className="flex items-center gap-4">
        <div className="w-40 h-28 rounded-xl border overflow-hidden bg-gray-50 shrink-0">
          {imgUrl ? (
            <img src={imgUrl} alt={title || 'Cover image'} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full grid place-items-center text-xs text-gray-500">
              No image
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <AgencyImageUploader
            agencyId={agencyId}
            category="itineraries"
            rowId={itineraryId}
            type="main"
            name={title || 'itinerary'}
            onUploaded={onUploaded}
          />
          {currentPath && (
            <button
              type="button"
              onClick={removeImage}
              className="text-sm rounded border px-3 py-2 hover:bg-gray-50 disabled:opacity-60"
              disabled={busy}
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
