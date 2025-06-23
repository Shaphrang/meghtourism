'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import RentalFormModal from './rentalsFormModal';
import DeleteConfirmModal from '../deleteConfirmModal';
import { toast } from 'react-hot-toast';

export default function AdminRentals() {
  const [items, setItems] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);

  const fetchRentals = async () => {
    const { data } = await supabase
      .from('rentals')
      .select('*')
      .order('created_at', { ascending: false });
    setItems(data || []);
  };

  useEffect(() => {
    fetchRentals();
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
      const { error } = await supabase.from('rentals').delete().eq('id', selected.id);
      if (!error) {
        toast.success('Rental deleted');
        fetchRentals();
      } else {
        toast.error('Failed to delete');
      }
      setShowDeleteModal(false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button onClick={openAddModal} className="bg-emerald-600 text-white px-4 py-2 rounded">
          + Add Rental
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-gray-500">No rentals found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((it) => (
            <div key={it.id} className="bg-white border rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-lg mb-1">{it.title}</h3>
              <p className="text-sm text-gray-600">{it.type}</p>
              <p className="text-sm text-gray-500 italic">{it.location}</p>
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
        <RentalFormModal
          initialData={editing}
          onClose={() => setShowModal(false)}
          onSave={fetchRentals}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmModal
          open={showDeleteModal}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          itemName={selected?.title || 'this rental'}
        />
      )}
    </div>
  );
}