import React, { useState, useEffect, useRef } from 'react';
import { X, CheckCircle2, Home, Building2, ChevronRight, Camera, Calendar, ShieldCheck, Clock, PaintRoller, Brush, Palette, Hammer, Store, Award, Star, ListChecks, Construction, PencilRuler, LayoutGrid, Triangle, AlignJustify, Sun, Layers, Upload, Loader2, Paperclip, Trash2, MapPinIcon, QuoteIcon } from 'lucide-react';
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
          <div className="flex flex-col max-h-[90vh]">
            {/* Header - Fixed */}
            <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
                <div className="flex gap-2 mb-6" aria-hidden="true">
                  {[1, 2, 3].map(i => (
                    <div key={i} className={`h-1 flex-1 transition-all duration-500 rounded-full ${step >= i ? 'bg-[#FACC15]' : 'bg-slate-200 dark:bg-slate-700'}`} />
                  ))}
                </div>

                <div className="space-y-1">
                  <h2 id="modal-title" className="text-2xl font-bold text-slate-900 dark:text-white">
                    {step === 1 && "Start Your Build"}
                    {step === 2 && "Project Scope"}
                    {step === 3 && "Get Your Free Price"}
                  </h2>
                  <div className="flex items-center justify-between">
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                      {step === 1 && "Select property type and ZIP to connect."}
                      {step === 2 && "Tell us about the project size and type."}
                      {step === 3 && "Where can we send your professional estimate?"}
                    </p>
                    <div className="hidden sm:flex items-center gap-2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded">
                       <ShieldCheck size={14} /> No Obligation
                    </div>
                  </div>
                </div>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                {error && (
                  <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md flex items-start gap-3">
                    <div className="bg-red-100 dark:bg-red-900/40 p-1 rounded-full text-red-600 dark:text-red-400">
                        <Triangle className="w-4 h-4" />
                    </div>
                    <div>
                        <h4 className="text-red-800 dark:text-red-300 font-bold text-sm">Action Required</h4>
                        <p className="text-red-700 dark:text-red-400 text-sm mt-1">{error}</p>
                    </div>
                  </div>
                )}

                <form id="quote-form" onSubmit={handleSubmit} className="space-y-6">
                  {step === 1 && (
                    <div className="space-y-6 animate-in slide-in-from-right duration-300">
                      <div className="grid grid-cols-2 gap-4">
                        <button 
                          type="button"
                          aria-pressed={formData.property === 'Residential'}
                          onClick={() => setFormData({...formData, property: 'Residential'})}
                          className={`p-5 rounded-xl border-2 transition-all text-left space-y-3 hover:scale-[1.02] active:scale-[0.98] ${formData.property === 'Residential' ? 'border-[#FACC15] bg-[#FACC15]/10 dark:bg-[#FACC15]/10 shadow-sm' : 'border-slate-200 dark:border-slate-700 hover:border-[#FACC15]/50 dark:hover:border-[#FACC15]/50'}`}
                        >
                          <div className={`p-3 rounded-full w-fit ${formData.property === 'Residential' ? 'bg-[#FACC15] text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                             <Home className="w-6 h-6" />
                          </div>
                          <div>
                              <p className="font-bold text-slate-900 dark:text-white">Residential</p>
                              <p className="text-xs text-slate-500 font-medium mt-1">Home renovations & repairs</p>
                          </div>
                        </button>
                        <button 
                          type="button"
                          aria-pressed={formData.property === 'Commercial'}
                          onClick={() => setFormData({...formData, property: 'Commercial'})}
                          className={`p-5 rounded-xl border-2 transition-all text-left space-y-3 hover:scale-[1.02] active:scale-[0.98] ${formData.property === 'Commercial' ? 'border-[#FACC15] bg-[#FACC15]/10 dark:bg-[#FACC15]/10 shadow-sm' : 'border-slate-200 dark:border-slate-700 hover:border-[#FACC15]/50 dark:hover:border-[#FACC15]/50'}`}
                        >
                          <div className={`p-3 rounded-full w-fit ${formData.property === 'Commercial' ? 'bg-[#FACC15] text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                             <Building2 className="w-6 h-6" />
                          </div>
                          <div>
                              <p className="font-bold text-slate-900 dark:text-white">Commercial</p>
                              <p className="text-xs text-slate-500 font-medium mt-1">Office, Retail & Industrial</p>
                          </div>
                        </button>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">Project ZIP Code</label>
                        <div className="relative">
                            <input 
                            required 
                            type="text" 
                            maxLength={5}
                            className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-4 focus:outline-none focus:border-[#FACC15] dark:focus:border-[#FACC15] transition-all text-lg font-bold text-slate-900 dark:text-white pl-12"
                            value={formData.zip}
                            onChange={(e) => setFormData({...formData, zip: e.target.value.replace(/\D/g, '')})}
                            placeholder="68022"
                            />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <MapPinIcon className="w-5 h-5" />
                            </div>
                        </div>
                      </div>
                      
                      {/* Featured Review */}
                      <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 flex gap-4 items-start">
                        <div className="bg-[#FACC15] text-slate-900 p-2 rounded-full flex-shrink-0">
                            <QuoteIcon size={16} fill="currentColor" />
                        </div>
                        <div>
                            <p className="italic text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                "They exceeded our expectations... Professional, on-time, and great results."
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                                <div className="flex text-[#FACC15]">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sarah J. • Verified BBB Review</span>
                            </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-8 animate-in slide-in-from-right duration-300">
                      <div className="space-y-3">
                        <label htmlFor="project-type" className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 block">Service Needed</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
                              className={`p-3 rounded-xl border-2 text-left transition-all flex flex-col gap-2 items-center justify-center text-center h-24 hover:shadow-sm ${
                                formData.project === type.name 
                                  ? 'border-[#CA8A04] bg-[#FACC15]/10 dark:bg-[#FACC15]/10 shadow-inner' 
                                  : 'border-slate-200 dark:border-slate-700 hover:border-[#FACC15]/50 dark:hover:border-[#FACC15]/50 hover:bg-slate-50 dark:hover:bg-slate-800'
                              }`}
                            >
                              <type.icon className={`w-6 h-6 ${formData.project === type.name ? 'text-[#CA8A04]' : 'text-slate-400 dark:text-slate-500'}`} />
                              <span className={`text-[11px] font-bold leading-tight ${formData.project === type.name ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                                {type.name}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">Project Size</label>
                        <div className="grid grid-cols-3 gap-3">
                          {['Small', 'Medium', 'Large'].map(size => (
                            <button 
                              key={size}
                              type="button"
                              onClick={() => setFormData({...formData, size: size})}
                              className={`py-4 rounded-xl border-2 text-xs font-bold uppercase tracking-wider transition-all hover:shadow-sm ${formData.size === size ? 'border-[#FACC15] bg-[#FACC15] text-slate-900 shadow-md' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-[#FACC15]/50 dark:hover:border-[#FACC15]/50 bg-slate-50 dark:bg-slate-800'}`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">Estimated Budget</label>
                        <div className="grid grid-cols-2 gap-3">
                          {['Under $1k', '$1k - $5k', '$5k - $10k', '$10k+'].map(budget => (
                            <button 
                              key={budget}
                              type="button"
                              onClick={() => setFormData({...formData, budget: budget})}
                              className={`py-4 rounded-xl border-2 text-xs font-bold uppercase tracking-wider transition-all hover:shadow-sm ${formData.budget === budget ? 'border-[#FACC15] bg-[#FACC15] text-slate-900 shadow-md' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-[#FACC15]/50 dark:hover:border-[#FACC15]/50 bg-slate-50 dark:bg-slate-800'}`}
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
                      <div className="bg-emerald-50 dark:bg-emerald-900/10 p-5 rounded-xl border border-emerald-100 dark:border-emerald-900/30 mb-6">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 mb-3 flex items-center gap-2">
                           <Award size={16} /> What You'll Receive:
                        </h4>
                        <ul className="space-y-2 text-sm font-medium text-emerald-900 dark:text-emerald-100">
                           <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Professional On-Site Assessment</li>
                           <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Detailed Material & Labor Breakdown</li>
                           <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Guaranteed Price Valid for 30 Days</li>
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">Project Details (Optional)</label>
                        <textarea 
                          className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-[#FACC15] dark:focus:border-[#FACC15] min-h-[120px] text-sm resize-none text-slate-900 dark:text-white leading-relaxed"
                          placeholder="Tell us a bit about your project (e.g., 'Painting 3 bedrooms and a hallway' or 'Full exterior repaint'). Big or small, we handle it all."
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />
                      </div>

                      <div className="space-y-3">
                         <label className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 flex items-center justify-between">
                            <span>Project Photos (Optional)</span>
                            <span className="text-[10px] text-slate-400 font-bold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">MAX 5</span>
                         </label>
                         
                         {/* File Input */}
                         <div className="relative group">
                           <input 
                              type="file" 
                              multiple 
                              accept="image/*"
                              onChange={handleFileChange}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                           />
                           <div className="flex items-center gap-4 p-6 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl group-hover:bg-slate-50 dark:group-hover:bg-slate-800/50 group-hover:border-[#FACC15] transition-all">
                              <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-full group-hover:bg-[#FACC15] group-hover:text-slate-900 transition-colors">
                                 <Camera className="w-6 h-6 text-slate-400 dark:text-slate-400 group-hover:text-slate-900" />
                              </div>
                              <div>
                                 <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#CA8A04] transition-colors">Click to upload photos</p>
                                 <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">JPG, PNG, WEBP supported</p>
                              </div>
                           </div>
                         </div>

                         {/* Attachments List - Scrollable if too many */}
                         {attachments.length > 0 && (
                           <div className="grid gap-2 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                             {attachments.map((file, index) => (
                               <div key={index} className="flex items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                                 <div className="flex items-center gap-3 truncate">
                                   <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center flex-shrink-0 text-slate-400">
                                      <Paperclip size={14} />
                                   </div>
                                   <div className="truncate">
                                      <p className="text-xs font-bold text-slate-700 dark:text-white truncate max-w-[180px]">{file.name}</p>
                                      <p className="text-[10px] text-slate-400">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                                   </div>
                                 </div>
                                 <button 
                                   type="button" 
                                   onClick={() => removeAttachment(index)}
                                   className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-all"
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
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">Your Name</label>
                          <input required className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-[#FACC15] dark:focus:border-[#FACC15] text-slate-900 dark:text-white font-medium" placeholder="John Doe" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">Phone Number</label>
                          <input required type="tel" className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-[#FACC15] dark:focus:border-[#FACC15] text-slate-900 dark:text-white font-medium" placeholder="(402) 555-0123" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">Email Address</label>
                        <input required type="email" className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-[#FACC15] dark:focus:border-[#FACC15] text-slate-900 dark:text-white font-medium" placeholder="john@example.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                      </div>
                    </div>
                  )}
                </form>
            </div>

            {/* Footer - Fixed */}
            <div className="p-6 md:p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex-shrink-0 z-10">
                <div className="flex gap-4">
                    {step > 1 && (
                    <button 
                        type="button"
                        onClick={() => setStep(step - 1)}
                        className="flex-1 border-2 border-slate-300 dark:border-slate-600 py-4 rounded-xl font-bold uppercase tracking-wider text-slate-900 dark:text-white hover:bg-white dark:hover:bg-slate-800 transition-all text-xs"
                    >
                        Back
                    </button>
                    )}
                    <button 
                    type="submit" 
                    form="quote-form" // Link to form
                    disabled={loading}
                    className="flex-[2] bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-[#FACC15] hover:text-slate-900 transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-xs shadow-lg"
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
                
                {/* Trust Badges in Footer for Visibility */}
                <div className="mt-4 flex justify-center items-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        <ShieldCheck size={14} /> Fully Insured
                    </div>
                    <div className="w-1 h-1 bg-slate-300 rounded-full" />
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        <Award size={14} /> Licensed
                    </div>
                </div>
            </div>
          </div>
        ) : (
          <div className="p-16 text-center space-y-6 animate-in fade-in slide-in-from-bottom duration-700 h-full flex flex-col items-center justify-center">
            <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Project Logged!</h2>
            <p className="text-slate-600 dark:text-slate-300 max-w-sm mx-auto font-medium text-lg leading-relaxed">
                Thank you, <span className="text-slate-900 dark:text-white font-bold">{formData.name}</span>.<br/>Our master contractor will review your project and contact you within 24 hours.
            </p>
            <button 
              onClick={onClose}
              className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-10 py-5 rounded-xl font-bold uppercase tracking-wider hover:bg-[#FACC15] hover:text-slate-900 transition-all shadow-xl mt-8"
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
