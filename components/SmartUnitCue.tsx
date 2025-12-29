
import React from 'react';
import { Sparkles, RotateCcw, Info } from 'lucide-react';
import { SmartSwitchFeedback } from '../utils/unitSwitcher';

interface Props {
  feedback: SmartSwitchFeedback | null;
  onUndo: () => void;
  language: string;
}

const CUE_TRANSLATIONS: Record<string, any> = {
  en: { detected: "Detected", undo: "Undo", metric: "cm", imperial: "ft" },
  es: { detected: "Detectado", undo: "Deshacer", metric: "cm", imperial: "ft" },
  fr: { detected: "Détecté", undo: "Annuler", metric: "cm", imperial: "ft" },
  ru: { detected: "Определено", undo: "Назад", metric: "см", imperial: "фт" },
  hi: { detected: "पहचाना गया", undo: "पूर्ववत", metric: "cm", imperial: "ft" },
  ar: { detected: "تم الكشف", undo: "تراجع", metric: "سم", imperial: "قدم" }
};

export const SmartUnitCue: React.FC<Props> = ({ feedback, onUndo, language }) => {
  if (!feedback) return null;

  const t = CUE_TRANSLATIONS[language] || CUE_TRANSLATIONS.en;
  const unitLabel = feedback.detectedUnit === 'metric' ? t.metric : t.imperial;

  return (
    <div className="flex items-center gap-2 mt-1 animate-in fade-in zoom-in-95 duration-300 fill-mode-both">
      {/* Detection Pill */}
      <div className={`
        flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-tight
        ${feedback.isAmbiguous 
          ? 'bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50' 
          : 'bg-indigo-50 text-indigo-600 border border-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900/40'}
      `}>
        {feedback.isAmbiguous ? (
          <Info className="w-3 h-3" />
        ) : (
          <Sparkles className="w-3 h-3 animate-pulse" />
        )}
        <span>{t.detected}: {unitLabel}</span>
      </div>

      {/* Undo Affordance */}
      <button
        onClick={(e) => { e.preventDefault(); onUndo(); }}
        className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-all active:scale-95 text-[10px] font-bold group border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
      >
        <RotateCcw className="w-2.5 h-2.5 group-hover:-rotate-45 transition-transform" />
        <span>{t.undo}</span>
      </button>
    </div>
  );
};
