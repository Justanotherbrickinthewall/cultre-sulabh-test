export interface UserDetails {
  name: string;
  email: string;
  phone: string;
  collectionName: string;
  location: string;
}

export interface DesignUpload {
  category: 'men' | 'women' | 'others';
  custom_category_name?: string;
  imageBlob: Blob;
  isRequired: boolean;
}

export type UploadStep = 'user-details' | 'upload-designs' | 'preview' | 'success';

export interface UploadState {
  step: UploadStep;
  userDetails: UserDetails;
  designs: DesignUpload[];
  currentDesignCategory: 'men' | 'women' | 'others' | null;
  currentDesignIndex: number;
  capturedImageData: string | null;
  croppedImageBlob: Blob | null;
  loading: boolean;
  error: string | null;
}