"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, X, Plus } from 'lucide-react';
import { DesignUpload } from '@/types/upload';

interface DesignCardProps {
  title: string;
  emoji: string;
  category: 'men' | 'women' | 'others';
  isRequired?: boolean;
  designs: DesignUpload[];
  onCapture: () => void;
  onRemove: (index: number) => void;
  // Removed gradientColors as we're using category directly for styling
}

export function DesignCard({
  title,
  emoji,
  category,
  isRequired = false,
  designs,
  onCapture,
  onRemove,
  // gradientColors removed
}: DesignCardProps) {
  const categoryDesigns = designs.filter(d => d.category === category);
  const mainDesign = category !== 'others' ? categoryDesigns[0] : undefined;

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
          <div className="flex-1">{title}</div>
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
        {category !== 'others' ? (
          // Men's and Women's designs
          mainDesign ? (
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
          )
        ) : (
          // Other designs section
          <div className="space-y-4">
            {categoryDesigns.map((design, index) => (
              <div key={index} className="flex items-center gap-4 p-4 border-2 border-purple-100 rounded-2xl bg-purple-50/30">
                <div className="flex-1">
                  <p className="font-semibold text-purple-900 mb-2">{design.custom_category_name}</p>
                  <img 
                    src={URL.createObjectURL(design.imageBlob)} 
                    alt={design.custom_category_name}
                    className="w-28 h-28 object-cover rounded-xl shadow-sm"
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
                    onClick={() => onRemove(designs.findIndex(d => d === design))}
                    size="sm"
                    className="rounded-xl"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            <Button 
              onClick={onCapture}
              variant="outline"
              className="w-full h-12 border-2 border-purple-200 hover:bg-purple-50 text-purple-700 rounded-xl font-semibold"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Another Design
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}