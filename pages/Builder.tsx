
import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CALCULATORS, getAllCategories } from '../utils/calculatorRegistry';
import { ArrowLeft, ArrowRight, Plus, GitMerge, Check, Save, Beaker, Search, Banana } from 'lucide-react';
import { useCustomCalc } from '../contexts/CustomCalcContext';
import { InputMapping } from '../types/customCalc';
import { CalculatorDef } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { builderTranslations } from '../utils/builderTranslations';

const Builder: React.FC = () => {
  const navigate = useNavigate();
  const { saveCustomCalculator } = useCustomCalc();
  const { language, t: tGlobal } = useLanguage();
  
  const tB = (key: string) => builderTranslations[language]?.[key] || builderTranslations['en'][key];
  
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [calcAId, setCalcAId] = useState<string>('');
  const [calcBId, setCalcBId] = useState<string>('');
  const [mappings, setMappings] = useState<InputMapping[]>([]);
  const [customName, setCustomName] = useState('');
  const [customDesc, setCustomDesc] = useState('');
  const [customUnit, setCustomUnit] = useState(''); // Easter Egg State
  const [showEasterEgg, setShowEasterEgg] = useState(false); // Easter Egg Visibility
  const [searchQuery, setSearchQuery] = useState('');

  const calcA = useMemo(() => CALCULATORS.find(c => c.id === calcAId), [calcAId]);
  const calcB = useMemo(() => CALCULATORS.find(c => c.id === calcBId), [calcBId]);

  // Initial mapping generation when B is selected
  const generateInitialMappings = (cB: CalculatorDef) => {
    return cB.inputs.map(input => ({
      targetInputId: input.id,
      sourceType: 'USER_INPUT' as const
    }));
  };

  const handleSelectA = (id: string) => {
    setCalcAId(id);
    setSearchQuery('');
    setStep(2);
  };

  const handleSelectB = (id: string) => {
    setCalcBId(id);
    const b = CALCULATORS.find(c => c.id === id);
    if (b) {
      setMappings(generateInitialMappings(b));
    }
    setSearchQuery('');
    setStep(3);
  };

  const updateMapping = (targetId: string, updates: Partial<InputMapping>) => {
    setMappings(prev => prev.map(m => m.targetInputId === targetId ? { ...m, ...updates } : m));
  };

  const handleSave = () => {
    if (!calcAId || !calcBId || !customName) return;
    saveCustomCalculator({
      name: customName,
      description: customDesc || tB('defaultDesc').replace('{a}', tGlobal(calcA?.name || '')).replace('{b}', tGlobal(calcB?.name || '')),
      calculatorAId: calcAId,
      calculatorBId: calcBId,
      inputMappings: mappings,
      customUnit: customUnit || undefined
    });
    navigate('/my-calculators');
  };

  const renderCalcSelect = (onSelect: (id: string) => void, currentId: string) => {
    const filtered = CALCULATORS.filter(c => {
      const name = tGlobal(c.name).toLowerCase();
      const cat = (tGlobal(c.category) || c.category).toLowerCase();
      const q = searchQuery.toLowerCase();
      return name.includes(q) || cat.includes(q);
    });

    return (
      <div className="space-y-6">
        <div className="relative">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
                type="text" 
                placeholder={tB('searchPlaceholder')} 
                className="w-full px-10 py-3 bg-slate-50 dark:bg-slate-900 border border-border rounded-xl outline-none focus:border-primary"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-96 overflow-y-auto pr-2 custom-scrollbar">
          {filtered.map(c => (
            <button
              key={c.id}
              onClick={() => onSelect(c.id)}
              className={`p-4 rounded-xl border text-start transition-all ${
                currentId === c.id 
                  ? 'border-primary bg-primary/5 ring-1 ring-primary' 
                  : 'border-border bg-card hover:border-primary/50'
              }`}
            >
              <div className="font-bold text-slate-900 dark:text-white">{tGlobal(c.name)}</div>
              <div className="text-xs text-slate-500">{tGlobal(c.category) || c.category}</div>
            </button>
          ))}
          {filtered.length === 0 && (
              <div className="col-span-full text-center py-10 text-slate-500">
                  {tB('noResults')} "{searchQuery}".
              </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-20">
      {/* Nav */}
      <div>
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors font-medium">
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" /> {tB('backToHome')}
        </Link>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <Beaker className="w-8 h-8 text-primary" /> {tB('title')}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          {tB('subtitle')}
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-4 text-sm font-medium text-slate-500 border-b border-border pb-4 overflow-x-auto">
        <span className={`whitespace-nowrap ${step >= 1 ? 'text-primary' : ''}`}>{tB('step1')}</span>
        <ArrowRight className="w-4 h-4 rtl:rotate-180 shrink-0" />
        <span className={`whitespace-nowrap ${step >= 2 ? 'text-primary' : ''}`}>{tB('step2')}</span>
        <ArrowRight className="w-4 h-4 rtl:rotate-180 shrink-0" />
        <span className={`whitespace-nowrap ${step >= 3 ? 'text-primary' : ''}`}>{tB('step3')}</span>
        <ArrowRight className="w-4 h-4 rtl:rotate-180 shrink-0" />
        <span className={`whitespace-nowrap ${step >= 4 ? 'text-primary' : ''}`}>{tB('step4')}</span>
      </div>

      {/* Step 1: Select A */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{tB('selectSourceTitle')}</h2>
          <p className="text-sm text-slate-500">{tB('selectSourceDesc')}</p>
          {renderCalcSelect(handleSelectA, calcAId)}
        </div>
      )}

      {/* Step 2: Select B */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <span className="font-bold text-slate-700 dark:text-slate-300">{tB('selectedSource')}</span>
            <span className="text-primary font-bold">{calcA ? tGlobal(calcA.name) : ''}</span>
            <button onClick={() => { setStep(1); setSearchQuery(''); }} className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white ms-auto">{tB('change')}</button>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{tB('selectTargetTitle')}</h2>
          <p className="text-sm text-slate-500">{tB('selectTargetDesc')}</p>
          {renderCalcSelect(handleSelectB, calcBId)}
        </div>
      )}

      {/* Step 3: Wiring */}
      {step === 3 && calcA && calcB && (
        <div className="space-y-8">
          <div className="flex items-center justify-center gap-8 py-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-border border-dashed">
            <div className="text-center">
              <div className="font-bold text-lg text-slate-900 dark:text-white">{tGlobal(calcA.name)}</div>
              <div className="text-xs text-slate-500">{tB('source')}</div>
            </div>
            <ArrowRight className="w-6 h-6 text-slate-400 rtl:rotate-180" />
            <div className="text-center">
              <div className="font-bold text-lg text-slate-900 dark:text-white">{tGlobal(calcB.name)}</div>
              <div className="text-xs text-slate-500">{tB('target')}</div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <GitMerge className="w-5 h-5 text-primary" /> {tB('mapInputs').replace('{name}', tGlobal(calcB.name))}
            </h3>
            
            <div className="space-y-6">
              {calcB.inputs.map(inputB => {
                const mapping = mappings.find(m => m.targetInputId === inputB.id);
                const inputBLabel = tGlobal(inputB.label);
                return (
                  <div key={inputB.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <div className="md:col-span-4">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-200">{inputBLabel}</label>
                      <div className="text-xs text-slate-500">{tB('targetInput')}</div>
                    </div>
                    
                    <div className="md:col-span-1 flex justify-center">
                      <ArrowLeft className="w-4 h-4 text-slate-400 transform rotate-90 md:rotate-0 rtl:rotate-180" />
                    </div>

                    <div className="md:col-span-7 flex flex-col gap-2">
                      <select
                        className="w-full bg-white dark:bg-slate-900 border border-border rounded-lg p-2.5 text-sm"
                        value={mapping?.sourceType}
                        onChange={(e) => updateMapping(inputB.id, { sourceType: e.target.value as any })}
                      >
                        <option value="USER_INPUT">{tB('optUser')}</option>
                        <option value="LINKED_TO_A_INPUT">{tB('optLinked').replace('{name}', tGlobal(calcA.name))}</option>
                        <option value="RESULT_FROM_A">{tB('optResult').replace('{name}', tGlobal(calcA.name))}</option>
                      </select>

                      {mapping?.sourceType === 'LINKED_TO_A_INPUT' && (
                        <select
                          className="w-full bg-white dark:bg-slate-900 border border-border rounded-lg p-2.5 text-sm"
                          value={mapping.sourceId || ''}
                          onChange={(e) => updateMapping(inputB.id, { sourceId: e.target.value })}
                        >
                          <option value="">{tB('selectInput').replace('{name}', tGlobal(calcA.name))}</option>
                          {calcA.inputs.map(inputA => (
                            <option key={inputA.id} value={inputA.id}>{tGlobal(inputA.label)}</option>
                          ))}
                        </select>
                      )}
                      
                      {mapping?.sourceType === 'RESULT_FROM_A' && (
                        <div className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/10 p-2 rounded">
                          <Check className="w-3 h-3" /> {tB('autoFill')}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-4">
             <button onClick={() => { setStep(2); setSearchQuery(''); }} className="px-6 py-2 text-slate-500 hover:text-slate-900 dark:hover:text-white">{tB('back')}</button>
             <button onClick={() => setStep(4)} className="px-6 py-2 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors">{tB('nextSave')}</button>
          </div>
        </div>
      )}

      {/* Step 4: Save */}
      {step === 4 && (
        <div className="max-w-xl mx-auto space-y-6">
          <div className="bg-card border border-border rounded-2xl p-8 shadow-xl relative overflow-hidden">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex justify-between items-center">
                {tB('nameTitle')}
                <button 
                  onClick={() => setShowEasterEgg(!showEasterEgg)}
                  className="opacity-0 hover:opacity-100 transition-opacity p-2 text-yellow-500"
                  title="Unlock Secret Units"
                >
                    <Banana className="w-5 h-5" />
                </button>
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{tB('nameLabel')}</label>
                <input 
                  type="text" 
                  className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-border rounded-xl focus:border-primary outline-none"
                  placeholder={tB('namePlaceholder')}
                  value={customName}
                  onChange={e => setCustomName(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{tB('descLabel')}</label>
                <textarea 
                  className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-border rounded-xl focus:border-primary outline-none h-24"
                  placeholder={tB('descPlaceholder')}
                  value={customDesc}
                  onChange={e => setCustomDesc(e.target.value)}
                />
              </div>
              
              {showEasterEgg && (
                <div className="animate-in fade-in slide-in-from-top-2">
                   <label className="block text-sm font-bold text-yellow-600 dark:text-yellow-400 mb-2 flex items-center gap-2">
                      <Banana className="w-4 h-4" /> Custom Unit (Easter Egg)
                   </label>
                   <input 
                      type="text" 
                      className="w-full p-3 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-xl focus:border-yellow-500 outline-none text-yellow-900 dark:text-yellow-100"
                      placeholder="e.g. Bananas, Tacos, Lightyears"
                      value={customUnit}
                      onChange={e => setCustomUnit(e.target.value)}
                   />
                   <p className="text-xs text-yellow-600/70 dark:text-yellow-400/70 mt-1">
                      Overrides the result unit label for fun comparisons.
                   </p>
                </div>
              )}
            </div>

            <div className="mt-8 flex gap-4">
              <button 
                onClick={() => setStep(3)} 
                className="flex-1 py-3 border border-border rounded-xl font-bold text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                {tB('back')}
              </button>
              <button 
                onClick={handleSave}
                disabled={!customName}
                className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" /> {tB('saveBtn')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Builder;
