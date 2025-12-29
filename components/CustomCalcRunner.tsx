
import React, { useState, useMemo, useEffect } from 'react';
import { CustomCalculator } from '../types/customCalc';
import { CALCULATORS } from '../utils/calculatorRegistry';
import { CalculationResult, InputField } from '../types';
import { ArrowDown, RefreshCw, Calculator, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { builderTranslations } from '../utils/builderTranslations';

interface Props {
  customCalc: CustomCalculator;
}

const extractNumber = (val: string | number): number => {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  const clean = val.replace(/,/g, '').replace(/[^0-9.-]/g, '');
  const num = parseFloat(clean);
  return isNaN(num) ? 0 : num;
};

const CustomCalcRunner: React.FC<Props> = ({ customCalc }) => {
  const calcA = CALCULATORS.find(c => c.id === customCalc.calculatorAId);
  const calcB = CALCULATORS.find(c => c.id === customCalc.calculatorBId);
  const { language, t: tGlobal } = useLanguage();
  const tB = (key: string) => builderTranslations[language]?.[key] || builderTranslations['en'][key];

  // State
  const [inputsA, setInputsA] = useState<Record<string, any>>({});
  const [inputsB_User, setInputsB_User] = useState<Record<string, any>>({});
  const [resultA, setResultA] = useState<CalculationResult | null>(null);
  const [resultB, setResultB] = useState<CalculationResult | null>(null);

  // Initialize defaults
  useEffect(() => {
    if (calcA) {
      const defaultsA: Record<string, any> = {};
      calcA.inputs.forEach(i => defaultsA[i.id] = i.defaultValue);
      setInputsA(defaultsA);
    }
    if (calcB) {
      const defaultsB: Record<string, any> = {};
      calcB.inputs.forEach(i => {
        // Only set defaults for USER_INPUT mappings
        const mapping = customCalc.inputMappings.find(m => m.targetInputId === i.id);
        if (mapping?.sourceType === 'USER_INPUT') {
          defaultsB[i.id] = i.defaultValue;
        }
      });
      setInputsB_User(defaultsB);
    }
  }, [calcA, calcB, customCalc]);

  // Combined Calculate Function
  const handleCalculate = () => {
    if (!calcA || !calcB) return;

    // 1. Run Calc A
    let resA: CalculationResult | null = null;
    try {
      resA = calcA.calculate(inputsA);
      setResultA(resA);
    } catch (e) {
      console.error("Error calculating A", e);
      return;
    }

    if (!resA) return;

    // 2. Prepare Inputs for Calc B
    const finalInputsB: Record<string, any> = { ...inputsB_User };
    const resultValueA = extractNumber(resA.mainValue);

    customCalc.inputMappings.forEach(mapping => {
      if (mapping.sourceType === 'LINKED_TO_A_INPUT' && mapping.sourceId) {
        finalInputsB[mapping.targetInputId] = inputsA[mapping.sourceId];
      } else if (mapping.sourceType === 'RESULT_FROM_A') {
        finalInputsB[mapping.targetInputId] = resultValueA;
      }
    });

    // 3. Run Calc B
    try {
      const resB = calcB.calculate(finalInputsB);
      setResultB(resB);
    } catch (e) {
      console.error("Error calculating B", e);
    }
  };

  // Auto-calculate effect when inputs change (debounced could be added here)
  useEffect(() => {
    // Determine if we have minimum inputs to run
    // For simplicity, just try running it
    handleCalculate();
  }, [inputsA, inputsB_User]);

  if (!calcA || !calcB) return <div>Invalid configuration</div>;

  const renderInput = (
    def: InputField, 
    value: any, 
    onChange: (val: any) => void
  ) => {
    return (
      <div key={def.id} className="mb-3">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{tGlobal(def.label)}</label>
        {def.type === 'select' ? (
          <select 
            value={value} 
            onChange={e => onChange(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-border rounded-lg p-2 text-sm"
          >
            {def.options?.map(o => <option key={o.value} value={o.value}>{tGlobal(o.label)}</option>)}
          </select>
        ) : (
          <input
            type={def.type === 'number' || def.type === 'currency' || def.type === 'percentage' ? 'number' : 'text'}
            value={value}
            onChange={e => onChange(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-border rounded-lg p-2 text-sm"
          />
        )}
      </div>
    );
  };

  const getFinalDisplayValue = () => {
    if (!resultB?.mainValue) return '...';
    if (!customCalc.customUnit) return resultB.mainValue;
    
    // Easter Egg Logic: Extract number and append custom unit
    const num = extractNumber(resultB.mainValue);
    // Formatting number with commas
    const formatted = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(num);
    return `${formatted} ${customCalc.customUnit}`;
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* SECTION A */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col h-full">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2 border-b border-border pb-2">
            <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 rounded px-2 py-0.5 text-xs">{tB('step1Label')}</span> 
            {tGlobal(calcA.name)}
          </h2>
          
          <div className="flex-1 space-y-4">
            {calcA.inputs.map(input => (
              renderInput(input, inputsA[input.id], (val) => setInputsA(p => ({...p, [input.id]: val})))
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-border bg-slate-50 dark:bg-slate-900/50 -mx-6 -mb-6 p-6 rounded-b-2xl">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{tB('intermediate')}</div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">{resultA?.mainValue || '...'}</div>
            {resultA?.subText && <div className="text-sm text-secondary">{resultA.subText}</div>}
          </div>
        </div>

        {/* SECTION B */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col h-full relative">
          {/* Connector Visual */}
          <div className="absolute top-1/2 -left-4 md:-left-4 transform -translate-y-1/2 z-10 bg-slate-200 dark:bg-slate-700 p-1.5 rounded-full border-4 border-white dark:border-slate-900 hidden md:block">
            <ArrowDown className="w-4 h-4 text-slate-500 transform -rotate-90 rtl:rotate-90" />
          </div>

          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2 border-b border-border pb-2">
            <span className="bg-primary/10 text-primary rounded px-2 py-0.5 text-xs">{tB('step2Label')}</span> 
            {tGlobal(calcB.name)}
          </h2>

          <div className="flex-1 space-y-4">
            {calcB.inputs.map(input => {
              const mapping = customCalc.inputMappings.find(m => m.targetInputId === input.id);
              
              if (mapping?.sourceType === 'RESULT_FROM_A') {
                return (
                  <div key={input.id} className="mb-3 p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg border border-emerald-100 dark:border-emerald-900/30">
                    <label className="block text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1">{tGlobal(input.label)}</label>
                    <div className="text-sm font-medium flex items-center gap-2">
                      <RefreshCw className="w-3 h-3" /> {tB('autoFilled')}
                    </div>
                  </div>
                );
              }
              
              if (mapping?.sourceType === 'LINKED_TO_A_INPUT') {
                const sourceInputLabel = calcA.inputs.find(i => i.id === mapping.sourceId)?.label;
                const displayLabel = sourceInputLabel ? tGlobal(sourceInputLabel) : '';
                return (
                  <div key={input.id} className="mb-3 p-3 bg-indigo-50 dark:bg-indigo-900/10 rounded-lg border border-indigo-100 dark:border-indigo-900/30">
                    <label className="block text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider mb-1">{tGlobal(input.label)}</label>
                    <div className="text-sm font-medium flex items-center gap-2">
                      <RefreshCw className="w-3 h-3" /> {tB('linkedTo')} "{displayLabel}"
                    </div>
                  </div>
                );
              }

              return renderInput(input, inputsB_User[input.id], (val) => setInputsB_User(p => ({...p, [input.id]: val})));
            })}
          </div>

          <div className="mt-6 pt-6 border-t border-border bg-gradient-to-br from-primary/5 to-secondary/5 -mx-6 -mb-6 p-6 rounded-b-2xl">
            <div className="text-xs font-bold text-primary uppercase tracking-wider mb-1 flex items-center gap-2">
              {tB('final')}
              {customCalc.customUnit && <Sparkles className="w-3 h-3 text-yellow-500 animate-pulse" />}
            </div>
            <div className="text-4xl font-bold text-slate-900 dark:text-white">
              {getFinalDisplayValue()}
            </div>
            {resultB?.subText && <div className="text-base text-secondary font-medium">{resultB.subText}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomCalcRunner;
