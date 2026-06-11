import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X, CheckCircle2, Home, Building2, ChevronRight, Camera, Calendar, ShieldCheck, Clock, Award, Star, Triangle, Loader2, Paperclip, Trash2, MapPinIcon, QuoteIcon } from 'lucide-react';
import { submitLead, uploadLeadAttachment } from '../utils/api';
import { compressImage } from '../utils/compression';
import { analytics } from '../utils/analytics';
import { z } from 'zod';
import { leadSchema } from '../utils/schema';
import { resolveEstimateFlow } from '../estimateFlows';
import EstimateQuestions, { AnswerMap, summarizeAnswers, firstMissingRequired } from './EstimateQuestions';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialZip?: string;
  /** ISO date (YYYY-MM-DD) pre-selected from the booking calendar. */
  preferredDate?: string;
  /** Quote-form service pre-selected from a project card or search ("Roofing", "Cabinets", ...). */
  initialProject?: string;
  /** The specific project the visitor picked ("Popcorn Ceiling Removal") — prefills the description. */
  initialDetail?: string;
}

const formatPreferredDate = (iso: string): string => {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });
};

const QuoteModal: React.FC<QuoteModalProps> = ({ isOpen, onClose, initialZip, preferredDate, initialProject, initialDetail }) => {
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

  // The questionnaire is chosen from the specific project (or the service type).
  const flow = useMemo(
    () => resolveEstimateFlow(initialDetail, initialProject),
    [initialDetail, initialProject]
  );
  const [answers, setAnswers] = useState<AnswerMap>({});

  const handleAnswer = (id: string, value: string | string[]) =>
    setAnswers(prev => ({ ...prev, [id]: value }));

  // Reset modal state when opened
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSubmitted(false);
      setError('');
      setAttachments([]); // Reset attachments
      setAnswers({});      // Fresh questionnaire each open
      setFormData(prev => ({
        ...prev,
        zip: initialZip || prev.zip,
        project: initialProject || prev.project,
        description: '',
      }));
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen, initialZip, initialProject, initialDetail]);

  // Lock body scroll cleanup on unmount
  useEffect(() => () => { document.body.style.overflow = 'auto'; }, []);

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
      if (step === 2) {
        const missing = firstMissingRequired(flow, answers);
        if (missing) {
          setError(`Please answer: ${missing.label}`);
          return false;
        }
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

  /** Derive the lead's structured fields + notes summary from the questionnaire. */
  const buildLeadPayload = () => {
    const roleAnswer = (role: 'service' | 'size' | 'budget'): string => {
      const q = flow.questions.find(question => question.role === role);
      if (!q) return '';
      const v = answers[q.id];
      return Array.isArray(v) ? v.join(', ') : (v ?? '');
    };

    const project = roleAnswer('service') || (flow.service as string) || formData.project || 'Other';
    const size = roleAnswer('size') || 'Medium';
    const budget = roleAnswer('budget') || '';

    const summary = summarizeAnswers(flow, answers);
    const description = [summary, formData.description.trim()].filter(Boolean).join('\n\n');

    return { project, size, budget, description };
  };

  const MAX_ATTACHMENTS = 5;
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB per image

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const validFiles = newFiles.filter(
        file => file.type.startsWith('image/') && file.size <= MAX_FILE_SIZE
      );

      if (validFiles.length !== newFiles.length) {
        setError('Only image files (JPG, PNG, WEBP) up to 10 MB are allowed.');
        setTimeout(() => setError(''), 4000);
      }

      setAttachments(prev => {
        const combined = [...prev, ...validFiles];
        if (combined.length > MAX_ATTACHMENTS) {
          setError(`Maximum ${MAX_ATTACHMENTS} photos per request.`);
          setTimeout(() => setError(''), 4000);
        }
        return combined.slice(0, MAX_ATTACHMENTS);
      });

      // Allow re-selecting the same file after removal
      e.target.value = '';
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
        setIsUploading(true);
        for (const file of attachments) {
          try {
            const compressedFile = await compressImage(file);
            const url = await uploadLeadAttachment(compressedFile);
            if (url) {
                uploadedUrls.push(url);
            }
          } catch (error) {
             console.error('Failed to process an attachment:', error);
          }
        }
        setIsUploading(false);
      }

      // Final validation & Sanitization before submit
      try {
        const payload = buildLeadPayload();
        const cleanData = leadSchema.parse({
            ...formData,
            project: payload.project,
            size: payload.size,
            budget: payload.budget,
            description: payload.description,
            preferred_date: preferredDate || '',
            attachments: uploadedUrls
        });

        const result = await submitLead(cleanData);
        setLoading(false);
        if (result.success) {
            analytics.leadSubmitted(payload.project, formData.property);
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
                    <div key={i} className={`h-1 flex-1 transition-all duration-500 rounded-full ${step >= i ? 'bg-brand-400' : 'bg-slate-200 dark:bg-slate-700'}`} />
                  ))}
                </div>

                <div className="space-y-1">
                  <h2 id="modal-title" className="text-2xl font-bold text-slate-900 dark:text-white">
                    {step === 1 && "Start your free estimate"}
                    {step === 2 && flow.headline}
                    {step === 3 && "Get your free price"}
                  </h2>
                  <div className="flex items-center justify-between">
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                      {step === 1 && "Property type and ZIP to get started."}
                      {step === 2 && flow.blurb}
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
                  {initialDetail && (
                    <div className="p-4 bg-navy/5 dark:bg-white/5 border border-navy/10 dark:border-white/10 rounded-xl flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-lg bg-brand-400 text-navy flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-slate-400">Your free estimate for</p>
                        <p className="text-base font-extrabold text-slate-900 dark:text-white truncate">{initialDetail}</p>
                      </div>
                    </div>
                  )}
                  {preferredDate && (
                    <div className="p-4 bg-brand-400/10 border border-brand-400/30 rounded-xl flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-brand-600 shrink-0" />
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        Preferred start date: <span className="font-bold">{formatPreferredDate(preferredDate)}</span>
                        <span className="block text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">We'll do our best to build your schedule around this date.</span>
                      </p>
                    </div>
                  )}
                  {step === 1 && (
                    <div className="space-y-6 animate-in slide-in-from-right duration-300">
                      <div className="grid grid-cols-2 gap-4">
                        <button 
                          type="button"
                          aria-pressed={formData.property === 'Residential'}
                          onClick={() => setFormData({...formData, property: 'Residential'})}
                          className={`p-5 rounded-xl border-2 transition-all text-left space-y-3 hover:scale-[1.02] active:scale-[0.98] ${formData.property === 'Residential' ? 'border-brand-400 bg-brand-400/10 dark:bg-brand-400/10 shadow-sm' : 'border-slate-200 dark:border-slate-700 hover:border-brand-400/50 dark:hover:border-brand-400/50'}`}
                        >
                          <div className={`p-3 rounded-full w-fit ${formData.property === 'Residential' ? 'bg-brand-400 text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
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
                          className={`p-5 rounded-xl border-2 transition-all text-left space-y-3 hover:scale-[1.02] active:scale-[0.98] ${formData.property === 'Commercial' ? 'border-brand-400 bg-brand-400/10 dark:bg-brand-400/10 shadow-sm' : 'border-slate-200 dark:border-slate-700 hover:border-brand-400/50 dark:hover:border-brand-400/50'}`}
                        >
                          <div className={`p-3 rounded-full w-fit ${formData.property === 'Commercial' ? 'bg-brand-400 text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
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
                            className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-4 focus:outline-none focus:border-brand-400 dark:focus:border-brand-400 transition-all text-lg font-bold text-slate-900 dark:text-white pl-12"
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
                        <div className="bg-brand-400 text-slate-900 p-2 rounded-full flex-shrink-0">
                            <QuoteIcon size={16} fill="currentColor" />
                        </div>
                        <div>
                            <p className="italic text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                "JAJD exceeded my expectations by a mile. From the first meeting to the final day of work, they were excellent."
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                                <div className="flex text-brand-400">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Richard L. • BBB Review</span>
                            </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <EstimateQuestions flow={flow} answers={answers} onChange={handleAnswer} />
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
                          className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-400 dark:focus:border-brand-400 min-h-[120px] text-sm resize-none text-slate-900 dark:text-white leading-relaxed"
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
                           <div className="flex items-center gap-4 p-6 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl group-hover:bg-slate-50 dark:group-hover:bg-slate-800/50 group-hover:border-brand-400 transition-all">
                              <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-full group-hover:bg-brand-400 group-hover:text-slate-900 transition-colors">
                                 <Camera className="w-6 h-6 text-slate-400 dark:text-slate-400 group-hover:text-slate-900" />
                              </div>
                              <div>
                                 <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">Click to upload photos</p>
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
                          <input required className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-400 dark:focus:border-brand-400 text-slate-900 dark:text-white font-medium" placeholder="John Doe" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">Phone Number</label>
                          <input required type="tel" className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-400 dark:focus:border-brand-400 text-slate-900 dark:text-white font-medium" placeholder="(402) 555-0123" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">Email Address</label>
                        <input required type="email" className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-400 dark:focus:border-brand-400 text-slate-900 dark:text-white font-medium" placeholder="john@example.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
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
                    className="flex-[2] bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-brand-400 hover:text-slate-900 transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-xs shadow-lg"
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
              className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-10 py-5 rounded-xl font-bold uppercase tracking-wider hover:bg-brand-400 hover:text-slate-900 transition-all shadow-xl mt-8"
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
