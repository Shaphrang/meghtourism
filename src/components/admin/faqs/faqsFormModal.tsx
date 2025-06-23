'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Dialog } from '@headlessui/react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-hot-toast';

interface Props {
  initialData?: any;
  onClose: () => void;
  onSave: () => void;
}

export default function FaqFormModal({ initialData, onClose, onSave }: Props) {
  const isEditMode = !!initialData;
  const [form, setForm] = useState(
    initialData || {
      id: uuidv4(),
      question: '',
      answer: '',
      category: '',
      tags: [] as string[],
      related_destinations: [] as string[],
      related_events: [] as string[],
      related_itineraries: [] as string[],
      audience: '',
      language: '',
      priority: '',
      isactive: false,
      visibilitystatus: '',
    }
  );

  const handleChange = (key: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (isEditMode) {
        const { error } = await supabase.from('prebuilt_faqs').update(form).eq('id', form.id);
        if (error) throw error;
        toast.success('FAQ updated');
      } else {
        const { error } = await supabase.from('prebuilt_faqs').insert([form]);
        if (error) throw error;
        toast.success('FAQ created');
      }
      onSave();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Error saving data');
    }
  };

  const renderInput = (label: string, key: string, type = 'text') => (
    <div className="mb-3">
      <label className="block font-medium text-sm mb-1">{label}</label>
      <input
        type={type}
        value={form[key] || ''}
        onChange={(e) => handleChange(key, type === 'number' ? Number(e.target.value) : e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />
    </div>
  );

  const renderArray = (label: string, key: string) => (
    <div className="mb-3">
      <label className="block font-medium text-sm mb-1">{label}</label>
      <textarea
        value={(form[key] || []).join(', ')}
        onChange={(e) => handleChange(key, e.target.value.split(',').map((s) => s.trim()))}
        className="w-full border px-3 py-2 rounded"
        placeholder="Comma-separated values"
        rows={2}
      />
    </div>
  );

  const renderCheckbox = (label: string, key: string) => (
    <div className="mb-3 flex items-center gap-2">
      <input type="checkbox" checked={form[key]} onChange={(e) => handleChange(key, e.target.checked)} />
      <label className="text-sm">{label}</label>
    </div>
  );

  return (
    <Dialog open={true} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="bg-white p-6 rounded-lg z-10 w-full max-w-3xl overflow-y-auto max-h-[95vh]">
        <Dialog.Title className="text-xl font-bold mb-4">{isEditMode ? 'Edit FAQ' : 'Add FAQ'}</Dialog.Title>

        {renderInput('Question', 'question')}
        {renderInput('Answer', 'answer')}
        {renderInput('Category', 'category')}
        {renderArray('Tags', 'tags')}
        {renderArray('Related Destinations', 'related_destinations')}
        {renderArray('Related Events', 'related_events')}
        {renderArray('Related Itineraries', 'related_itineraries')}
        {renderInput('Audience', 'audience')}
        {renderInput('Language', 'language')}
        {renderInput('Priority', 'priority')}
        {renderCheckbox('Active', 'isactive')}
        {renderInput('Visibility Status', 'visibilitystatus')}

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="bg-gray-200 px-4 py-2 rounded">Cancel</button>
          <button onClick={handleSubmit} className="bg-emerald-600 text-white px-4 py-2 rounded">
            {isEditMode ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </Dialog>
  );
}