'use client';

import Image from 'next/image';
import { useState } from 'react';

// ✅ Set your actual fallback image URL from Supabase
const SUPABASE_FALLBACK_IMAGE = 'https://dsvndsiallxdncdkcagj.supabase.co/storage/v1/object/public/images/placeholders/no-image.jpg';

interface SupabaseImageProps {
  src: string | null;
  alt?: string;
  width: number;
  height: number;
  className?: string;
  fallback?: string;
}

export function SupabaseImage({
  src,
  alt = '',
  width,
  height,
  className = '',
  fallback = SUPABASE_FALLBACK_IMAGE,
}: SupabaseImageProps) {
  const [imgSrc, setImgSrc] = useState(src || fallback);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      className={className}
      onError={() => {
        if (imgSrc !== fallback) setImgSrc(fallback);
      }}
    />
  );
}

interface SupabaseGalleryProps {
  images: string[];
  className?: string;
  imageClassName?: string;
  fallback?: string;
  imageHeight?: number; // height in px
}

export function SupabaseGallery({
  images = [],
  className = '',
  imageClassName = '',
  fallback = SUPABASE_FALLBACK_IMAGE,
  imageHeight = 96,
}: SupabaseGalleryProps) {
  return (
    <div className={`grid grid-cols-3 gap-2 ${className}`}>
      {images.length === 0 ? (
        <div className="col-span-3 text-center text-sm text-gray-500">No images</div>
      ) : (
        images.map((src, i) => (
          <img
            key={i}
            src={src || fallback}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target.src !== fallback) {
                target.src = fallback;
              }
            }}
            className={`object-cover rounded w-full ${imageClassName}`}
            style={{ height: `${imageHeight}px` }}
            alt={`Gallery image ${i + 1}`}
          />
        ))
      )}
    </div>
  );
}
