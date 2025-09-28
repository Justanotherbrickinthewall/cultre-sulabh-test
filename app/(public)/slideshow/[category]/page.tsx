"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Slideshow } from '@/components/slideshow/Slideshow';
import { Image } from '@/types';

export default function SlideshowPage() {
  const params = useParams();
  const category = params.category as 'men' | 'women';
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSelectedImages();
    
    // Refresh data every 30 seconds to get newly selected images
    const interval = setInterval(fetchSelectedImages, 30000);
    
    return () => clearInterval(interval);
  }, [category]);

  const fetchSelectedImages = async () => {
    try {
      const response = await fetch(`/api/images/selected/${category}`);
      const result = await response.json();
      
      if (result.success) {
        setImages(result.data);
        setError(null);
      } else {
        setError(result.error || 'Failed to fetch images');
      }
    } catch (err) {
      setError('Failed to fetch images');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">Loading Gallery</h2>
          <p className="text-gray-300">Preparing {category}'s designs...</p>
        </div>
      </div>
    );
  }

  if (error || images.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white max-w-md px-4">
          <div className="text-6xl mb-6">🎨</div>
          <h2 className="text-3xl font-bold mb-4">Gallery Coming Soon</h2>
          <p className="text-gray-300 mb-6">
            {error 
              ? 'There was an error loading the gallery. Please try again later.'
              : `No ${category}'s designs have been selected for display yet. Check back soon for amazing creative works!`
            }
          </p>
          <div className="text-sm text-gray-400">
            Refreshing automatically...
          </div>
        </div>
      </div>
    );
  }

  return (
    <Slideshow 
      images={images} 
      category={category}
    />
  );
}
