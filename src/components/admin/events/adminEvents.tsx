'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import EventFormModal from './eventFormModal';
import DeleteConfirmModal from '../deleteConfirmModal';
import { toast } from 'react-hot-toast';
import { LOCATION_ZONES } from '@/lib/locationZones';

export default function AdminEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  const fetchEvents = async () => {
    let query = supabase.from('events').select('*');
    if (search) query = query.ilike('name', `%${search}%`);
    if (locationFilter) query = query.eq('location', locationFilter);
    const { data } = await query.order('created_at', { ascending: false });
    setEvents(data || []);
  };

  useEffect(() => {
    fetchEvents();
  }, [search, locationFilter]);

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
