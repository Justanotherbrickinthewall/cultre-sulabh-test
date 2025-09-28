"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { CameraCapture } from '@/components/camera/CameraCapture';
import { ImageCropper } from '@/components/image-crop/ImageCropper';
import { validateEmail } from '@/lib/utils';

interface FormData {
  creator_name: string;
  creator_email: string;
  category: 'men' | 'women' | '';
}

interface UploadState {
  step: 'form' | 'camera' | 'crop' | 'upload' | 'success';
  capturedImage: string | null;
  croppedImage: Blob | null;
  loading: boolean;
  error: string | null;
}

export default function UploadPage() {
  const [formData, setFormData] = useState<FormData>({
    creator_name: '',
    creator_email: '',
    category: '',
  });

  const [uploadState, setUploadState] = useState<UploadState>({
    step: 'form',
    capturedImage: null,
    croppedImage: null,
    loading: false,
    error: null,
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.creator_name.trim()) {
      setUploadState(prev => ({ ...prev, error: 'Name is required' }));
      return;
    }
    
    if (!validateEmail(formData.creator_email)) {
      setUploadState(prev => ({ ...prev, error: 'Valid email is required' }));
      return;
    }
    
    if (!formData.category) {
      setUploadState(prev => ({ ...prev, error: 'Category is required' }));
      return;
    }

    setUploadState(prev => ({ ...prev, step: 'camera', error: null }));
  };

  const handleImageCapture = (imageDataUrl: string) => {
    setUploadState(prev => ({
      ...prev,
      step: 'crop',
      capturedImage: imageDataUrl,
    }));
  };

  const handleImageCrop = (croppedBlob: Blob) => {
    setUploadState(prev => ({
      ...prev,
      croppedImage: croppedBlob,
      step: 'upload',
    }));
  };

  const handleUpload = async () => {
    if (!uploadState.croppedImage) return;

    setUploadState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const formDataToUpload = new FormData();
      formDataToUpload.append('image', uploadState.croppedImage, 'design.jpg');
      formDataToUpload.append('creator_name', formData.creator_name);
      formDataToUpload.append('creator_email', formData.creator_email);
      formDataToUpload.append('category', formData.category);

      const response = await fetch('/api/images', {
        method: 'POST',
        body: formDataToUpload,
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Upload failed');
      }

      setUploadState(prev => ({ ...prev, step: 'success', loading: false }));
    } catch (error) {
      setUploadState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      }));
    }
  };

  const resetUpload = () => {
    setFormData({ creator_name: '', creator_email: '', category: '' });
    setUploadState({
      step: 'form',
      capturedImage: null,
      croppedImage: null,
      loading: false,
      error: null,
    });
  };

  const renderStep = () => {
    switch (uploadState.step) {
      case 'form':
        return (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Share Your Design
              </CardTitle>
              <p className="text-gray-600">
                Tell us about yourself and your creative category
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.creator_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, creator_name: e.target.value }))}
                    placeholder="Enter your name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.creator_email}
                    onChange={(e) => setFormData(prev => ({ ...prev, creator_email: e.target.value }))}
                    placeholder="Enter your email"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Design Category</Label>
                  <div className="flex gap-2 mt-2">
                    <Button
                      type="button"
                      variant={formData.category === 'men' ? 'default' : 'outline'}
                      onClick={() => setFormData(prev => ({ ...prev, category: 'men' }))}
                      className="flex-1"
                    >
                      Men's Design
                    </Button>
                    <Button
                      type="button"
                      variant={formData.category === 'women' ? 'default' : 'outline'}
                      onClick={() => setFormData(prev => ({ ...prev, category: 'women' }))}
                      className="flex-1"
                    >
                      Women's Design
                    </Button>
                  </div>
                </div>

                {uploadState.error && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {uploadState.error}
                  </div>
                )}

                <Button type="submit" className="w-full">
                  <Camera className="w-4 h-4 mr-2" />
                  Take Photo
                </Button>
              </form>
            </CardContent>
          </Card>
        );

      case 'camera':
        return (
          <CameraCapture
            onCapture={handleImageCapture}
            onBack={() => setUploadState(prev => ({ ...prev, step: 'form' }))}
          />
        );

      case 'crop':
        return (
          <ImageCropper
            image={uploadState.capturedImage!}
            onCrop={handleImageCrop}
            onBack={() => setUploadState(prev => ({ ...prev, step: 'camera' }))}
          />
        );

      case 'upload':
        return (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Ready to Upload
              </CardTitle>
              <p className="text-gray-600">
                Review your design and submit to the collection
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p><strong>Name:</strong> {formData.creator_name}</p>
                <p><strong>Email:</strong> {formData.creator_email}</p>
                <p><strong>Category:</strong> <Badge variant="secondary">{formData.category}</Badge></p>
              </div>

              {uploadState.croppedImage && (
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    src={URL.createObjectURL(uploadState.croppedImage)} 
                    alt="Cropped design"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {uploadState.error && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {uploadState.error}
                </div>
              )}

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setUploadState(prev => ({ ...prev, step: 'crop' }))}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleUpload}
                  disabled={uploadState.loading}
                  className="flex-1"
                >
                  {uploadState.loading ? (
                    'Uploading...'
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Design
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 'success':
        return (
          <Card className="w-full max-w-md mx-auto">
            <CardContent className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Upload Successful!
              </h2>
              <p className="text-gray-600 mb-6">
                Thank you for sharing your design. It will be reviewed by our team 
                and may appear in the museum slideshow.
              </p>
              <Button onClick={resetUpload} className="w-full">
                Upload Another Design
              </Button>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Upload Your Design
          </h1>
          <p className="text-gray-600">
            Share your creativity with the museum community
          </p>
        </div>

        {renderStep()}
      </div>
    </div>
  );
}
