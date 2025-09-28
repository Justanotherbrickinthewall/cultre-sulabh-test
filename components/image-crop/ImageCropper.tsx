"use client";

import { useState, useRef } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Crop as CropIcon } from 'lucide-react';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageCropperProps {
  image: string;
  onCrop: (croppedBlob: Blob) => void;
  onBack: () => void;
}

export function ImageCropper({ image, onCrop, onBack }: ImageCropperProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 80,
    height: 80,
    x: 10,
    y: 10,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

  const getCroppedImg = async (): Promise<Blob | null> => {
    if (!completedCrop || !imgRef.current) {
      return null;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return null;
    }

    const image = imgRef.current;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg', 0.9);
    });
  };

  const handleCropComplete = async () => {
    const croppedBlob = await getCroppedImg();
    if (croppedBlob) {
      onCrop(croppedBlob);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gray-900">
          Crop Your Design
        </CardTitle>
        <p className="text-gray-600">
          Adjust the selection to frame your drawing perfectly
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gray-100 rounded-lg overflow-hidden">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={1} // Square aspect ratio
            minWidth={100}
            minHeight={100}
          >
            <img
              ref={imgRef}
              src={image}
              alt="Image to crop"
              className="max-w-full h-auto"
              style={{ maxHeight: '60vh' }}
            />
          </ReactCrop>
        </div>

        <div className="text-sm text-gray-600 text-center">
          <p>Drag the corners to adjust the crop area</p>
          <p>Your design will be cropped to a square format</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack} className="flex-1">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retake Photo
          </Button>
          <Button onClick={handleCropComplete} className="flex-1">
            <CropIcon className="w-4 h-4 mr-2" />
            Crop & Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
