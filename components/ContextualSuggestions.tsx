
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, GitFork } from 'lucide-react';
import { getCalculatorById } from '../utils/calculatorRegistry';
import CategoryIcon from './CategoryIcon';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  currentCalcId: string;
}

// Logic mapping for "Next Steps" flow
// Maps current calculator ID to suggested next calculator IDs
const NEXT_STEPS_MAP: Record<string, string[]> = {
  'mortgage': ['refinance', 'moving', 'amortization'], // 'refinance' includes closing costs logic
  'affordability': ['mortgage', 'rent-buy'],
  'rent-buy': ['mortgage', 'affordability'],
  'car-loan': ['trip-cost', 'insurance'],
  'auto-loan': ['trip-cost', 'insurance'],
  'bmi': ['tdee', 'macros', 'bodyfat'],
  'tdee': ['macros', 'cal-lookup'],
  'roi': ['compound', 'cap-gains'],
  'savings-goal': ['budget', 'compound'],
  'budget': ['savings-goal', 'emergency']
};

const ContextualSuggestions: React.FC<Props> = ({ currentCalcId }) => {
  const { t } = useLanguage();
  const suggestionIds = NEXT_STEPS_MAP[currentCalcId];

  if (!suggestionIds || suggestionIds.length === 0) return null;

  const suggestions = suggestionIds
    .map(id => getCalculatorById(id))
    .filter((c): c is NonNullable<typeof c> => !!c);

  if (suggestions.length === 0) return null;

  return (
    <div className="mt-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-2 mb-3 px-1">
         <GitFork className="w-4 h-4 text-indigo-500" />
         <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Suggested Next Steps
         </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {suggestions.map((calc) => (
          <Link
            key={calc.id}
            to={`/calculator/${calc.id}`}
            className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-indigo-500/50 hover:shadow-md hover:shadow-indigo-500/5 transition-all group relative overflow-hidden"
          >
            {/* Hover Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-transparent dark:from-indigo-900/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative p-2.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 group-hover:text-indigo-500 group-hover:bg-white dark:group-hover:bg-slate-900 transition-colors shadow-sm">
               <CategoryIcon category={calc.category} className="w-5 h-5" />
            </div>
            
            <div className="relative flex-1 min-w-0">
               <div className="font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                 {t(calc.name)}
               </div>
               <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                 {t(calc.category)}
               </div>
            </div>
            
            <div className="relative p-1.5 rounded-full text-slate-300 group-hover:text-indigo-500 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 transition-all">
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ContextualSuggestions;
