
import React from 'react';
import { Link } from 'react-router-dom';
import { useCustomCalc } from '../contexts/CustomCalcContext';
import { Plus, Trash2, ArrowRight, Beaker, Play, ArrowLeft } from 'lucide-react';
import AdUnit from '../components/AdUnit';
import { useLanguage } from '../contexts/LanguageContext';
import { builderTranslations } from '../utils/builderTranslations';

const MyCalculators: React.FC = () => {
  const { customCalculators, deleteCustomCalculator } = useCustomCalc();
  const { language } = useLanguage();
  const tB = (key: string) => builderTranslations[language]?.[key] || builderTranslations['en'][key];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Nav */}
      <div>
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors font-medium">
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" /> {tB('backToHome')}
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Beaker className="w-8 h-8 text-primary" /> {tB('myCalcsTitle')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            {tB('myCalcsSubtitle')}
          </p>
        </div>
        <Link 
          to="/builder" 
          className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> {tB('buildNew')}
        </Link>
      </div>

      {customCalculators.length === 0 ? (
        <div className="text-center py-20 bg-card/50 border border-border border-dashed rounded-3xl">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Beaker className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{tB('noCalcsTitle')}</h2>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">
            {tB('noCalcsDesc')}
          </p>
          <Link to="/builder" className="text-primary font-bold hover:underline">
            {tB('startBuilding')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customCalculators.map(calc => (
            <div key={calc.id} className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative group flex flex-col">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">{calc.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 min-h-[40px]">
                  {calc.description}
                </p>
                <div className="flex gap-2 mb-4 text-xs font-mono text-slate-400">
                   <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">ID: {calc.id.slice(0,8)}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
                <Link 
                  to={`/custom/${calc.id}`}
                  className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-2 rounded-lg font-bold text-center text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <Play className="w-4 h-4" /> {tB('run')}
                </Link>
                <button 
                  onClick={() => deleteCustomCalculator(calc.id)}
                  className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AdUnit slot="my-calc-footer" format="horizontal" />
    </div>
  );
};

export default MyCalculators;
