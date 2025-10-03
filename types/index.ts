export interface Image {
  collection_id: string;
  id: string;
  image_url: string;
  collection_name?: string;
  collection_updated_at?: string;
  creator_name: string;
  creator_email?: string;
  creator_phone?: string;
  category: 'men' | 'women' | 'others';
  custom_category_name?: string;
  status: 'not_selected' | 'selected';
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  username: string;
  created_at: string;
}

export interface UploadFormData {
  collection_id: string;
  creator_name: string;
  creator_email?: string;
  creator_phone?: string;
  category: 'men' | 'women' | 'others';
  custom_category_name?: string;
  image: File;
}

export interface DesignUpload {
  category: 'men' | 'women' | 'others';
  custom_category_name?: string;
  imageBlob: Blob;
  isRequired: boolean;
}

export interface UserDetails {
  name: string;
  email?: string;
  phone?: string;
}

export interface ImageCardProps {
  image: Image;
  onStatusToggle: (id: string, newStatus: 'selected' | 'not_selected') => void;
  isLoading?: boolean;
}

export interface SlideshowImage {
  id: string;
  image_url: string;
  creator_name: string;
}

export interface Collection {
  id: string;
  collection_name: string;
  creator_name: string;
  creator_email?: string;
  creator_phone?: string;
  status: 'not_selected' | 'selected';
  created_at: string;
  updated_at: string;
  images: CollectionImage[];
}

export interface CollectionImage {
  id: string;
  image_url: string;
  category: 'men' | 'women' | 'others';
  custom_category_name?: string;
  created_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
