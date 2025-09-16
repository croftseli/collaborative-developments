import { supabase } from './supabase';

export const uploadFile = async (file: File, fileName: string): Promise<string> => {
  try {
    console.log('🚀 Starting file upload:', fileName);
    console.log('📁 File details:', { 
      name: file.name, 
      size: file.size, 
      type: file.type 
    });
    
    // Store images in 'news' folder in the existing 'images' bucket
    const filePath = `news/${fileName}`;
    console.log('📤 Uploading to path:', filePath);
    
    const { data, error } = await supabase.storage
      .from('images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('❌ Upload error:', error);
      console.error('❌ Error details:', {
        message: error.message,
        name: error.name,
        cause: error.cause
      });
      throw error;
    }
    
    console.log('✅ Upload successful, data:', data);
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);
    
    console.log('🌐 File uploaded successfully, public URL:', publicUrl);
    return publicUrl;
  } catch (error) {
    console.error('💥 Error uploading file:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to upload file: ${errorMessage}`);
  }
};

// Test if an image URL is accessible
export const testImageUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('Error testing image URL:', error);
    return false;
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