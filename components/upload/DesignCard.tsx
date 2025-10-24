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

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif'];

function validateFile(file: File): string | null {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return 'Please select a valid image file (JPEG, PNG, WebP, GIF, or HEIC)';
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'File size must be less than 25MB';
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
      className={`shadow-lg hover:shadow-xl transition-all duration-300 border-2 rounded-none ${
        category === 'men' ? 'border-navyblue/30' : 
        category === 'women' ? 'border-fuchsia/30' : 
        'border-amber/30'
      }`}
    >
      <CardHeader 
        className={`${
          category === 'men' ? 'bg-navyblue/5' :
          category === 'women' ? 'bg-fuchsia/5' :
          'bg-amber/5'
        }`}
      >
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="flex items-center justify-center">
            <span className="text-3xl">{emoji}</span>
          </div>
          <div className="flex-1">
            {title}
            {category === 'others' && mainDesign?.custom_category_name && (
              <span className="text-gray-400 ml-2">({mainDesign.custom_category_name})</span>
            )}
          </div>
          {isRequired ? (
            <Badge 
              variant="default" 
              className={`px-3 rounded-none ${
                category === 'men' ? 'bg-navyblue/80' :
                category === 'women' ? 'bg-fuchsia/80' :
                'bg-amber/80'
              }`}
            >
              Required
            </Badge>
          ) : (
            <Badge variant="secondary" className="px-3 bg-amber/20 text-navyblue rounded-none">Optional</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 pb-4">
        {mainDesign ? (
          <div className="space-y-3">
            <div className="flex justify-center">
              <img 
                src={URL.createObjectURL(mainDesign.imageBlob)} 
                alt={`${title} design`}
                className="w-32 h-32 object-cover shadow-md rounded-none"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={onCapture}
                size="sm"
                className="flex-1 rounded-none"
              >
                <Camera className="w-4 h-4 mr-1" />
                Retake
              </Button>
              <Button 
                variant="outline" 
                onClick={() => onRemove(designs.findIndex(d => d === mainDesign))}
                size="sm"
                className="rounded-none px-3"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button 
              onClick={onCapture}
              className={`flex-1 h-12 text-white font-semibold shadow-md rounded-none ${
                category === 'men' ? 'bg-navyblue/80 hover:bg-navyblue/70' :
                category === 'women' ? 'bg-fuchsia/80 hover:bg-fuchsia/70' :
                'bg-amber/80 hover:bg-amber/70'
              }`}
            >
              <Camera className="w-5 h-5 md:w-4 md:h-4 md:mr-2" />
              <span className="hidden md:inline">Take Photo</span>
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
              className="flex-1 h-12 border-2 font-semibold rounded-none"
            >
              <Upload className="w-5 h-5 md:w-4 md:h-4 md:mr-2" />
              <span className="hidden md:inline">Upload</span>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}