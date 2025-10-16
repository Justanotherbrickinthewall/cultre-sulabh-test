"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, ArrowLeft, Upload } from 'lucide-react';
import { DesignUpload } from '@/types/upload';

interface PreviewSectionProps {
  designs: DesignUpload[];
  loading: boolean;
  error: string | null;
  onBack: () => void;
  onUpload: () => void;
}

export function PreviewSection({
  designs,
  loading,
  error,
  onBack,
  onUpload
}: PreviewSectionProps) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mb-4 mx-auto">
          <span className="text-3xl">👀</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Preview Your Designs
        </h2>
        <p className="text-gray-600">
          Review your designs before uploading. We&apos;ll process them to enhance quality. ✨
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {designs.map((design, index) => (
          <Card key={index} className="rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-gray-100">
            <CardContent className="p-0">
              <div className="space-y-0">
                <img 
                  src={URL.createObjectURL(design.imageBlob)} 
                  alt={`Design ${index + 1}`}
                  className="w-full h-56 object-cover"
                />
                <div className="p-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={design.isRequired ? "default" : "secondary"} className="rounded-full capitalize">
                      {design.category === 'others' ? design.custom_category_name : design.category}
                    </Badge>
                    {design.isRequired && <Badge variant="destructive" className="rounded-full">Required</Badge>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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
          Go Back
        </Button>
        <Button 
          onClick={onUpload}
          disabled={loading}
          className="flex-1 h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg"
        >
          {loading ? (
            'Processing & Uploading...'
          ) : (
            <>
              Upload All Designs
              <Upload className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
