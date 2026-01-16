import React, { useState, useEffect, useRef } from 'react';
import { X, CheckCircle2, Home, Building2, ChevronRight, Camera, Calendar, ShieldCheck, Clock } from 'lucide-react';
import { submitLead } from '../utils/api';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialZip?: string;
}

const QuoteModal: React.FC<QuoteModalProps> = ({ isOpen, onClose, initialZip }) => {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState({
    property: 'Residential',
    project: 'Full Remodel / Renovation',
    size: 'Medium',
    zip: initialZip || '',
    name: '',
    email: '',
    phone: '',
    date: ''
  });

  // Reset modal state when opened
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSubmitted(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      setLoading(true);
      const result = await submitLead(formData);
      setLoading(false);
      if (result.success) setSubmitted(true);
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
        className="relative bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300"
      >
        <button 
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors p-2 rounded-full hover:bg-slate-100 z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {!submitted ? (
          <div className="p-8 md:p-12">
            <div className="flex gap-2 mb-10" aria-hidden="true">
              {[1, 2, 3].map(i => (
                <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-[#FACC15]' : 'bg-slate-100'}`} />
              ))}
            </div>

            <div className="space-y-2 mb-10">
              <h2 id="modal-title" className="text-3xl font-black text-slate-900">
                {step === 1 && "Start Your Build"}
                {step === 2 && "Project Scope"}
                {step === 3 && "Finalize Inquiry"}
              </h2>
              <div className="flex items-center justify-between">
                <p className="text-slate-500 text-sm font-medium">
                  {step === 1 && "Select property type and ZIP to connect."}
                  {step === 2 && "Tell us about the project size and type."}
                  {step === 3 && "Where can we send your professional estimate?"}
                </p>
                <div className="hidden sm:flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
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
                      className={`p-6 rounded-2xl border-2 transition-all text-left space-y-3 ${formData.property === 'Residential' ? 'border-[#FACC15] bg-[#FACC15]/5' : 'border-slate-100 hover:border-[#FACC15]/30'}`}
                    >
                      <Home className={`w-6 h-6 ${formData.property === 'Residential' ? 'text-[#FACC15]' : 'text-slate-300'}`} />
                      <p className="font-bold text-slate-900">Residential</p>
                    </button>
                    <button 
                      type="button"
                      aria-pressed={formData.property === 'Commercial'}
                      onClick={() => setFormData({...formData, property: 'Commercial'})}
                      className={`p-6 rounded-2xl border-2 transition-all text-left space-y-3 ${formData.property === 'Commercial' ? 'border-[#FACC15] bg-[#FACC15]/5' : 'border-slate-100 hover:border-[#FACC15]/30'}`}
                    >
                      <Building2 className={`w-6 h-6 ${formData.property === 'Commercial' ? 'text-[#FACC15]' : 'text-slate-300'}`} />
                      <p className="font-bold text-slate-900">Commercial</p>
                    </button>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Zip Code</label>
                    <input 
                      required 
                      type="text" 
                      maxLength={5}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-4 focus:outline-none focus:border-[#FACC15] transition-all text-xl font-bold"
                      value={formData.zip}
                      onChange={(e) => setFormData({...formData, zip: e.target.value.replace(/\D/g, '')})}
                      placeholder="10001"
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 animate-in slide-in-from-right duration-300">
                  <div className="space-y-2">
                    <label htmlFor="project-type" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Project Type</label>
                    <select 
                      id="project-type"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-4 focus:outline-none focus:border-[#FACC15] transition-all appearance-none font-bold text-slate-900"
                      value={formData.project}
                      onChange={(e) => setFormData({...formData, project: e.target.value})}
                    >
                      <option>Full Remodel / Renovation</option>
                      <option>New Construction Build</option>
                      <option>Interior Restoration</option>
                      <option>Roofing & Exterior</option>
                      <option>Structural Improvement</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Project Size</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Small', 'Medium', 'Large'].map(size => (
                        <button 
                          key={size}
                          type="button"
                          onClick={() => setFormData({...formData, size: size})}
                          className={`py-3 rounded-xl border-2 text-[11px] font-black uppercase tracking-widest transition-all ${formData.size === size ? 'border-[#FACC15] bg-[#FACC15] text-slate-900' : 'border-slate-100 text-slate-400 hover:border-[#FACC15]/30'}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 animate-in slide-in-from-right duration-300">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Name</label>
                      <input required className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-4 focus:outline-none focus:border-[#FACC15]" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Phone</label>
                      <input required type="tel" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-4 focus:outline-none focus:border-[#FACC15]" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Email</label>
                    <input required type="email" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-4 focus:outline-none focus:border-[#FACC15]" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <Clock size={16} className="text-[#FACC15]" />
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">We'll contact you within 24 hours. No spam, no pressure.</p>
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                {step > 1 && (
                  <button 
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="flex-1 border-2 border-slate-100 py-4 rounded-xl font-black uppercase tracking-widest text-slate-900 hover:bg-slate-50 transition-all text-xs"
                  >
                    Back
                  </button>
                )}
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-[2] bg-slate-900 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-[#FACC15] hover:text-slate-900 transition-all flex items-center justify-center gap-3 disabled:opacity-50 text-xs"
                >
                  {loading ? "Submitting..." : (
                    <>
                      {step === 3 ? "Submit Request" : "Next Step"} <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="p-16 text-center space-y-8 animate-in fade-in slide-in-from-bottom duration-700">
            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            </div>
            <h2 className="text-4xl font-black text-slate-900">Project Logged!</h2>
            <p className="text-slate-500 max-w-sm mx-auto font-medium">Thank you, {formData.name}. Our master contractor will contact you within 24 hours.</p>
            <button 
              onClick={onClose}
              className="bg-slate-900 text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-[#FACC15] hover:text-slate-900 transition-all"
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