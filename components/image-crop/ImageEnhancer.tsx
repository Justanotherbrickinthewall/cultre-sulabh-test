"use client";

import React, { useState, useEffect } from 'react';
import { Check, ArrowLeft, Sparkles, Sun, Eraser, Maximize } from 'lucide-react';
import { removeBackground, increaseContrast, sharpenImage, autoAdjust } from '@/lib/image-processing';

interface ImageEnhancerProps {
  image: Blob;
  onComplete: (enhancedBlob: Blob) => void;
  onBack: () => void;
}

interface Enhancement {
  id: string;
  name: string;
  icon: React.ReactNode;
  process: (blob: Blob) => Promise<Blob>;
  position: 'left' | 'right';
}

export function ImageEnhancer({ image, onComplete, onBack }: ImageEnhancerProps) {
  const [currentImage, setCurrentImage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeEnhancements, setActiveEnhancements] = useState<Set<string>>(new Set());

  const enhancements: Enhancement[] = [
    {
      id: 'background',
      name: 'Remove Background',
      icon: <Eraser className="w-6 h-6" />,
      process: removeBackground,
      position: 'left'
    },
    {
      id: 'contrast',
      name: 'Brighten',
      icon: <Sun className="w-6 h-6" />,
      process: (blob) => increaseContrast(blob, 1.3),
      position: 'left'
    },
    {
      id: 'sharpen',
      name: 'Enhance Details',
      icon: <Maximize className="w-6 h-6" />,
      process: (blob) => sharpenImage(blob, 0.5),
      position: 'right'
    },
    {
      id: 'auto',
      name: 'Magic Fix',
      icon: <Sparkles className="w-6 h-6" />,
      process: autoAdjust,
      position: 'right'
    }
  ];

  useEffect(() => {
    const url = URL.createObjectURL(image);
    setCurrentImage(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  const toggleEnhancement = async (enhancementId: string) => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);
      setError(null);

      const newActiveEnhancements = new Set(activeEnhancements);
      if (newActiveEnhancements.has(enhancementId)) {
        newActiveEnhancements.delete(enhancementId);
      } else {
        newActiveEnhancements.add(enhancementId);
      }
      setActiveEnhancements(newActiveEnhancements);

      let processedBlob = image;
      
      for (const enhancement of enhancements) {
        if (newActiveEnhancements.has(enhancement.id)) {
          processedBlob = await enhancement.process(processedBlob);
        }
      }

      URL.revokeObjectURL(currentImage);
      const newUrl = URL.createObjectURL(processedBlob);
      setCurrentImage(newUrl);

    } catch (err) {
      console.error('Enhancement error:', err);
      setError('Failed to apply enhancement');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleComplete = async () => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);
      setError(null);

      let finalImage = image;
      for (const enhancement of enhancements) {
        if (activeEnhancements.has(enhancement.id)) {
          finalImage = await enhancement.process(finalImage);
        }
      }

      onComplete(finalImage);
    } catch (err) {
      console.error('Final processing error:', err);
      setError('Failed to process image');
    }
  };

  return (
    <div className="fixed inset-0 bg-black">
      {/* Main Image Display */}
      <div className="relative w-full h-full">
        <img
          src={currentImage}
          alt="Image being enhanced"
          className="w-full h-full object-contain"
        />

        {/* Processing Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="text-white text-center">
              <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-lg font-semibold">Processing...</p>
            </div>
          </div>
        )}

        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute top-8 left-8 text-white bg-black/30 hover:bg-black/50 rounded-full p-4 transition-colors z-20"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        {/* Enhancement Controls Container */}
        <div className="absolute inset-x-0 bottom-0 h-40 flex items-end justify-between px-8 pb-12">
          {/* Left Side Enhancements */}
          <div className="flex flex-col gap-4 z-20">
            {enhancements
              .filter(e => e.position === 'left')
              .map(enhancement => (
                <button
                  key={enhancement.id}
                  onClick={() => toggleEnhancement(enhancement.id)}
                  disabled={isProcessing}
                  className={`group relative p-4 rounded-full transition-all ${
                    activeEnhancements.has(enhancement.id)
                      ? 'bg-white text-black'
                      : 'bg-black/30 text-white hover:bg-black/50'
                  }`}
                >
                  {enhancement.icon}
                  <span className="absolute left-full ml-2 px-2 py-1 bg-black/70 text-white text-sm rounded-md
                                 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {enhancement.name}
                  </span>
                </button>
              ))}
          </div>

          {/* Center Complete Button */}
          <button
            onClick={handleComplete}
            disabled={isProcessing}
            className="absolute left-1/2 -translate-x-1/2 bottom-0 w-20 h-20 
                     rounded-full bg-white border-4 border-white/80 shadow-lg 
                     transform transition-transform active:scale-95 hover:scale-105
                     disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center z-20"
            aria-label="Complete enhancement"
          >
            <Check className="w-10 h-10 text-green-600" />
          </button>

          {/* Right Side Enhancements */}
          <div className="flex flex-col gap-4 z-20">
            {enhancements
              .filter(e => e.position === 'right')
              .map(enhancement => (
                <button
                  key={enhancement.id}
                  onClick={() => toggleEnhancement(enhancement.id)}
                  disabled={isProcessing}
                  className={`group relative p-4 rounded-full transition-all ${
                    activeEnhancements.has(enhancement.id)
                      ? 'bg-white text-black'
                      : 'bg-black/30 text-white hover:bg-black/50'
                  }`}
                >
                  {enhancement.icon}
                  <span className="absolute right-full mr-2 px-2 py-1 bg-black/70 text-white text-sm rounded-md
                                 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {enhancement.name}
                  </span>
                </button>
              ))}
          </div>
        </div>

        {/* Background Gradient - Now behind the controls */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 to-transparent pointer-events-none z-10" />

        {/* Error Display */}
        {error && (
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-full z-50">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}