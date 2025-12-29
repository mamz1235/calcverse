
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Menu, X, Search, Calculator, Zap, ChevronRight, Globe, 
  ChevronDown, ChevronUp, Check, LayoutDashboard, FileText, Lock, Heart, ArrowUp, Scale, Layers, Beaker, Palette, Layout as LayoutIcon, MapPin, Dices, DollarSign, History
} from 'lucide-react';
import { CALCULATORS, getCalculatorById } from '../utils/calculatorRegistry';
import { Category } from '../types';
import AdUnit from './AdUnit';
import { useLanguage } from '../contexts/LanguageContext';
import CategoryIcon, { getIconComponent } from './CategoryIcon';
import { searchCalculators } from '../utils/search';
import { useFavorites } from '../hooks/useFavorites';
import PersonalizationWizard from './PersonalizationWizard';
import ComparisonTray from './ComparisonTray';
import { useComparison } from '../contexts/ComparisonContext';
import { sidebarTranslations } from '../utils/sidebarTranslations';
import { builderTranslations } from '../utils/builderTranslations';
import { themeTranslations } from '../utils/themeTranslations';
import { featureTranslations } from '../utils/featureTranslations';
import { newFeatureTranslations } from '../utils/newFeatureTranslations';
import { useCustomCalc } from '../contexts/CustomCalcContext';
import { useSkin } from '../contexts/SkinContext';
import ThemePicker from './ThemePicker';
import { useLocalization } from '../contexts/LocalizationContext';
import MatrixRain from './MatrixRain';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isThemePickerOpen, setIsThemePickerOpen] = useState(false);
  
  // Desktop Header State
  const [isDesktopLangOpen, setIsDesktopLangOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isEmbed = searchParams.get('embed') === 'true';

  const { t, language, setLanguage, dir } = useLanguage();
  const { currency, setCurrency } = useLocalization();

  const tSidebar = (key: string) => sidebarTranslations[language]?.[key] || sidebarTranslations['en'][key];
  const tBuilder = (key: string) => builderTranslations[language]?.[key] || builderTranslations['en'][key];
  const tTheme = (key: string) => themeTranslations[language]?.[key] || themeTranslations['en'][key];
  const tFeature = (key: string) => featureTranslations[language]?.[key] || featureTranslations['en'][key];
  const tNew = newFeatureTranslations[language as keyof typeof newFeatureTranslations] || newFeatureTranslations['en'];
  
  const { items } = useComparison();
  const { getCustomCalculator } = useCustomCalc();
  const { isDarkMode, toggleDarkMode, currentTheme } = useSkin();
  
  // Favorites Hook
  const { favorites } = useFavorites();
  const favoriteCalculators = useMemo(() => 
    CALCULATORS.filter(c => favorites.includes(c.id)),
  [favorites]);
  
  const mobileLangRef = useRef<HTMLDivElement>(null);
  const desktopLangRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K for search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        if (window.innerWidth < 768) {
           setIsSidebarOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle Scroll Visibility for Scroll to Top button
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileLangRef.current && !mobileLangRef.current.contains(event.target as Node)) {
        setShowLangMenu(false);
      }
      if (desktopLangRef.current && !desktopLangRef.current.contains(event.target as Node)) {
        setIsDesktopLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Optimized Search
  const filteredCalculators = useMemo(() => 
    searchCalculators(searchQuery, CALCULATORS, t), 
  [searchQuery, t]);

  const handleSearchSelect = (id: string) => {
    navigate(`/calculator/${id}`);
    setSearchQuery('');
    setIsSidebarOpen(false);
  };

  // Generate nav links dynamically from Category enum
  const navLinks = useMemo(() => Object.values(Category).map(cat => ({
    name: cat,
    displayName: t(cat) !== cat ? t(cat) : cat, // Attempt translation or fallback
    path: `/category/${encodeURIComponent(cat)}`
  })), [t]);

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'ru', label: 'Русский' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'ar', label: 'العربية' }
  ];
  
  const CURRENCIES = [
    'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 
    'INR', 'CNY', 'BRL', 'RUB', 'KRW', 'EGP', 
    'AED', 'SAR', 'TRY', 'MXN', 'ZAR', 'SGD'
  ].sort();

  const pageInfo = useMemo(() => {
    if (location.pathname === '/') return { title: t('nav.dashboard'), icon: LayoutDashboard };
    
    if (location.pathname.startsWith('/explore')) return { title: 'Explore', icon: Search };
    
    if (location.pathname.startsWith('/bundles')) return { title: 'Bundles', icon: Layers };
    if (location.pathname.startsWith('/bundle/')) return { title: 'Bundle View', icon: Layers };
    if (location.pathname.startsWith('/salary-map')) return { title: tNew.nav.salaryMap, icon: MapPin };
    if (location.pathname.startsWith('/randomness-engine')) return { title: tNew.nav.randomness, icon: Dices };
    if (location.pathname.startsWith('/time-travel')) return { title: "Time Travel", icon: History };

    if (location.pathname.startsWith('/builder')) return { title: tBuilder('title'), icon: Beaker };
    if (location.pathname.startsWith('/my-calculators')) return { title: tBuilder('myCalcsTitle'), icon: Beaker };
    
    if (location.pathname.startsWith('/workspace')) return { title: tFeature('workspace'), icon: LayoutIcon };

    if (location.pathname.startsWith('/custom/')) {
        const id = location.pathname.split('/')[2];
        const calc = getCustomCalculator(id);
        return { title: calc ? calc.name : 'Custom Calculator', icon: Beaker };
    }

    if (location.pathname.startsWith('/category/')) {
        const cat = decodeURIComponent(location.pathname.split('/')[2]);
        return { title: t(cat) || cat, icon: getIconComponent(cat) };
    }
    
    if (location.pathname.startsWith('/calculator/')) {
        const id = location.pathname.split('/')[2];
        const calc = getCalculatorById(id);
        if (calc) {
            return { title: t(calc.name), icon: getIconComponent(calc.category) };
        }
        return { title: 'Calculator', icon: Calculator };
    }
    
    if (location.pathname.startsWith('/terms')) return { title: t('footer.terms'), icon: FileText };
    if (location.pathname.startsWith('/privacy')) return { title: t('footer.privacy'), icon: Lock };
    if (location.pathname.startsWith('/compare')) return { title: 'Workspace', icon: Scale };
    
    return { title: 'Page', icon: LayoutDashboard };
  }, [location.pathname, t, tBuilder, getCustomCalculator, tFeature, tNew]);

  const PageIcon = pageInfo.icon;

  if (isEmbed) {
    return (
      <div className="min-h-screen bg-transparent font-sans" dir={dir}>
        <div className="p-4">
          {children}
          <div className="mt-4 text-center text-xs text-slate-500">
             Powered by <a href="/" target="_blank" className="font-bold text-primary hover:underline">CalcVerse</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-slate-900 dark:text-slate-200 flex flex-col md:flex-row font-sans transition-colors duration-300" dir={dir}>
      {/* Matrix Effect Injection */}
      {currentTheme.id === 'matrix' && <MatrixRain />}

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-card border-b border-border sticky top-0 z-50 shadow-sm">
        <Link to="/" className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight">
          <img src="/logo.png" alt="CalcVerse" className="w-8 h-8 object-contain" />
          <span>{t('app.name')}</span>
        </Link>
        <div className="flex items-center gap-2">
          {/* Mobile Theme Picker Button */}
          <button 
             onClick={() => setIsThemePickerOpen(true)}
             className="p-2 rounded-xl bg-card border border-border hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
          >
             <Palette className="w-4 h-4" />
          </button>

          {/* Mobile Language Dropdown */}
          <div className="relative" ref={mobileLangRef}>
            <button 
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-card border border-border hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs font-medium text-slate-700 dark:text-slate-200 uppercase"
            >
               <Globe className="w-4 h-4 text-slate-500" />
               <span>{language}</span>
               {showLangMenu ? <ChevronUp className="w-3 h-3 text-slate-400" /> : <ChevronDown className="w-3 h-3 text-slate-400" />}
            </button>
            {showLangMenu && (
              <div className="absolute top-full end-0 mt-2 w-40 bg-card border border-border rounded-xl shadow-xl z-[60] overflow-hidden py-1 animate-fade-in">
                {languages.map(l => (
                  <button
                    key={l.code}
                    onClick={() => { setLanguage(l.code as any); setShowLangMenu(false); }}
                    className={`w-full text-start px-4 py-2.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-700/50 flex items-center justify-between ${language === l.code ? 'text-primary font-bold bg-primary/5' : 'text-slate-600 dark:text-slate-300'}`}
                  >
                    {l.label}
                    {language === l.code && <Check className="w-3 h-3" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
            {isSidebarOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Sidebar / Navigation */}
      <aside className={`
        fixed inset-y-0 start-0 z-40 w-72 bg-card border-e border-border transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : (dir === 'rtl' ? 'translate-x-full' : '-translate-x-full')}
        md:sticky md:top-0 md:h-screen md:transform-none md:shadow-none
      `}>
        <div className="p-6 border-b border-border flex items-center gap-3 shrink-0">
           <img src="/logo.png" alt="CalcVerse" className="w-10 h-10 object-contain" />
           <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
             {t('app.name')}
           </span>
        </div>

        {/* Global Search */}
        <div className="p-4 pb-0 relative z-50 shrink-0">
          <div className="relative group">
            <Search className="absolute start-3 top-3 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input 
              ref={searchInputRef}
              type="text" 
              placeholder={t('search.placeholder')} 
              className="w-full bg-slate-50 dark:bg-slate-900 border border-border rounded-xl py-2.5 ps-9 pe-4 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner text-slate-900 dark:text-slate-100 placeholder-slate-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute end-3 top-2.5 hidden md:flex items-center gap-0.5 pointer-events-none opacity-50">
               <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-300 font-mono">⌘</span>
               <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-300 font-mono">K</span>
            </div>
          </div>
          
          {searchQuery && (
            <div className="absolute start-4 end-4 top-14 bg-card border border-border rounded-xl shadow-2xl overflow-hidden max-h-[60vh] overflow-y-auto z-50 text-start">
              {filteredCalculators.length === 0 ? (
                <div className="p-4 text-sm text-slate-500 text-center">{t('sidebar.no_results')}</div>
              ) : (
                filteredCalculators.map(calc => (
                    <button
                      key={calc.id}
                      onClick={() => handleSearchSelect(calc.id)}
                      className="w-full text-start p-3 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors flex items-center gap-3 text-sm border-b border-border last:border-0 group"
                    >
                      <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg text-secondary group-hover:scale-110 transition-transform">
                        <CategoryIcon category={calc.category} className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-900 dark:text-slate-200">{t(calc.name)}</div>
                        <div className="text-xs text-slate-500">{t(calc.category) || calc.category}</div>
                      </div>
                    </button>
                  ))
              )}
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <Link 
            to="/" 
            className={`flex items-center gap-3 p-3 rounded-xl transition-all mb-1 ${location.pathname === '/' ? 'bg-primary/20 text-primary font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium'}`}
            onClick={() => setIsSidebarOpen(false)}
          >
             <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
             {t('nav.dashboard')}
          </Link>

          <Link 
            to="/bundles" 
            className={`flex items-center gap-3 p-3 rounded-xl transition-all mb-1 ${location.pathname === '/bundles' ? 'bg-primary/20 text-primary font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium'}`}
            onClick={() => setIsSidebarOpen(false)}
          >
             <Layers className="w-4 h-4" />
             <span>{tSidebar('bundles')}</span>
          </Link>

          <Link 
            to="/workspace" 
            className={`flex items-center gap-3 p-3 rounded-xl transition-all mb-1 ${location.pathname === '/workspace' ? 'bg-primary/20 text-primary font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium'}`}
            onClick={() => setIsSidebarOpen(false)}
          >
             <LayoutIcon className="w-4 h-4" />
             <span>{tFeature('workspace')}</span>
          </Link>

          <Link 
            to="/salary-map" 
            className={`flex items-center gap-3 p-3 rounded-xl transition-all mb-1 ${location.pathname === '/salary-map' ? 'bg-primary/20 text-primary font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium'}`}
            onClick={() => setIsSidebarOpen(false)}
          >
             <MapPin className="w-4 h-4" />
             <span>{tNew.nav.salaryMap}</span>
          </Link>

          <Link 
            to="/randomness-engine" 
            className={`flex items-center gap-3 p-3 rounded-xl transition-all mb-1 ${location.pathname === '/randomness-engine' ? 'bg-primary/20 text-primary font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium'}`}
            onClick={() => setIsSidebarOpen(false)}
          >
             <Dices className="w-4 h-4" />
             <span>{tNew.nav.randomness}</span>
          </Link>
          
          <Link 
            to="/time-travel" 
            className={`flex items-center gap-3 p-3 rounded-xl transition-all mb-4 ${location.pathname === '/time-travel' ? 'bg-primary/20 text-primary font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium'}`}
            onClick={() => setIsSidebarOpen(false)}
          >
             <History className="w-4 h-4" />
             <span>Time Travel</span>
          </Link>
          
          {items.length > 0 && (
             <Link 
               to="/compare" 
               className={`flex items-center gap-3 p-3 rounded-xl transition-all mb-4 ${location.pathname === '/compare' ? 'bg-indigo-500 text-white font-bold' : 'bg-indigo-50 dark:bg-indigo-900/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30'}`}
               onClick={() => setIsSidebarOpen(false)}
             >
                <Scale className="w-4 h-4" />
                <span>Comparison Workspace</span>
                <span className="ml-auto text-xs bg-white/20 px-1.5 py-0.5 rounded-md font-bold">{items.length}</span>
             </Link>
          )}

          {/* Favorites Section */}
          {favoriteCalculators.length > 0 && (
            <div className="mb-4">
              <div className="px-3 py-2 text-[11px] font-bold text-slate-500 uppercase tracking-widest opacity-80 flex items-center gap-2">
                 <Heart className="w-3 h-3" /> {t('home.favorites')}
              </div>
              <div className="space-y-1">
                {favoriteCalculators.map(calc => (
                    <Link
                    key={calc.id}
                    to={`/calculator/${calc.id}`}
                    className={`flex items-center gap-3 p-2.5 rounded-xl transition-all group ${location.pathname === `/calculator/${calc.id}` ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                    onClick={() => setIsSidebarOpen(false)}
                    >
                        <CategoryIcon category={calc.category} className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                        <span className="text-sm font-medium truncate">{t(calc.name)}</span>
                    </Link>
                ))}
              </div>
            </div>
          )}
          
          <div className="px-3 py-2 text-[11px] font-bold text-slate-500 uppercase tracking-widest opacity-80">{t('nav.categories')}</div>
          
          {navLinks.map(link => {
            const isActive = location.pathname.includes(encodeURIComponent(link.name)) || location.pathname.includes(link.name);
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center justify-between p-3 rounded-xl transition-all group ${isActive ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <span className="text-sm font-medium truncate">{link.displayName}</span>
                {isActive && <ChevronRight className="w-4 h-4 text-primary shrink-0 transform rtl:rotate-180" />}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="px-4 mt-auto">
          <AdUnit slot="sidebar-bottom" format="rectangle" className="!my-4 !h-[200px]" label="Partner" />
        </div>

        <div className="p-4 border-t border-border bg-slate-50/50 dark:bg-dark/30 shrink-0">
          <div className="flex items-center justify-between text-xs text-slate-500">
             <span>© 2025 CalcVerse</span>
             <span>{t('sidebar.version')}</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 bg-dark relative">
        
        {/* DESKTOP HEADER - Sticky */}
        <header className="hidden md:flex items-center justify-between px-8 py-5 sticky top-0 z-30 bg-dark/80 backdrop-blur-md border-b border-border transition-colors duration-300">
           <div className="flex items-center gap-3">
             <div className="p-2 bg-card border border-border rounded-lg text-secondary">
               <PageIcon className="w-5 h-5" />
             </div>
             <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-none">{pageInfo.title}</h2>
             </div>
           </div>

           <div className="flex items-center gap-3">
             {/* Desktop Language */}
             <div className="relative" ref={desktopLangRef}>
                <button 
                  onClick={() => setIsDesktopLangOpen(!isDesktopLangOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-card border border-border hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                   <Globe className="w-4 h-4 text-slate-500" />
                   <span>{languages.find(l => l.code === language)?.label || 'English'}</span>
                   {isDesktopLangOpen ? <ChevronUp className="w-3 h-3 text-slate-400" /> : <ChevronDown className="w-3 h-3 text-slate-400" />}
                </button>
                
                {isDesktopLangOpen && (
                   <div className="absolute top-full end-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50 animate-fade-in">
                      {languages.map(l => (
                        <button
                          key={l.code}
                          onClick={() => { setLanguage(l.code as any); setIsDesktopLangOpen(false); }}
                          className={`w-full text-start px-4 py-2.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-700/50 flex items-center justify-between ${language === l.code ? 'text-primary font-bold bg-primary/5' : 'text-slate-600 dark:text-slate-300'}`}
                        >
                          {l.label}
                          {language === l.code && <Check className="w-3 h-3" />}
                        </button>
                      ))}
                   </div>
                )}
             </div>

             {/* Theme Picker Trigger */}
             <button 
                onClick={() => setIsThemePickerOpen(true)}
                className="px-3 py-2 rounded-xl bg-card border border-border hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300 flex items-center gap-2 group"
                title={tTheme('settingsTitle')}
             >
                <Palette className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">{tTheme('appearance')}</span>
             </button>
           </div>
        </header>

        {/* Content Container */}
        <div className="max-w-7xl mx-auto p-4 md:p-8 flex flex-col min-h-[calc(100vh-80px)]">
          <div className="flex-1">
             {children}
          </div>

          {/* Global Footer */}
          <footer className="mt-20 border-t border-border">
            {/* Donation Section */}
            <div className="py-8 flex flex-col items-center justify-center text-center gap-6">
               <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">{t('footer.support.title')}</h3>
               <div className="flex flex-wrap justify-center gap-4">
                  <a href="https://ko-fi.com/calcverse" target="_blank" rel="noopener noreferrer" className="px-6 py-2.5 bg-[#FF5E5B] text-white rounded-full font-bold hover:opacity-90 transition-opacity shadow-lg shadow-[#FF5E5B]/20 text-sm">
                     {t('footer.support.kofi')}
                  </a>
                  <a href="https://paypal.me/calcverse" target="_blank" rel="noopener noreferrer" className="px-6 py-2.5 bg-[#00457C] text-white rounded-full font-bold hover:opacity-90 transition-opacity shadow-lg shadow-[#00457C]/20 text-sm">
                     {t('footer.support.paypal')}
                  </a>
               </div>
            </div>
            
            {/* Currency Selector */}
            <div className="py-6 border-t border-border flex flex-col items-center justify-center gap-3">
               <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                 <DollarSign className="w-3 h-3" /> Currency
               </label>
               <div className="flex flex-wrap justify-center gap-2">
                 <select 
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="bg-card border border-border text-slate-700 dark:text-slate-300 text-sm rounded-lg px-3 py-2 outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer"
                 >
                    {CURRENCIES.map(curr => (
                        <option key={curr} value={curr}>{curr}</option>
                    ))}
                 </select>
               </div>
            </div>

            {/* Links and Copyright */}
            <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-sm pb-8">
              <div>
                © {new Date().getFullYear()} {t('app.name')}. {t('footer.rights')}
              </div>
              <div className="flex gap-6 font-medium">
                <Link to="/terms" className="hover:text-primary transition-colors">{t('footer.terms')}</Link>
                <Link to="/privacy" className="hover:text-primary transition-colors">{t('footer.privacy')}</Link>
              </div>
            </div>
          </footer>
        </div>
      </main>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 end-8 p-3.5 rounded-full bg-primary text-white shadow-2xl transition-all duration-300 z-50 hover:bg-primary/90 active:scale-95 flex items-center justify-center ${
          showScrollTop ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-75 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-6 h-6" />
      </button>

      {/* Personalization Wizard */}
      <PersonalizationWizard />
      
      {/* Comparison Tray */}
      <ComparisonTray />

      {/* Theme Picker Modal */}
      <ThemePicker isOpen={isThemePickerOpen} onClose={() => setIsThemePickerOpen(false)} />
    </div>
  );
};

export default Layout;
