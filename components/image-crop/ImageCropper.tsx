"use client";

import { useState, useRef } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import { Check, ArrowLeft } from 'lucide-react';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageCropperProps {
  image: string;
  onCrop: (croppedBlob: Blob) => void;
  onBack: () => void;
}

export function ImageCropper({ image, onCrop, onBack }: ImageCropperProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize crop as a square based on image dimensions
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    // Use the smaller dimension to create a perfect square that fits
    const size = Math.min(width, height);
    const x = (width - size) / 2;
    const y = (height - size) / 2;
    
    const newCrop: Crop = {
      unit: 'px',
      width: size,
      height: size,
      x: x,
      y: y,
    };
    setCrop(newCrop);
    setCompletedCrop({
      unit: 'px',
      width: size,
      height: size,
      x: x,
      y: y,
    });
  };

  const getCroppedImg = async (): Promise<Blob | null> => {
    if (!completedCrop) {
      console.error('No crop defined');
      return null;
    }

    if (!imgRef.current) {
      console.error('Missing image ref');
      return null;
    }

    const currentCrop = completedCrop;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Could not get canvas context');
      return null;
    }

    const image = imgRef.current;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = currentCrop.width * scaleX;
    canvas.height = currentCrop.height * scaleY;

    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      currentCrop.x * scaleX,
      currentCrop.y * scaleY,
      currentCrop.width * scaleX,
      currentCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Canvas to Blob conversion failed'));
          }
        },
        'image/jpeg',
        0.95
      );
    });
  };

  const handleCropComplete = async () => {
    try {
      setIsProcessing(true);
      setError(null);
      
      if (!completedCrop) {
        setError('Please adjust the crop area');
        setIsProcessing(false);
        return;
      }
      
      const croppedBlob = await getCroppedImg();
      
      if (!croppedBlob) {
        setError('Failed to crop image');
        return;
      }

      onCrop(croppedBlob);
    } catch (err) {
      console.error('Crop error:', err);
      setError('Failed to process crop');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black">
      {/* Main Image Area */}
      <div className="relative w-full h-full">
        <div className="absolute inset-0 flex items-center justify-center">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={1}
            className="max-h-[100dvh] touch-none"
            style={{
              // Override ReactCrop styles for better mobile handling
              maxWidth: '100%',
              maxHeight: '100%',
            }}
          >
            <img
              ref={imgRef}
              src={image}
              alt="Image to crop"
              onLoad={onImageLoad}
              className="max-h-[100dvh] w-auto"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
              }}
            />
          </ReactCrop>
        </div>

        {/* Processing Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-lg font-semibold">Processing...</p>
            </div>
          </div>
        )}

        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute top-8 left-8 text-white bg-black/30 hover:bg-black/50 rounded-full p-4 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        {/* Complete Button */}
        <div className="absolute bottom-12 left-0 right-0 flex justify-center">
          <button
            onClick={handleCropComplete}
            disabled={isProcessing}
            className="w-20 h-20 rounded-full bg-white border-4 border-white/80 shadow-lg 
                     transform transition-transform active:scale-95 hover:scale-105
                     disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center"
            aria-label="Complete crop"
          >
            <Check className="w-10 h-10 text-green-600" />
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-full">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}