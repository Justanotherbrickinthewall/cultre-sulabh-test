"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Image } from '@/types';
import { Pencil, Check, Heart, Loader2 } from 'lucide-react';

function EditableTitle({ id, initialValue, onSaved }: { id: string; initialValue: string; onSaved: () => void }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    try {
      setSaving(true);
      const resp = await fetch(`/api/collections/${id}/name`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: value.trim() }),
      });
      if (resp.ok) {
        setEditing(false);
        onSaved();
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center gap-2 min-w-0 flex-1">
      {editing ? (
        <>
          <input
            className="border rounded px-2 py-1 text-base md:text-lg font-semibold min-w-0 flex-1"
            value={value}
            onChange={e => setValue(e.target.value)}
            disabled={saving}
          />
          <button onClick={save} disabled={saving} className="p-1 border rounded flex-shrink-0">
            <Check className="w-4 h-4" />
          </button>
        </>
      ) : (
        <>
          <CardTitle className="text-base md:text-lg truncate">{value}</CardTitle>
          <button onClick={() => setEditing(true)} className="p-1 border rounded flex-shrink-0 hover:bg-gray-100">
            <Pencil className="w-3 h-3 md:w-4 md:h-4" />
          </button>
        </>
      )}
    </div>
  );
}

function SelectToggle({
  selected,
  onChange,
  disabled,
}: {
  selected: boolean;
  onChange: (next: boolean) => Promise<void>;
  disabled?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  
  const handleClick = async () => {
    setLoading(true);
    try {
      await onChange(!selected);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      disabled={disabled || loading}
      onClick={handleClick}
      className={
        `inline-flex items-center gap-2 px-4 py-1.5 rounded-full border transition-colors ` +
        (selected
          ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'
          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50') +
        (loading ? ' opacity-75 cursor-wait' : '')
      }
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Heart
          className={selected ? 'w-4 h-4 text-rose-600 fill-rose-600' : 'w-4 h-4 text-gray-500'}
        />
      )}
      <span className="text-sm font-medium">{selected ? 'Deselect' : 'Select'}</span>
    </button>
  );
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
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

  const filteredImages = images.filter(image => (statusFilter === 'all' || image.status === statusFilter));

  const collections = images.reduce<Record<string, { collection_name?: string; collection_updated_at?: string; creator_name: string; created_at: string; items: Image[] }>>((acc, img) => {
    const key = (img as any).collection_id || 'ungrouped';
    if (!acc[key]) {
      acc[key] = { collection_name: (img as any).collection_name, collection_updated_at: (img as any).collection_updated_at, creator_name: img.creator_name, created_at: img.created_at, items: [] };
    }
    acc[key].items.push(img);
    return acc;
  }, {});

  const collectionList = Object.entries(collections).map(([id, data]) => {
    const statusSet = new Set(data.items.map(i => i.status));
    const status = statusSet.size === 1 ? (data.items[0].status as 'selected' | 'not_selected') : 'not_selected';
    return { id, ...data, status } as { id: string; collection_name?: string; collection_updated_at?: string; creator_name: string; created_at: string; items: Image[]; status: 'selected' | 'not_selected' };
  });

  const stats = {
    total: collectionList.length,
    approved: collectionList.filter(c => c.status === 'selected').length,
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-700">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100">
      <AdminHeader />
      
      <div className="container mx-auto px-4 py-4 md:py-8">
        {/* Page Header */}
        <div className="mb-4 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-900 mb-1 md:mb-2">
            Collection Dashboard
          </h1>
          <p className="text-sm md:text-base text-blue-700">
            Manage and curate uploaded designs for the museum slideshow
          </p>
        </div>

        {/* Stats and Filters in one row */}
        <div className="flex flex-col lg:flex-row gap-3 md:gap-6 mb-4 md:mb-8">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 md:gap-4 lg:flex-1">
            <Card className="border-0 shadow-md bg-white">
              <CardHeader className="pb-1 md:pb-2 pt-3 md:pt-6">
                <CardTitle className="text-xs font-medium text-blue-600">Received</CardTitle>
              </CardHeader>
              <CardContent className="pb-3 md:pb-6">
                <div className="text-2xl md:text-3xl font-bold text-blue-900">{stats.total}</div>
                <p className="text-xs text-blue-700 mt-0.5 hidden md:block">Total submissions</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md bg-white">
              <CardHeader className="pb-1 md:pb-2 pt-3 md:pt-6">
                <CardTitle className="text-xs font-medium text-blue-600">Approved</CardTitle>
              </CardHeader>
              <CardContent className="pb-3 md:pb-6">
                <div className="text-2xl md:text-3xl font-bold text-blue-900">{stats.approved}</div>
                <p className="text-xs text-blue-700 mt-0.5 hidden md:block">Ready for slideshow</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="border-0 shadow-sm lg:w-auto bg-white">
            <CardHeader className="pb-1 md:pb-2 pt-3 md:pt-6">
              <CardTitle className="text-xs md:text-sm text-blue-900">Filters</CardTitle>
            </CardHeader>
            <CardContent className="pb-3 md:pb-6">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={statusFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('all')}
                  className={`rounded-full text-xs ${statusFilter === 'all' ? 'bg-blue-600 hover:bg-blue-700' : 'border-blue-200 text-blue-700 hover:bg-blue-50'}`}
                >
                  All
                </Button>
                <Button
                  variant={statusFilter === 'selected' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('selected')}
                  className={`rounded-full text-xs ${statusFilter === 'selected' ? 'bg-blue-600 hover:bg-blue-700' : 'border-blue-200 text-blue-700 hover:bg-blue-50'}`}
                >
                  Approved
                </Button>
                <Button
                  variant={statusFilter === 'not_selected' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('not_selected')}
                  className={`rounded-full text-xs ${statusFilter === 'not_selected' ? 'bg-blue-600 hover:bg-blue-700' : 'border-blue-200 text-blue-700 hover:bg-blue-50'}`}
                >
                  Pending
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Collections */}
        <div className="space-y-6">
          {collectionList
            .filter(c => statusFilter === 'all' || (statusFilter === 'selected' ? c.status === 'selected' : c.status !== 'selected'))
            .map(collection => (
            <Card key={collection.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-blue-100">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <EditableTitle id={collection.id} initialValue={collection.collection_name || `${collection.creator_name}'s Designs`} onSaved={fetchImages} />
                    </div>
                    <p className="text-xs md:text-sm text-gray-500 truncate">By <span className="font-medium">{collection.creator_name}</span> • {new Date(collection.collection_updated_at || collection.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <SelectToggle
                      selected={collection.status === 'selected'}
                      onChange={async (next) => {
                        try {
                          const ids = collection.items.map((i) => i.id);
                          const response = await fetch('/api/images/bulk', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ ids, status: next ? 'selected' : 'not_selected' }),
                          });
                          if (response.ok) fetchImages();
                        } catch (e) { console.error(e); }
                      }}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {collection.items.map((img) => (
                    <div key={img.id} className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all flex-shrink-0 w-48 md:w-56">
                      <div className="aspect-square overflow-hidden relative">
                        <img src={img.image_url} alt={img.custom_category_name || img.category} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <span className="absolute top-2 right-2 px-2 py-1 text-xs font-medium capitalize bg-white/90 backdrop-blur-sm text-gray-700 rounded shadow-sm">
                          {img.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
