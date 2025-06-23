'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import TravelTipFormModal from './travelTipsFormModal';
import DeleteConfirmModal from '../deleteConfirmModal';
import { toast } from 'react-hot-toast';

export default function AdminTravelTips() {
  const [tips, setTips] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTip, setEditingTip] = useState<any | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTip, setSelectedTip] = useState<any | null>(null);

  const fetchTips = async () => {
    const { data } = await supabase
      .from('traveltips')
      .select('*')
      .order('created_at', { ascending: false });
    setTips(data || []);
  };

  useEffect(() => {
    fetchTips();
  }, []);

  const openAddModal = () => {
    setEditingTip(null);
    setShowModal(true);
  };

  const openEditModal = (tip: any) => {
    setEditingTip(tip);
    setShowModal(true);
  };

  const confirmDelete = (tip: any) => {
    setSelectedTip(tip);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (selectedTip) {
      const { error } = await supabase
        .from('traveltips')
        .delete()
        .eq('id', selectedTip.id);
      if (!error) {
        toast.success('Travel tip deleted');
        fetchTips();
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
          + Add Travel Tip
        </button>
      </div>

      {tips.length === 0 ? (
        <p className="text-gray-500">No travel tips found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tips.map((tip) => (
            <div key={tip.id} className="bg-white border rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-lg mb-1">{tip.title}</h3>
              <p className="text-sm text-gray-600">{tip.category}</p>
              <p className="text-sm text-gray-500 italic">{tip.region}</p>
              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => openEditModal(tip)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => confirmDelete(tip)}
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
        <TravelTipFormModal
          initialData={editingTip}
          onClose={() => setShowModal(false)}
          onSave={fetchTips}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmModal
          open={showDeleteModal}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          itemName={selectedTip?.title || 'this tip'}
        />
      )}
    </div>
  );
}