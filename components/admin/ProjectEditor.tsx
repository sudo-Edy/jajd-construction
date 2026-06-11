import React, { useState, useEffect, FormEvent, useRef } from 'react';
import { supabase, deleteProjectImage, uploadProjectImage } from '../../utils/supabase';
import { Project, ProjectImage } from '../../types';
import { X, Save, Loader2, Trash2, Star } from 'lucide-react';
import ImageUploader from './ImageUploader';
import imageCompression from 'browser-image-compression';

interface ProjectEditorProps {
  project: Project | null;
  onClose: () => void;
  onSave: () => void;
}

const ProjectEditor: React.FC<ProjectEditorProps> = ({ project, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [details, setDetails] = useState('');
  const [completionDate, setCompletionDate] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [thumbnailUploading, setThumbnailUploading] = useState(false);
  const [thumbnailError, setThumbnailError] = useState<string | null>(null);
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isPublished, setIsPublished] = useState(true);
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [projectId, setProjectId] = useState<string>('');
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setLocation(project.location);
      setDescription(project.description);
      setDetails(project.details || '');
      setCompletionDate(project.completion_date || '');
      setThumbnailUrl(project.thumbnail_url);
      setDisplayOrder(project.display_order);
      setIsPublished(project.is_published);
      setImages(project.images || []);
      setProjectId(project.id);
    } else {
      // Generate a temporary ID for new projects
      setProjectId(crypto.randomUUID());
    }
  }, [project]);

  const handleImageUploaded = async (imageUrl: string) => {
    // If this is the first image and no thumbnail is set, use it as thumbnail
    if (!thumbnailUrl || images.length === 0) {
      setThumbnailUrl(imageUrl);
    }

    // Add to images list
    const newImage: ProjectImage = {
      id: crypto.randomUUID(),
      project_id: projectId,
      image_url: imageUrl,
      display_order: images.length,
    };

    setImages(prev => [...prev, newImage]);
  };

  const handleDeleteImage = async (image: ProjectImage, index: number) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      // If this is an existing image in the database, delete it
      if (project && image.id) {
        const { error } = await supabase
          .from('project_images')
          .delete()
          .eq('id', image.id);

        if (error) throw error;

        // Delete from storage
        await deleteProjectImage(image.image_url);
      }

      // Remove from local state
      setImages(prev => prev.filter((_, i) => i !== index));

      // If the deleted image was the thumbnail, set a new one
      if (image.image_url === thumbnailUrl && images.length > 1) {
        const remainingImages = images.filter((_, i) => i !== index);
        if (remainingImages.length > 0) {
          setThumbnailUrl(remainingImages[0].image_url);
        } else {
          setThumbnailUrl('');
        }
      }
    } catch (error: any) {
      console.error('Error deleting image:', error);
      alert(`Error deleting image: ${error.message}`);
    }
  };

  const handleSetThumbnail = (imageUrl: string) => {
    setThumbnailUrl(imageUrl);
  };

  const handleThumbnailInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    void processThumbnailUpload(file);
    e.target.value = '';
  };

  const processThumbnailUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setThumbnailError('Please select an image file');
      return;
    }

    try {
      setThumbnailError(null);
      setThumbnailUploading(true);

      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);
      const imageUrl = await uploadProjectImage(compressedFile, projectId);

      setThumbnailUrl(imageUrl);
      setImages(prev => {
        if (prev.some(img => img.image_url === imageUrl)) return prev;
        return [
          ...prev,
          {
            id: crypto.randomUUID(),
            project_id: projectId,
            image_url: imageUrl,
            display_order: prev.length,
          },
        ];
      });
    } catch (error: any) {
      console.error('Thumbnail upload error:', error);
      setThumbnailError(error.message || 'Failed to upload thumbnail');
    } finally {
      setThumbnailUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!title || !location || !description || !thumbnailUrl) {
        alert('Please fill in all required fields and upload at least one image');
        setLoading(false);
        return;
      }

      // Prepare project data
      const projectData = {
        title,
        location,
        description,
        details,
        completion_date: completionDate,
        thumbnail_url: thumbnailUrl,
        display_order: displayOrder,
        is_published: isPublished,
        updated_at: new Date().toISOString(),
      };

      let finalProjectId = projectId;

      if (project) {
        // Update existing project
        const { error: updateError } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', project.id);

        if (updateError) throw updateError;
        finalProjectId = project.id;
      } else {
        // Create new project
        const { data: newProject, error: insertError } = await supabase
          .from('projects')
          .insert([{ ...projectData, id: projectId }])
          .select()
          .single();

        if (insertError) throw insertError;
        finalProjectId = newProject.id;
      }

      // Save images
      const imagePromises = images.map((img, index) => {
        // Only insert if it's a new image (doesn't have a database ID yet)
        if (!img.created_at) {
          return supabase
            .from('project_images')
            .insert([{
              project_id: finalProjectId,
              image_url: img.image_url,
              display_order: index,
              caption: img.caption || null,
            }]);
        }
        return Promise.resolve();
      });

      await Promise.all(imagePromises);

      // Success!
      onSave();
      onClose();
    } catch (error: any) {
      console.error('Error saving project:', error);
      alert(`Error saving project: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="bg-white rounded-[2.5rem] w-full max-w-4xl my-8 flex flex-col max-h-[90vh]">
        {/* Header - Fixed */}
        <div className="p-8 border-b-2 border-slate-200 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-3xl font-black text-slate-900">
              {project ? 'Edit Project' : 'New Project'}
            </h2>
            <p className="text-slate-500 font-medium mt-1">
              {project ? 'Update project details and images' : 'Add a new project to your gallery'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-12 h-12 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6 text-slate-600" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <form id="project-form" onSubmit={handleSubmit} className="space-y-8">
            {/* Basic info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-slate-900 font-black uppercase tracking-widest text-xs mb-3">
                  Project Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-brand-400 focus:outline-none font-medium"
                  placeholder="Kitchen Cabinet Refinish"
                />
              </div>

              <div>
                <label className="block text-slate-900 font-black uppercase tracking-widest text-xs mb-3">
                  Location *
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-brand-400 focus:outline-none font-medium"
                  placeholder="Papillion, NE"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-slate-900 font-black uppercase tracking-widest text-xs mb-3">
                Short Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={2}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-brand-400 focus:outline-none font-medium resize-none"
                placeholder="Brief description shown on project card"
              />
            </div>

            {/* Details */}
            <div>
              <label className="block text-slate-900 font-black uppercase tracking-widest text-xs mb-3">
                Detailed Description
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-brand-400 focus:outline-none font-medium resize-none"
                placeholder="Full details shown in the gallery modal"
              />
            </div>

            {/* Completion date and settings */}
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-slate-900 font-black uppercase tracking-widest text-xs mb-3">
                  Completion Date
                </label>
                <input
                  type="text"
                  value={completionDate}
                  onChange={(e) => setCompletionDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-brand-400 focus:outline-none font-medium"
                  placeholder="January 2024"
                />
              </div>

              <div>
                <label className="block text-slate-900 font-black uppercase tracking-widest text-xs mb-3">
                  Display Order
                </label>
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-brand-400 focus:outline-none font-medium"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-slate-900 font-black uppercase tracking-widest text-xs mb-3">
                  Status
                </label>
                <label className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-slate-200 cursor-pointer hover:border-brand-400 transition-colors">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="w-5 h-5 rounded"
                  />
                  <span className="font-bold text-slate-900">Published</span>
                </label>
              </div>
            </div>

            {/* Thumbnail */}
            <div>
              <label className="block text-slate-900 font-black uppercase tracking-widest text-xs mb-3">
                Thumbnail Image *
              </label>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-56">
                  <div className="w-full aspect-[4/3] rounded-xl border-2 border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center">
                    {thumbnailUrl ? (
                      <img
                        src={thumbnailUrl}
                        alt="Project thumbnail"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-slate-400 text-sm font-bold">No thumbnail yet</span>
                    )}
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => thumbnailInputRef.current?.click()}
                      disabled={thumbnailUploading}
                      className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-brand-400 hover:text-slate-900 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {thumbnailUploading ? 'Uploading...' : 'Upload Thumbnail'}
                    </button>
                    {thumbnailUrl && (
                      <button
                        type="button"
                        onClick={() => setThumbnailUrl('')}
                        className="px-6 py-3 border-2 border-slate-200 text-slate-700 rounded-xl font-black uppercase tracking-widest text-xs hover:border-slate-300 hover:bg-slate-50 transition-all"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 font-medium">
                    Auto-compressed before upload • Recommended 4:3 or 16:9
                  </p>
                  {thumbnailError && (
                    <p className="text-sm text-red-600 font-bold">{thumbnailError}</p>
                  )}
                </div>
              </div>

              <input
                ref={thumbnailInputRef}
                type="file"
                accept="image/*"
                onChange={handleThumbnailInput}
                className="hidden"
              />
            </div>

            {/* Images */}
            <div>
              <label className="block text-slate-900 font-black uppercase tracking-widest text-xs mb-3">
                Project Images *
              </label>

              {/* Existing images */}
              {images.length > 0 && (
                <div className="mb-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-2">
                    {images.map((image, index) => (
                      <div key={index} className="relative group rounded-xl overflow-hidden">
                        <img
                          src={image.image_url}
                          alt={`Project image ${index + 1}`}
                          className="w-full aspect-square object-cover"
                        />

                        {/* Thumbnail indicator */}
                        {image.image_url === thumbnailUrl && (
                          <div className="absolute top-2 left-2 bg-brand-400 text-slate-900 px-2 py-1 rounded-lg flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current" />
                            <span className="text-xs font-black">Thumbnail</span>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          {image.image_url !== thumbnailUrl && (
                            <button
                              type="button"
                              onClick={() => handleSetThumbnail(image.image_url)}
                              className="px-3 py-2 bg-brand-400 text-slate-900 rounded-lg text-xs font-black hover:bg-white transition-colors"
                            >
                              Set as Thumbnail
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteImage(image, index)}
                            className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                          >
                            <Trash2 className="w-5 h-5 text-white" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-slate-500 font-medium">
                    {images.length} image{images.length !== 1 ? 's' : ''} • Click "Set as Thumbnail" to choose the main image
                  </p>
                </div>
              )}

              {/* Image uploader */}
              <ImageUploader
                projectId={projectId}
                onImageUploaded={handleImageUploaded}
                existingImages={images.map(img => img.image_url)}
              />
            </div>
          </form>
        </div>

        {/* Footer Actions - Fixed */}
        <div className="flex items-center justify-end gap-4 p-6 border-t-2 border-slate-200 bg-white rounded-b-[2.5rem] flex-shrink-0 z-10">
          <button
            type="button"
            onClick={onClose}
            className="px-8 py-4 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="project-form" // Link to form
            disabled={loading}
            className="px-8 py-4 bg-brand-400 text-slate-900 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-slate-900 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 shadow-lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Project
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectEditor;
