//src\components\admin\itineraries\adminItineraries.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ItineraryFormModal from './itinerariesFormModal';
import DeleteConfirmModal from '../deleteConfirmModal';
import { toast } from 'react-hot-toast';
import { LOCATION_ZONES } from '@/lib/locationZones';
import Image from "next/image";

// Chip styles (reuse from previous step)
const statusStyle: Record<string, string> = {
  approved: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
  pending: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
  rejected: "bg-rose-100 text-rose-700 ring-1 ring-rose-200",
};
const prettyStatus: Record<string, string> = {
  approved: "Approved",
  pending: "Pending",
  rejected: "Rejected",
};

// Get a usable thumbnail (image → first gallery image → placeholder)
function getThumb(it: any) {
  const fromGallery =
    Array.isArray(it.gallery) && it.gallery.length
      ? it.gallery.find(Boolean)
      : null;
  return it.image || fromGallery || "/images/placeholders/itinerary-thumb.jpg";
}

// Region label fallback (region OR first regions_covered OR first district)
function getRegionLabel(it: any) {
  if (it.region) return it.region; // if you stored a single string
  if (Array.isArray(it.regions_covered) && it.regions_covered.length)
    return it.regions_covered[0];
  if (Array.isArray(it.districts) && it.districts.length) return it.districts[0];
  return "—";
}



export default function AdminItineraries() {
  const [items, setItems] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  const fetchItineraries = async () => {
    let query = supabase.from('itineraries').select('*');
    if (search) query = query.ilike('title', `%${search}%`);
    if (locationFilter) query = query.eq('region', locationFilter);
    const { data } = await query.order('created_at', { ascending: false });
    setItems(data || []);
  };

  useEffect(() => {
    fetchItineraries();
  }, [search, locationFilter]);

  useEffect(() => {
    const channel = supabase
      .channel('admin-itineraries')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'itineraries' },
        () => fetchItineraries()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const openAddModal = () => {
    setEditing(null);
    setShowModal(true);
  };

  const openEditModal = (item: any) => {
    setEditing(item);
    setShowModal(true);
  };

  const confirmDelete = (item: any) => {
    setSelected(item);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (selected) {
      const { error } = await supabase.from('itineraries').delete().eq('id', selected.id);
      if (!error) {
        toast.success('Itinerary deleted');
        fetchItineraries();
      } else {
        toast.error('Failed to delete');
      }
      setShowDeleteModal(false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div className="flex gap-2">
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
        <button onClick={openAddModal} className="bg-emerald-600 text-white px-4 py-2 rounded">
          + Add Itinerary
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-gray-500">No itineraries found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((it) => (
            <div key={it.id} className="bg-white border rounded-lg p-3 shadow-sm">
  <div className="flex items-start gap-3">
    {/* Thumbnail */}
    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100 ring-1 ring-gray-200">
      <Image
        src={getThumb(it)}
        alt={it.cover_image_alt || it.title || "Itinerary image"}
        fill
        sizes="64px"
        className="object-cover"
      />
    </div>

    {/* Text + actions */}
    <div className="min-w-0 flex-1">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-sm md:text-base truncate">{it.title}</h3>

        {/* Approval status chip */}
        <span
          className={[
            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap",
            statusStyle[it.approval_status as string] ??
              "bg-gray-100 text-gray-700 ring-1 ring-gray-200",
          ].join(" ")}
          title={`Status: ${it.approval_status ?? "unknown"}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
          {prettyStatus[it.approval_status as string] ?? "Unknown"}
        </span>
      </div>

      <div className="mt-0.5 text-xs text-gray-600">
        Days: {it.days ?? "—"}
        <span className="mx-2 text-gray-300">•</span>
        <span className="italic text-gray-500">{getRegionLabel(it)}</span>
      </div>

      <div className="mt-2 flex gap-3">
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
  </div>
</div>


          ))}
        </div>
      )}

      {showModal && (
        <ItineraryFormModal
          initialData={editing}
          onClose={() => setShowModal(false)}
          onSave={fetchItineraries}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmModal
          open={showDeleteModal}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          itemName={selected?.title || 'this itinerary'}
        />
      )}
    </div>
  );
}