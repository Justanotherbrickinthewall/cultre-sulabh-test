"use client";

import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft, ArrowRight, Camera } from 'lucide-react';
import { DesignCard } from './DesignCard';
import { DesignUpload } from '@/types/upload';

interface DesignUploadSectionProps {
  designs: DesignUpload[];
  onStartCapture: (category: 'men' | 'women' | 'others') => void;
  onRemoveDesign: (index: number) => void;
  onBack: () => void;
  onPreview: () => void;
  error: string | null;
}

export function DesignUploadSection({
  designs,
  onStartCapture,
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
        <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-cyan-100 rounded-2xl flex items-center justify-center mb-4 mx-auto">
          <Camera className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Capture Your Designs
        </h2>
        <p className="text-gray-600">
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
        onRemove={onRemoveDesign}
        gradientColors={{ from: 'blue', to: 'cyan' }}
      />

      <DesignCard
        title="Women's Design"
        emoji="👗"
        category="women"
        isRequired
        designs={designs}
        onCapture={() => onStartCapture('women')}
        onRemove={onRemoveDesign}
        gradientColors={{ from: 'pink', to: 'purple' }}
      />

      <DesignCard
        title="Other Designs"
        emoji="🎨"
        category="others"
        designs={designs}
        onCapture={() => onStartCapture('others')}
        onRemove={onRemoveDesign}
        gradientColors={{ from: 'purple', to: 'indigo' }}
      />

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-4 rounded-2xl border-2 border-red-100">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="flex gap-4 pt-4">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex-1 h-12 rounded-xl border-2"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
        <Button 
          onClick={onPreview}
          disabled={!canProceedToPreview()}
          className="flex-1 h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold shadow-lg"
        >
          Preview & Upload
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}