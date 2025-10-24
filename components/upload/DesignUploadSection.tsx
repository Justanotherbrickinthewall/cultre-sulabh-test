"use client";

import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft, ArrowRight, Camera } from 'lucide-react';
import { DesignCard } from './DesignCard';
import { DesignUpload } from '@/types/upload';

interface DesignUploadSectionProps {
  designs: DesignUpload[];
  onStartCapture: (category: 'men' | 'women' | 'others') => void;
  onGalleryUpload: (category: 'men' | 'women' | 'others', file: File) => void;
  onRemoveDesign: (index: number) => void;
  onBack: () => void;
  onPreview: () => void;
  error: string | null;
}

export function DesignUploadSection({
  designs,
  onStartCapture,
  onGalleryUpload,
  onRemoveDesign,
  onBack,
  onPreview,
  error
}: DesignUploadSectionProps) {
  const canProceedToPreview = () => {
    const hasMenDesign = designs.some(d => d.category === 'men');
    const hasWomenDesign = designs.some(d => d.category === 'women');
    return hasMenDesign && hasWomenDesign;
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4 mx-auto">
          <Camera className="w-16 h-16 text-amber" />
        </div>
        <h2 className="text-3xl font-bold text-navyblue mb-2">
          Capture Your Designs
        </h2>
        <p className="text-gray-400">
          Take photos of your designs. Men&apos;s and Women&apos;s designs are required. ✨
        </p>
      </div>

      <DesignCard
        title="Men's Design"
        emoji="👔"
        category="men"
        isRequired
        designs={designs}
        onCapture={() => onStartCapture('men')}
        onGalleryUpload={(file) => onGalleryUpload('men', file)}
        onRemove={onRemoveDesign}
      />

      <DesignCard
        title="Women's Design"
        emoji="👗"
        category="women"
        isRequired
        designs={designs}
        onCapture={() => onStartCapture('women')}
        onGalleryUpload={(file) => onGalleryUpload('women', file)}
        onRemove={onRemoveDesign}
      />

      <DesignCard
        title="Other Designs"
        emoji="🎨"
        category="others"
        designs={designs}
        onCapture={() => onStartCapture('others')}
        onGalleryUpload={(file) => onGalleryUpload('others', file)}
        onRemove={onRemoveDesign}
      />

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-4 border-2 border-red-100 rounded-none">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="flex gap-4 pt-4">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex-1 h-12 border-2 rounded-none"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
        <Button 
          onClick={onPreview}
          disabled={!canProceedToPreview()}
          className="flex-1 h-12 bg-amber hover:bg-amber/90 text-white font-semibold shadow-lg rounded-none"
        >
          Preview & Upload
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}