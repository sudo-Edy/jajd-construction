import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables. Fail loudly in dev, but never white-screen
// production, fall back to a placeholder client so the static site still
// renders (data sections show their empty states instead).
if (!supabaseUrl || !supabaseAnonKey) {
  const message =
    'Missing Supabase environment variables (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).';
  if (import.meta.env.DEV) {
    throw new Error(`${message} Please check your .env.development file.`);
  }
  console.error(message);
}

// Create and export Supabase client
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'public-anon-key-missing'
);

// Helper function to upload image to Supabase storage
export const uploadProjectImage = async (file: File, projectId: string): Promise<string> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${projectId}/${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('project-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('project-images')
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Helper function to delete image from Supabase storage
export const deleteProjectImage = async (imageUrl: string): Promise<void> => {
  try {
    // Extract the file path from the public URL
    const urlParts = imageUrl.split('/project-images/');
    if (urlParts.length < 2) return;
    
    const filePath = urlParts[1];
    
    const { error } = await supabase.storage
      .from('project-images')
      .remove([filePath]);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};
