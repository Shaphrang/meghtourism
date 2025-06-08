'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import HomestayFormModal from './homestayFormModal';
import DeleteConfirmModal from '../deleteConfirmModal';
import { toast } from 'react-hot-toast';

export default function AdminHomestays() {
  const [homestays, setHomestays] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingHomestay, setEditingHomestay] = useState<any | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedHomestay, setSelectedHomestay] = useState<any | null>(null);

  const fetchHomestays = async () => {
    const { data } = await supabase.from('homestays').select('*').order('created_at', { ascending: false });
    setHomestays(data || []);
  };

  useEffect(() => {
    fetchHomestays();
  }, []);

  const openAddModal = () => {
    setEditingHomestay(null);
    setShowModal(true);
  };

  const openEditModal = (homestay: any) => {
    setEditingHomestay(homestay);
    setShowModal(true);
  };

  const confirmDelete = (homestay: any) => {
    setSelectedHomestay(homestay);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (selectedHomestay) {
      const { error } = await supabase.from('homestays').delete().eq('id', selectedHomestay.id);
      if (!error) {
        toast.success('Homestay deleted');
        fetchHomestays();
      } else {
        toast.error('Failed to delete');
      }
      setShowDeleteModal(false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button
          onClick={openAddModal}
          className="bg-emerald-600 text-white px-4 py-2 rounded"
        >
          + Add Homestay
        </button>
      </div>

      {homestays.length === 0 ? (
        <p className="text-gray-500">No homestays found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {homestays.map((hs) => (
            <div key={hs.id} className="bg-white border rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-lg mb-1">{hs.name}</h3>
              <p className="text-sm text-gray-600">📍 {hs.location}</p>
              <p className="text-sm text-gray-500 italic">💵 ₹{hs.pricepernight} per night</p>
              <p className="text-sm text-gray-500">🛏️ Occupancy: {hs.occupancy}</p>
              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => openEditModal(hs)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => confirmDelete(hs)}
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
        <HomestayFormModal
          initialData={editingHomestay}
          onClose={() => setShowModal(false)}
          onSave={fetchHomestays}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmModal
          open={showDeleteModal}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          itemName={selectedHomestay?.name || 'this homestay'}
        />
      )}
    </div>
  );
}
