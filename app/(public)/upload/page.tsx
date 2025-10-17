"use client";

import { UserDetailsForm } from '@/components/upload/UserDetailsForm';
import { DesignUploadSection } from '@/components/upload/DesignUploadSection';
import { PreviewSection } from '@/components/upload/PreviewSection';
import { SuccessSection } from '@/components/upload/SuccessSection';
import { CameraCapture } from '@/components/camera/CameraCapture';
import { ImageCropper } from '@/components/image-crop/ImageCropper';
import { ImageEnhancer } from '@/components/image-crop/ImageEnhancer';
import { useUploadState } from '@/hooks/useUploadState';

export default function UploadPage() {
  const {
    state,
    handleUserDetailsSubmit,
    updateUserDetails,
    startDesignCapture,
    handleImageCapture,
    handleGalleryUpload,
    handleImageCrop,
    handleImageEnhance,
    removeDesign,
    handlePreview,
    handleUpload,
    reset,
    cancelCapture,
    cancelEnhancement,
  } = useUploadState();

  const renderStep = () => {
    switch (state.step) {
      case 'user-details':
        return (
          <UserDetailsForm
            userDetails={state.userDetails}
            error={state.error}
            onSubmit={handleUserDetailsSubmit}
            onUpdateDetails={updateUserDetails}
          />
        );
      case 'upload-designs':
        return (
          <DesignUploadSection
            designs={state.designs}
            onStartCapture={startDesignCapture}
            onGalleryUpload={handleGalleryUpload}
            onRemoveDesign={removeDesign}
            onBack={() => state.step = 'user-details'}
            onPreview={handlePreview}
            error={state.error}
          />
        );
      case 'preview':
        return (
          <PreviewSection
            designs={state.designs}
            loading={state.loading}
            error={state.error}
            onBack={() => state.step = 'upload-designs'}
            onUpload={handleUpload}
          />
        );
      case 'success':
        return (
          <SuccessSection
            designCount={state.designs.length}
            onReset={reset}
          />
        );
      default:
        return null;
    }
  };

  // Handle image enhancement
  if (state.croppedImageBlob) {
    return (
      <ImageEnhancer
        image={state.croppedImageBlob}
        onComplete={handleImageEnhance}
        onBack={cancelEnhancement}
      />
    );
  }

  // Handle image cropping
  if (state.capturedImageData) {
    return (
      <ImageCropper
        image={state.capturedImageData}
        onCrop={handleImageCrop}
        onBack={cancelCapture}
      />
    );
  }

  // Handle camera capture
  if (state.currentDesignCategory) {
    return (
      <CameraCapture
        onCapture={handleImageCapture}
        onBack={cancelCapture}
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