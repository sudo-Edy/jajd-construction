import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, ShieldCheck, MapPin, Calendar as CalendarIcon, ArrowRight } from 'lucide-react';

interface BookingCalendarProps {
  onOpenQuote: () => void;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({ onOpenQuote }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Generate calendar days
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Pseudo-randomly determine availability for demo purposes
  // In a real app, this would fetch from an API
  const getDayStatus = (day: number) => {
    // Weekends are "Booked" for master crews typically
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dayOfWeek = date.getDay();
    
    // Past dates
    if (date < new Date(new Date().setHours(0,0,0,0))) return 'past';
    
    // Random "Booked" slots to create urgency (seeding based on day)
    if (day % 3 === 0 || day % 5 === 0) return 'booked';
    if (dayOfWeek === 0 || dayOfWeek === 6) return 'limited';
    
    return 'available';
  };

  return (
    <section className="py-24 px-6 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-[3rem] p-8 md:p-16 overflow-hidden relative border-b-8 border-[#FACC15] shadow-2xl">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FACC15]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
                {/* Text Content */}
                <div className="space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FACC15]/10 border border-[#FACC15]/20 text-[#FACC15] text-xs font-bold uppercase tracking-widest">
                        <Clock size={14} /> 2026 Schedule Filling Fast
                    </div>
                    
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight">
                        Secure Your <br/>
                        <span className="text-[#FACC15]">Start Date.</span>
                    </h2>
                    
                    <p className="text-slate-500 text-lg leading-relaxed font-medium max-w-lg">
                        Our master crews maintain a strict timeline to ensure quality. Check our availability below and request your consultation to lock in your slot.
                    </p>

                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4 text-slate-700 font-bold p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
                            <span>Available for Consultation</span>
                        </div>
                        <div className="flex items-center gap-4 text-slate-700 font-bold p-4 bg-slate-50 rounded-2xl border border-slate-100 opacity-60">
                            <div className="w-3 h-3 rounded-full bg-slate-500" />
                            <span>Fully Booked</span>
                        </div>
                    </div>

                    <button 
                        onClick={onOpenQuote}
                        className="w-fit bg-[#FACC15] text-slate-900 px-10 py-5 rounded-xl font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center gap-3 text-sm"
                    >
                        Request Priority Access <ArrowRight size={18} />
                    </button>
                </div>

                {/* Interactive Calendar - White Theme */}
                <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden ring-1 ring-slate-900/5">
                    {/* Live Badge */}
                    <div className="absolute top-6 right-6 md:top-8 md:right-8 flex items-center gap-2 bg-slate-50 backdrop-blur rounded-full px-3 py-1.5 border border-slate-100 z-10">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Live</span>
                    </div>

                    <div className="flex items-center justify-between mb-8 pt-4 relative z-10">
                        <h3 className="text-2xl font-black text-slate-900">
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h3>
                        <div className="flex gap-2">
                             <button 
                                onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
                                className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-slate-900 transition-colors"
                                disabled={new Date(currentDate.getFullYear(), currentDate.getMonth(), 1) < new Date()}
                             >
                                <ChevronLeft />
                             </button>
                             <button 
                                onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
                                className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-slate-900 transition-colors"
                             >
                                <ChevronRight />
                             </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-2 md:gap-4 mb-4 text-center">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                            <div key={day} className="text-slate-400 text-xs font-bold uppercase">{day}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-2 md:gap-4">
                        {[...Array(firstDay)].map((_, i) => (
                            <div key={`empty-${i}`} />
                        ))}
                        {[...Array(daysInMonth)].map((_, i) => {
                            const day = i + 1;
                            const status = getDayStatus(day);
                            
                            return (
                                <button
                                    key={day}
                                    disabled={status === 'past' || status === 'booked'}
                                    onClick={onOpenQuote}
                                    className={`
                                        aspect-square rounded-xl md:rounded-2xl flex flex-col items-center justify-center relative group transition-all duration-300
                                        ${status === 'available' ? 'bg-emerald-50 hover:bg-emerald-500 hover:scale-110 cursor-pointer border border-emerald-100 hover:border-emerald-500 shadow-sm' : ''}
                                        ${status === 'limited' ? 'bg-[#FACC15]/10 hover:bg-[#FACC15] hover:scale-110 cursor-pointer border border-[#FACC15]/20 hover:border-[#FACC15] shadow-sm' : ''}
                                        ${status === 'booked' ? 'bg-slate-50 text-slate-300 cursor-not-allowed' : ''}
                                        ${status === 'past' ? 'opacity-20 cursor-not-allowed' : ''}
                                    `}
                                >
                                    <span className={`text-sm md:text-lg font-bold ${status === 'available' ? 'text-emerald-600 group-hover:text-white' : status === 'limited' ? 'text-[#FACC15] group-hover:text-slate-900' : 'text-slate-300'}`}>
                                        {day}
                                    </span>
                                    
                                    {/* Tooltip for interaction */}
                                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold py-1 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-slate-700 shadow-xl z-20">
                                        {status === 'available' && "Open - Click to Book"}
                                        {status === 'limited' && "High Demand"}
                                        {status === 'booked' && "Fully Booked"}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-400">
                        <div className="flex items-center gap-2">
                             <MapPin size={14} className="text-[#FACC15]" /> Available in your area
                        </div>
                        <div>
                             * Dates estimated
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default BookingCalendar;
