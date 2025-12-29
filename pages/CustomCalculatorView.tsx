
import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useCustomCalc } from '../contexts/CustomCalcContext';
import CustomCalcRunner from '../components/CustomCalcRunner';
import { ArrowLeft, Edit } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { builderTranslations } from '../utils/builderTranslations';

const CustomCalculatorView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getCustomCalculator } = useCustomCalc();
  const customCalc = getCustomCalculator(id || '');
  const { language } = useLanguage();
  const tB = (key: string) => builderTranslations[language]?.[key] || builderTranslations['en'][key];

  if (!customCalc) {
    return <Navigate to="/my-calculators" replace />;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
      <div className="flex items-center justify-between">
        <Link to="/my-calculators" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors font-medium">
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" /> {tB('backToMyCalcs')}
        </Link>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{customCalc.name}</h1>
        <p className="text-slate-500 dark:text-slate-400">{customCalc.description}</p>
      </div>

      <CustomCalcRunner customCalc={customCalc} />
    </div>
  );
};

export default CustomCalculatorView;
