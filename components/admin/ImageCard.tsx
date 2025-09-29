"use client";

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ConfirmationDialog } from './ConfirmationDialog';
import { Image } from '@/types';
import { formatDate } from '@/lib/utils';
import { Calendar, CheckCircle, Clock, Eye } from 'lucide-react';

interface ImageCardProps {
  image: Image;
  onStatusToggle: (id: string, newStatus: 'selected' | 'not_selected') => void;
  isSelected: boolean;
  onSelect: () => void;
  viewMode: 'grid' | 'list';
}

export function ImageCard({ 
  image, 
  onStatusToggle, 
  isSelected, 
  onSelect, 
  viewMode 
}: ImageCardProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<'selected' | 'not_selected' | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleStatusChange = () => {
    const newStatus = image.status === 'selected' ? 'not_selected' : 'selected';
    setPendingStatus(newStatus);
    setShowConfirmation(true);
  };

  const confirmStatusChange = () => {
    if (pendingStatus) {
      onStatusToggle(image.id, pendingStatus);
    }
    setShowConfirmation(false);
    setPendingStatus(null);
  };

  const cancelStatusChange = () => {
    setShowConfirmation(false);
    setPendingStatus(null);
  };

  if (viewMode === 'list') {
    return (
      <>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Checkbox
                checked={isSelected}
                onCheckedChange={onSelect}
                className="mt-1"
              />
              
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                  src={image.image_url}
                  alt={`Design by ${image.creator_name}`}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => setShowPreview(true)}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-gray-900 truncate">
                    {image.creator_name}
                  </h3>
                  <Badge variant={image.category === 'men' ? 'default' : 'secondary'}>
                    {image.category}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 truncate">{image.creator_email}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(image.created_at)}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Badge 
                  variant={image.status === 'selected' ? 'default' : 'outline'}
                  className={image.status === 'selected' ? 'bg-green-500' : ''}
                >
                  {image.status === 'selected' ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Selected
                    </>
                  ) : (
                    <>
                      <Clock className="w-3 h-3 mr-1" />
                      Pending
                    </>
                  )}
                </Badge>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleStatusChange}
                >
                  {image.status === 'selected' ? 'Remove' : 'Select'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Image Preview Modal */}
        {showPreview && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={() => setShowPreview(false)}
          >
            <div className="max-w-4xl max-h-full">
              <img
                src={image.image_url}
                alt={`Design by ${image.creator_name}`}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
        )}

        <ConfirmationDialog
          open={showConfirmation}
          onConfirm={confirmStatusChange}
          onCancel={cancelStatusChange}
          title={pendingStatus === 'selected' ? 'Add to Slideshow' : 'Remove from Slideshow'}
          description={
            pendingStatus === 'selected'
              ? `Do you want to add "${image.creator_name}'s" design to the slideshow?`
              : `Do you want to remove "${image.creator_name}'s" design from the slideshow?`
          }
        />
      </>
    );
  }

  // Grid view
  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-200 relative">
        <div className="absolute top-2 left-2 z-10">
          <Checkbox
            checked={isSelected}
            onCheckedChange={onSelect}
            className="bg-white border-2 shadow-sm"
          />
        </div>

        <div className="absolute top-2 right-2 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPreview(true)}
            className="bg-white/80 hover:bg-white shadow-sm"
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>

        <CardContent className="p-0">
          <div className="aspect-square bg-gray-100 overflow-hidden">
            <img
              src={image.image_url}
              alt={`Design by ${image.creator_name}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </div>
          
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-900 truncate">
                {image.creator_name}
              </h3>
              <Badge variant={image.category === 'men' ? 'default' : 'secondary'}>
                {image.category}
              </Badge>
            </div>
            
            <p className="text-sm text-gray-600 truncate mb-2">
              {image.creator_email}
            </p>
            
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
              <Calendar className="w-3 h-3" />
              {formatDate(image.created_at)}
            </div>

            <div className="flex items-center justify-between">
              <Badge 
                variant={image.status === 'selected' ? 'default' : 'outline'}
                className={image.status === 'selected' ? 'bg-green-500' : ''}
              >
                {image.status === 'selected' ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Selected
                  </>
                ) : (
                  <>
                    <Clock className="w-3 h-3 mr-1" />
                    Pending
                  </>
                )}
              </Badge>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleStatusChange}
              >
                {image.status === 'selected' ? 'Remove' : 'Select'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Image Preview Modal */}
      {showPreview && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setShowPreview(false)}
        >
          <div className="max-w-4xl max-h-full">
            <img
              src={image.image_url}
              alt={`Design by ${image.creator_name}`}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}

      <ConfirmationDialog
        open={showConfirmation}
        onConfirm={confirmStatusChange}
        onCancel={cancelStatusChange}
        title={pendingStatus === 'selected' ? 'Add to Slideshow' : 'Remove from Slideshow'}
        description={
          pendingStatus === 'selected'
            ? `Do you want to add "${image.creator_name}'s" design to the slideshow?`
            : `Do you want to remove "${image.creator_name}'s" design from the slideshow?`
        }
      />
    </>
  );
}
