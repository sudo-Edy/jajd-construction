import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { Project } from '../../types';
import {
  Plus, Edit, Trash2, Eye, EyeOff, LogOut, Loader2, GripVertical,
  BarChart3, FolderKanban, Wrench, Palette, Search, HardHat, ExternalLink,
} from 'lucide-react';
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
import ServicesManager from './ServicesManager';
import AnalyticsDashboard from './AnalyticsDashboard';
import SeoManager from './SeoManager';
import AppearanceManager from './AppearanceManager';

interface AdminDashboardProps {
  onLogout: () => void;
  onEditProject: (project: Project | null) => void;
}

type AdminTab = 'analytics' | 'projects' | 'services' | 'appearance' | 'seo';

const TABS: { id: AdminTab; label: string; icon: React.ElementType; blurb: string }[] = [
  { id: 'analytics', label: 'Analytics', icon: BarChart3, blurb: 'Visits, humans vs bots, clicks & leads' },
  { id: 'projects', label: 'Projects', icon: FolderKanban, blurb: 'Portfolio gallery manager' },
  { id: 'services', label: 'Services', icon: Wrench, blurb: 'What you offer on the site' },
  { id: 'appearance', label: 'Appearance', icon: Palette, blurb: 'Use your photos as site backgrounds' },
  { id: 'seo', label: 'SEO', icon: Search, blurb: 'Title, description & search preview' },
];

// Sortable project row
const SortableProjectItem = ({ project, onEdit, onDelete, onTogglePublish }: { project: Project, onEdit: (p: Project) => void, onDelete: (p: Project) => void, onTogglePublish: (p: Project) => void }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: project.id });

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
      className={`bg-white rounded-2xl p-5 flex items-center gap-5 hover:shadow-card transition-shadow border border-slate-200 ${isDragging ? 'shadow-2xl ring-2 ring-brand-400' : ''}`}
    >
      <div {...attributes} {...listeners} className="cursor-grab hover:text-slate-900 text-slate-400 p-2">
        <GripVertical className="w-5 h-5" />
      </div>

      <img
        src={project.thumbnail_url}
        alt={project.title}
        className="w-20 h-20 object-cover rounded-xl flex-shrink-0 bg-slate-100"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4 mb-1">
          <div>
            <h3 className="text-base font-bold text-slate-900">{project.title}</h3>
            <p className="text-slate-500 font-medium text-xs">{project.location}</p>
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
        <p className="text-slate-600 line-clamp-1 mb-1.5 text-sm">{project.description}</p>
        <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          <span>{project.images?.length || 0} photos</span>
          {project.completion_date && <span>• {project.completion_date}</span>}
        </div>
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={() => onTogglePublish(project)}
          className="p-2 rounded-lg hover:bg-slate-50 transition-colors text-slate-400 hover:text-slate-900"
          title={project.is_published ? 'Unpublish' : 'Publish'}
        >
          {project.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
        <button
          onClick={() => onEdit(project)}
          className="p-2 rounded-lg hover:bg-slate-50 transition-colors text-slate-400 hover:text-blue-600"
          title="Edit project"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(project)}
          className="p-2 rounded-lg hover:bg-red-50 transition-colors text-slate-400 hover:text-red-600"
          title="Delete project"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, onEditProject }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('analytics');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
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
        .select(`*, images:project_images(*)`)
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
        updateProjectOrder(newItems);
        return newItems;
      });
    }
  };

  const updateProjectOrder = async (orderedProjects: Project[]) => {
    try {
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
      console.error('Failed to update order:', error);
    }
  };

  const handleTogglePublish = async (project: Project) => {
    try {
      const { error: updateError } = await supabase
        .from('projects')
        .update({ is_published: !project.is_published })
        .eq('id', project.id);

      if (updateError) throw updateError;
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

  const activeTabData = TABS.find(t => t.id === activeTab)!;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-navy text-white min-h-screen sticky top-0 max-h-screen">
        <div className="p-6 border-b border-white/10 flex items-center gap-2.5">
          <div className="bg-brand-400 p-1.5 rounded-lg">
            <HardHat className="w-5 h-5 text-navy" />
          </div>
          <div>
            <p className="font-extrabold tracking-tight leading-tight">JAJD Admin</p>
            <p className="text-[10px] text-white/50 font-semibold uppercase tracking-wider">Command Center</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {TABS.map(({ id, label, icon: Icon, blurb }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-start gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                activeTab === id ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon size={18} className={activeTab === id ? 'text-brand-400 mt-0.5' : 'mt-0.5'} />
              <span>
                <span className="block text-sm font-bold">{label}</span>
                <span className="block text-[11px] text-white/40 leading-tight mt-0.5">{blurb}</span>
              </span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noopener"
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-white/60 hover:bg-white/5 hover:text-white transition-colors text-sm font-semibold"
          >
            <ExternalLink size={15} /> View live site
          </a>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-white/60 hover:bg-white/5 hover:text-white transition-colors text-sm font-semibold"
          >
            <LogOut size={15} /> Log out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        {/* Mobile top bar */}
        <div className="md:hidden bg-navy text-white px-4 py-3 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <div className="bg-brand-400 p-1 rounded-md"><HardHat className="w-4 h-4 text-navy" /></div>
            <span className="font-extrabold text-sm">JAJD Admin</span>
          </div>
          <button onClick={onLogout} className="text-white/70 p-2" aria-label="Log out"><LogOut size={18} /></button>
        </div>
        <div className="md:hidden bg-white border-b border-slate-200 px-2 py-2 flex gap-1 overflow-x-auto sticky top-[52px] z-20">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                activeTab === id ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        <main className="p-6 md:p-10 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">{activeTabData.label}</h1>
            <p className="text-slate-500 mt-1">{activeTabData.blurb}</p>
          </div>

          {activeTab === 'analytics' && <AnalyticsDashboard />}
          {activeTab === 'seo' && <SeoManager />}
          {activeTab === 'appearance' && <AppearanceManager />}
          {activeTab === 'services' && <ServicesManager />}

          {activeTab === 'projects' && (
            <>
              <div className="mb-6">
                <button
                  onClick={() => onEditProject(null)}
                  className="flex items-center gap-2.5 px-6 py-3.5 bg-brand-400 text-slate-900 rounded-xl font-bold hover:bg-slate-900 hover:text-white transition-all shadow-card"
                >
                  <Plus className="w-5 h-5" />
                  Add New Project
                </button>
              </div>

              {loading && (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
                </div>
              )}

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

              {!loading && !error && (
                <div className="space-y-4">
                  {projects.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
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
    </div>
  );
};

export default AdminDashboard;
