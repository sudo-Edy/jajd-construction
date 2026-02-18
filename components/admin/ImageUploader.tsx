import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { uploadProjectImage } from '../../utils/supabase';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import imageCompression from 'browser-image-compression';

interface ImageUploaderProps {
  projectId: string;
  onImageUploaded: (imageUrl: string) => void;
  existingImages?: string[];
}

interface UploadingImage {
  file: File;
  preview: string;
  progress: number;
  uploading: boolean;
  compressing: boolean;
  error?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ projectId, onImageUploaded, existingImages = [] }) => {
  const [uploadingImages, setUploadingImages] = useState<UploadingImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length === 0) {
      alert('Please select only image files');
      return;
    }

    // Create preview objects
    const newUploads: UploadingImage[] = imageFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      uploading: false,
      compressing: true, // Start in compressing state
    }));

    setUploadingImages(prev => [...prev, ...newUploads]);

    // Start compression and uploading
    newUploads.forEach((upload, index) => {
      processAndUploadImage(upload, uploadingImages.length + index);
    });
  };

  const processAndUploadImage = async (upload: UploadingImage, index: number) => {
    try {
      // 1. Compression Options
      const options = {
        maxSizeMB: 1,          // Max size ~1MB
        maxWidthOrHeight: 1920, // Max width/height 1920px (Full HD)
        useWebWorker: true,
      };

      // 2. Compress Image
      const compressedFile = await imageCompression(upload.file, options);

      // Update state: Compression done, start uploading
      setUploadingImages(prev => {
        const updated = [...prev];
        updated[index] = { ...updated[index], compressing: false, uploading: true, progress: 20 };
        return updated;
      });

      // 3. Upload to Supabase
      const imageUrl = await uploadProjectImage(compressedFile, projectId);

      // Update progress
      setUploadingImages(prev => {
        const updated = [...prev];
        updated[index] = { ...updated[index], progress: 100 };
        return updated;
      });

      // Notify parent component
      onImageUploaded(imageUrl);

      // Remove from uploading list after a brief delay
      setTimeout(() => {
        setUploadingImages(prev => prev.filter((_, i) => i !== index));
      }, 1000);

    } catch (error: any) {
      console.error('Process/Upload error:', error);
      setUploadingImages(prev => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          uploading: false,
          compressing: false,
          error: error.message || 'Failed',
        };
        return updated;
      });
    }
  };

  const removeUploadingImage = (index: number) => {
    setUploadingImages(prev => {
      // Revoke object URL to free memory
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-4 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-[#FACC15] bg-[#FACC15]/10'
            : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
        }`}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
            <Upload className="w-8 h-8 text-slate-400" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900 mb-1">
              Drop images here or click to browse
            </p>
            <p className="text-sm text-slate-500 font-medium">
              Auto-compressed to 1MB • High Quality Protected
            </p>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />
      </div>

      {/* Uploading images */}
      {uploadingImages.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-bold uppercase tracking-widest text-xs text-slate-600">
            Processing ({uploadingImages.length})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {uploadingImages.map((upload, index) => (
              <div key={index} className="relative group rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={upload.preview}
                  alt="Uploading"
                  className={`w-full aspect-square object-cover transition-opacity ${upload.compressing ? 'opacity-50' : 'opacity-100'}`}
                />

                {/* Status Overlay */}
                <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="w-6 h-6 text-white animate-spin mx-auto mb-2" />
                    <p className="text-white text-[10px] font-bold uppercase tracking-wider">
                      {upload.compressing ? 'Compressing...' : `Uploading ${upload.progress}%`}
                    </p>
                  </div>
                </div>

                {/* Error overlay */}
                {upload.error && (
                  <div className="absolute inset-0 bg-red-600/90 flex items-center justify-center p-2">
                    <p className="text-white text-xs font-bold text-center">{upload.error}</p>
                  </div>
                )}

                {/* Success overlay */}
                {upload.progress === 100 && !upload.error && (
                  <div className="absolute inset-0 bg-green-600/90 flex items-center justify-center">
                    <p className="text-white text-sm font-bold">✓ Done</p>
                  </div>
                )}

                {/* Remove button */}
                {!upload.uploading && !upload.compressing && (
                  <button
                    onClick={() => removeUploadingImage(index)}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
