'use client';

import { useState } from 'react';

interface Photo {
  url: string;
  width: number;
  height: number;
}

interface PhotoGalleryProps {
  photos: Photo[];
  businessName: string;
}

export function PhotoGallery({ photos, businessName }: PhotoGalleryProps) {
  const [failedUrls, setFailedUrls] = useState<Set<string>>(new Set());

  const visiblePhotos = photos.filter((p) => !failedUrls.has(p.url));

  if (visiblePhotos.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {visiblePhotos.slice(0, 4).map((photo, idx) => (
          <div key={idx} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.url}
              alt={`${businessName} - 사진 ${idx + 1}`}
              className="w-full h-full object-cover"
              loading={idx === 0 ? 'eager' : 'lazy'}
              onError={() => {
                setFailedUrls((prev) => new Set(prev).add(photo.url));
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
