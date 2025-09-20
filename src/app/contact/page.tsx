'use client';
import { useState } from 'react';
import Head from 'next/head';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import Link from 'next/link';


/** Simple brand mark (swap with your logo if you have one) */
function BrandMark(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden {...props}>
      <defs>
        <linearGradient id="mt-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="32" height="32" rx="8" fill="url(#mt-grad)" />
      <path d="M8 20c3-6 7-6 10 0s7 6 6 0" stroke="white" strokeWidth="2" fill="none" />
    </svg>
  );
}

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
  ) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

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
      setForm({ name: '', email: '', phone: '', type: 'General Query', message: '' });
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

      {/* Top brand bar */}
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center gap-2 px-4 py-2">
          <Link href="/" aria-label="Go to Meghtourism home" className="flex items-center gap-2">
            <BrandMark className="h-6 w-6" />
            <span className="text-sm font-semibold tracking-tight hover:underline">
              Meghtourism
            </span>
          </Link>
        </div>
      </header>

      <main className="bg-gradient-to-br from-orange-50 via-white to-emerald-50 px-2 pt-3 md:pt-0 pb-4 min-h-[100svh] flex md:items-center md:justify-center  relative overflow-hidden">
        {/* Subtle background blobs */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-[240px] w-[240px] rounded-full bg-orange-100 blur-3xl opacity-30" />
        <div className="pointer-events-none absolute -bottom-24 -right-20 h-[200px] w-[200px] rounded-full bg-emerald-100 blur-2xl opacity-40" />

        <div className="z-10 w-full max-w-sm md:mt-0 mt-2">
          {/* Header */}
          <div className="mb-4 text-center">
            <h1 className="text-xl font-bold text-gray-900">Let’s get in touch</h1>
            <p className="mt-1 text-xs text-gray-600">
              Or email us at{' '}
              <a href="mailto:hello@meghtourism.com" className="font-medium text-blue-600 hover:underline">
                hello@meghtourism.com
              </a>
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-3 rounded-2xl border border-gray-200 bg-white/80 p-5 shadow-md backdrop-blur"
          >
            <div>
              <label className="mb-1 block text-xs text-gray-700">Full Name</label>
              <Input
                name="name"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                required
                className="h-9 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-gray-700">Email Address</label>
              <Input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                className="h-9 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-gray-700">Phone Number</label>
              <Input
                name="phone"
                placeholder="Optional"
                value={form.phone}
                onChange={handleChange}
                className="h-9 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-gray-700">Query Type</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="h-9 w-full rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>General Query</option>
                <option>Business Listing Request</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs text-gray-700">Message</label>
              <Textarea
                name="message"
                rows={4}
                maxLength={300}
                placeholder="Your message..."
                value={form.message}
                onChange={handleChange}
                required
                className="text-sm"
              />
              <p className="mt-1 text-right text-[10px] text-gray-400">{form.message.length}/300</p>
            </div>

            <label className="flex items-start gap-2 text-xs text-gray-600">
              <input type="checkbox" required className="mt-0.5" />
              <span>
                I agree to the{' '}
                <a href="/privacy" className="font-medium text-blue-600 underline">
                  Privacy Policy
                </a>
                .
              </span>
            </label>

            <Button
              type="submit"
              disabled={loading}
              className="h-9 w-full bg-indigo-600 text-sm text-white hover:bg-indigo-700"
            >
              {loading ? 'Sending...' : 'Submit Form →'}
            </Button>
          </form>

          {/* Small footer note */}
          <p className="mt-2 text-center text-xs text-gray-600">
            Prefer email? Write to{' '}
            <a href="mailto:hello@meghtourism.com" className="font-medium text-blue-600 hover:underline">
              hello@meghtourism.com
            </a>
          </p>
        </div>
      </main>
    </>
  );
}
