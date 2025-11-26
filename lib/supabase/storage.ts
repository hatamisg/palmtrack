import { supabase } from './client';

const BUCKET_NAME = 'palmtrack-images';

/**
 * Upload image to Supabase Storage
 */
export async function uploadImage(
  file: File,
  folder: string,
  fileName?: string
): Promise<{ url: string | null; path: string | null; error: string | null }> {
  try {
    if (!supabase) {
      return { url: null, path: null, error: 'Supabase client not initialized' };
    }

    // Generate unique filename if not provided
    const timestamp = Date.now();
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const finalFileName = fileName || `${timestamp}.${extension}`;
    const path = `${folder}/${finalFileName}`;

    // Upload file
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.error('Upload error:', error);
      return { url: null, path: null, error: error.message };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(path);

    return { 
      url: urlData.publicUrl, 
      path: path,
      error: null 
    };
  } catch (err) {
    console.error('Upload exception:', err);
    return { url: null, path: null, error: 'Failed to upload image' };
  }
}

/**
 * Upload multiple images
 */
export async function uploadMultipleImages(
  files: File[],
  folder: string
): Promise<{ urls: string[]; paths: string[]; errors: string[] }> {
  const results = await Promise.all(
    files.map((file, index) => uploadImage(file, folder, `${Date.now()}_${index}.${file.name.split('.').pop()}`))
  );

  return {
    urls: results.filter(r => r.url).map(r => r.url!),
    paths: results.filter(r => r.path).map(r => r.path!),
    errors: results.filter(r => r.error).map(r => r.error!),
  };
}

/**
 * Delete image from Supabase Storage
 */
export async function deleteImage(
  path: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    if (!supabase) {
      return { success: false, error: 'Supabase client not initialized' };
    }

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([path]);

    if (error) {
      console.error('Delete error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error('Delete exception:', err);
    return { success: false, error: 'Failed to delete image' };
  }
}

/**
 * Delete multiple images
 */
export async function deleteMultipleImages(
  paths: string[]
): Promise<{ success: boolean; error: string | null }> {
  try {
    if (!supabase) {
      return { success: false, error: 'Supabase client not initialized' };
    }

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove(paths);

    if (error) {
      console.error('Delete multiple error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error('Delete multiple exception:', err);
    return { success: false, error: 'Failed to delete images' };
  }
}

/**
 * Get public URL for an image path
 */
export function getImageUrl(path: string): string | null {
  if (!supabase || !path) return null;
  
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(path);
  
  return data.publicUrl;
}

/**
 * Compress image before upload (client-side)
 */
export async function compressImage(
  file: File,
  maxWidth: number = 1920,
  quality: number = 0.8
): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Resize if needed
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => reject(new Error('Failed to load image'));
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
  });
}

/**
 * Validate image file
 */
export function validateImageFile(
  file: File,
  maxSizeMB: number = 5
): { valid: boolean; error: string | null } {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Format file tidak didukung. Gunakan JPG, PNG, WebP, atau GIF.' };
  }

  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return { valid: false, error: `Ukuran file maksimal ${maxSizeMB}MB` };
  }

  return { valid: true, error: null };
}
