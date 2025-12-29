
import React from 'react';
import { Shield, Scale, Zap, ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import { Scenario } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';
import { newFeatureTranslations } from '../utils/newFeatureTranslations';

interface Props {
  scenarios: Scenario[];
  loading: boolean;
  onSimulate: () => void;
  hasResult: boolean;
}

const ScenarioSimulator: React.FC<Props> = ({ scenarios, loading, onSimulate, hasResult }) => {
  const { language } = useLanguage();
  const t = newFeatureTranslations[language as keyof typeof newFeatureTranslations] || newFeatureTranslations['en'];
  const ts = t.scenario;

  if (!hasResult && !loading) return null;

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden mt-6">
      <div className="p-4 border-b border-border bg-slate-50 dark:bg-slate-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
             <Zap className="w-5 h-5 text-amber-500" /> {ts.title}
           </h3>
           <p className="text-sm text-slate-500 dark:text-slate-400">
             {ts.desc}
           </p>
        </div>
        <button
          onClick={onSimulate}
          disabled={loading}
          className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto justify-center"
        >
          {loading ? (
             <>
               <Loader2 className="w-4 h-4 animate-spin" /> {ts.simulating}
             </>
          ) : (
             <>
               <RefreshCw className="w-4 h-4" /> {scenarios.length > 0 ? ts.regenerate : ts.simulate}
             </>
          )}
        </button>
      </div>

      {scenarios.length > 0 && !loading && (
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {scenarios.map((scenario, idx) => {
            let colorClass = 'border-l-4 border-blue-500';
            let icon = <Shield className="w-5 h-5 text-blue-500" />;
            let bgClass = 'bg-blue-50 dark:bg-blue-900/10';
            let titleClass = 'text-blue-700 dark:text-blue-300';

            if (scenario.type.toLowerCase().includes('moderate')) {
                colorClass = 'border-l-4 border-amber-500';
                icon = <Scale className="w-5 h-5 text-amber-500" />;
                bgClass = 'bg-amber-50 dark:bg-amber-900/10';
                titleClass = 'text-amber-700 dark:text-amber-300';
            } else if (scenario.type.toLowerCase().includes('aggressive')) {
                colorClass = 'border-l-4 border-rose-500';
                icon = <Zap className="w-5 h-5 text-rose-500" />;
                bgClass = 'bg-rose-50 dark:bg-rose-900/10';
                titleClass = 'text-rose-700 dark:text-rose-300';
            }

            return (
              <div key={idx} className={`relative rounded-xl p-5 border border-border shadow-sm flex flex-col h-full ${colorClass} bg-white dark:bg-slate-900`}>
                 <div className="flex items-center gap-2 mb-3">
                    <div className={`p-2 rounded-lg ${bgClass}`}>
                        {icon}
                    </div>
                    <div>
                        <div className={`text-xs font-bold uppercase tracking-wider ${titleClass}`}>{scenario.type}</div>
                        <div className="font-bold text-slate-900 dark:text-white leading-tight">{scenario.title}</div>
                    </div>
                 </div>
                 
                 <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 flex-grow">
                    {scenario.description}
                 </p>

                 <div className="space-y-3 mt-auto pt-4 border-t border-border border-dashed">
                    <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">{ts.inputs}</div>
                        <div className="text-xs font-mono text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 p-2 rounded">
                            {scenario.changes}
                        </div>
                    </div>
                    <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">{ts.outcome}</div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white flex items-start gap-2">
                            <ArrowRight className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                            {scenario.outcome}
                        </div>
                    </div>
                 </div>
              </div>
            );
          })}
        </div>
      )}
      
      {loading && (
          <div className="p-8 text-center text-slate-400 flex flex-col items-center">
              <Loader2 className="w-8 h-8 animate-spin mb-2 text-indigo-500" />
              <p className="text-sm">{ts.loading}</p>
          </div>
      )}
    </div>
  );
};

export default ScenarioSimulator;
