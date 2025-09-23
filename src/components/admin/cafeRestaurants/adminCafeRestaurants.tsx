// src/components/admin/cafesRestaurants/adminCafeRestaurants.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import CafeRestaurantFormModal from './cafeRestaurantsFormModal';
import DeleteConfirmModal from '../deleteConfirmModal';
import { toast } from 'react-hot-toast';
import { LOCATION_ZONES } from '@/lib/locationZones';

// --- helpers ---
function getThumb(row: any) {
  const fromGallery =
    Array.isArray(row?.gallery) && row.gallery.length
      ? row.gallery.find(Boolean)
      : null;
  return row?.image || fromGallery || '/images/placeholders/cafe-thumb.jpg';
}

function prettyType(t?: string | null) {
  if (!t) return '—';
  const s = t.toString().trim();
  // normalize common variants
  if (/cafe|caf[eé]/i.test(s)) return 'Cafe';
  if (/restaurant|restro|resto|dining|bistro/i.test(s)) return 'Restaurant';
  return s;
}

export default function AdminCafeRestaurants() {
  const [items, setItems] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  const fetchItems = async () => {
    console.log('📥 Fetching cafe/restaurant entries...');
    let query = supabase.from('cafes_and_restaurants').select('*');

    if (search) query = query.ilike('name', `%${search}%`);
    if (locationFilter) query = query.eq('location', locationFilter);

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching data:', error.message);
      toast.error('Failed to load entries');
    } else {
      console.log(`✅ Fetched ${data?.length || 0} entries`);
    }

    setItems(data || []);
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, locationFilter]);

  useEffect(() => {
    const channel = supabase
      .channel('admin-cafes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'cafes_and_restaurants' },
        () => fetchItems()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openAddModal = () => {
    console.log('➕ Opening add modal');
    setEditing(null);
    setShowModal(true);
  };

  const openEditModal = (item: any) => {
    console.log('✏️  Opening edit modal for:', { id: item?.id, name: item?.name });
    setEditing(item);
    setShowModal(true);
  };

  const confirmDelete = (item: any) => {
    console.log('🗑️  Confirming delete for:', { id: item?.id, name: item?.name });
    setSelected(item);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!selected) return;
    console.log('🔨 Deleting entry:', { id: selected.id, name: selected.name });
    const { error } = await supabase
      .from('cafes_and_restaurants')
      .delete()
      .eq('id', selected.id);

    if (error) {
      console.error('❌ Delete failed:', error.message);
      toast.error('Failed to delete');
    } else {
      toast.success('Entry deleted');
      fetchItems();
    }
    setShowDeleteModal(false);
  };

  // Optional quick counts for your sanity while testing
  const counts = useMemo(() => {
    let cafes = 0, restos = 0, others = 0;
    for (const it of items) {
      const t = prettyType(it?.type);
      if (t === 'Cafe') cafes++;
      else if (t === 'Restaurant') restos++;
      else others++;
    }
    return { cafes, restos, others, total: items.length };
  }, [items]);

  useEffect(() => {
    console.log('🧮 Current counts ->', counts);
  }, [counts]);

  return (
    <div>
      {/* Top controls */}
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div className="flex gap-2 w-full md:w-auto">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name"
            className="border px-3 py-2 rounded w-full"
          />
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="">All locations</option>
            {LOCATION_ZONES.map((z) => (
              <option key={z} value={z}>
                {z}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={openAddModal}
          className="bg-emerald-600 text-white px-4 py-2 rounded"
        >
          + Add Cafe/Restaurant
        </button>
      </div>

      {/* Empty state */}
      {items.length === 0 ? (
        <p className="text-gray-500">No entries found.</p>
      ) : (
        // 3-column responsive grid (1 → 2 → 3)
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((it) => (
            <div
              key={it.id}
              className="bg-white border rounded-lg p-3 shadow-sm hover:shadow transition-shadow"
            >
              {/* Thumb */}
              <div className="relative w-full h-40 overflow-hidden rounded-xl bg-gray-100 ring-1 ring-gray-200">
                <Image
                  src={getThumb(it)}
                  alt={it.cover_image_alt || it.name || 'Place image'}
                  fill
                  sizes="(max-width: 1024px) 50vw, 300px"
                  className="object-cover"
                />
              </div>

              {/* Text */}
              <div className="mt-3">
                <h3 className="font-semibold text-sm md:text-base truncate" title={it.name}>
                  {it.name || 'Untitled'}
                </h3>
                <div className="mt-1 flex items-center gap-2 text-xs text-gray-600">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 ring-1 ring-gray-200">
                    {prettyType(it.type)}
                  </span>
                  {it.location ? (
                    <>
                      <span className="text-gray-300">•</span>
                      <span className="italic">{it.location}</span>
                    </>
                  ) : null}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-3 flex gap-3">
                <button
                  onClick={() => openEditModal(it)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => confirmDelete(it)}
                  className="text-sm text-red-500 hover:underline"
                >
                    Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showModal && (
        <CafeRestaurantFormModal
          initialData={editing}
          onClose={() => {
            console.log('🔒 Closing form modal');
            setShowModal(false);
          }}
          onSave={() => {
            console.log('💾 Saved — refreshing list');
            fetchItems();
          }}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmModal
          open={showDeleteModal}
          onCancel={() => {
            console.log('✋ Cancel delete');
            setShowDeleteModal(false);
          }}
          onConfirm={handleDelete}
          itemName={selected?.name || 'this entry'}
        />
      )}
    </div>
  );
}
