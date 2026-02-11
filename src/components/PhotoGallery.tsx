'use client';

import { useState } from 'react';

interface PhotoGalleryProps {
  /** Photo references extracted server-side (no API keys) */
  photoRefs: string[];
  businessName: string;
}

export function PhotoGallery({ photoRefs, businessName }: PhotoGalleryProps) {
  const [failedRefs, setFailedRefs] = useState<Set<string>>(new Set());

  const visibleRefs = photoRefs.filter((ref) => !failedRefs.has(ref));

  if (visibleRefs.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {visibleRefs.slice(0, 4).map((ref, idx) => (
          <div key={ref} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/photo?ref=${encodeURIComponent(ref)}&maxwidth=800`}
              alt={`${businessName} - 사진 ${idx + 1}`}
              className="w-full h-full object-cover"
              loading={idx === 0 ? 'eager' : 'lazy'}
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
