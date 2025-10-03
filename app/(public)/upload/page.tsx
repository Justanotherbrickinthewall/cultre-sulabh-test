"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, Upload, CheckCircle, AlertCircle, ArrowLeft, ArrowRight, Plus, X } from 'lucide-react';
import { CameraCapture } from '@/components/camera/CameraCapture';
import { ImageCropper } from '@/components/image-crop/ImageCropper';
import { validateEmail } from '@/lib/utils';
import { UserDetails, DesignUpload } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface UploadState {
  step: 'user-details' | 'upload-designs' | 'preview' | 'success';
  userDetails: UserDetails;
  designs: DesignUpload[];
  currentDesignCategory: 'men' | 'women' | 'others' | null;
  currentDesignIndex: number;
  capturedImageData: string | null;
  loading: boolean;
  error: string | null;
}

export default function UploadPage() {
  const [uploadState, setUploadState] = useState<UploadState>({
    step: 'user-details',
    userDetails: { name: '', email: '', phone: '' },
    designs: [],
    currentDesignCategory: null,
    currentDesignIndex: -1,
    capturedImageData: null,
    loading: false,
    error: null,
  });

  const handleUserDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadState.userDetails.name.trim()) {
      setUploadState(prev => ({ ...prev, error: 'Name is required' }));
      return;
    }
    
    if (uploadState.userDetails.email && !validateEmail(uploadState.userDetails.email)) {
      setUploadState(prev => ({ ...prev, error: 'Please enter a valid email address' }));
      return;
    }

    setUploadState(prev => ({ ...prev, step: 'upload-designs', error: null }));
  };

  const startDesignCapture = (category: 'men' | 'women' | 'others', customName?: string) => {
    setUploadState(prev => ({
      ...prev,
      currentDesignCategory: category,
      currentDesignIndex: prev.designs.length,
      error: null,
    }));
  };

  const handleImageCapture = (imageDataUrl: string) => {
    // Move to crop view with the captured image
    setUploadState(prev => ({
      ...prev,
      capturedImageData: imageDataUrl,
      error: null, // Clear any previous errors
    }));
  };

  const handleImageCrop = (croppedBlob: Blob) => {
    if (!uploadState.currentDesignCategory) {
      console.error('No design category selected');
      return;
    }

    try {
      let custom_category_name: string | undefined;
      if (uploadState.currentDesignCategory === 'others') {
        custom_category_name = prompt('Please name this design category:');
        if (!custom_category_name) {
          custom_category_name = 'Custom Design';
        }
      }

      const newDesign: DesignUpload = {
        category: uploadState.currentDesignCategory,
        custom_category_name,
        imageBlob: croppedBlob,
        isRequired: uploadState.currentDesignCategory === 'men' || uploadState.currentDesignCategory === 'women',
      };

      // First add the new design
      setUploadState(prev => ({
        ...prev,
        designs: [...prev.designs, newDesign],
      }));

      // Then clear the capture state in a separate update
      setUploadState(prev => ({
        ...prev,
        currentDesignCategory: null,
        currentDesignIndex: -1,
        capturedImageData: null,
      }));
    } catch (error) {
      console.error('Error in crop handler:', error);
      setUploadState(prev => ({
        ...prev,
        error: 'Failed to process cropped image. Please try again.',
      }));
    }
  };

  const removeDesign = (index: number) => {
    setUploadState(prev => ({
      ...prev,
      designs: prev.designs.filter((_, i) => i !== index),
    }));
  };

  const canProceedToPreview = () => {
    const hasMenDesign = uploadState.designs.some(d => d.category === 'men');
    const hasWomenDesign = uploadState.designs.some(d => d.category === 'women');
    return hasMenDesign && hasWomenDesign;
  };

  const handlePreview = () => {
    if (!canProceedToPreview()) {
      setUploadState(prev => ({ 
        ...prev, 
        error: 'Please upload at least one Men\'s design and one Women\'s design' 
      }));
      return;
    }
    setUploadState(prev => ({ ...prev, step: 'preview', error: null }));
  };

  const handleUpload = async () => {
    setUploadState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const collectionId = uuidv4();
      const uploadPromises = uploadState.designs.map(async (design, index) => {
        const formData = new FormData();
        formData.append('image', design.imageBlob, `design-${index}.jpg`);
        formData.append('collection_id', collectionId);
        formData.append('creator_name', uploadState.userDetails.name);
        if (uploadState.userDetails.email) {
          formData.append('creator_email', uploadState.userDetails.email);
        }
        if (uploadState.userDetails.phone) {
          formData.append('creator_phone', uploadState.userDetails.phone);
        }
        formData.append('category', design.category);
        if (design.custom_category_name) {
          formData.append('custom_category_name', design.custom_category_name);
        }

        const response = await fetch('/api/images', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();
        if (!result.success) {
          throw new Error(result.error || 'Upload failed');
        }
        return result;
      });

      await Promise.all(uploadPromises);
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
    setUploadState({
      step: 'user-details',
      userDetails: { name: '', email: '', phone: '' },
      designs: [],
      currentDesignCategory: null,
      currentDesignIndex: -1,
      capturedImageData: null,
      loading: false,
      error: null,
    });
  };

  const renderUserDetails = () => (
    <Card className="w-full max-w-md mx-auto rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300">
      <CardHeader className="text-center pt-8 pb-4">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl flex items-center justify-center mb-6 mx-auto">
          <span className="text-4xl">✨</span>
        </div>
        <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
          Share Your Designs
        </CardTitle>
        <p className="text-gray-600">
          Tell us about yourself to get started
        </p>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        <form onSubmit={handleUserDetailsSubmit} className="space-y-5">
          <div>
            <Label htmlFor="name" className="text-base font-semibold">Your Name *</Label>
            <Input
              id="name"
              type="text"
              value={uploadState.userDetails.name}
              onChange={(e) => setUploadState(prev => ({
                ...prev,
                userDetails: { ...prev.userDetails, name: e.target.value }
              }))}
              placeholder="Enter your name"
              className="mt-2 h-12 rounded-xl"
              required
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-base font-semibold">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={uploadState.userDetails.email}
              onChange={(e) => setUploadState(prev => ({
                ...prev,
                userDetails: { ...prev.userDetails, email: e.target.value }
              }))}
              placeholder="your.email@example.com (optional)"
              className="mt-2 h-12 rounded-xl"
            />
          </div>

          <div>
            <Label htmlFor="phone" className="text-base font-semibold">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={uploadState.userDetails.phone}
              onChange={(e) => setUploadState(prev => ({
                ...prev,
                userDetails: { ...prev.userDetails, phone: e.target.value }
              }))}
              placeholder="+1 (555) 000-0000 (optional)"
              className="mt-2 h-12 rounded-xl"
            />
          </div>

          {uploadState.error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-xl">
              <AlertCircle className="w-5 h-5" />
              {uploadState.error}
            </div>
          )}

          <Button type="submit" className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold">
            Continue to Design Upload
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  const renderUploadDesigns = () => (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-cyan-100 rounded-2xl flex items-center justify-center mb-4 mx-auto">
          <Camera className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Capture Your Designs
        </h2>
        <p className="text-gray-600">
          Take photos of your designs. Men's and Women's designs are required. ✨
        </p>
      </div>

      {/* Men's Design Section */}
      <Card className="rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-blue-100">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-3xl">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">👔</span>
            </div>
            <div className="flex-1">Men's Design</div>
            <Badge variant="default" className="bg-blue-500 rounded-full px-3">Required</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {uploadState.designs.some(d => d.category === 'men') ? (
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <img 
                  src={URL.createObjectURL(uploadState.designs.find(d => d.category === 'men')!.imageBlob)} 
                  alt="Men's design"
                  className="w-40 h-40 object-cover rounded-2xl shadow-md"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => startDesignCapture('men')}
                  size="sm"
                  className="rounded-xl"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Retake
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => removeDesign(uploadState.designs.findIndex(d => d.category === 'men'))}
                  size="sm"
                  className="rounded-xl"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <Button 
              onClick={() => startDesignCapture('men')}
              className="w-full h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold"
            >
              <Camera className="w-5 h-5 mr-2" />
              Take Photo - Men's Design
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Women's Design Section */}
      <Card className="rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-pink-100">
        <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-t-3xl">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">👗</span>
            </div>
            <div className="flex-1">Women's Design</div>
            <Badge variant="default" className="bg-pink-500 rounded-full px-3">Required</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {uploadState.designs.some(d => d.category === 'women') ? (
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <img 
                  src={URL.createObjectURL(uploadState.designs.find(d => d.category === 'women')!.imageBlob)} 
                  alt="Women's design"
                  className="w-40 h-40 object-cover rounded-2xl shadow-md"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => startDesignCapture('women')}
                  size="sm"
                  className="rounded-xl"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Retake
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => removeDesign(uploadState.designs.findIndex(d => d.category === 'women'))}
                  size="sm"
                  className="rounded-xl"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <Button 
              onClick={() => startDesignCapture('women')}
              className="w-full h-14 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-semibold"
            >
              <Camera className="w-5 h-5 mr-2" />
              Take Photo - Women's Design
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Others Design Section */}
      <Card className="rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-purple-100">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-t-3xl">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">🎨</span>
            </div>
            <div className="flex-1">Other Designs</div>
            <Badge variant="secondary" className="rounded-full px-3">Optional</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {uploadState.designs.filter(d => d.category === 'others').map((design, index) => (
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
                    onClick={() => startDesignCapture('others', design.custom_category_name)}
                    size="sm"
                    className="rounded-xl"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Retake
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => removeDesign(uploadState.designs.findIndex(d => d === design))}
                    size="sm"
                    className="rounded-xl"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            <Button 
              onClick={() => startDesignCapture('others')}
              variant="outline"
              className="w-full h-12 border-2 border-purple-200 hover:bg-purple-50 text-purple-700 rounded-xl font-semibold"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Another Design
            </Button>
          </div>
        </CardContent>
      </Card>

      {uploadState.error && (
        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-4 rounded-2xl border-2 border-red-100">
          <AlertCircle className="w-5 h-5" />
          {uploadState.error}
        </div>
      )}

      <div className="flex gap-4 pt-4">
        <Button 
          variant="outline" 
          onClick={() => setUploadState(prev => ({ ...prev, step: 'user-details' }))}
          className="flex-1 h-12 rounded-xl border-2"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
        <Button 
          onClick={handlePreview}
          disabled={!canProceedToPreview()}
          className="flex-1 h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold shadow-lg"
        >
          Preview & Upload
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderPreview = () => (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mb-4 mx-auto">
          <span className="text-3xl">👀</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Preview Your Designs
        </h2>
        <p className="text-gray-600">
          Review your designs before uploading. We'll process them to enhance quality. ✨
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {uploadState.designs.map((design, index) => (
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

      {uploadState.error && (
        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-4 rounded-2xl border-2 border-red-100">
          <AlertCircle className="w-5 h-5" />
          {uploadState.error}
        </div>
      )}

      <div className="flex gap-4 pt-4">
        <Button 
          variant="outline" 
          onClick={() => setUploadState(prev => ({ ...prev, step: 'upload-designs' }))}
          className="flex-1 h-12 rounded-xl border-2"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Go Back
        </Button>
        <Button 
          onClick={handleUpload}
          disabled={uploadState.loading}
          className="flex-1 h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg"
        >
          {uploadState.loading ? (
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

  const renderSuccess = () => (
    <Card className="w-full max-w-md mx-auto rounded-3xl shadow-2xl">
      <CardContent className="text-center py-12 px-8">
        <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-14 h-14 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Upload Successful! 🎉
        </h2>
        <p className="text-gray-600 mb-8 text-lg">
          Thank you for sharing {uploadState.designs.length} amazing design{uploadState.designs.length > 1 ? 's' : ''}! 
          They will be reviewed by our team and may appear in the museum slideshow.
        </p>
        <Button 
          onClick={resetUpload} 
          className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold shadow-lg"
        >
          Upload More Designs
        </Button>
      </CardContent>
    </Card>
  );

  const renderStep = () => {
    switch (uploadState.step) {
      case 'user-details':
        return renderUserDetails();
      case 'upload-designs':
        return renderUploadDesigns();
      case 'preview':
        return renderPreview();
      case 'success':
        return renderSuccess();
      default:
        return null;
    }
  };

  // Handle image cropping (prioritize cropper if we have captured data)
  if (uploadState.capturedImageData) {
    return (
      <ImageCropper
        image={uploadState.capturedImageData}
        onCrop={handleImageCrop}
        onBack={() => setUploadState(prev => ({ 
          ...prev, 
          currentDesignCategory: null, 
          currentDesignIndex: -1,
          capturedImageData: null
        }))}
      />
    );
  }

  // Handle camera capture
  if (uploadState.currentDesignCategory) {
    return (
      <CameraCapture
        onCapture={handleImageCapture}
        onBack={() => setUploadState(prev => ({ 
          ...prev, 
          currentDesignCategory: null, 
          currentDesignIndex: -1 
        }))}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 flex items-center justify-center">
      <div className="container mx-auto px-4 py-8">
        {renderStep()}
      </div>
    </div>
  );
}