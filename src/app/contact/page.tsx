'use client';
import { useState } from 'react';
import Head from 'next/head';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'General Query',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.ok) {
      toast.success('Message sent!');
      setForm({
        name: '',
        email: '',
        phone: '',
        type: 'General Query',
        message: '',
      });
    } else {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error || 'Failed to send');
    }
  };

  return (
    <>
      <Head>
        <title>Contact Us - Meghtourism</title>
        <meta
          name="description"
          content="Get in touch for queries or to list your business on Meghtourism"
        />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-emerald-50 px-4 py-12 flex items-center justify-center relative overflow-hidden">
        {/* Abstract floating circles */}
        <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-orange-100 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-[-120px] right-[-80px] w-[250px] h-[250px] bg-emerald-100 rounded-full blur-2xl opacity-40"></div>

        <div className="w-full max-w-md z-10">
          {/* Header */}
          <div className="text-center mb-6">
            <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
              Contact Us
            </span>
            <h1 className="text-2xl font-bold text-gray-900 mt-4">Let’s Get In Touch.</h1>
            <p className="text-sm text-gray-600 mt-1">
              Or just reach out manually at{' '}
              <a
                href="mailto:hello@meghtourism.com"
                className="text-blue-600 font-medium hover:underline"
              >
                hello@meghtourism.com
              </a>
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-gray-200"
          >
            <div>
              <label className="block text-sm text-gray-700 mb-1">Full Name</label>
              <Input
                name="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Email Address</label>
              <Input
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Phone Number</label>
              <Input
                name="phone"
                placeholder="Optional"
                value={form.phone}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Query Type</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>General Query</option>
                <option>Business Listing Request</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Message</label>
              <Textarea
                name="message"
                rows={4}
                placeholder="Enter your main message..."
                value={form.message}
                onChange={handleChange}
                required
              />
              <p className="text-right text-xs text-gray-400 mt-1">{form.message.length}/300</p>
            </div>

            <div className="flex items-start gap-2 text-sm text-gray-600">
              <input type="checkbox" required className="mt-1" />
              <span>
                I agree to the{' '}
                <a href="/privacy" className="text-blue-600 font-medium underline">
                  Privacy Policy
                </a>{' '}
                terms.
              </span>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {loading ? 'Sending...' : 'Submit Form →'}
            </Button>
          </form>

          {/* Footer Info */}
          <div className="text-center mt-8">
            <span className="inline-block text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
              Reach Out To Us
            </span>
            <h2 className="text-lg font-semibold mt-3">Send Us A Message.</h2>
            <p className="text-sm text-gray-600 mt-1">
              Or just reach out manually to{' '}
              <a
                href="mailto:hello@meghtourism.com"
                className="text-blue-600 font-medium hover:underline"
              >
                hello@meghtourism.com
              </a>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
