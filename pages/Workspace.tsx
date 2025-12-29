
import React from 'react';
import { useWorkspace } from '../contexts/WorkspaceContext';
import CalculatorRunner from '../components/CalculatorRunner';
import { getCalculatorById } from '../utils/calculatorRegistry';
import { X, Layout, Plus, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { featureTranslations } from '../utils/featureTranslations';
import { ArrowLeft } from 'lucide-react';

const Workspace: React.FC = () => {
  const { tabs, activeInstanceId, closeTab, switchTab } = useWorkspace();
  const { language, t: tGlobal } = useLanguage();
  const t = (key: string) => featureTranslations[language]?.[key] || featureTranslations['en'][key];

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col">
       {/* Header / Tab Bar */}
       <div className="flex items-center gap-4 mb-4 shrink-0">
          <Link to="/" className="p-2 bg-slate-200 dark:bg-slate-800 rounded-full hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300 transform rtl:rotate-180" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
             <Layout className="w-6 h-6 text-primary" /> {t('workspace')}
          </h1>
       </div>

       {tabs.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
             <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 shadow-sm">
                <Layout className="w-8 h-8 text-slate-400" />
             </div>
             <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('noTabs')}</h3>
             <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm text-center">{t('noTabsDesc')}</p>
             <Link to="/explore" className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors">
                Open Calculators
             </Link>
          </div>
       ) : (
          <div className="flex-1 flex flex-col min-h-0 bg-slate-100 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
             {/* Tab Strip */}
             <div className="flex items-center bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-2 pt-2 gap-2 overflow-x-auto no-scrollbar shrink-0">
                {tabs.map(tab => {
                   const isActive = tab.instanceId === activeInstanceId;
                   return (
                      <div 
                        key={tab.instanceId}
                        onClick={() => switchTab(tab.instanceId)}
                        className={`
                           flex items-center gap-2 px-4 py-2.5 rounded-t-xl cursor-pointer min-w-[140px] max-w-[200px] border-t border-x transition-colors relative group
                           ${isActive 
                             ? 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-primary font-bold z-10' 
                             : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                           }
                        `}
                      >
                         <span className="truncate text-xs">{tab.label}</span>
                         <button 
                           onClick={(e) => { e.stopPropagation(); closeTab(tab.instanceId); }}
                           className={`ml-auto p-0.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                         >
                            <X className="w-3 h-3" />
                         </button>
                         {/* Bottom line hider for active tab */}
                         {isActive && <div className="absolute bottom-[-1px] left-0 right-0 h-[1px] bg-slate-100 dark:bg-slate-950" />}
                      </div>
                   );
                })}
             </div>

             {/* Content Area */}
             <div className="flex-1 relative overflow-hidden bg-slate-100 dark:bg-slate-950">
                {tabs.map(tab => {
                   const calculator = getCalculatorById(tab.calculatorId);
                   if (!calculator) return null;
                   
                   return (
                      <div 
                        key={tab.instanceId}
                        className="absolute inset-0 overflow-y-auto p-4 md:p-6 custom-scrollbar"
                        style={{ display: tab.instanceId === activeInstanceId ? 'block' : 'none' }}
                      >
                         <CalculatorRunner calculator={calculator} />
                      </div>
                   );
                })}
             </div>
          </div>
       )}
    </div>
  );
};

export default Workspace;
