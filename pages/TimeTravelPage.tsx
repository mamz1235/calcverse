
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, History } from 'lucide-react';
import TimeTravelInflation from '../components/TimeTravelInflation';
import { useLanguage } from '../contexts/LanguageContext';
import { timeTravelTranslations } from '../utils/timeTravelTranslations';

const TimeTravelPage: React.FC = () => {
  const { language, t: tGlobal } = useLanguage();
  const t = timeTravelTranslations[language] || timeTravelTranslations['en'];

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div>
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors font-medium">
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" /> {tGlobal('common.go_home')}
        </Link>
      </div>

      <div className="text-center mb-8">
         <div className="inline-flex items-center justify-center p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl mb-4 text-indigo-600 dark:text-indigo-400">
            <History className="w-10 h-10" />
         </div>
         <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-3">
           {t.title}
         </h1>
         <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
           {t.subtitle}
         </p>
      </div>

      <TimeTravelInflation />
      
      <div className="max-w-3xl mx-auto mt-12 text-center text-sm text-slate-500 leading-relaxed">
         Based on US Consumer Price Index (CPI-U) data. Historical prices are averages and may vary by region. 
         This tool is for educational and entertainment purposes.
      </div>
    </div>
  );
};

export default TimeTravelPage;
