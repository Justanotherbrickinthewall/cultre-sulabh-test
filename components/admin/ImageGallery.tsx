"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ImageCard } from './ImageCard';
import { BulkActions } from './BulkActions';
import { Image } from '@/types';
import { RefreshCw, Grid, List } from 'lucide-react';

interface ImageGalleryProps {
  images: Image[];
  onStatusToggle: (id: string, newStatus: 'selected' | 'not_selected') => void;
  onRefresh: () => void;
}

export function ImageGallery({ images, onStatusToggle, onRefresh }: ImageGalleryProps) {
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(false);

  const handleSelectImage = (id: string) => {
    setSelectedImages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedImages.size === images.length) {
      setSelectedImages(new Set());
    } else {
      setSelectedImages(new Set(images.map(img => img.id)));
    }
  };

  const handleBulkAction = async (action: 'select' | 'deselect') => {
    if (selectedImages.size === 0) return;

    setLoading(true);
    try {
      const status = action === 'select' ? 'selected' : 'not_selected';
      const response = await fetch('/api/images/bulk', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ids: Array.from(selectedImages),
          status,
        }),
      });

      if (response.ok) {
        Array.from(selectedImages).forEach(id => {
          onStatusToggle(id, status);
        });
        setSelectedImages(new Set());
      }
    } catch (error) {
      console.error('Error performing bulk action:', error);
    } finally {
      setLoading(false);
    }
  };

  if (images.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Grid className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No designs found</h3>
          <p className="text-gray-500 mb-4">
            No designs match your current filters. Try adjusting the filters or refresh the page.
          </p>
          <Button onClick={onRefresh} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Design Collection ({images.length})</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            >
              {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Bulk Actions */}
        <BulkActions
          selectedCount={selectedImages.size}
          totalCount={images.length}
          onSelectAll={handleSelectAll}
          onBulkAction={handleBulkAction}
          loading={loading}
        />

        {/* Image Grid/List */}
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          : "space-y-4"
        }>
          {images.map((image) => (
            <ImageCard
              key={image.id}
              image={image}
              onStatusToggle={onStatusToggle}
              isSelected={selectedImages.has(image.id)}
              onSelect={() => handleSelectImage(image.id)}
              viewMode={viewMode}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
