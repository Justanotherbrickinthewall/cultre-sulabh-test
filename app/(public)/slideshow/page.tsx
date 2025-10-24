"use client";

import { useState, useEffect, useCallback } from 'react';
import { CollectionSlideshow } from '@/components/slideshow/CollectionSlideshow';
import { Collection } from '@/types';

export default function CollectionSlideshowPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSelectedCollections = useCallback(async () => {
    try {
      const response = await fetch('/api/collections/selected');
      const result = await response.json();
      
      if (result.success) {
        // Sort collections by created_at (latest first) before passing to slideshow
        const time = (d: string) => Date.parse(d) || 0;
        const sorted: Collection[] = (result.data as Collection[])
          .slice()
          .sort((a, b) => time(b.created_at) - time(a.created_at));
        setCollections(sorted);
        setError(null);
      } else {
        setError(result.error || 'Failed to fetch collections');
      }
    } catch {
      setError('Failed to fetch collections');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSelectedCollections();
    
    // Refresh data every 30 seconds to get newly selected collections
    const interval = setInterval(fetchSelectedCollections, 30000);
    
    return () => clearInterval(interval);
  }, [fetchSelectedCollections]);

  if (loading) {
    return (
      <div className="h-screen bg-amber relative overflow-hidden">
        <div className="h-full flex flex-col items-center justify-center gap-6">
          <div className="relative w-14 h-14">
            <div
              className="absolute inset-0 rounded-full animate-spin"
              style={{
                background: 'conic-gradient(#d79828 0deg, #d79828 280deg, rgba(0,0,0,0.2) 280deg 360deg)'
              }}
            />
            <div className="absolute inset-2 rounded-full bg-black/10" />
          </div>
          <div className="text-center text-navyblue">
            <h2
              className="text-3xl leading-none italic font-black mb-2"
              style={{ fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}
            >
              Loading Collections
            </h2>
            <p className="text-base opacity-80">Curating the latest creations…</p>
          </div>
        </div>

        <div className="fixed bottom-4 right-4 z-30">
          <div className="bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
            <p className="text-sm text-white font-medium flex items-center gap-2">
              Crafted with <span className="inline-block w-3 h-3 rounded-full bg-red-400" /> by Cultre
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || collections.length === 0) {
    return (
      <div className="h-screen bg-amber relative overflow-hidden">
        <div className="h-full flex items-center justify-center">
          <div className="text-center text-navyblue max-w-md px-6">
            <div className="text-5xl mb-4">🎨</div>
            <h2
              className="text-3xl leading-none italic font-black mb-3"
              style={{ fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}
            >
              {error ? 'Gallery Unavailable' : 'Gallery Coming Soon'}
            </h2>
            <p className="opacity-90 mb-6">
              {error
                ? 'There was an error loading the gallery. Please try again shortly.'
                : 'No collections have been selected for display yet. Check back soon for amazing creative works!'}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={fetchSelectedCollections}
                className="px-4 py-2 rounded-full border-2 border-navyblue text-navyblue hover:bg-navyblue/10 transition-colors"
              >
                Retry now
              </button>
              <span className="text-sm opacity-60">Auto-refreshing…</span>
            </div>
          </div>
        </div>

        <div className="fixed bottom-4 right-4 z-30">
          <div className="bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
            <p className="text-sm text-white font-medium flex items-center gap-2">
              Crafted with <span className="inline-block w-3 h-3 rounded-full bg-red-400" /> by Cultre
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <CollectionSlideshow collections={collections} />
  );
}

