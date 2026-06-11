import React, { useState, useEffect } from 'react';
import { MapPin, Image as ImageIcon, Loader2 } from 'lucide-react';
import { supabase } from '../utils/supabase';
import { Project } from '../types';
import ProjectGalleryModal from './ProjectGalleryModal';

const RecentWork = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('projects')
        .select(`
          *,
          images:project_images(*)
        `)
        .eq('is_published', true)
        .order('display_order', { ascending: true });

      if (fetchError) throw fetchError;

      setProjects(data || []);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 300); // Wait for animation
  };

  return (
    <section id="portfolio" className="py-24 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mb-12 space-y-4">
           <span className="text-brand-600 font-bold text-xs uppercase tracking-[0.2em]">Our portfolio</span>
           <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">Recent work around the neighborhood</h2>
           <p className="text-stone-600 text-lg">
             Real projects from real Nebraska homes. Click any project to see the full photo gallery.
           </p>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-8 text-center">
            <p className="text-red-800 font-bold">{error}</p>
            <button 
              onClick={fetchProjects}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-md font-bold hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Projects grid */}
        {!loading && !error && (
          <div className="grid md:grid-cols-3 gap-8">
             {projects.map((project) => {
               const imageCount = project.images?.length || 0;
               
               return (
                 <div 
                   key={project.id} 
                   className="group relative cursor-pointer"
                   onClick={() => handleProjectClick(project)}
                 >
                    {/* Ambilight / Bloom Effect */}
                    <div 
                      className="absolute inset-0 translate-y-4 bg-cover bg-center rounded-2xl opacity-0 group-hover:opacity-60 blur-2xl transition-all duration-700 pointer-events-none"
                      style={{ 
                        backgroundImage: `url(${project.thumbnail_url})`,
                        transform: 'scale(0.95) translateY(10px)', 
                      }}
                    />

                    {/* Main Card Content */}
                    <div className="relative rounded-2xl overflow-hidden aspect-[4/5] shadow-card group-hover:shadow-card-hover transition-all duration-500 bg-navy border border-stone-200/50">
                        <img
                          src={project.thumbnail_url}
                          alt={`${project.title} in ${project.location}, a JAJD Construction project`}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent opacity-90 transition-opacity" />
                        
                        {/* Photo count badge */}
                        {imageCount > 0 && (
                          <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/20 text-white px-3 py-1.5 rounded-full flex items-center gap-1.5">
                            <ImageIcon className="w-3 h-3" />
                            <span className="text-[10px] font-bold">{imageCount}</span>
                          </div>
                        )}
                        
                        <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                          <div className="flex items-center gap-2 text-brand-400 text-xs font-bold uppercase tracking-wider mb-2">
                            <MapPin className="w-4 h-4" /> {project.location}
                          </div>
                          <h3 className="text-xl font-bold text-white mb-2 leading-tight">{project.title}</h3>
                          <p className="text-white/80 text-sm font-medium line-clamp-2">
                            {project.description}
                          </p>
                        </div>
                    </div>
                 </div>
               );
             })}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && projects.length === 0 && (
          <div className="text-center py-20 bg-stone-50 rounded-lg border-2 border-dashed border-stone-200">
            <p className="text-stone-500 text-lg font-medium">No projects available at the moment.</p>
          </div>
        )}
      </div>

      {/* Gallery Modal */}
      <ProjectGalleryModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        project={selectedProject}
      />
    </section>
  );
};

export default RecentWork;
