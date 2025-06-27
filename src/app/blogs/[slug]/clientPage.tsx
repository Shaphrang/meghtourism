"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Blog } from "@/types/blogs";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import DescriptionToggle from "@/components/common/descriptionToggle";
import { supabase } from "@/lib/supabaseClient";
import { normalizeSlug } from "@/lib/utils"

export default function ClientPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);

  useEffect(() => {
    async function fetchData() {
      const fixedSlug = normalizeSlug(String(slug));
      const { data } = await supabase
        .from("blogs")
        .select("*")
        .eq("slug", fixedSlug)
        .single();
      setBlog(data);
    }
    fetchData();
  }, [slug]);

  if (!blog) return <p className="p-4">Loading...</p>;

  const gallery = blog.gallery?.length
    ? blog.gallery
    : blog.cover_image
    ? [blog.cover_image]
    : [];

  return (
    <main className="w-full min-h-screen bg-white text-gray-800 pb-10 overflow-x-hidden">
      {gallery.length > 0 && (
        <Swiper spaceBetween={10} slidesPerView={1} className="w-full h-64 md:h-96">
          {gallery.map((img, idx) => (
            <SwiperSlide key={idx} className="relative w-full h-full rounded-lg overflow-hidden">
              {img && img.startsWith('https') ? (
                <Image src={img} alt={blog.title || "Blog"} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No image</div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      <section className="p-4">
        <h1 className="text-2xl font-bold mb-1">{blog.title}</h1>
        {blog.author && <p className="text-sm text-gray-600">By {blog.author}</p>}
        {blog.published_at && (
          <p className="text-xs text-gray-500">
            {new Date(blog.published_at).toLocaleDateString()}
          </p>
        )}
      </section>

      {blog.content && (
        <section className="px-4 pb-6">
          <DescriptionToggle text={blog.content} />
        </section>
      )}
    </main>
  );
}