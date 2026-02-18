import React, { useState, useEffect, useRef } from 'react';
import { X, CheckCircle2, Home, Building2, ChevronRight, Camera, Calendar, ShieldCheck, Clock, PaintRoller, Brush, Palette, Hammer, Store, Award, Star, ListChecks, Construction, PencilRuler, LayoutGrid, Triangle, AlignJustify, Sun, Layers, Upload, Loader2, Paperclip, Trash2 } from 'lucide-react';
import { submitLead, uploadLeadAttachment } from '../utils/api';
import { compressImage } from '../utils/compression';
import { z } from 'zod';
import { leadSchema } from '../utils/schema';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialZip?: string;
}

const QuoteModal: React.FC<QuoteModalProps> = ({ isOpen, onClose, initialZip }) => {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const modalRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState({
    property: 'Residential',
    project: 'Interior Paint', // Default to valid option
    size: 'Medium',
    budget: '$1k - $5k',
    zip: initialZip || '',
    name: '',
    email: '',
    phone: '',
    description: ''
  });

  const [attachments, setAttachments] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Reset modal state when opened
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSubmitted(false);
      setError('');
      setAttachments([]); // Reset attachments
      setFormData(prev => ({ ...prev, zip: initialZip || prev.zip }));
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen, initialZip]);

  // Accessibility: Escape Key and Focus Trap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const validateStep = (): boolean => {
    try {
      if (step === 1) {
        leadSchema.pick({ zip: true }).parse({ zip: formData.zip });
      }
      if (step === 3) {
        leadSchema.pick({ name: true, email: true, phone: true }).parse({
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        });
      }
      setError('');
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      }
      return false;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const validFiles = newFiles.filter(file => file.type.startsWith('image/'));
      
      if (validFiles.length !== newFiles.length) {
        setError('Only image files (JPG, PNG, WEBP) are allowed.');
        // Clear error after 3 seconds
        setTimeout(() => setError(''), 3000);
      }

      setAttachments(prev => [...prev, ...validFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateStep()) {
      return;
    }

    if (step < 3) {
      setStep(step + 1);
    } else {
      setLoading(true);

      // Upload attachments if any
      const uploadedUrls: string[] = [];
      if (attachments.length > 0) {
        console.log(`Starting upload for ${attachments.length} files...`);
        setIsUploading(true);
        for (const file of attachments) {
          try {
            console.log(`Processing file: ${file.name} (Original size: ${file.size})`);
            const compressedFile = await compressImage(file);
            console.log(`Compressed size: ${compressedFile.size}`);
            
            const url = await uploadLeadAttachment(compressedFile);
            if (url) {
                console.log('Got URL:', url);
                uploadedUrls.push(url);
            } else {
                console.error('Upload failed for file:', file.name);
            }
          } catch (error) {
             console.error("Failed to process file", file.name, error);
          }
        }
        setIsUploading(false);
      }
      
      console.log('Final Attachments Payload:', uploadedUrls);

      // Final validation & Sanitization before submit
      try {
        const cleanData = leadSchema.parse({
            ...formData,
            attachments: uploadedUrls
        });
        
        const result = await submitLead(cleanData);
        setLoading(false);
        if (result.success) {
            setSubmitted(true);
        } else {
            setError(result.message || 'Failed to submit. Please try again.');
        }
      } catch (err) {
        console.error("Validation failed", err);
        setLoading(false);
        setError("Please check your inputs and try again.");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center px-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={onClose} />
      
      <div 
        ref={modalRef}
        className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 border border-slate-200 dark:border-slate-700"
      >
        <button 
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors p-2 hover:bg-slate-100 dark:hover:bg-slate-800 z-10 rounded"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div className="p-8 md:p-10">
            <div className="flex gap-2 mb-8" aria-hidden="true">
              {[1, 2, 3].map(i => (
                <div key={i} className={`h-1 flex-1 transition-all duration-500 ${step >= i ? 'bg-[#FACC15]' : 'bg-slate-200 dark:bg-slate-700'}`} />
              ))}
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-red-700 dark:text-red-400 text-sm font-semibold">{error}</p>
              </div>
            )}

            <div className="space-y-2 mb-8">
              <h2 id="modal-title" className="text-2xl font-bold text-slate-900 dark:text-white">
                {step === 1 && "Start Your Build"}
                {step === 2 && "Project Scope"}
                {step === 3 && "Get Your Free Price"}
              </h2>
              <div className="flex items-center justify-between">
                <p className="text-slate-700 dark:text-slate-300 text-sm font-medium">
                  {step === 1 && "Select property type and ZIP to connect."}
                  {step === 2 && "Tell us about the project size and type."}
                  {step === 3 && "Where can we send your professional estimate?"}
                </p>
                <div className="hidden sm:flex items-center gap-2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                   <ShieldCheck size={14} /> No Obligation
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <div className="space-y-6 animate-in slide-in-from-right duration-300">
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      type="button"
                      aria-pressed={formData.property === 'Residential'}
                      onClick={() => setFormData({...formData, property: 'Residential'})}
                      className={`p-5 rounded-md border-2 transition-all text-left space-y-2 ${formData.property === 'Residential' ? 'border-[#FACC15] bg-[#FACC15]/5 dark:bg-[#FACC15]/10' : 'border-slate-200 dark:border-slate-700 hover:border-[#FACC15]/50 dark:hover:border-[#FACC15]/50'}`}
                    >
                      <Home className={`w-5 h-5 ${formData.property === 'Residential' ? 'text-[#FACC15]' : 'text-slate-400 dark:text-slate-500'}`} />
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">Residential</p>
                    </button>
                    <button 
                      type="button"
                      aria-pressed={formData.property === 'Commercial'}
                      onClick={() => setFormData({...formData, property: 'Commercial'})}
                      className={`p-5 rounded-md border-2 transition-all text-left space-y-2 ${formData.property === 'Commercial' ? 'border-[#FACC15] bg-[#FACC15]/5 dark:bg-[#FACC15]/10' : 'border-slate-200 dark:border-slate-700 hover:border-[#FACC15]/50 dark:hover:border-[#FACC15]/50'}`}
                    >
                      <Building2 className={`w-5 h-5 ${formData.property === 'Commercial' ? 'text-[#FACC15]' : 'text-slate-400 dark:text-slate-500'}`} />
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">Commercial</p>
                    </button>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">ZIP Code</label>
                    <input 
                      required 
                      type="text" 
                      maxLength={5}
                      className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-md px-4 py-3 focus:outline-none focus:border-[#FACC15] dark:focus:border-[#FACC15] transition-all text-lg font-semibold text-slate-900 dark:text-white"
                      value={formData.zip}
                      onChange={(e) => setFormData({...formData, zip: e.target.value.replace(/\D/g, '')})}
                      placeholder="68022"
                    />
                  </div>
                  
                  {/* Featured Review */}
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-md border border-slate-200 dark:border-slate-700 italic text-xs text-slate-700 dark:text-slate-300 text-center leading-relaxed">
                    <span className="text-[#CA8A04] text-base leading-none">"</span>
                    They exceeded our expectations and did a fantastic job. Professional, on-time, and great results.
                    <span className="text-[#CA8A04] text-base leading-none">"</span>
                    <div className="mt-2 font-bold text-slate-900 dark:text-white not-italic uppercase tracking-wider text-[10px]">- Verified BBB Review</div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 animate-in slide-in-from-right duration-300">
                  <div className="space-y-2">
                    <label htmlFor="project-type" className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 block mb-2">Service Needed</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {[
                        { name: 'Interior Paint', icon: Layers },
                        { name: 'Exterior Paint', icon: Sun },
                        { name: 'Roofing', icon: Triangle },
                        { name: 'Siding', icon: AlignJustify },
                        { name: 'Cabinets', icon: LayoutGrid },
                        { name: 'Commercial', icon: Building2 }, 
                        { name: 'Remodel', icon: PencilRuler },
                        { name: 'Other', icon: Construction }
                      ].map((type) => (
                        <button
                          key={type.name}
                          type="button"
                          onClick={() => setFormData({...formData, project: type.name})}
                          className={`p-3 rounded-md border-2 text-left transition-all flex flex-col gap-1.5 items-center justify-center text-center h-20 ${
                            formData.project === type.name 
                              ? 'border-[#CA8A04] bg-[#FACC15]/10 dark:bg-[#FACC15]/10' 
                              : 'border-slate-200 dark:border-slate-700 hover:border-[#FACC15]/50 dark:hover:border-[#FACC15]/50 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          <type.icon className={`w-4 h-4 ${formData.project === type.name ? 'text-[#CA8A04]' : 'text-slate-700 dark:text-slate-400'}`} />
                          <span className={`text-[10px] font-bold leading-tight ${formData.project === type.name ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                            {type.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">Project Size</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Small', 'Medium', 'Large'].map(size => (
                        <button 
                          key={size}
                          type="button"
                          onClick={() => setFormData({...formData, size: size})}
                          className={`py-3 rounded-md border-2 text-xs font-bold uppercase tracking-wider transition-all ${formData.size === size ? 'border-[#FACC15] bg-[#FACC15] text-slate-900' : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-[#FACC15]/50 dark:hover:border-[#FACC15]/50'}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">Estimated Budget</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Under $1k', '$1k - $5k', '$5k - $10k', '$10k+'].map(budget => (
                        <button 
                          key={budget}
                          type="button"
                          onClick={() => setFormData({...formData, budget: budget})}
                          className={`py-3 rounded-md border-2 text-xs font-bold uppercase tracking-wider transition-all ${formData.budget === budget ? 'border-[#FACC15] bg-[#FACC15] text-slate-900' : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-[#FACC15]/50 dark:hover:border-[#FACC15]/50'}`}
                        >
                          {budget}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 animate-in slide-in-from-right duration-300">
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-md border border-slate-200 dark:border-slate-700 mb-6">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                       <ListChecks size={14} className="text-[#CA8A04]" /> What's Included:
                    </h4>
                    <ul className="space-y-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                       <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-emerald-500" /> Detailed Cost Breakdown</li>
                       <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-emerald-500" /> Material Recommendations</li>
                       <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-emerald-500" /> Project Timeline</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">Project Details (Optional)</label>
                    <textarea 
                      className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-md px-4 py-3 focus:outline-none focus:border-[#FACC15] dark:focus:border-[#FACC15] min-h-[80px] text-sm resize-none text-slate-900 dark:text-white"
                      placeholder="Tell us a bit about your project (e.g., 'Painting 3 bedrooms and a hallway' or 'Full exterior repaint'). Big or small, we handle it all."
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </div>

                  <div className="space-y-3">
                     <label className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 flex items-center justify-between">
                        <span>Project Photos (Optional)</span>
                        <span className="text-[10px] text-slate-500 font-normal normal-case">Max 5 photos</span>
                     </label>
                     
                     {/* File Input */}
                     <div className="relative">
                       <input 
                          type="file" 
                          multiple 
                          accept="image/*"
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                       />
                       <div className="flex items-center gap-3 p-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                          <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded-full">
                             <Upload className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                          </div>
                          <div>
                             <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Click to upload photos</p>
                             <p className="text-xs text-slate-500 dark:text-slate-400">JPG, PNG, WEBP supported</p>
                          </div>
                       </div>
                     </div>

                     {/* Attachments List */}
                     {attachments.length > 0 && (
                       <div className="grid gap-2">
                         {attachments.map((file, index) => (
                           <div key={index} className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700 text-xs">
                             <div className="flex items-center gap-2 truncate">
                               <Paperclip className="w-3.5 h-3.5 text-[#CA8A04]" />
                               <span className="truncate max-w-[200px] text-slate-700 dark:text-white font-medium">{file.name}</span>
                               <span className="text-slate-400">({(file.size / 1024 / 1024).toFixed(1)} MB)</span>
                             </div>
                             <button 
                               type="button" 
                               onClick={() => removeAttachment(index)}
                               className="text-red-500 hover:text-red-700 p-1"
                             >
                               <Trash2 className="w-4 h-4" />
                             </button>
                           </div>
                         ))}
                       </div>
                     )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">Name</label>
                      <input required className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-md px-4 py-3 focus:outline-none focus:border-[#FACC15] dark:focus:border-[#FACC15] text-slate-900 dark:text-white" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">Phone</label>
                      <input required type="tel" className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-md px-4 py-3 focus:outline-none focus:border-[#FACC15] dark:focus:border-[#FACC15] text-slate-900 dark:text-white" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">Email</label>
                    <input required type="email" className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-md px-4 py-3 focus:outline-none focus:border-[#FACC15] dark:focus:border-[#FACC15] text-slate-900 dark:text-white" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                {step > 1 && (
                  <button 
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="flex-1 border-2 border-slate-300 dark:border-slate-600 py-3.5 rounded-md font-bold uppercase tracking-wider text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-xs"
                  >
                    Back
                  </button>
                )}
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-[2] bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3.5 rounded-md font-bold uppercase tracking-wider hover:bg-[#FACC15] hover:text-slate-900 transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-xs"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {isUploading ? "Uploading..." : "Submitting..."}
                    </>
                  ) : (
                    <>
                      {step === 3 ? "Get My Free Estimate" : "Next Step"} <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Trust Footer */}
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                 <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <Award size={14} className="text-[#CA8A04]" /> Fully Licensed
                 </div>
                 <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <ShieldCheck size={14} className="text-[#CA8A04]" /> Insured
                 </div>
                 <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <Star size={14} className="text-[#CA8A04]" /> 5-Star Rated
                 </div>
              </div>
            </form>
          </div>
        ) : (
          <div className="p-16 text-center space-y-6 animate-in fade-in slide-in-from-bottom duration-700">
            <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Project Logged!</h2>
            <p className="text-slate-700 dark:text-slate-300 max-w-sm mx-auto font-medium">Thank you, {formData.name}. Our master contractor will contact you within 24 hours.</p>
            <button 
              onClick={onClose}
              className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3.5 rounded-md font-bold uppercase tracking-wider hover:bg-[#FACC15] hover:text-slate-900 transition-all"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuoteModal;
