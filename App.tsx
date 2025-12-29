import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useParams, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import CalculatorRunner from './components/CalculatorRunner';
import Compare from './pages/Compare';
import Bundles from './pages/Bundles';
import BundleView from './pages/BundleView';
import Builder from './pages/Builder';
import MyCalculators from './pages/MyCalculators';
import CustomCalculatorView from './pages/CustomCalculatorView';
import ProjectFolders from './pages/ProjectFolders';
import ProjectFolderView from './pages/ProjectFolderView';
import VisualDiscovery from './pages/VisualDiscovery';
import Workspace from './pages/Workspace';
import SalaryMapPage from './pages/SalaryMapPage';
import SlopePage from './pages/SlopePage';
import LoadBalancerPage from './pages/LoadBalancerPage';
import RandomnessEngine from './pages/RandomnessEngine';
import TimeTravelPage from './pages/TimeTravelPage'; 
import { getCalculatorById, CALCULATORS, getAllCategories } from './utils/calculatorRegistry';
import { ArrowLeft, ArrowRight, Zap, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdUnit from './components/AdUnit';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import CategoryIcon from './components/CategoryIcon';
import { searchCalculators } from './utils/search';
import { ComparisonProvider } from './contexts/ComparisonContext';
import { GoalProvider } from './contexts/GoalContext';
import { CustomCalcProvider } from './contexts/CustomCalcContext';
import { SkinProvider } from './contexts/SkinContext';
import { FolderProvider } from './contexts/FolderContext';
import { PresetProvider } from './contexts/PresetContext'; 
import { WorkspaceProvider } from './contexts/WorkspaceContext'; 
import { LocalizationProvider } from './contexts/LocalizationContext';
import SEOHead from './components/SEOHead';
import { translations } from './utils/translations';

// --- Scroll Restoration Hook ---
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// --- SEO Hook ---
const usePageSEO = (title: string, description: string) => {
  useEffect(() => {
    document.title = title;
    let metaDesc = document.querySelector("meta[name='description']");
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);
  }, [title, description]);
};

/* -------------------------------------------------------------------------- */
/*                                SUB-PAGES                                   */
/* -------------------------------------------------------------------------- */

const ExplorePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const categories = getAllCategories();
  const { t } = useLanguage();

  usePageSEO(`${t('explore.title')} | ${t('app.name')}`, t('explore.subtitle'));

  const searchResults = searchTerm 
    ? searchCalculators(searchTerm, CALCULATORS, t)
    : [];

  const getDesc = (calcId: string, calcName: string) => {
    const specificKey = `calc.${calcId}.desc`;
    const specificDesc = t(specificKey);
    if (specificDesc !== specificKey) return specificDesc;
    
    const genericTemplate = t('calc.generic.description');
    if (genericTemplate === 'calc.generic.description') return calcName;
    return genericTemplate.replace('{name}', calcName);
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 bg-slate-200 dark:bg-slate-800 rounded-full hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors group">
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transform rtl:rotate-180" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('explore.title')}</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{t('explore.subtitle')}</p>
          </div>
        </div>

        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pr-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 rtl:pl-3 rtl:pr-10 pr-3 py-3 border border-border rounded-xl leading-5 bg-card text-slate-900 dark:text-slate-300 placeholder-slate-500 focus:outline-none focus:bg-slate-50 dark:focus:bg-slate-800 focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm transition-colors shadow-lg"
            placeholder={t('explore.search_placeholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <AdUnit slot="explore-header" format="horizontal" />

      {searchTerm ? (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            {t('explore.results').replace('{count}', searchResults.length.toString()).replace('{query}', searchTerm)}
          </h2>
          
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map(calc => (
                <Link 
                  key={calc.id} 
                  to={`/calculator/${calc.id}`}
                  className="group flex flex-col p-5 bg-card border border-border rounded-xl hover:border-primary/50 transition-all hover:shadow-lg"
                >
                  <div className="flex items-center gap-3 mb-3">
                     <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                       <CategoryIcon category={calc.category} className="w-5 h-5" />
                     </div>
                     <div>
                       <h3 className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-primary dark:group-hover:text-white transition-colors">{t(calc.name)}</h3>
                       <div className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full w-fit mt-1">{t(calc.category)}</div>
                     </div>
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-2">{getDesc(calc.id, t(calc.name))}</p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-card/50 rounded-2xl border border-border border-dashed">
              <p className="text-slate-400">{t('explore.no_results')}</p>
              <button onClick={() => setSearchTerm('')} className="text-primary mt-2 text-sm hover:underline">{t('explore.clear')}</button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-16">
          {categories.map((cat, idx) => {
             const topCalculators = CALCULATORS
              .filter(c => c.category === cat)
              .slice(0, 3);
            
            if (topCalculators.length === 0) return null;

            return (
              <div key={cat} className="space-y-6">
                <div className="flex items-center justify-between border-b border-border pb-4">
                   <h2 className="text-2xl font-bold text-slate-900 dark:text-white pl-4 rtl:pl-0 rtl:pr-4 border-l-4 rtl:border-l-0 rtl:border-r-4 border-primary">
                     {t(cat) || cat}
                   </h2>
                   <Link 
                     to={`/category/${encodeURIComponent(cat)}`}
                     className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
                   >
                     {t('common.view_all')} <ArrowRight className="w-4 h-4 transform rtl:rotate-180" />
                   </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {topCalculators.map(calc => (
                    <Link 
                      key={calc.id} 
                      to={`/calculator/${calc.id}`}
                      className="group bg-card hover:bg-slate-100 dark:hover:bg-slate-800 border border-border rounded-xl p-5 transition-all hover:border-primary/50 hover:shadow-lg flex flex-col"
                    >
                      <div className="flex items-center gap-3 mb-3">
                         <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                           <CategoryIcon category={calc.category} className="w-4 h-4" />
                         </div>
                         <h3 className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-primary dark:group-hover:text-white transition-colors line-clamp-1">{t(calc.name)}</h3>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2">{getDesc(calc.id, t(calc.name))}</p>
                    </Link>
                  ))}
                </div>
                
                {(idx + 1) % 4 === 0 && (
                  <AdUnit slot={`explore-feed-${idx}`} format="horizontal" className="!my-2" />
                )}
              </div>
            )
          })}
        </div>
      )}

      <AdUnit slot="explore-footer" format="horizontal" />
    </div>
  );
};

const CategoryPage: React.FC = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const decodedName = decodeURIComponent(categoryName || '');
  const { t } = useLanguage();
  
  const calculators = CALCULATORS.filter(c => c.category.includes(decodedName) || c.category === decodedName);
  const translatedCategoryName = t(decodedName) || decodedName;

  useEffect(() => {
    if (calculators.length > 0) {
      const topTools = calculators.slice(0, 3).map(c => t(c.name)).join(', ');
      const title = t('category.seo_title').replace('{category}', translatedCategoryName) + ` | ${t('app.name')}`;
      const desc = t('category.seo_desc').replace('{category}', translatedCategoryName).replace('{tools}', topTools);
      
      document.title = title;
      let metaDesc = document.querySelector("meta[name='description']");
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', desc);
    }
  }, [decodedName, translatedCategoryName, calculators, t]);

  if (calculators.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{t('category.not_found')}</h2>
        <p className="text-slate-500 dark:text-slate-400">{t('category.no_tools').replace('{category}', translatedCategoryName)}</p>
        <Link to="/" className="text-primary mt-4 inline-block">{t('common.go_home')}</Link>
      </div>
    );
  }

  const getDesc = (calcId: string, calcName: string) => {
    const specificKey = `calc.${calcId}.desc`;
    const specificDesc = t(specificKey);
    if (specificDesc !== specificKey) return specificDesc;
    
    const genericTemplate = t('calc.generic.description');
    if (genericTemplate === 'calc.generic.description') return calcName;
    return genericTemplate.replace('{name}', calcName);
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/" className="p-2 bg-slate-200 dark:bg-slate-800 rounded-full hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300 transform rtl:rotate-180" />
        </Link>
        <div>
           <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{translatedCategoryName}</h1>
           <p className="text-slate-500 dark:text-slate-400">{t('tools.available').replace('{count}', calculators.length.toString())}</p>
        </div>
      </div>

      <AdUnit slot={`category-${decodedName.toLowerCase().replace(/\s/g, '-')}-top`} format="horizontal" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {calculators.map(calc => (
          <Link 
            key={calc.id} 
            to={`/calculator/${calc.id}`}
            className="group flex flex-col p-6 bg-card border border-border rounded-2xl hover:border-primary transition-all hover:shadow-xl"
          >
             <div className="flex items-center gap-3 mb-3">
                 <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                     <CategoryIcon category={calc.category} className="w-5 h-5" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{t(calc.name)}</h3>
             </div>
             
             <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 flex-1">{getDesc(calc.id, t(calc.name))}</p>
             <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1 group-hover:gap-2 transition-all">
                {t('tools.launch')} <ArrowRight className="w-3 h-3 rtl:rotate-180" />
             </span>
          </Link>
        ))}
      </div>

      <AdUnit slot="category-bottom" format="horizontal" />
    </div>
  );
};

const CalculatorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const calculator = getCalculatorById(id || '');
  const { t } = useLanguage();

  if (!calculator) {
    return <Navigate to="/" replace />;
  }

  const catName = t(calculator.category) || calculator.category;
  
  const calcName = t(calculator.name);
  const seoTitle = `${calcName} - ${catName} | ${t('app.name')}`;
  const seoDesc = t('calc.generic.description').replace('{name}', calcName);
  
  usePageSEO(seoTitle, seoDesc);

  return (
    <div className="animate-fade-in">
       <div className="mb-6">
        <Link to={`/category/${encodeURIComponent(calculator.category)}`} className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors text-sm">
          <ArrowLeft className="w-4 h-4 transform rtl:rotate-180" /> {t('common.back_to').replace('{category}', catName)}
        </Link>
       </div>
       <CalculatorRunner key={calculator.id} calculator={calculator} />
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                                MAIN APP & ROUTING                          */
/* -------------------------------------------------------------------------- */

const VALID_LANGUAGES = Object.keys(translations);
const DEFAULT_LANG = 'en';

const AppContent: React.FC = () => {
  return (
    <Layout>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/bundles" element={<Bundles />} />
        <Route path="/bundle/:id" element={<BundleView />} />
        <Route path="/builder" element={<Builder />} />
        <Route path="/my-calculators" element={<MyCalculators />} />
        <Route path="/custom/:id" element={<CustomCalculatorView />} />
        <Route path="/project-folders" element={<ProjectFolders />} />
        <Route path="/project-folders/:id" element={<ProjectFolderView />} />
        <Route path="/visual-discovery" element={<VisualDiscovery />} />
        <Route path="/workspace" element={<Workspace />} />
        <Route path="/salary-map" element={<SalaryMapPage />} />
        <Route path="/slope" element={<SlopePage />} />
        <Route path="/load-balancer" element={<LoadBalancerPage />} />
        <Route path="/randomness-engine" element={<RandomnessEngine />} />
        <Route path="/time-travel" element={<TimeTravelPage />} />
        {/* Backward compatibility */}
        <Route path="/house" element={<Navigate to="/visual-discovery" replace />} />
        <Route path="/category/:categoryName" element={<CategoryPage />} />
        <Route path="/calculator/:id" element={<CalculatorPage />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  // Determine if the URL already has a valid language prefix
  // e.g. /ar/explore -> valid
  // e.g. /explore -> invalid (needs redirection to default)
  const pathSegments = window.location.pathname.split('/');
  const firstSegment = pathSegments[1]; // index 0 is empty string before leading slash
  
  // If we are at the root domain with NO path (e.g. calc-verse.com/), firstSegment is empty string
  // If we are at /explore, firstSegment is 'explore'
  // If we are at /ar/explore, firstSegment is 'ar'

  let lang = DEFAULT_LANG;
  let isLangInUrl = false;

  if (VALID_LANGUAGES.includes(firstSegment)) {
    lang = firstSegment;
    isLangInUrl = true;
  }

  // If the language is NOT in the URL, we must redirect
  // This logic runs once on mount. The LanguageProvider will then handle switching.
  useEffect(() => {
    if (!isLangInUrl) {
      // Redirect to /en/{currentPath}
      // We use window.location.replace to avoid history stack buildup for the redirect
      // Construct new path
      const newPath = `/${DEFAULT_LANG}${window.location.pathname === '/' ? '' : window.location.pathname}${window.location.search}${window.location.hash}`;
      window.history.replaceState(null, '', newPath);
      // We need to force a re-render or just let the router pick it up?
      // Since we changed history state but didn't trigger a nav event, the browser won't reload.
      // We should probably just let the Router basename handle it if we passed valid lang?
      // No, because basename assumes the prefix EXISTS.
      
      // Force reload to ensure everything aligns clean for the first time
      // This is the safest way to ensure the router basename syncs with the URL
      window.location.reload();
    }
  }, [isLangInUrl]);

  // If we are in the process of redirecting, render nothing or a loader
  if (!isLangInUrl) {
    return null; 
  }

  return (
    <BrowserRouter basename={`/${lang}`}>
      <LanguageProvider initialLanguage={lang as any}>
        <LocalizationProvider>
          <SkinProvider>
            <ComparisonProvider>
              <FolderProvider>
                <GoalProvider>
                  <PresetProvider>
                    <WorkspaceProvider>
                      <CustomCalcProvider>
                        <SEOHead />
                        <AppContent />
                      </CustomCalcProvider>
                    </WorkspaceProvider>
                  </PresetProvider>
                </GoalProvider>
              </FolderProvider>
            </ComparisonProvider>
          </SkinProvider>
        </LocalizationProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
};

export default App;