
import React from 'react';
import { useComparison } from '../contexts/ComparisonContext';
import { X, ArrowRight, Scale, Layers } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const LOCAL_TRANSLATIONS = {
  en: { workspace: "Comparison Workspace", scenarios: "Scenarios", addMore: "Add more", clear: "Clear", compare: "Compare" },
  es: { workspace: "Espacio de Comparación", scenarios: "Escenarios", addMore: "Añadir más", clear: "Borrar", compare: "Comparar" },
  fr: { workspace: "Espace de Comparaison", scenarios: "Scénarios", addMore: "Ajouter", clear: "Effacer", compare: "Comparer" },
  ru: { workspace: "Сравнение", scenarios: "Сценарии", addMore: "Добавить", clear: "Очистить", compare: "Сравнить" },
  hi: { workspace: "तुलना कार्यक्षेत्र", scenarios: "परिदृश्य", addMore: "और जोड़ें", clear: "साफ़ करें", compare: "तुलना करें" },
  ar: { workspace: "مساحة المقارنة", scenarios: "سيناريوهات", addMore: "إضافة", clear: "مسح", compare: "قارن" }
};

const ComparisonTray: React.FC = () => {
  const { items, removeItem, clearItems } = useComparison();
  const navigate = useNavigate();
  const location = useLocation();
  const { language, t } = useLanguage();

  const lt = LOCAL_TRANSLATIONS[language as keyof typeof LOCAL_TRANSLATIONS] || LOCAL_TRANSLATIONS.en;

  if (items.length === 0 || location.pathname === '/compare') return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-2xl px-4 animate-fade-in-up">
      <div className="bg-slate-900/90 dark:bg-slate-800/90 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-slate-700 p-3 flex items-center gap-4">
        <div className="flex items-center gap-3 pl-2">
            <div className="p-2 bg-indigo-500 rounded-lg">
                <Scale className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
                <div className="text-sm font-bold">{lt.workspace}</div>
                <div className="text-xs text-slate-300">{items.length} / 3 {lt.scenarios}</div>
            </div>
        </div>

        <div className="flex-1 flex items-center gap-2 overflow-x-auto scrollbar-hide py-1 px-2">
            {items.map(item => (
                <div key={item.id} className="relative group shrink-0">
                    <div className="px-3 py-1.5 bg-slate-800 dark:bg-slate-900 rounded-lg border border-slate-600 flex flex-col min-w-[100px] max-w-[140px]">
                        <span className="text-[10px] text-slate-400 truncate">{t(item.calculatorName)}</span>
                        <span className="text-xs font-bold truncate">{item.result.mainValue}</span>
                    </div>
                    <button 
                        onClick={() => removeItem(item.id)}
                        className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </div>
            ))}
            {items.length < 3 && (
                <div className="border border-dashed border-slate-600 rounded-lg px-3 py-1.5 flex flex-col items-center justify-center min-w-[80px] text-slate-500 text-[10px] shrink-0">
                    <span>{lt.addMore}</span>
                </div>
            )}
        </div>

        <div className="flex items-center gap-2 border-l border-slate-700 pl-4">
            <button 
                onClick={clearItems}
                className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors text-xs"
                title="Clear All"
            >
                {lt.clear}
            </button>
            <button 
                onClick={() => navigate('/compare')}
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/20 whitespace-nowrap"
            >
                {lt.compare} <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default ComparisonTray;
