
import React from 'react';
import { Link } from 'react-router-dom';
import { BundleDef } from '../utils/bundleRegistry';
import { Layers, ArrowRight, CheckCircle2 } from 'lucide-react';
import { CALCULATORS } from '../utils/calculatorRegistry';
import { useLanguage } from '../contexts/LanguageContext';
import { getBundleTranslation } from '../utils/bundleTranslations';
import { bundlesPageTranslations } from '../utils/bundlesPageTranslations';

interface BundleCardProps {
  bundle: BundleDef;
}

const BundleCard: React.FC<BundleCardProps> = ({ bundle }) => {
  const { t, language } = useLanguage();
  const bundleTrans = getBundleTranslation(bundle.id, language);
  const tBundles = (key: string) => bundlesPageTranslations[language]?.[key] || bundlesPageTranslations['en'][key];
  
  // Use translation or fallback to English bundle definition
  const title = bundleTrans ? bundleTrans.title : bundle.title;
  const description = bundleTrans ? bundleTrans.description : bundle.description;

  const getCalcName = (id: string) => {
    const calc = CALCULATORS.find(c => c.id === id);
    if (!calc) return id;
    // Translate calculator name
    return t(calc.name);
  };

  return (
    <Link 
      to={`/bundle/${bundle.id}`}
      className="flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/50 transition-all duration-300 group h-full"
    >
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:scale-110 transition-transform">
            <Layers className="w-6 h-6" />
          </div>
          <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-xs font-bold uppercase tracking-wider rounded-full text-slate-500">
            {tBundles(`cat_${bundle.category}`) || bundle.category}
          </span>
        </div>
        
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-2">
          {description}
        </p>
        
        <div className="mt-auto space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('calc.includes') || 'Includes'}:</div>
          <div className="flex flex-wrap gap-2">
            {bundle.calculatorIds.slice(0, 3).map(id => (
              <div key={id} className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded-md border border-border">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span className="truncate max-w-[120px]">{getCalcName(id)}</span>
              </div>
            ))}
            {bundle.calculatorIds.length > 3 && (
              <span className="text-xs text-slate-400 py-1 px-1">+{bundle.calculatorIds.length - 3} {t('more') || 'more'}</span>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-border flex items-center justify-between group-hover:bg-primary group-hover:border-primary transition-colors">
        <span className="text-sm font-bold text-slate-600 dark:text-slate-300 group-hover:text-white">{tBundles('exploreBtn')}</span>
        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white transform group-hover:translate-x-1 transition-all rtl:rotate-180" />
      </div>
    </Link>
  );
};

export default BundleCard;
