'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ThrillFormModal from './thrillFormModal';
import DeleteConfirmModal from '../deleteConfirmModal';
import { toast } from 'react-hot-toast';
import { LOCATION_ZONES } from '@/lib/locationZones';

export default function AdminThrills() {
  const [thrills, setThrills] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingThrill, setEditingThrill] = useState<any | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedThrill, setSelectedThrill] = useState<any | null>(null);
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  const fetchThrills = async () => {
    let query = supabase.from('thrills').select('*');
    if (search) query = query.ilike('name', `%${search}%`);
    if (locationFilter) query = query.eq('location', locationFilter);
    const { data } = await query.order('created_at', { ascending: false });
    setThrills(data || []);
  };

  useEffect(() => {
    fetchThrills();
  }, [search, locationFilter]);

  useEffect(() => {
    const channel = supabase
      .channel('admin-thrills')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'thrills' },
        () => fetchThrills()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const openAddModal = () => {
    setEditingThrill(null);
    setShowModal(true);
  };

  const openEditModal = (thrill: any) => {
    setEditingThrill(thrill);
    setShowModal(true);
  };

  const confirmDelete = (thrill: any) => {
    setSelectedThrill(thrill);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (selectedThrill) {
      const { error } = await supabase.from('thrills').delete().eq('id', selectedThrill.id);
      if (!error) {
        toast.success('Thrill deleted');
        fetchThrills();
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
          + Add Thrill
        </button>
      </div>

      {thrills.length === 0 ? (
        <p className="text-gray-500">No thrills found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {thrills.map((thrill) => (
            <div key={thrill.id} className="bg-white border rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-lg mb-1">{thrill.name}</h3>
              <p className="text-sm text-gray-600">📍 {thrill.location}</p>
              <p className="text-sm text-gray-500 italic">🏷️ Difficulty: {thrill.difficultylevel}</p>
              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => openEditModal(thrill)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => confirmDelete(thrill)}
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
        <ThrillFormModal
          initialData={editingThrill}
          onClose={() => setShowModal(false)}
          onSave={fetchThrills}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmModal
          open={showDeleteModal}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          itemName={selectedThrill?.name || 'this thrill'}
        />
      )}
    </div>
  );
}
