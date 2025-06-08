'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import EventFormModal from './eventFormModal';
import DeleteConfirmModal from '../deleteConfirmModal';
import { toast } from 'react-hot-toast';

export default function AdminEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  const fetchEvents = async () => {
    const { data } = await supabase.from('events').select('*').order('created_at', { ascending: false });
    setEvents(data || []);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openAddModal = () => {
    setEditingEvent(null);
    setShowModal(true);
  };

  const openEditModal = (event: any) => {
    setEditingEvent(event);
    setShowModal(true);
  };

  const confirmDelete = (event: any) => {
    setSelectedEvent(event);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (selectedEvent) {
      const { error } = await supabase.from('events').delete().eq('id', selectedEvent.id);
      if (!error) {
        toast.success('Event deleted');
        fetchEvents();
      } else {
        toast.error('Failed to delete');
      }
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="">
      <div className="mb-4 flex justify-end">
        <button
          onClick={openAddModal}
          className="bg-emerald-600 text-white px-4 py-2 rounded"
        >
          + Add Event
        </button>
      </div>

      {events.length === 0 ? (
        <p className="text-gray-500">No events found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((event) => (
            <div key={event.id} className="bg-white border rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-lg mb-1">{event.name}</h3>
              <p className="text-sm text-gray-600">📍 {event.location}</p>
              <p className="text-sm text-gray-500 italic">📅 {event.date}</p>
              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => openEditModal(event)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => confirmDelete(event)}
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
        <EventFormModal
          initialData={editingEvent}
          onClose={() => setShowModal(false)}
          onSave={fetchEvents}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmModal
          open={showDeleteModal}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          itemName={selectedEvent?.name || 'this event'}
        />
      )}
    </div>
  );
}
