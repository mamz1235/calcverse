import React from 'react';
import { SalaryHeatmap } from '../components/SalaryHeatmap';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const SalaryMapPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-20">
      <div>
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors font-medium">
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" /> {t('common.go_home')}
        </Link>
      </div>

      <SalaryHeatmap />

      <div className="mt-12 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-border">
         <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">About Purchasing Power</h3>
         <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            Your salary's numeric value stays the same, but its buying power changes drastically depending on where you live. 
            This map uses the Cost of Living Index to adjust your nominal salary into "real dollars." 
            For example, earning $50,000 in Mississippi feels like earning nearly $60,000 in terms of goods and services you can buy, 
            whereas in Hawaii, it might feel like less than $30,000.
         </p>
      </div>
    </div>
  );
};

export default SalaryMapPage;