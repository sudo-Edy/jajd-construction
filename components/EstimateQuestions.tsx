import React from 'react';
import { Check } from 'lucide-react';
import { EstimateFlow, EstimateQuestion } from '../types';

export type AnswerMap = Record<string, string | string[]>;

interface EstimateQuestionsProps {
  flow: EstimateFlow;
  answers: AnswerMap;
  onChange: (id: string, value: string | string[]) => void;
}

const isSelected = (answers: AnswerMap, q: EstimateQuestion, option: string): boolean => {
  const v = answers[q.id];
  if (q.type === 'multi') return Array.isArray(v) && v.includes(option);
  return v === option;
};

const EstimateQuestions: React.FC<EstimateQuestionsProps> = ({ flow, answers, onChange }) => {
  const toggle = (q: EstimateQuestion, option: string) => {
    if (q.type === 'multi') {
      const current = Array.isArray(answers[q.id]) ? (answers[q.id] as string[]) : [];
      onChange(
        q.id,
        current.includes(option) ? current.filter((o) => o !== option) : [...current, option]
      );
    } else {
      onChange(q.id, option);
    }
  };

  return (
    <div className="space-y-7 animate-in slide-in-from-right duration-300">
      {flow.questions.map((q) => (
        <div key={q.id} className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 flex items-center gap-2">
            {q.label}
            {q.required && <span className="text-brand-600 normal-case tracking-normal font-semibold text-[10px]">Required</span>}
          </label>
          {q.hint && <p className="text-xs text-slate-500 dark:text-slate-400 -mt-1.5 leading-relaxed">{q.hint}</p>}

          {(q.type === 'single' || q.type === 'multi') && (
            <div className="flex flex-wrap gap-2.5">
              {q.options?.map((option) => {
                const selected = isSelected(answers, q, option);
                return (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => toggle(q, option)}
                    className={`px-4 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all flex items-center gap-2 ${
                      selected
                        ? 'border-brand-400 bg-brand-400/10 text-slate-900 dark:text-white shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-brand-400/50 bg-slate-50 dark:bg-slate-800'
                    }`}
                  >
                    {selected && <Check className="w-3.5 h-3.5 text-brand-600" />}
                    {option}
                  </button>
                );
              })}
            </div>
          )}

          {q.type === 'number' && (
            <input
              type="number"
              inputMode="numeric"
              min={0}
              placeholder={q.placeholder}
              className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-400 transition-all text-slate-900 dark:text-white font-semibold"
              value={(answers[q.id] as string) ?? ''}
              onChange={(e) => onChange(q.id, e.target.value)}
            />
          )}

          {q.type === 'text' && (
            <textarea
              placeholder={q.placeholder}
              className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-400 transition-all text-slate-900 dark:text-white text-sm min-h-[80px] resize-none"
              value={(answers[q.id] as string) ?? ''}
              onChange={(e) => onChange(q.id, e.target.value)}
            />
          )}
        </div>
      ))}
    </div>
  );
};

/** Turn answers into a readable summary that rides along in the lead notes. */
export const summarizeAnswers = (flow: EstimateFlow, answers: AnswerMap): string => {
  const lines = flow.questions
    .map((q) => {
      const v = answers[q.id];
      if (!v || (Array.isArray(v) && v.length === 0)) return null;
      const value = Array.isArray(v) ? v.join(', ') : v;
      return `• ${q.label} ${value}`;
    })
    .filter(Boolean);
  if (lines.length === 0) return '';
  return `${flow.headline}\n${lines.join('\n')}`;
};

/** First unanswered required question, or null if the step is complete. */
export const firstMissingRequired = (flow: EstimateFlow, answers: AnswerMap): EstimateQuestion | null => {
  for (const q of flow.questions) {
    if (!q.required) continue;
    const v = answers[q.id];
    const empty = v == null || v === '' || (Array.isArray(v) && v.length === 0);
    if (empty) return q;
  }
  return null;
};

export default EstimateQuestions;
