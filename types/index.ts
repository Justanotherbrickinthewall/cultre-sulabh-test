export interface Image {
  id: string;
  image_url: string;
  creator_name: string;
  creator_email: string;
  category: 'men' | 'women';
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
  creator_name: string;
  creator_email: string;
  category: 'men' | 'women';
  image: File;
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

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
