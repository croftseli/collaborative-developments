import { supabase } from './supabase';

export const uploadFile = async (file: File, fileName: string): Promise<string> => {
  try {
    // Store images in 'news' folder in Supabase Storage
    const filePath = `news/${fileName}`;
    
    const { data, error } = await supabase.storage
      .from('images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) throw error;
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);
    
    return publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to upload file: ${errorMessage}`);
  }
};

export const deleteFile = async (fileUrl: string): Promise<void> => {
  try {
    // Check if it's a Supabase Storage URL
    if (fileUrl.includes('supabase')) {
      // Extract file path from Supabase URL
      const url = new URL(fileUrl);
      const pathParts = url.pathname.split('/');
      const bucketIndex = pathParts.findIndex(part => part === 'images');
      
      if (bucketIndex !== -1 && bucketIndex < pathParts.length - 1) {
        const filePath = pathParts.slice(bucketIndex + 1).join('/');
        
        const { error } = await supabase.storage
          .from('images')
          .remove([filePath]);
        
        if (error) throw error;
      } else {
        throw new Error('Could not extract file path from Supabase URL');
      }
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};