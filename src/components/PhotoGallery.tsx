'use client';

import { useState } from 'react';
import Image from 'next/image';

interface PhotoGalleryProps {
  /** Photo references extracted server-side (no API keys) */
  photoRefs: string[];
  businessName: string;
}

export function PhotoGallery({ photoRefs, businessName }: PhotoGalleryProps) {
  const [failedRefs, setFailedRefs] = useState<Set<string>>(new Set());
  const [loadedRefs, setLoadedRefs] = useState<Set<string>>(new Set());

  const visibleRefs = photoRefs.filter((ref) => !failedRefs.has(ref));

  if (visibleRefs.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {visibleRefs.slice(0, 4).map((ref, idx) => (
          <div key={ref} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={`/api/photo?ref=${encodeURIComponent(ref)}&maxwidth=800`}
              alt={`${businessName} - 사진 ${idx + 1}`}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className={`object-cover transition-opacity ${
                loadedRefs.has(ref) ? 'opacity-100' : 'opacity-0'
              }`}
              priority={idx === 0}
              unoptimized
              onLoad={() => {
                setLoadedRefs((prev) => new Set(prev).add(ref));
              }}
              onError={() => {
                setFailedRefs((prev) => new Set(prev).add(ref));
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
