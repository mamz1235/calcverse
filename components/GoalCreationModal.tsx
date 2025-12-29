
import React, { useState, useEffect } from 'react';
import { X, Target, Bell, Calendar as CalendarIcon } from 'lucide-react';
import { CalculatorDef, CalculationResult } from '../types';
import { useGoals } from '../contexts/GoalContext';
import { useLanguage } from '../contexts/LanguageContext';
import { GOAL_TRANSLATIONS } from '../utils/goalTranslations';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  calculator: CalculatorDef;
  inputs: Record<string, any>;
  result: CalculationResult | null;
}

const GoalCreationModal: React.FC<Props> = ({ isOpen, onClose, calculator, inputs, result }) => {
  const { addGoal, requestNotificationPermission } = useGoals();
  const { language, t: tGlobal } = useLanguage();
  const t = (key: string) => GOAL_TRANSLATIONS[language]?.[key] || GOAL_TRANSLATIONS['en'][key];
  
  const [title, setTitle] = useState('');
  const [currentVal, setCurrentVal] = useState<string>('');
  const [targetVal, setTargetVal] = useState<string>('');
  const [deadline, setDeadline] = useState('');
  const [unit, setUnit] = useState('');
  const [notifications, setNotifications] = useState(false);

  useEffect(() => {
    if (isOpen) {
        // Use translated calculator name if available
        const calcName = tGlobal(calculator.name);
        setTitle(t('goalDefaultTitle').replace('{name}', calcName));
        
        // Smart Guessing Logic
        let guessedCurrent = '';
        let guessedTarget = '';
        let guessedUnit = '';

        // Try to find currency or number inputs
        const numInputs = calculator.inputs.filter(i => i.type === 'number' || i.type === 'currency' || i.type === 'percentage');
        
        // Guess Unit
        const currencyInput = numInputs.find(i => i.type === 'currency');
        if (currencyInput) guessedUnit = '$';
        else if (numInputs.find(i => i.type === 'percentage')) guessedUnit = '%';
        
        // Heuristic: Inputs named 'goal', 'target' usually target
        const targetInput = numInputs.find(i => /goal|target|total/i.test(i.id) || /goal|target|total/i.test(i.label));
        if (targetInput) guessedTarget = inputs[targetInput.id]?.toString() || '';

        // Heuristic: Inputs named 'current', 'start', 'initial' usually current
        const currentInput = numInputs.find(i => /curr|start|init|now/i.test(i.id) || /curr|start|init|now/i.test(i.label));
        if (currentInput) guessedCurrent = inputs[currentInput.id]?.toString() || '';

        if (!guessedTarget && result?.mainValue) {
             const clean = result.mainValue.replace(/[^0-9.]/g, '');
        }

        setCurrentVal(guessedCurrent);
        setTargetVal(guessedTarget);
        setUnit(guessedUnit);
    }
  }, [isOpen, calculator, inputs, result, language, tGlobal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (notifications) {
        await requestNotificationPermission();
    }
    
    addGoal({
        calculatorId: calculator.id,
        title,
        currentValue: parseFloat(currentVal) || 0,
        targetValue: parseFloat(targetVal) || 0,
        unit,
        deadline: deadline || undefined,
        inputs
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden">
        <div className="bg-primary/10 p-6 pb-8 text-center">
            <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg shadow-primary/20">
                <Target className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{t('trackTitle')}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                {t('subtitle')}
            </p>
        </div>

        <button onClick={onClose} className="absolute top-4 right-4 rtl:right-auto rtl:left-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
          <X className="w-5 h-5" />
        </button>

        <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-4">
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{t('goalName')}</label>
                <input 
                    type="text" 
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-border rounded-xl font-medium focus:border-primary focus:ring-1 focus:ring-primary outline-none text-slate-900 dark:text-white"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{t('current')}</label>
                    <input 
                        type="number" 
                        required
                        step="any"
                        value={currentVal}
                        onChange={e => setCurrentVal(e.target.value)}
                        className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-border rounded-xl font-medium focus:border-primary outline-none text-slate-900 dark:text-white"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{t('target')}</label>
                    <input 
                        type="number" 
                        required
                        step="any"
                        value={targetVal}
                        onChange={e => setTargetVal(e.target.value)}
                        className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-border rounded-xl font-medium focus:border-primary outline-none text-slate-900 dark:text-white"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{t('unit')}</label>
                    <input 
                        type="text" 
                        value={unit}
                        onChange={e => setUnit(e.target.value)}
                        className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-border rounded-xl font-medium focus:border-primary outline-none text-slate-900 dark:text-white"
                        placeholder="$, kg, %, etc"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{t('deadline')}</label>
                    <div className="relative">
                        <input 
                            type="date" 
                            value={deadline}
                            onChange={e => setDeadline(e.target.value)}
                            className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-border rounded-xl font-medium focus:border-primary outline-none text-slate-900 dark:text-white"
                        />
                        <CalendarIcon className="absolute right-3 rtl:right-auto rtl:left-3 top-3 w-5 h-5 text-slate-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
                <input 
                    type="checkbox" 
                    id="notif" 
                    checked={notifications}
                    onChange={e => setNotifications(e.target.checked)}
                    className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
                />
                <label htmlFor="notif" className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2 cursor-pointer select-none">
                    <Bell className="w-4 h-4" /> {t('enableNotif')}
                </label>
            </div>

            <button 
                type="submit"
                className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95 mt-4"
            >
                {t('startTracking')}
            </button>
        </form>
      </div>
    </div>
  );
};

export default GoalCreationModal;
