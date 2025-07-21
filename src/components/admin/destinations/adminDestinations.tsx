'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import DestinationFormModal from './destinationFormModal';
import DeleteConfirmModal from '../deleteConfirmModal';
import { toast } from 'react-hot-toast';
import { LOCATION_ZONES } from '@/lib/locationZones';

export default function AdminDestinations() {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingDestination, setEditingDestination] = useState<any | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<any | null>(null);
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  const fetchDestinations = async () => {
    let query = supabase.from('destinations').select('*');
    if (search) query = query.ilike('name', `%${search}%`);
    if (locationFilter) query = query.eq('location', locationFilter);
    const { data } = await query.order('created_at', { ascending: false });
    setDestinations(data || []);
  };

  useEffect(() => {
    fetchDestinations();
  }, [search, locationFilter]);

  useEffect(() => {
    const channel = supabase
      .channel('admin-destinations')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'destinations' },
        () => fetchDestinations()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);


  const openAddModal = () => {
    setEditingDestination(null);
    setShowModal(true);
  };

  const openEditModal = (destination: any) => {
    setEditingDestination(destination);
    setShowModal(true);
  };

  const confirmDelete = (destination: any) => {
    setSelectedDestination(destination);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (selectedDestination) {
      const { error } = await supabase.from('destinations').delete().eq('id', selectedDestination.id);
      if (!error) {
        toast.success('Destination deleted');
        fetchDestinations();
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
        <button
          onClick={openAddModal}
          className="bg-emerald-600 text-white px-4 py-2 rounded"
        >
          + Add Destination
        </button>
      </div>

      {destinations.length === 0 ? (
        <p className="text-gray-500">No destinations found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {destinations.map((dest) => (
            <div key={dest.id} className="bg-white border rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-lg mb-1">{dest.name}</h3>
              <p className="text-sm text-gray-600">📍 {dest.location}</p>
              <p className="text-sm text-gray-500 italic">🗺 {dest.district}</p>
              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => openEditModal(dest)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => confirmDelete(dest)}
                  className="text-sm text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <DestinationFormModal
          initialData={editingDestination}
          onClose={() => setShowModal(false)}
          onSave={fetchDestinations}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmModal
          open={showDeleteModal}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          itemName={selectedDestination?.name || 'this destination'}
        />
      )}
    </div>
  );
}
