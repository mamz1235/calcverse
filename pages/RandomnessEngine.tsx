
import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Dices, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { newFeatureTranslations } from '../utils/newFeatureTranslations';
import LootGenerator from '../components/LootGenerator';

// Lazy load 3D Component
const DiceRoller3D = React.lazy(() => import('../components/Three/DiceRoller3D').then(module => ({ default: module.DiceRoller3D })));

const RandomnessEngine: React.FC = () => {
  const { language } = useLanguage();
  const t = newFeatureTranslations[language as keyof typeof newFeatureTranslations] || newFeatureTranslations['en'];
  const tr = t.randomness;

  return (
    <div className="animate-fade-in space-y-8 pb-20">
      <div>
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors font-medium">
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" /> Back to Home
        </Link>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-3">
             <Dices className="w-10 h-10 text-indigo-500" /> {tr.title}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
             {tr.subtitle}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-3xl p-1 shadow-xl h-[600px] relative">
                  <Suspense fallback={
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900 rounded-3xl">
                       <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
                    </div>
                  }>
                      <DiceRoller3D />
                  </Suspense>
              </div>
          </div>
          <div className="lg:col-span-1">
              <LootGenerator />
          </div>
      </div>
    </div>
  );
};

export default RandomnessEngine;
