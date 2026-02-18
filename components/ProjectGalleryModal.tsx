import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, MapPin, Calendar, Maximize2 } from 'lucide-react';
import { Project } from '../types';

interface ProjectGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}

const ProjectGalleryModal: React.FC<ProjectGalleryModalProps> = ({ isOpen, onClose, project }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Reset to first image when project changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [project]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, currentImageIndex, project]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !project) return null;

  const images = project.images || [];
  const currentImage = images[currentImageIndex]?.image_url || project.thumbnail_url;

  const goToNext = () => {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const jumpToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/95 backdrop-blur-md p-4 md:p-8"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div 
        className="relative w-full h-full max-w-7xl mx-auto flex flex-col md:flex-row gap-6 bg-transparent"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 md:top-0 md:right-0 z-50 w-10 h-10 rounded-full bg-slate-800 text-white hover:bg-slate-700 flex items-center justify-center transition-all shadow-lg border border-slate-700"
          aria-label="Close gallery"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Image Viewer */}
        <div className="flex-1 flex flex-col relative min-h-0 bg-black/20 rounded-2xl overflow-hidden border border-white/10">
          <div className="flex-1 relative flex items-center justify-center p-4">
            <img
              src={currentImage}
              alt={`${project.title} - Image ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />

            {/* Navigation arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  disabled={currentImageIndex === 0}
                  className={`absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/50 hover:bg-slate-900 text-white backdrop-blur-sm flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed`}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  onClick={goToNext}
                  disabled={currentImageIndex === images.length - 1}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/50 hover:bg-slate-900 text-white backdrop-blur-sm flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed`}
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="h-24 bg-slate-900/50 backdrop-blur-md border-t border-white/10 p-4 overflow-x-auto">
              <div className="flex gap-3 min-w-min mx-auto">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => jumpToImage(index)}
                    className={`relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 transition-all ${
                      index === currentImageIndex
                        ? 'ring-2 ring-[#FACC15] ring-offset-2 ring-offset-slate-900'
                        : 'opacity-50 hover:opacity-100 hover:scale-105'
                    }`}
                  >
                    <img
                      src={image.image_url}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Project Info */}
        <div className="w-full md:w-[400px] flex-shrink-0 flex flex-col h-[30vh] md:h-auto bg-slate-900/80 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
            <div className="space-y-6">
              {/* Header Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#FACC15]">
                  <MapPin className="w-4 h-4" />
                  <span className="font-bold uppercase tracking-widest text-xs">{project.location}</span>
                </div>
                <h2 id="modal-title" className="text-2xl md:text-3xl font-black text-white leading-tight">
                  {project.title}
                </h2>
                {project.completion_date && (
                  <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                    <Calendar className="w-4 h-4" />
                    <span>Completed {project.completion_date}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="prose prose-invert prose-sm">
                <p className="text-slate-300 leading-relaxed text-base">
                  {project.description}
                </p>
              </div>

              {/* Details Section */}
              {project.details && (
                <div className="pt-6 border-t border-slate-700/50">
                  <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-3">
                    Project Details
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {project.details}
                  </p>
                </div>
              )}

              {/* Current Image Caption */}
              {images[currentImageIndex]?.caption && (
                <div className="bg-white/5 rounded-lg p-4 border border-white/5">
                  <p className="text-slate-300 text-sm italic">
                    "{images[currentImageIndex].caption}"
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Footer / Counter */}
          <div className="mt-auto p-4 bg-slate-950/50 border-t border-white/5 flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-500">
            <span>JAJD Construction Gallery</span>
            <span>{currentImageIndex + 1} / {Math.max(1, images.length)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectGalleryModal;
