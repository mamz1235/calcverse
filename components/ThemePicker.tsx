
import React from 'react';
import { THEMES } from '../utils/themeRegistry';
import { useSkin } from '../contexts/SkinContext';
import { Check, Palette, X, Sun, Moon, Monitor } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { themeTranslations } from '../utils/themeTranslations';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ThemePicker: React.FC<Props> = ({ isOpen, onClose }) => {
  const { currentTheme, setThemeId, isDarkMode, toggleDarkMode } = useSkin();
  const { language } = useLanguage();
  const tTheme = (key: string) => themeTranslations[language]?.[key] || themeTranslations['en'][key];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-card border border-border rounded-3xl p-6 w-full max-w-4xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-xl text-primary">
            <Palette className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{tTheme('settingsTitle')}</h2>
            <p className="text-sm text-slate-500">{tTheme('settingsDesc')}</p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="mt-6 mb-8">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">{tTheme('modeTitle')}</h3>
            <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-full sm:w-fit">
                <button
                    onClick={() => { if(isDarkMode) toggleDarkMode(); }}
                    disabled={currentTheme.mode === 'dark'}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                        !isDarkMode 
                        ? 'bg-white dark:bg-slate-700 shadow text-primary' 
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    } ${currentTheme.mode === 'dark' ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <Sun className="w-4 h-4" /> {tTheme('light')}
                </button>
                <button
                    onClick={() => { if(!isDarkMode) toggleDarkMode(); }}
                    disabled={currentTheme.mode === 'light'}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                        isDarkMode 
                        ? 'bg-white dark:bg-slate-700 shadow text-primary' 
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    } ${currentTheme.mode === 'light' ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <Moon className="w-4 h-4" /> {tTheme('dark')}
                </button>
            </div>
            {currentTheme.mode !== 'system' && (
                <p className="text-xs text-amber-500 mt-2 font-medium flex items-center gap-1.5">
                    <LockIcon className="w-3 h-3" />
                    {tTheme('enforcement').replace('{mode}', tTheme(currentTheme.mode))}
                </p>
            )}
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">{tTheme('selectTheme')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {THEMES.map(theme => {
              const isActive = currentTheme.id === theme.id;
              
              // Determine preview palette:
              let displayPalette;
              if (theme.mode === 'light') {
                  displayPalette = theme.colors.light;
              } else if (theme.mode === 'dark') {
                  displayPalette = theme.colors.dark;
              } else {
                  displayPalette = isDarkMode ? theme.colors.dark : theme.colors.light;
              }

              // Localized Name/Desc
              const localizedName = tTheme(`theme_${theme.id.replace(/-/g, '_')}_name`) || theme.name;
              const localizedDesc = tTheme(`theme_${theme.id.replace(/-/g, '_')}_desc`) || theme.description;

              return (
                <button
                  key={theme.id}
                  onClick={() => setThemeId(theme.id)}
                  className={`
                    relative group flex items-start gap-4 p-4 rounded-2xl border-2 transition-all text-left overflow-hidden
                    ${isActive ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'border-border hover:border-slate-400 dark:hover:border-slate-500 hover:shadow-lg'}
                  `}
                >
                  {/* Visual Preview Swatch */}
                  <div 
                    className="w-24 h-24 rounded-xl shadow-inner shrink-0 flex flex-col items-center justify-center gap-2 border border-black/5 dark:border-white/10"
                    style={{ backgroundColor: displayPalette.bgMain }}
                  >
                    <div className="flex gap-2">
                      <div className="w-6 h-6 rounded-full shadow-lg ring-1 ring-black/5" style={{ backgroundColor: displayPalette.primary }}></div>
                      <div className="w-6 h-6 rounded-full shadow-lg ring-1 ring-black/5" style={{ backgroundColor: displayPalette.secondary }}></div>
                    </div>
                    <div 
                      className="w-16 h-2 rounded-full opacity-50"
                      style={{ backgroundColor: displayPalette.textMain }}
                    ></div>
                  </div>

                  <div className="flex-1 min-w-0 z-10">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white">{localizedName}</h3>
                      {isActive && <Check className="w-5 h-5 text-primary" />}
                    </div>
                    <p className="text-xs font-medium opacity-70 mb-3 text-slate-600 dark:text-slate-300">
                      {localizedDesc}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider font-bold text-slate-400">
                      <span className={`px-2 py-1 rounded-md border ${theme.mode === 'system' ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700' : 'bg-slate-100 dark:bg-slate-800/50 border-transparent'}`}>
                        {theme.mode === 'system' ? tTheme('autoMode') : theme.mode === 'dark' ? tTheme('darkOnly') : tTheme('lightOnly')}
                      </span>
                    </div>
                  </div>

                  {/* Subtle gradient overlay for active state */}
                  {isActive && (
                    <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper icon
const LockIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
);

export default ThemePicker;
