"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, X, Plus, Upload } from 'lucide-react';
import * as React from 'react';
import { DesignUpload } from '@/types/upload';

interface DesignCardProps {
  title: string;
  emoji: string;
  category: 'men' | 'women' | 'others';
  isRequired?: boolean;
  designs: DesignUpload[];
  onCapture: () => void;
  onGalleryUpload: (file: File) => void;
  onRemove: (index: number) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function validateFile(file: File): string | null {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return 'Please select a valid image file (JPEG, PNG, or WebP)';
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'File size must be less than 5MB';
  }
  return null;
}

export function DesignCard({
  title,
  emoji,
  category,
  isRequired = false,
  designs,
  onCapture,
  onGalleryUpload,
  onRemove,
}: DesignCardProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const categoryDesigns = designs.filter(d => d.category === category);
  const mainDesign = categoryDesigns[0];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      alert(error);
      return;
    }

    onGalleryUpload(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card 
      className={`rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 ${
        category === 'men' ? 'border-blue-100' : 
        category === 'women' ? 'border-pink-100' : 
        'border-purple-100'
      }`}
    >
      <CardHeader 
        className={`bg-gradient-to-r rounded-t-3xl ${
          category === 'men' ? 'from-blue-50 to-blue-50' :
          category === 'women' ? 'from-pink-50 to-pink-50' :
          'from-purple-50 to-purple-50'
        }`}
      >
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            category === 'men' ? 'bg-blue-500' :
            category === 'women' ? 'bg-pink-500' :
            'bg-purple-500'
          }`}>
            <span className="text-white font-bold">{emoji}</span>
          </div>
          <div className="flex-1">
            {title}
            {category === 'others' && mainDesign?.custom_category_name && (
              <span className="text-gray-600 ml-2">({mainDesign.custom_category_name})</span>
            )}
          </div>
          {isRequired ? (
            <Badge 
              variant="default" 
              className={`rounded-full px-3 ${
                category === 'men' ? 'bg-blue-500' :
                category === 'women' ? 'bg-pink-500' :
                'bg-purple-500'
              }`}
            >
              Required
            </Badge>
          ) : (
            <Badge variant="secondary" className="rounded-full px-3">Optional</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {mainDesign ? (
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <img 
                src={URL.createObjectURL(mainDesign.imageBlob)} 
                alt={`${title} design`}
                className="w-40 h-40 object-cover rounded-2xl shadow-md"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={onCapture}
                size="sm"
                className="rounded-xl"
              >
                <Camera className="w-4 h-4 mr-2" />
                Retake
              </Button>
              <Button 
                variant="outline" 
                onClick={() => onRemove(designs.findIndex(d => d === mainDesign))}
                size="sm"
                className="rounded-xl"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <Button 
              onClick={onCapture}
              className={`w-full h-14 text-white rounded-xl font-semibold ${
                category === 'men' ? 'bg-blue-500 hover:bg-blue-600' :
                category === 'women' ? 'bg-pink-500 hover:bg-pink-600' :
                'bg-purple-500 hover:bg-purple-600'
              }`}
            >
              <Camera className="w-5 h-5 mr-2" />
              Take Photo - {title}
            </Button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept={ALLOWED_FILE_TYPES.join(',')}
              className="hidden"
            />

            <Button 
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-14 border-2 rounded-xl font-semibold"
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload from Gallery
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}