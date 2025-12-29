
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllCategories, CALCULATORS } from '../utils/calculatorRegistry';
import { BUNDLES } from '../utils/bundleRegistry';
import { ArrowRight, Star, TrendingUp, Zap, Box, Search, Mail, Heart, Target, Layers, Beaker, Folder, Sparkles, Mountain } from 'lucide-react';
import AdUnit from '../components/AdUnit';
import { useLanguage } from '../contexts/LanguageContext';
import CategoryIcon from '../components/CategoryIcon';
import BundleCard from '../components/BundleCard';
import { searchCalculators } from '../utils/search';
import { useFavorites } from '../hooks/useFavorites';
import { useGoals } from '../contexts/GoalContext';
import GoalWidget from '../components/GoalWidget';
import { GOAL_TRANSLATIONS } from '../utils/goalTranslations';
import { homeExtraTranslations } from '../utils/homeExtraTranslations';
import { bundlesPageTranslations } from '../utils/bundlesPageTranslations';
import { visualDiscoveryTranslations } from '../utils/visualDiscoveryTranslations';
import { projectFolderTranslations } from '../utils/projectFolderTranslations';
import { newFeatureTranslations } from '../utils/newFeatureTranslations';

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const categories = getAllCategories();
  const { t, language } = useLanguage();
  const tGoal = (key: string) => GOAL_TRANSLATIONS[language]?.[key] || GOAL_TRANSLATIONS['en'][key];
  const tHome = (key: string) => homeExtraTranslations[language]?.[key] || homeExtraTranslations['en'][key];
  const tBundles = (key: string) => bundlesPageTranslations[language]?.[key] || bundlesPageTranslations['en'][key];
  const tVis = visualDiscoveryTranslations[language] || visualDiscoveryTranslations['en'];
  const tFolder = projectFolderTranslations[language] || projectFolderTranslations['en'];
  const tNew = newFeatureTranslations[language as keyof typeof newFeatureTranslations] || newFeatureTranslations['en'];
  
  // Favorites
  const { favorites } = useFavorites();
  const favoriteCalculators = useMemo(() => 
    CALCULATORS.filter(c => favorites.includes(c.id)), 
  [favorites]);

  // Goals
  const { goals } = useGoals();
  
  // Get popular calculators (simulated by taking first 4)
  const popularCalculators = useMemo(() => CALCULATORS.slice(0, 4), []);

  // Use smart search, memoized for performance
  const searchResults = useMemo(() => 
    searchQuery.length > 0 
      ? searchCalculators(searchQuery, CALCULATORS, t).slice(0, 6)
      : [],
  [searchQuery, t]);

  // SEO Update for Home
  useEffect(() => {
    document.title = `${t('app.name')} - ${t('app.tagline')}`;
    let metaDesc = document.querySelector("meta[name='description']");
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', t('home.hero.subtitle'));
  }, [t]);

  const handleResultClick = (id: string) => {
    navigate(`/calculator/${id}`);
  };

  const getDesc = (calcId: string, calcName: string) => {
    // 1. Try specific translation key
    const specificKey = `calc.${calcId}.desc`;
    const specificDesc = t(specificKey);
    if (specificDesc !== specificKey) return specificDesc;
    
    // 2. Fallback to translated generic template
    const genericTemplate = t('calc.generic.description');
    // If generic template is missing (unlikely), fallback to name
    if (genericTemplate === 'calc.generic.description') return calcName;
    
    return genericTemplate.replace('{name}', calcName);
  }

  return (
    <div className="space-y-8 md:space-y-12">
      {/* Hero */}
      <section className="relative py-10 md:py-20 overflow-visible rounded-3xl bg-white dark:bg-card border border-border">
        <div className="absolute top-0 end-0 p-6 md:p-12 opacity-10 dark:opacity-20 pointer-events-none rtl:flip-x">
          <Box className="w-48 h-48 md:w-64 md:h-64 text-primary" />
        </div>
        <div className="relative z-10 px-6 md:px-12">
          <span className="inline-block py-1 px-3 rounded-full bg-slate-100 dark:bg-white/10 text-primary text-xs font-bold tracking-wider mb-4">
            {t('home.hero.tag')}
          </span>
          <h1 className="text-3xl md:text-6xl font-bold text-slate-900 dark:text-white mb-4 md:mb-6 leading-tight">
            {t('home.hero.title.1')}<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              {t('home.hero.title.2')}
            </span>
          </h1>
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mb-8">
            {t('home.hero.subtitle')}
          </p>
          
          <div className="flex flex-col gap-6 max-w-xl">
            {/* Search Input */}
            <div className="relative">
              <div className="relative group">
                <div className="absolute inset-y-0 start-0 pl-4 rtl:pr-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-11 pr-4 rtl:pl-4 rtl:pr-11 py-3.5 md:py-4 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-xl text-sm md:text-base"
                  placeholder={t('home.search.placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Search Results Dropdown */}
              {searchQuery.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-50 text-start">
                  {searchResults.length > 0 ? (
                    <div>
                      {searchResults.map(result => (
                        <button
                          key={result.id}
                          onClick={() => handleResultClick(result.id)}
                          className="w-full text-start p-4 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors flex items-center gap-4 border-b border-border last:border-0 group"
                        >
                          <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg text-secondary group-hover:scale-110 transition-transform">
                             <CategoryIcon category={result.category} className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{t(result.name)}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">{t(result.category)}</div>
                          </div>
                        </button>
                      ))}
                      <Link 
                        to="/explore" 
                        className="block w-full text-center p-3 bg-slate-50 dark:bg-slate-800/50 text-primary text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        {t('home.explore_btn')}
                      </Link>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-slate-500">
                      {t('sidebar.no_results')} <Link to="/explore" className="text-primary hover:underline">{t('common.view_all')}</Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-4">
               <Link to="/explore" className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-primary/20 w-full sm:w-auto justify-center">
                 {t('home.explore_btn')} <ArrowRight className="w-4 h-4 transform rtl:rotate-180" />
               </Link>
               <Link to="/visual-discovery" className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 w-full sm:w-auto justify-center">
                 <Sparkles className="w-4 h-4" /> {tVis.buttonLabel}
               </Link>
               <Link to="/builder" className="px-6 py-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl font-bold transition-all flex items-center gap-2 shadow-sm w-full sm:w-auto justify-center">
                 <Beaker className="w-4 h-4" /> {tHome('buildYourOwn')}
               </Link>
            </div>
            
            <div className="flex flex-wrap gap-4 items-center text-sm pt-2">
               <Link to="/project-folders" className="text-primary font-bold hover:underline flex items-center gap-2">
                  <Folder className="w-4 h-4" /> {tFolder.link}
               </Link>
               <span className="text-slate-300">|</span>
               <Link to="/slope" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors flex items-center gap-1.5 font-medium">
                  <Mountain className="w-4 h-4" /> {tNew.nav.slopeMap}
               </Link>
               <span className="text-slate-300">|</span>
               <Link to="/load-balancer" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors flex items-center gap-1.5 font-medium">
                  <Zap className="w-4 h-4" /> {tNew.nav.loadBalancer}
               </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Goals Section - Only visible if goals exist */}
      {goals.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
             <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Target className="w-5 h-5 md:w-6 md:h-6 text-primary" /> {tGoal('activeGoals')}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map(goal => (
              <GoalWidget key={goal.id} goal={goal} />
            ))}
          </div>
        </section>
      )}

      {/* Primary Ad Slot */}
      <AdUnit slot="home-top" format="horizontal" />

      {/* Popular Bundles Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 md:w-6 md:h-6 text-indigo-500" /> {tBundles('title')}
          </h2>
          <Link 
            to="/bundles"
            className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
          >
            {tBundles('exploreBundles')} <ArrowRight className="w-4 h-4 transform rtl:rotate-180" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BUNDLES.slice(0, 3).map(bundle => (
            <BundleCard key={bundle.id} bundle={bundle} />
          ))}
        </div>
      </section>

      {/* Favorites Section - Only visible if favorites exist */}
      {favoriteCalculators.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
             <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Heart className="w-5 h-5 md:w-6 md:h-6 text-rose-500 fill-rose-500" /> {t('home.favorites')}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {favoriteCalculators.map(calc => (
              <Link 
                key={calc.id} 
                to={`/calculator/${calc.id}`}
                className="p-5 bg-card border border-border rounded-xl hover:shadow-lg hover:shadow-primary/5 hover:border-primary transition-all group"
              >
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-900 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <CategoryIcon category={calc.category} className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-1">{t(calc.name)}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">{getDesc(calc.id, t(calc.name))}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Categories Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-secondary" /> {t('home.categories')}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <Link 
              key={idx} 
              to={`/category/${encodeURIComponent(cat)}`}
              className="group p-6 bg-card hover:bg-slate-50 dark:hover:bg-slate-700/50 border border-border hover:border-primary/50 rounded-2xl transition-all duration-300 relative overflow-hidden flex flex-col items-start"
            >
              <div className="absolute top-0 end-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all"></div>
              <div className="mb-4 p-3 bg-slate-100 dark:bg-slate-900 rounded-xl text-primary group-hover:scale-110 transition-transform duration-300 relative z-10">
                <CategoryIcon category={cat} className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 relative z-10">{t(cat) || cat}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 relative z-10">
                {t('tools.available').replace('{count}', CALCULATORS.filter(c => c.category === cat).length.toString())}
              </p>
              <div className="mt-auto flex items-center text-primary text-sm font-medium group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform relative z-10">
                {t('tools.browse')} <ArrowRight className="w-4 h-4 ml-1 transform rtl:rotate-180" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Mid Page Ad */}
      <AdUnit slot="home-middle" format="horizontal" />

      {/* Popular Tools */}
      <section>
        <div className="flex items-center justify-between mb-6">
           <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Star className="w-5 h-5 md:w-6 md:h-6 text-yellow-500" /> {t('home.popular')}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularCalculators.map(calc => (
            <Link 
              key={calc.id} 
              to={`/calculator/${calc.id}`}
              className="p-5 bg-card border border-border rounded-xl hover:shadow-lg hover:shadow-primary/5 hover:border-primary transition-all group"
            >
              <div className="w-10 h-10 bg-slate-100 dark:bg-slate-900 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <CategoryIcon category={calc.category} className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-1">{t(calc.name)}</h3>
              <p className="text-xs text-slate-500 line-clamp-2">{getDesc(calc.id, t(calc.name))}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Bottom Page Ad */}
      <AdUnit slot="home-bottom" format="horizontal" />

      {/* Request Feature Section */}
      <section className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl p-8 md:p-12 border border-border relative overflow-hidden">
        <div className="absolute top-0 end-0 p-8 opacity-10 rtl:flip-x">
            <Mail className="w-32 h-32 md:w-48 md:h-48 text-primary" />
        </div>
        <div className="relative z-10 max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">{t('home.request.title')}</h2>
            <p className="text-slate-600 dark:text-slate-300 text-base md:text-lg mb-8 leading-relaxed">
                {t('home.request.desc')}
            </p>
            <a href="mailto:calcverse91@gmail.com" className="inline-flex items-center gap-3 px-6 py-3 md:px-8 md:py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-lg dark:shadow-white/10 group text-sm md:text-base">
                calcverse91@gmail.com
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform rtl:rotate-180" />
            </a>
        </div>
      </section>

      {/* SEO Footer Text */}
      <section className="border-t border-border pt-12 pb-8">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{t('home.why.title')}</h2>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
          {t('home.why.body')}
        </p>
      </section>
    </div>
  );
};

export default Home;
