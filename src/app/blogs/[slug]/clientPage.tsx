"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Blog } from "@/types/blogs";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import DescriptionToggle from "@/components/common/descriptionToggle";
import { supabase } from "@/lib/supabaseClient";
import { normalizeSlug } from "@/lib/utils";
import Head from "next/head";

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

  if (!blog) {
    return (
      <>
        <Head>
          <title>Loading Blog... | Meghtourism</title>
        </Head>
        <p className="p-4">Loading...</p>
      </>
    );
  }

  const gallery = blog.gallery?.length
    ? blog.gallery
    : blog.cover_image
    ? [blog.cover_image]
    : [];

  return (
    <>
      <Head>
        <title>{blog.title} | Meghtourism</title>
        <meta name="description" content={blog.summary?.slice(0, 150) || ""} />
        <meta property="og:title" content={`${blog.title} | Meghtourism`} />
        <meta
          property="og:description"
          content={blog.summary?.slice(0, 150) || ""}
        />
        {blog.cover_image && (
          <meta property="og:image" content={blog.cover_image} />
        )}
      </Head>

      <main className="bg-gradient-to-b from-stone-50 to-white w-full min-h-screen text-charcoal overflow-x-hidden pb-10">
        {/* ✅ Full Width Image Swiper */}
        {gallery.length > 0 && (
          <Swiper
            spaceBetween={10}
            slidesPerView={1}
            className="w-screen h-64 md:h-96"
          >
            {gallery.map((img, idx) => (
              <SwiperSlide
                key={idx}
                className="relative w-full h-full overflow-hidden"
              >
                {img && img.startsWith("https") ? (
                  <Image
                    src={img}
                    alt={blog.title || "Blog"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                    No image
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        {/* ✅ Content */}
        <div className="max-w-screen-md mx-auto px-4">
          <section className="pt-4">
            <h1 className="text-2xl font-bold text-green-800">
              {blog.title}
            </h1>
            {blog.author && (
              <p className="text-sm text-charcoal mt-1">By {blog.author}</p>
            )}
            {blog.published_at && (
              <p className="text-xs text-gray-500 mt-1">
                {new Date(blog.published_at).toLocaleDateString()}
              </p>
            )}
          </section>

          {/* ✅ Tags */}
          {blog.tags?.length ? (
            <section className="pt-3">
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          ) : null}

          {/* ✅ Content Toggle */}
          {blog.content && (
            <section className="pt-6">
              <DescriptionToggle text={blog.content} />
            </section>
          )}
        </div>
      </main>
    </>
  );
}
