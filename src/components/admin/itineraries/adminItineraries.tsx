'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ItineraryFormModal from './itinerariesFormModal';
import DeleteConfirmModal from '../deleteConfirmModal';
import { toast } from 'react-hot-toast';
import { LOCATION_ZONES } from '@/lib/locationZones';

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
            <div key={it.id} className="bg-white border rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-lg mb-1">{it.title}</h3>
              <p className="text-sm text-gray-600">Days: {it.days}</p>
              <p className="text-sm text-gray-500 italic">{it.region}</p>
              <div className="flex gap-3 mt-3">
                <button onClick={() => openEditModal(it)} className="text-sm text-blue-600 hover:underline">
                  Edit
                </button>
                <button onClick={() => confirmDelete(it)} className="text-sm text-red-500 hover:underline">
                  Delete
                </button>
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