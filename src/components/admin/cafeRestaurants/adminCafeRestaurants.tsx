'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import CafeRestaurantFormModal from './cafeRestaurantsFormModal';
import DeleteConfirmModal from '../deleteConfirmModal';
import { toast } from 'react-hot-toast';

export default function AdminCafeRestaurants() {
  const [items, setItems] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);

  const fetchItems = async () => {
    const { data } = await supabase
      .from('caferestaurants')
      .select('*')
      .order('created_at', { ascending: false });
    setItems(data || []);
  };

  useEffect(() => {
    fetchItems();
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
      const { error } = await supabase.from('caferestaurants').delete().eq('id', selected.id);
      if (!error) {
        toast.success('Entry deleted');
        fetchItems();
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
          + Add Cafe/Restaurant
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-gray-500">No entries found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((it) => (
            <div key={it.id} className="bg-white border rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-lg mb-1">{it.name}</h3>
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
        <CafeRestaurantFormModal
          initialData={editing}
          onClose={() => setShowModal(false)}
          onSave={fetchItems}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmModal
          open={showDeleteModal}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          itemName={selected?.name || 'this entry'}
        />
      )}
    </div>
  );
}