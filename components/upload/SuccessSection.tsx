"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Home } from 'lucide-react';
import Link from 'next/link';

interface SuccessSectionProps {
  designCount: number;
  onReset: () => void;
}

export function SuccessSection({ designCount, onReset }: SuccessSectionProps) {
  return (
    <Card className="w-full max-w-md mx-auto shadow-2xl rounded-none">
      <CardContent className="text-center py-12 px-8">
        <div className="flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-20 h-20 text-amber" />
        </div>
        <h2 className="text-3xl font-bold text-navyblue mb-4">
          Upload Successful! 🎉
        </h2>
        <p className="text-gray-400 mb-8 text-lg">
          Thank you for sharing {designCount} amazing design{designCount > 1 ? 's' : ''}! 
          They will be reviewed by our team and may appear in the museum slideshow.
        </p>
        <div className="space-y-3">
          <Button 
            onClick={onReset} 
            className="w-full h-12 bg-amber hover:bg-amber/90 text-white font-semibold shadow-lg rounded-none"
          >
            Upload More Designs
          </Button>
          <Link href="/" className="block">
            <Button 
              variant="outline"
              className="w-full h-12 border-2 font-semibold rounded-none"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Home
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
