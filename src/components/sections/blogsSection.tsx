// src/components/sections/BlogsSection.tsx
'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useSupabaseList from '@/hooks/useSupabaseList';
import { Blog } from '@/types/blogs';

export default function BlogsSection() {
  const { data: blogs, loading } = useSupabaseList<Blog>('blogs', {
    sortBy: 'published_at',
    ascending: false,
    pageSize: 6,
  });

  return (
    <section className="w-full px-2 sm:px-4 mt-6">
      <div className="flex justify-between items-center px-1 mb-2">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Latest Blogs</h2>
        <Link href="/blogs" className="text-sm text-emerald-600 hover:underline font-medium">
          View All
        </Link>
      </div>

      {loading ? (
        <div className="text-sm text-gray-500 px-1">Loading blogs...</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {blogs.map((blog) => (
            <Link
              href={`/blogs/${blog.slug}`}
              key={blog.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative w-full h-[160px] sm:h-[180px] bg-gray-100">
                {blog.cover_image && blog.cover_image.startsWith('https') ? (
                  <Image
                    src={blog.cover_image}
                    alt={blog.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-sm text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              <div className="p-3">
                <h3 className="text-sm font-semibold text-gray-800 mb-1 truncate">
                  {blog.title}
                </h3>
                <p className="text-xs text-gray-600 line-clamp-3 mb-2">
                  {blog.summary}
                </p>
                <div className="flex flex-wrap gap-1">
                  {Array.isArray(blog.tags) &&
                    blog.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="bg-emerald-100 text-emerald-700 text-[10px] font-medium px-2 py-0.5 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
