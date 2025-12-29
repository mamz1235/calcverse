
import React, { useState } from 'react';
import { usePresets } from '../../contexts/PresetContext';
import { X, Save } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { featureTranslations } from '../../utils/featureTranslations';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentInputs: Record<string, any>;
}

export const PresetModal: React.FC<Props> = ({ isOpen, onClose, currentInputs }) => {
  const { addPreset } = usePresets();
  const [name, setName] = useState('');
  const { language } = useLanguage();
  const t = (key: string) => featureTranslations[language]?.[key] || featureTranslations['en'][key];

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      addPreset(name, currentInputs);
      setName('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-sm shadow-2xl relative">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 dark:text-white">{t('savePreset')}</h3>
            <button onClick={onClose}><X className="w-5 h-5 text-slate-400" /></button>
        </div>
        <form onSubmit={handleSave} className="p-4 space-y-4">
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{t('presetName')}</label>
                <input 
                    type="text" 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder={t('presetPlaceholder')}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-primary dark:text-white"
                    autoFocus
                />
            </div>
            <div className="flex justify-end gap-2">
                <button 
                    type="button" 
                    onClick={onClose}
                    className="px-4 py-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-sm font-medium"
                >
                    {t('cancel')}
                </button>
                <button 
                    type="submit"
                    disabled={!name.trim()}
                    className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 disabled:opacity-50"
                >
                    {t('save')}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};
