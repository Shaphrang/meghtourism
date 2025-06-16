'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-hot-toast';

interface Props {
  itemId: string;
  itemType: string;
}

export default function ContactForm({ itemId, itemType }: Props) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('queries').insert([
      { ...form, itemId, itemType },
    ]);
    if (error) {
      toast.error(error.message || 'Failed to submit');
    } else {
      toast.success('Submitted');
      setForm({ name: '', email: '', message: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        name="name"
        required
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        className="w-full border rounded-md px-3 py-2"
      />
      <input
        name="email"
        type="email"
        required
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="w-full border rounded-md px-3 py-2"
      />
      <textarea
        name="message"
        required
        placeholder="Message"
        value={form.message}
        onChange={handleChange}
        rows={4}
        className="w-full border rounded-md px-3 py-2"
      />
      <button
        type="submit"
        className="w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700"
      >
        Send
      </button>
    </form>
  );
}