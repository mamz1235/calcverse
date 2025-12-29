
import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { getBundleById } from '../utils/bundleRegistry';
import { getCalculatorById } from '../utils/calculatorRegistry';
import { getBundleTranslation } from '../utils/bundleTranslations';
import { Layers, ArrowLeft, ArrowRight, Zap, Info, CheckCircle } from 'lucide-react';
import AdUnit from '../components/AdUnit';
import { useLanguage } from '../contexts/LanguageContext';

const BundleView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const bundle = getBundleById(id || '');
  const { t, language } = useLanguage();

  if (!bundle) {
    return <Navigate to="/bundles" replace />;
  }

  const bundleTrans = getBundleTranslation(bundle.id, language);
  const title = bundleTrans ? bundleTrans.title : bundle.title;
  const description = bundleTrans ? bundleTrans.description : bundle.description;
  const usageFlow = bundleTrans ? bundleTrans.usageFlow : bundle.usageFlow;

  // Hydrate calculator data
  const tools = bundle.calculatorIds.map(calcId => {
    const calc = getCalculatorById(calcId);
    return calc ? { ...calc, exists: true } : { id: calcId, name: calcId, category: 'Unknown', description: 'Tool not found', exists: false };
  });

  // Simple Markdown parser for usage flow (bolding)
  const renderFlow = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i} className="text-slate-900 dark:text-white font-bold">{part.slice(2, -2)}</strong>;
        }
        return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Nav */}
      <div>
        <Link to="/bundles" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors font-medium">
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" /> {t('common.back_to').replace('{category}', 'Bundles')}
        </Link>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 transform translate-x-1/4 -translate-y-1/4">
          <Layers className="w-64 h-64" />
        </div>
        
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-wider">
              {t(bundle.category) || bundle.category} Bundle
            </span>
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-3 h-3" /> {tools.length} Tools
            </span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">{title}</h1>
          <p className="text-lg md:text-xl text-indigo-100 leading-relaxed opacity-90 max-w-2xl">
            {description}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Usage Flow */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" /> {t('calc.how_it_works') || 'Suggested Workflow'}
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
              <p>{renderFlow(usageFlow)}</p>
            </div>
          </div>

          {/* Tools List */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('calc.includes') || 'Included Calculators'}</h2>
            {tools.map((tool, idx) => (
              <div key={tool.id} className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow flex flex-col md:flex-row gap-4 items-start md:items-center group">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-bold">
                  {idx + 1}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    {t(tool.name as string) || tool.name}
                    {!tool.exists && <span className="text-xs bg-rose-100 text-rose-600 px-2 py-0.5 rounded">Coming Soon</span>}
                  </h3>
                  {tool.exists && (
                    // @ts-ignore
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1 mt-1">{t(`calc.${tool.id}.desc`) !== `calc.${tool.id}.desc` ? t(`calc.${tool.id}.desc`) : tool.description}</p>
                  )}
                </div>

                {tool.exists && (
                  <Link 
                    to={`/calculator/${tool.id}`}
                    className="shrink-0 px-5 py-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-primary hover:text-white text-slate-700 dark:text-slate-200 font-bold rounded-lg transition-all text-sm flex items-center gap-2 group-hover:border-primary"
                  >
                    {t('tools.launch') || 'Launch'} <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10 border border-emerald-100 dark:border-emerald-800/30 rounded-2xl p-6">
            <h3 className="font-bold text-emerald-800 dark:text-emerald-300 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" /> Why this bundle?
            </h3>
            <ul className="space-y-3 text-sm text-emerald-700 dark:text-emerald-400">
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span>Curated selection of related tools</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span>Optimized logical workflow</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span>Solve complex scenarios faster</span>
              </li>
            </ul>
          </div>
          
          <AdUnit slot="bundle-sidebar" format="rectangle" />
        </div>
      </div>
    </div>
  );
};

export default BundleView;
