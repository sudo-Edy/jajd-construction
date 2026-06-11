import imageCompression from 'browser-image-compression';

export const compressImage = async (file: File): Promise<File> => {
  // Options for compression
  const options = {
    maxSizeMB: 0.3,          // Max file size ~300KB (Great for "just the gist")
    maxWidthOrHeight: 1280, // Standard HD resolution (plenty for phone screens)
    useWebWorker: true,    // Use web worker for better performance
    initialQuality: 0.6,   // Lower quality to aggressive save space
  };

  try {
    // Only compress images
    if (!file.type.startsWith('image/')) {
      return file;
    }

    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error('Image compression failed, using original file:', error);
    return file; // Fallback to original file
  }
};
