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
        setCollections(result.data);
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
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-orange-700 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">Loading Gallery</h2>
          <p className="text-gray-200">Preparing amazing collections...</p>
        </div>
      </div>
    );
  }

  if (error || collections.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-orange-700 flex items-center justify-center">
        <div className="text-center text-white max-w-md px-4">
          <div className="text-6xl mb-6">🎨</div>
          <h2 className="text-3xl font-bold mb-4">Gallery Coming Soon</h2>
          <p className="text-gray-200 mb-6">
            {error 
              ? 'There was an error loading the gallery. Please try again later.'
              : 'No collections have been selected for display yet. Check back soon for amazing creative works!'
            }
          </p>
          <div className="text-sm text-gray-300">
            Refreshing automatically...
          </div>
        </div>
      </div>
    );
  }

  return (
    <CollectionSlideshow collections={collections} />
  );
}

