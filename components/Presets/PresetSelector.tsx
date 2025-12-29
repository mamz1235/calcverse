
import React, { useState } from 'react';
import { usePresets } from '../../contexts/PresetContext';
import { Download, ChevronDown, Trash2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { featureTranslations } from '../../utils/featureTranslations';

interface Props {
  onLoad: (data: Record<string, any>) => void;
}

export const PresetSelector: React.FC<Props> = ({ onLoad }) => {
  const { presets, deletePreset } = usePresets();
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();
  const t = (key: string) => featureTranslations[language]?.[key] || featureTranslations['en'][key];

  if (presets.length === 0) return null;

  return (
    <div className="relative inline-block text-left z-20">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
      >
        <Download className="w-3 h-3" />
        {t('loadPreset')}
        <ChevronDown className="w-3 h-3" />
      </button>

      {isOpen && (
        <>
        <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-20">
             <div className="max-h-60 overflow-y-auto">
                 {presets.map(preset => (
                     <div key={preset.id} className="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 group border-b border-gray-100 dark:border-gray-700/50 last:border-0">
                         <button 
                             onClick={() => { onLoad(preset.data); setIsOpen(false); }}
                             className="flex-1 text-left text-sm font-medium text-slate-700 dark:text-slate-200 px-2 truncate"
                         >
                             {preset.name}
                         </button>
                         <button 
                             onClick={(e) => { e.stopPropagation(); deletePreset(preset.id); }}
                             className="p-1.5 text-slate-400 hover:text-rose-500 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                         >
                             <Trash2 className="w-3 h-3" />
                         </button>
                     </div>
                 ))}
             </div>
        </div>
        </>
      )}
    </div>
  );
};
