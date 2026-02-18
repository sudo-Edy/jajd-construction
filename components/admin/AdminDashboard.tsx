import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { Project } from '../../types';
import { Plus, Edit, Trash2, Eye, EyeOff, LogOut, Loader2, GripVertical } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface AdminDashboardProps {
  onLogout: () => void;
  onEditProject: (project: Project | null) => void;
}

// Sortable Item Component
const SortableProjectItem = ({ project, onEdit, onDelete, onTogglePublish }: { project: Project, onEdit: (p: Project) => void, onDelete: (p: Project) => void, onTogglePublish: (p: Project) => void }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-lg p-6 flex items-center gap-6 hover:shadow-md transition-shadow border border-slate-100 ${isDragging ? 'shadow-2xl ring-2 ring-[#FACC15]' : ''}`}
    >
      {/* Drag Handle */}
      <div {...attributes} {...listeners} className="cursor-grab hover:text-slate-900 text-slate-400 p-2">
        <GripVertical className="w-6 h-6" />
      </div>

      {/* Thumbnail */}
      <img
        src={project.thumbnail_url}
        alt={project.title}
        className="w-24 h-24 object-cover rounded-md flex-shrink-0 bg-slate-100"
      />

      {/* Project info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4 mb-1">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{project.title}</h3>
            <p className="text-slate-500 font-medium text-xs uppercase tracking-wide">{project.location}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {project.is_published ? (
              <span className="px-2 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-bold flex items-center gap-1 border border-green-100">
                <Eye className="w-3 h-3" /> Published
              </span>
            ) : (
              <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-bold flex items-center gap-1 border border-slate-200">
                <EyeOff className="w-3 h-3" /> Draft
              </span>
            )}
          </div>
        </div>
        <p className="text-slate-600 line-clamp-1 mb-2 text-sm">{project.description}</p>
        <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          <span>{project.images?.length || 0} photos</span>
          {project.completion_date && <span>• {project.completion_date}</span>}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={() => onTogglePublish(project)}
          className="p-2 rounded-md hover:bg-slate-50 transition-colors text-slate-400 hover:text-slate-900"
          title={project.is_published ? 'Unpublish' : 'Publish'}
        >
          {project.is_published ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
        <button
          onClick={() => onEdit(project)}
          className="p-2 rounded-md hover:bg-slate-50 transition-colors text-slate-400 hover:text-blue-600"
          title="Edit project"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(project)}
          className="p-2 rounded-md hover:bg-red-50 transition-colors text-slate-400 hover:text-red-600"
          title="Delete project"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

import ServicesManager from './ServicesManager';

interface AdminDashboardProps {
  onLogout: () => void;
  onEditProject: (project: Project | null) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, onEditProject }) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'services'>('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
        .order('display_order', { ascending: true });

      if (fetchError) throw fetchError;

      setProjects(data || []);
    } catch (err: any) {
      console.error('Error fetching projects:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setProjects((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        // Update display_order in Supabase for all affected items
        updateProjectOrder(newItems);
        
        return newItems;
      });
    }
  };

  const updateProjectOrder = async (orderedProjects: Project[]) => {
    try {
      // In a real app, you'd want to optimize this to only update changed items
      // or use a batch update RPC function.
      const updates = orderedProjects.map((project, index) => ({
        id: project.id,
        display_order: index,
      }));

      for (const update of updates) {
         await supabase
          .from('projects')
          .update({ display_order: update.display_order })
          .eq('id', update.id);
      }
      
    } catch (error) {
      console.error("Failed to update order:", error);
    }
  };

  const handleTogglePublish = async (project: Project) => {
    try {
      const { error: updateError } = await supabase
        .from('projects')
        .update({ is_published: !project.is_published })
        .eq('id', project.id);

      if (updateError) throw updateError;
      
      // Update local state without refetching to preserve drag order
      setProjects(prev => prev.map(p => 
        p.id === project.id ? { ...p, is_published: !p.is_published } : p
      ));
    } catch (err: any) {
      console.error('Error toggling publish:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleDelete = async (project: Project) => {
    if (!confirm(`Are you sure you want to delete "${project.title}"? This cannot be undone.`)) {
      return;
    }

    try {
      const { error: deleteError } = await supabase
        .from('projects')
        .delete()
        .eq('id', project.id);

      if (deleteError) throw deleteError;
      
      setProjects(prev => prev.filter(p => p.id !== project.id));
    } catch (err: any) {
      console.error('Error deleting project:', err);
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b-2 border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Project Gallery Manager</h1>
            <p className="text-slate-500 font-medium mt-1">Drag and drop to reorder projects</p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors text-xs uppercase tracking-wider"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 border-b-2 border-slate-200 pb-1">
          <button
            onClick={() => setActiveTab('projects')}
            className={`pb-4 px-2 font-black uppercase tracking-widest text-xs transition-colors relative ${
              activeTab === 'projects'
                ? 'text-slate-900 border-b-2 border-[#FACC15] -mb-1.5'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`pb-4 px-2 font-black uppercase tracking-widest text-xs transition-colors relative ${
              activeTab === 'services'
                ? 'text-slate-900 border-b-2 border-[#FACC15] -mb-1.5'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Services
          </button>
        </div>

        {activeTab === 'services' ? (
          <ServicesManager />
        ) : (
          <>
            {/* Add new project button */}
            <div className="mb-8">
              <button
                onClick={() => onEditProject(null)}
                className="flex items-center gap-3 px-8 py-4 bg-[#FACC15] text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-900 hover:text-white transition-all shadow-xl"
              >
                <Plus className="w-5 h-5" />
                Add New Project
              </button>
            </div>

            {/* Loading state */}
            {loading && (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-[#FACC15] animate-spin" />
              </div>
            )}

            {/* Error state */}
            {error && !loading && (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
                <p className="text-red-800 font-bold">{error}</p>
                <button
                  onClick={fetchProjects}
                  className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Projects list */}
            {!loading && !error && (
              <div className="space-y-4">
                {projects.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center">
                    <p className="text-slate-500 text-lg font-medium">
                      No projects yet. Click "Add New Project" to get started!
                    </p>
                  </div>
                ) : (
                  <DndContext 
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext 
                      items={projects.map(p => p.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-4">
                        {projects.map((project) => (
                          <SortableProjectItem 
                            key={project.id} 
                            project={project} 
                            onEdit={onEditProject}
                            onDelete={handleDelete}
                            onTogglePublish={handleTogglePublish}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
