"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageGallery } from '@/components/admin/ImageGallery';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { StatsCards } from '@/components/admin/StatsCards';
import { Image } from '@/types';
import { Users, ImageIcon, CheckCircle, Clock } from 'lucide-react';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'men' | 'women'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'selected' | 'not_selected'>('all');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/images');
      const result = await response.json();
      if (result.success) {
        setImages(result.data);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (id: string, newStatus: 'selected' | 'not_selected') => {
    try {
      const response = await fetch(`/api/images/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();
      if (result.success) {
        setImages(prev => 
          prev.map(img => 
            img.id === id ? { ...img, status: newStatus } : img
          )
        );
      }
    } catch (error) {
      console.error('Error updating image status:', error);
    }
  };

  const filteredImages = images.filter(image => {
    const categoryMatch = filter === 'all' || image.category === filter;
    const statusMatch = statusFilter === 'all' || image.status === statusFilter;
    return categoryMatch && statusMatch;
  });

  const stats = {
    total: images.length,
    selected: images.filter(img => img.status === 'selected').length,
    men: images.filter(img => img.category === 'men').length,
    women: images.filter(img => img.category === 'women').length,
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Collection Dashboard
          </h1>
          <p className="text-gray-600">
            Manage and curate uploaded designs for the museum slideshow
          </p>
        </div>

        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Category</label>
                <div className="flex gap-2">
                  <Button
                    variant={filter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('all')}
                  >
                    All
                  </Button>
                  <Button
                    variant={filter === 'men' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('men')}
                  >
                    Men&apos;s Designs
                  </Button>
                  <Button
                    variant={filter === 'women' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('women')}
                  >
                    Women&apos;s Designs
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Status</label>
                <div className="flex gap-2">
                  <Button
                    variant={statusFilter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter('all')}
                  >
                    All
                  </Button>
                  <Button
                    variant={statusFilter === 'selected' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter('selected')}
                  >
                    Selected
                  </Button>
                  <Button
                    variant={statusFilter === 'not_selected' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter('not_selected')}
                  >
                    Pending
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Image Gallery */}
        <ImageGallery 
          images={filteredImages}
          onStatusToggle={handleStatusToggle}
          onRefresh={fetchImages}
        />
      </div>
    </div>
  );
}
