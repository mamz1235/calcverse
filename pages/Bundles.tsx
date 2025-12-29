
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BUNDLES } from '../utils/bundleRegistry';
import { getBundleTranslation } from '../utils/bundleTranslations';
import BundleCard from '../components/BundleCard';
import { Search, Layers, Filter, ArrowLeft } from 'lucide-react';
import AdUnit from '../components/AdUnit';
import { useLanguage } from '../contexts/LanguageContext';
import { bundlesPageTranslations } from '../utils/bundlesPageTranslations';

const Bundles: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const { t, language } = useLanguage();
  const tBundles = (key: string) => bundlesPageTranslations[language]?.[key] || bundlesPageTranslations['en'][key];

  const categories = ['All', ...Array.from(new Set(BUNDLES.map(b => b.category)))];

  const filteredBundles = useMemo(() => {
    return BUNDLES.filter(bundle => {
      const trans = getBundleTranslation(bundle.id, language);
      const title = trans ? trans.title : bundle.title;
      const description = trans ? trans.description : bundle.description;
      
      const matchesSearch = 
        title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bundle.calculatorIds.some(id => id.includes(searchQuery.toLowerCase()));
      
      const matchesCategory = activeFilter === 'All' || bundle.category === activeFilter;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeFilter, language]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Nav */}
      <div>
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors font-medium">
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" /> {t('common.go_home')}
        </Link>
      </div>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-2">
          <Layers className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white">
          {tBundles('title')}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          {tBundles('subtitle')}
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-2xl border border-border shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text"
            placeholder={t('search.placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-border rounded-xl focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
          />
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${
                activeFilter === cat 
                  ? 'bg-primary text-white shadow-lg shadow-primary/25' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat === 'All' ? tBundles('all') : (tBundles(`cat_${cat}`) || cat)}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filteredBundles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBundles.map(bundle => (
            <BundleCard key={bundle.id} bundle={bundle} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-card/50 border border-border border-dashed rounded-3xl">
          <p className="text-slate-500 text-lg">{t('explore.no_results')}</p>
          <button 
            onClick={() => {setSearchQuery(''); setActiveFilter('All');}}
            className="mt-4 text-primary font-bold hover:underline"
          >
            {t('explore.clear')}
          </button>
        </div>
      )}

      <AdUnit slot="bundles-footer" format="horizontal" />
    </div>
  );
};

export default Bundles;
