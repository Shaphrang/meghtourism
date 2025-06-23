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
    console.log('Fetching cafe/restaurant entries...');
    const { data, error } = await supabase
      .from('cafes_and_restaurants') // Make sure this matches the correct table name
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching data:', error.message);
      toast.error('Failed to load entries');
    } else {
      console.log('Fetched entries:', data);
    }

    setItems(data || []);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openAddModal = () => {
    console.log('Opening add modal');
    setEditing(null);
    setShowModal(true);
  };

  const openEditModal = (item: any) => {
    console.log('Opening edit modal for:', item);
    setEditing(item);
    setShowModal(true);
  };

  const confirmDelete = (item: any) => {
    console.log('Confirming delete for:', item);
    setSelected(item);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (selected) {
      console.log('Deleting entry:', selected);
      const { error } = await supabase.from('cafes_and_restaurants').delete().eq('id', selected.id);
      if (!error) {
        toast.success('Entry deleted');
        fetchItems();
      } else {
        console.error('Delete failed:', error.message);
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
          onClose={() => {
            console.log('Closing modal');
            setShowModal(false);
          }}
          onSave={() => {
            console.log('Saving new or edited entry');
            fetchItems();
          }}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmModal
          open={showDeleteModal}
          onCancel={() => {
            console.log('Cancel delete');
            setShowDeleteModal(false);
          }}
          onConfirm={handleDelete}
          itemName={selected?.name || 'this entry'}
        />
      )}
    </div>
  );
}
