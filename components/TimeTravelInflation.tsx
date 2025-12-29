
import React, { useState, useMemo } from 'react';
import { CPI_DATA, FUN_FACTS, HistoricalItem } from '../utils/cpiData';
import { useLanguage } from '../contexts/LanguageContext';
import { timeTravelTranslations } from '../utils/timeTravelTranslations';
import { History, ArrowRight, DollarSign, TrendingDown, Calendar, ShoppingCart } from 'lucide-react';

const TimeTravelInflation: React.FC = () => {
  const { language } = useLanguage();
  const t = timeTravelTranslations[language] || timeTravelTranslations['en'];
  
  const [amount, setAmount] = useState<number>(50000);
  const [targetYear, setTargetYear] = useState<number>(1950);
  const currentYear = 2024;
  const currentCPI = CPI_DATA[currentYear];

  // Calculate Logic
  const calculateHistoricalValue = (amt: number, year: number) => {
    const yearCPI = CPI_DATA[year];
    if (!yearCPI || !currentCPI) return 0;
    // Formula: Value in Past = Current * (Past CPI / Current CPI)
    return amt * (yearCPI / currentCPI);
  };

  const historicalValue = useMemo(() => calculateHistoricalValue(amount, targetYear), [amount, targetYear]);
  const inflationRate = useMemo(() => ((currentCPI - CPI_DATA[targetYear]) / CPI_DATA[targetYear]) * 100, [targetYear, currentCPI]);
  const priceMultiplier = useMemo(() => currentCPI / CPI_DATA[targetYear], [targetYear, currentCPI]);

  // Find nearest fun facts (within 5 year blocks)
  const getFunFacts = (year: number): HistoricalItem[] => {
    const roundedYear = Math.floor(year / 5) * 5;
    return FUN_FACTS[roundedYear] || [];
  };

  const facts = useMemo(() => getFunFacts(targetYear), [targetYear]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  return (
    <div className="bg-card border border-border rounded-3xl shadow-xl overflow-hidden max-w-5xl mx-auto flex flex-col md:flex-row">
      
      {/* LEFT: Controls */}
      <div className="md:w-1/3 bg-slate-50 dark:bg-slate-900/50 p-6 border-r border-border flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
             <History className="w-6 h-6 text-indigo-500" />
             Time Travel
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Inflation Calculator</p>
        </div>

        <div className="space-y-4">
          <div>
             <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
               {t.inputLabel}
             </label>
             <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                   type="number" 
                   value={amount}
                   onChange={(e) => setAmount(Number(e.target.value))}
                   className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-lg"
                />
             </div>
          </div>

          <div>
             <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex justify-between">
                {t.yearLabel}
                <span className="text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded text-xs">
                   {targetYear}
                </span>
             </label>
             <input 
               type="range"
               min="1950"
               max="2024"
               step="1"
               value={targetYear}
               onChange={(e) => setTargetYear(Number(e.target.value))}
               className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
             />
             <div className="flex justify-between text-xs text-slate-400 mt-2 font-mono">
               <span>1950</span>
               <span>1985</span>
               <span>2024</span>
             </div>
          </div>
        </div>

        <div className="mt-auto bg-white dark:bg-slate-800 p-4 rounded-xl border border-border space-y-3">
            <div className="flex justify-between items-center text-sm">
               <span className="text-slate-500">{t.inflationRate}</span>
               <span className="font-bold text-rose-500">+{inflationRate.toFixed(0)}%</span>
            </div>
            <div className="flex justify-between items-center text-sm">
               <span className="text-slate-500">{t.multiplier}</span>
               <span className="font-bold text-slate-700 dark:text-slate-300">{priceMultiplier.toFixed(1)}x</span>
            </div>
            <p className="text-[10px] text-slate-400 pt-2 border-t border-border mt-2 leading-tight">
               {t.explanation}
            </p>
        </div>
      </div>

      {/* RIGHT: Results */}
      <div className="md:w-2/3 p-6 md:p-10 flex flex-col justify-center relative overflow-hidden">
         {/* Background Decor */}
         <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <History className="w-64 h-64 text-slate-900 dark:text-white" />
         </div>

         <div className="relative z-10">
            <h3 className="text-lg text-slate-500 dark:text-slate-400 mb-2">
               {t.resultIntro.replace('{year}', targetYear.toString())}
            </h3>
            
            <div className="flex items-baseline gap-4 mb-8">
               <span className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight">
                  {formatCurrency(historicalValue)}
               </span>
               <span className="text-xl md:text-2xl text-slate-400 font-medium">
                  in {targetYear}
               </span>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800 rounded-2xl p-6">
               <h4 className="text-sm font-bold text-indigo-800 dark:text-indigo-300 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" /> {t.contextTitle.replace('{year}', targetYear.toString())}
               </h4>
               
               {facts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     {facts.map((fact, i) => {
                        const count = Math.floor(historicalValue / fact.price);
                        if (count < 1) return null;
                        
                        return (
                           <div key={i} className="flex items-start gap-3 p-3 bg-white dark:bg-slate-800/80 rounded-xl shadow-sm border border-indigo-100 dark:border-indigo-900/30">
                              <div className="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                                 {count > 99 ? '99+' : count}
                              </div>
                              <div>
                                 <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">{fact.item}s</div>
                                 <div className="text-xs text-slate-500">
                                    at {formatCurrency(fact.price)} each
                                 </div>
                              </div>
                           </div>
                        );
                     })}
                  </div>
               ) : (
                  <div className="text-slate-400 italic text-sm">No specific data points for this era.</div>
               )}
            </div>
            
            <div className="mt-8 flex items-center gap-2 text-xs text-slate-400">
               <TrendingDown className="w-4 h-4" />
               <span>$1.00 in {currentYear} = {formatCurrency(1 / priceMultiplier)} in {targetYear}</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default TimeTravelInflation;
