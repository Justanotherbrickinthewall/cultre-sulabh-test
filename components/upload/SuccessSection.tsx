"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

interface SuccessSectionProps {
  designCount: number;
  onReset: () => void;
}

export function SuccessSection({ designCount, onReset }: SuccessSectionProps) {
  return (
    <Card className="w-full max-w-md mx-auto rounded-3xl shadow-2xl">
      <CardContent className="text-center py-12 px-8">
        <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-14 h-14 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Upload Successful! 🎉
        </h2>
        <p className="text-gray-600 mb-8 text-lg">
          Thank you for sharing {designCount} amazing design{designCount > 1 ? 's' : ''}! 
          They will be reviewed by our team and may appear in the museum slideshow.
        </p>
        <Button 
          onClick={onReset} 
          className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold shadow-lg"
        >
          Upload More Designs
        </Button>
      </CardContent>
    </Card>
  );
}
