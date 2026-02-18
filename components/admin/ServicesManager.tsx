import React, { useState, useEffect, useRef } from 'react';
import { supabase, uploadProjectImage } from '../../utils/supabase';
import { Service } from '../../types';
import { Plus, Edit, Trash2, Loader2, GripVertical, Save, X, Upload } from 'lucide-react';
import imageCompression from 'browser-image-compression';
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

interface ServicesManagerProps {
  // no props needed for now
}

// Sortable Service Item
const SortableServiceItem = ({ service, onEdit, onDelete }: { service: Service, onEdit: (s: Service) => void, onDelete: (s: Service) => void }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: service.id });

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
      <div {...attributes} {...listeners} className="cursor-grab hover:text-slate-900 text-slate-400 p-2">
        <GripVertical className="w-6 h-6" />
      </div>

      <img
        src={service.image_url}
        alt={service.title}
        className="w-16 h-16 object-cover rounded-md flex-shrink-0 bg-slate-100"
      />

      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-bold text-slate-900">{service.title}</h3>
        <p className="text-slate-500 text-sm line-clamp-1">{service.description}</p>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onEdit(service)}
          className="p-2 rounded-md hover:bg-slate-50 transition-colors text-slate-400 hover:text-blue-600"
          title="Edit service"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(service)}
          className="p-2 rounded-md hover:bg-red-50 transition-colors text-slate-400 hover:text-red-600"
          title="Delete service"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const ServicesManager: React.FC<ServicesManagerProps> = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setServices((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        // Update order in Supabase
        updateServiceOrder(newItems);
        
        return newItems;
      });
    }
  };

  const updateServiceOrder = async (orderedServices: Service[]) => {
    try {
      const updates = orderedServices.map((service, index) => ({
        id: service.id,
        display_order: index,
      }));

      for (const update of updates) {
         await supabase
          .from('services')
          .update({ display_order: update.display_order })
          .eq('id', update.id);
      }
    } catch (error) {
      console.error("Failed to update order:", error);
    }
  };

  const handleDelete = async (service: Service) => {
    if (!confirm(`Are you sure you want to delete "${service.title}"?`)) return;

    try {
      const { error } = await supabase.from('services').delete().eq('id', service.id);
      if (error) throw error;
      setServices(prev => prev.filter(s => s.id !== service.id));
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Failed to delete service');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService?.title || !editingService?.description || !editingService?.image_url) {
      alert('Please fill in all fields');
      return;
    }

    setSaving(true);
    try {
      const serviceData = {
        title: editingService.title,
        description: editingService.description,
        image_url: editingService.image_url,
        display_order: editingService.id ? editingService.display_order : services.length,
      };

      if (editingService.id) {
        // Update
        const { error } = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', editingService.id);
        if (error) throw error;
      } else {
        // Create
        const { error } = await supabase
          .from('services')
          .insert([serviceData]);
        if (error) throw error;
      }

      await fetchServices();
      setIsModalOpen(false);
      setEditingService(null);
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  const openEditModal = (service: Service | null) => {
    setEditingService(service || { title: '', description: '', image_url: '' });
    setImageUploading(false);
    setImageError(null);
    setIsModalOpen(true);
  };

  const handleImageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    void processServiceImageUpload(file);
    e.target.value = '';
  };

  const processServiceImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setImageError('Please select an image file');
      return;
    }

    try {
      setImageError(null);
      setImageUploading(true);

      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);
      const imageUrl = await uploadProjectImage(compressedFile, 'services');

      setEditingService(prev => (prev ? { ...prev, image_url: imageUrl } : prev));
    } catch (error: any) {
      console.error('Service image upload error:', error);
      setImageError(error.message || 'Failed to upload image');
    } finally {
      setImageUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-200">
        <div>
          <h2 className="text-xl font-black text-slate-900">Services List</h2>
          <p className="text-slate-500 text-sm">Drag to reorder how they appear on the homepage</p>
        </div>
        <button
          onClick={() => openEditModal(null)}
          className="flex items-center gap-2 px-6 py-3 bg-[#FACC15] text-slate-900 rounded-lg font-bold uppercase tracking-wider text-xs hover:bg-slate-900 hover:text-white transition-all shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Add Service
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-[#FACC15] animate-spin" />
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={services.map(s => s.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {services.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-slate-200">
                    <p className="text-slate-500 font-medium">No services found. Add one to get started.</p>
                </div>
              ) : (
                services.map(service => (
                  <SortableServiceItem
                    key={service.id}
                    service={service}
                    onEdit={openEditModal}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Edit Modal */}
      {isModalOpen && editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-slate-900">
                {editingService.id ? 'Edit Service' : 'Add New Service'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Service Title</label>
                <input
                  type="text"
                  value={editingService.title}
                  onChange={e => setEditingService({ ...editingService, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#FACC15] focus:ring-0 transition-colors bg-slate-50"
                  placeholder="e.g. Interior Painting"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                <textarea
                  value={editingService.description}
                  onChange={e => setEditingService({ ...editingService, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#FACC15] focus:ring-0 transition-colors bg-slate-50 h-32 resize-none"
                  placeholder="Describe the service..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Service Image</label>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    disabled={imageUploading}
                    className="flex items-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-lg font-bold uppercase tracking-wider text-xs hover:bg-[#FACC15] hover:text-slate-900 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <Upload className="w-4 h-4" />
                    {imageUploading ? 'Uploading...' : 'Upload Image'}
                  </button>
                  {editingService.image_url && (
                    <button
                      type="button"
                      onClick={() => setEditingService({ ...editingService, image_url: '' })}
                      className="px-4 py-3 border border-slate-200 text-slate-700 rounded-lg font-bold uppercase tracking-wider text-xs hover:bg-slate-50 transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Auto-compressed before upload
                </p>
                {imageError && (
                  <p className="text-xs text-red-600 font-bold mt-2">{imageError}</p>
                )}
                {editingService.image_url && (
                  <div className="mt-4 relative h-40 rounded-lg overflow-hidden border border-slate-200">
                    <img
                      src={editingService.image_url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageInput}
                  className="hidden"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-4 bg-[#FACC15] text-slate-900 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-slate-900 hover:text-white transition-all shadow-lg flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Service
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesManager;
