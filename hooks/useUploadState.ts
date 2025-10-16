import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { validateEmail } from '@/lib/utils';
import { UploadState, UserDetails, DesignUpload } from '@/types/upload';

const initialState: UploadState = {
  step: 'user-details',
  userDetails: { name: '', email: '', phone: '' },
  designs: [],
  currentDesignCategory: null,
  currentDesignIndex: -1,
  capturedImageData: null,
  croppedImageBlob: null,
  loading: false,
  error: null,
};

export function useUploadState() {
  const [state, setState] = useState<UploadState>(initialState);

  const validateUserDetails = () => {
    if (!state.userDetails.name.trim()) {
      setState(prev => ({ ...prev, error: 'Name is required' }));
      return false;
    }
    
    if (state.userDetails.email && !validateEmail(state.userDetails.email)) {
      setState(prev => ({ ...prev, error: 'Please enter a valid email address' }));
      return false;
    }

    return true;
  };

  const handleUserDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateUserDetails()) {
      setState(prev => ({ ...prev, step: 'upload-designs', error: null }));
    }
  };

  const updateUserDetails = (details: Partial<UserDetails>) => {
    setState(prev => ({
      ...prev,
      userDetails: { ...prev.userDetails, ...details }
    }));
  };

  const startDesignCapture = (category: 'men' | 'women' | 'others') => {
    setState(prev => ({
      ...prev,
      currentDesignCategory: category,
      currentDesignIndex: prev.designs.length,
      error: null,
    }));
  };

  const handleImageCapture = (imageDataUrl: string) => {
    setState(prev => ({
      ...prev,
      capturedImageData: imageDataUrl,
      error: null,
    }));
  };

  const handleImageCrop = (croppedBlob: Blob) => {
    setState(prev => ({
      ...prev,
      capturedImageData: null,
      croppedImageBlob: croppedBlob,
      error: null,
    }));
  };

  const handleImageEnhance = async (enhancedBlob: Blob) => {
    if (!state.currentDesignCategory) {
      console.error('No design category selected');
      return;
    }

    try {
      let custom_category_name: string | undefined;
      if (state.currentDesignCategory === 'others') {
        const categoryName = prompt('Please name this design category:');
        custom_category_name = categoryName || 'Custom Design';
      }

      const newDesign: DesignUpload = {
        category: state.currentDesignCategory,
        custom_category_name,
        imageBlob: enhancedBlob,
        isRequired: state.currentDesignCategory === 'men' || state.currentDesignCategory === 'women',
      };

      setState(prev => ({
        ...prev,
        designs: [...prev.designs, newDesign],
        currentDesignCategory: null,
        currentDesignIndex: -1,
        croppedImageBlob: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to process enhanced image. Please try again.',
      }));
    }
  };

  const removeDesign = (index: number) => {
    setState(prev => ({
      ...prev,
      designs: prev.designs.filter((_, i) => i !== index),
    }));
  };

  const canProceedToPreview = () => {
    const hasMenDesign = state.designs.some(d => d.category === 'men');
    const hasWomenDesign = state.designs.some(d => d.category === 'women');
    return hasMenDesign && hasWomenDesign;
  };

  const handlePreview = () => {
    if (!canProceedToPreview()) {
      setState(prev => ({ 
        ...prev, 
        error: 'Please upload at least one Men\'s design and one Women\'s design' 
      }));
      return;
    }
    setState(prev => ({ ...prev, step: 'preview', error: null }));
  };

  const handleUpload = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const collectionId = uuidv4();
      const uploadPromises = state.designs.map(async (design, index) => {
        const formData = new FormData();
        formData.append('image', design.imageBlob, `design-${index}.jpg`);
        formData.append('collection_id', collectionId);
        formData.append('creator_name', state.userDetails.name);
        if (state.userDetails.email) {
          formData.append('creator_email', state.userDetails.email);
        }
        if (state.userDetails.phone) {
          formData.append('creator_phone', state.userDetails.phone);
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
      setState(prev => ({ ...prev, step: 'success', loading: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      }));
    }
  };

  const reset = () => {
    setState(initialState);
  };

  const cancelCapture = () => {
    setState(prev => ({ 
      ...prev, 
      currentDesignCategory: null, 
      currentDesignIndex: -1,
      capturedImageData: null,
      croppedImageBlob: null,
    }));
  };

  return {
    state,
    handleUserDetailsSubmit,
    updateUserDetails,
    startDesignCapture,
    handleImageCapture,
    handleImageCrop,
    handleImageEnhance,
    removeDesign,
    handlePreview,
    handleUpload,
    reset,
    cancelCapture,
    canProceedToPreview,
  };
}