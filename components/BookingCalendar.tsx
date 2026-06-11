import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, CalendarCheck, MapPin, ArrowRight } from 'lucide-react';
import { analytics } from '../utils/analytics';

interface BookingCalendarProps {
  onOpenQuote: () => void;
  /** Called with an ISO date (YYYY-MM-DD) when the visitor picks a preferred start date. */
  onSelectDate: (date: string) => void;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// Booking window: from the current month through the end of next year.
const today = new Date();
const MIN_MONTH = new Date(today.getFullYear(), today.getMonth(), 1);
const MAX_MONTH = new Date(today.getFullYear() + 1, 11, 1);

type DayStatus = 'past' | 'available' | 'weekend';

const BookingCalendar: React.FC<BookingCalendarProps> = ({ onOpenQuote, onSelectDate }) => {
  const [viewMonth, setViewMonth] = useState<Date>(MIN_MONTH);

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const canGoPrev = viewMonth > MIN_MONTH;
  const canGoNext = viewMonth < MAX_MONTH;

  const changeMonth = (delta: number) => {
    setViewMonth(prev => {
      const next = new Date(prev.getFullYear(), prev.getMonth() + delta, 1);
      if (next < MIN_MONTH || next > MAX_MONTH) return prev;
      return next;
    });
  };

  const getDayStatus = (day: number): DayStatus => {
    const date = new Date(year, month, day);
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    if (date < startOfToday) return 'past';
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) return 'weekend';
    return 'available';
  };

  const handleDayClick = (day: number) => {
    const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    analytics.calendarDateSelected(iso);
    onSelectDate(iso);
  };

  return (
    <section id="schedule" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-stone-50 rounded-3xl p-8 md:p-14 overflow-hidden relative border border-stone-200 shadow-card">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-400/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
            {/* Text content */}
            <div className="space-y-7">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-400/15 border border-brand-400/30 text-brand-700 text-xs font-bold uppercase tracking-widest">
                <Clock size={14} /> {today.getFullYear()} schedule filling fast
              </div>

              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
                Pick your preferred <span className="text-brand-600">start date.</span>
              </h2>

              <p className="text-stone-600 text-lg leading-relaxed max-w-lg">
                Choose the date that works best for you and we'll build your free estimate
                around it. We confirm every consultation within 24 hours, and weekday slots
                book up first.
              </p>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 text-slate-700 font-semibold p-4 bg-white rounded-xl border border-stone-200">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  Weekdays are open for consultations
                </div>
                <div className="flex items-center gap-3 text-stone-600 font-semibold p-4 bg-white rounded-xl border border-stone-200">
                  <span className="w-3 h-3 rounded-full bg-brand-400" />
                  Weekends have limited availability
                </div>
              </div>

              <button
                onClick={onOpenQuote}
                className="w-fit bg-navy text-white px-8 py-4 rounded-xl font-bold hover:bg-brand-400 hover:text-navy transition-all duration-300 shadow-xl flex items-center gap-3 active:scale-95"
              >
                No date in mind? Just get a quote <ArrowRight size={18} />
              </button>
            </div>

            {/* Calendar */}
            <div className="bg-white border border-stone-200 rounded-3xl p-6 md:p-8 shadow-card-hover relative">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl md:text-2xl font-extrabold text-slate-900">
                  {MONTH_NAMES[month]} {year}
                </h3>
                <div className="flex gap-1">
                   <button
                      onClick={() => changeMonth(-1)}
                      disabled={!canGoPrev}
                      aria-label="Previous month"
                      className="p-2.5 hover:bg-slate-100 rounded-xl text-stone-600 hover:text-slate-900 transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
                   >
                      <ChevronLeft size={20} />
                   </button>
                   <button
                      onClick={() => changeMonth(1)}
                      disabled={!canGoNext}
                      aria-label="Next month"
                      className="p-2.5 hover:bg-slate-100 rounded-xl text-stone-600 hover:text-slate-900 transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
                   >
                      <ChevronRight size={20} />
                   </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1.5 md:gap-2 mb-3 text-center">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                  <div key={day} className="text-slate-400 text-[11px] font-bold uppercase py-1">{day}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1.5 md:gap-2">
                {[...Array(firstDay)].map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {[...Array(daysInMonth)].map((_, i) => {
                  const day = i + 1;
                  const status = getDayStatus(day);
                  const isToday =
                    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

                  return (
                    <button
                      key={day}
                      disabled={status === 'past'}
                      onClick={() => handleDayClick(day)}
                      aria-label={`Request ${MONTH_NAMES[month]} ${day}, ${year} as preferred start date`}
                      className={`
                        aspect-square rounded-xl flex items-center justify-center relative group transition-all duration-200 text-sm md:text-base font-bold
                        ${status === 'available' ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-500 hover:text-white hover:scale-105 border border-emerald-100' : ''}
                        ${status === 'weekend' ? 'bg-brand-50 text-brand-700 hover:bg-brand-400 hover:text-navy hover:scale-105 border border-brand-100' : ''}
                        ${status === 'past' ? 'text-slate-300 cursor-not-allowed' : 'cursor-pointer'}
                        ${isToday ? 'ring-2 ring-navy/60' : ''}
                      `}
                    >
                      {day}
                      {status !== 'past' && (
                        <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-navy text-white text-[10px] font-bold py-1 px-2.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl z-20 hidden md:block">
                          {status === 'available' ? 'Request this date' : 'Limited, ask us'}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 pt-5 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-stone-500">
                <span className="flex items-center gap-1.5">
                   <MapPin size={14} className="text-brand-500" /> Serving all of Nebraska
                </span>
                <span className="flex items-center gap-1.5">
                   <CalendarCheck size={14} className="text-emerald-500" /> Confirmed within 24h
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingCalendar;
