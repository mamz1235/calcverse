
import React, { useState, useMemo, useEffect, useRef, Suspense } from 'react';
import { CalculatorDef, CalculationResult, InputField, Category } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { Sparkles, Info, RefreshCw, Calendar, Type, Minus, Plus, History, ArrowUpRight, ArrowDownRight, Share2, Check, BookOpen, GraduationCap, Sigma, Zap, Table as TableIcon, BarChart2, Heart, ShieldCheck, CalendarCheck, Star, FileText as FileTextIcon, Code, Download, X, Scale, Target, ExternalLink, Brain, Lightbulb, Image as ImageIcon, RotateCcw, Box, Save, Layout as LayoutIcon, TrendingUp, AlertTriangle, Loader2 } from 'lucide-react';
import { getCalculatorInsight, getScenarioSimulations, Scenario } from '../services/geminiService';
import AdUnit from './AdUnit';
import { useHistory } from '../hooks/useHistory';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import CategoryIcon from './CategoryIcon';
import { useFavorites } from '../hooks/useFavorites';
import { CALCULATORS } from '../utils/calculatorRegistry';
// @ts-ignore
import { jsPDF } from 'jspdf';
// @ts-ignore
import autoTable from 'jspdf-autotable';
import { useComparison } from '../contexts/ComparisonContext';
import GoalCreationModal from './GoalCreationModal';
import { GOAL_TRANSLATIONS } from '../utils/goalTranslations';
import { getStaticInsight } from '../utils/staticInsights';
import { getVerificationSource } from '../utils/verificationLinks';
import { AI_BUTTON_LABELS } from '../utils/aiButtonTranslations';
import { generateResultImage } from '../utils/imageGenerator';
import CalculatorSEOArticle from './CalculatorSEOArticle';
import { getAutoSwitchedInputs, SmartSwitchFeedback } from '../utils/unitSwitcher';
import { SmartUnitCue } from './SmartUnitCue';

// Lazy load 3D Visualizers
const BodyVisualizer = React.lazy(() => import('./Three/BodyVisualizer').then(module => ({ default: module.BodyVisualizer })));
const RoomVisualizer = React.lazy(() => import('./Three/RoomVisualizer').then(module => ({ default: module.RoomVisualizer })));

import { AudioVisualizer } from './AudioVisualizer';
// Interactive Charts
import InteractiveBreakEvenChart from './InteractiveCharts/InteractiveBreakEvenChart';
// New Feature Imports
import TimeDial from './TimeDial';
import MapDistanceInput from './MapDistanceInput';
import { PresetModal } from './Presets/PresetModal';
import { PresetSelector } from './Presets/PresetSelector';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { featureTranslations } from '../utils/featureTranslations';
import { newFeatureTranslations } from '../utils/newFeatureTranslations';
import MealPhotoAnalyzer from './MealPhotoAnalyzer';
import ScenarioSimulator from './ScenarioSimulator';
import ContextualSuggestions from './ContextualSuggestions';
import { useLocalization } from '../contexts/LocalizationContext';
import { useSkin } from '../contexts/SkinContext';

interface Props {
  calculator: CalculatorDef;
}

const COLORS = ['#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

const LOCAL_TRANSLATIONS = {
  en: { compare: "Compare", pinned: "Pinned" },
  es: { compare: "Comparar", pinned: "Fijado" },
  fr: { compare: "Comparer", pinned: "Épinglé" },
  ru: { compare: "Сравнить", pinned: "Закреплено" },
  hi: { compare: "तुलना करें", pinned: "पिन किया गया" },
  ar: { compare: "قارن", pinned: "مثبت" }
};

const FONTS = {
  ru: {
    url: 'https://raw.githubusercontent.com/google/fonts/main/apache/robotomono/RobotoMono-Regular.ttf',
    name: 'RobotoMono-Regular',
    style: 'normal'
  },
  ar: {
    url: 'https://raw.githubusercontent.com/google/fonts/main/ofl/amiri/Amiri-Regular.ttf',
    name: 'Amiri-Regular',
    style: 'normal'
  },
  hi: {
    url: 'https://raw.githubusercontent.com/google/fonts/main/ofl/notosansdevanagari/NotoSansDevanagari-Regular.ttf',
    name: 'NotoSansDevanagari-Regular',
    style: 'normal'
  }
};

const loadFont = async (url: string): Promise<string> => {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

const extractNumber = (val: string | number): number => {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  const clean = val.replace(/,/g, '').replace(/[^0-9.-]/g, '');
  const num = parseFloat(clean);
  return isNaN(num) ? 0 : num;
};

const formatDelta = (val: number, type: 'currency' | 'percentage' | 'number' = 'number', currencySymbol: string = '$') => {
  const abs = Math.abs(val);
  const prefix = val > 0 ? '+' : val < 0 ? '-' : '';
  
  if (type === 'currency') {
    // Basic formatting with custom symbol since Intl might force position
    return `${prefix}${currencySymbol}${abs.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
  }
  if (type === 'percentage') {
    return `${prefix}${abs.toFixed(2)}%`;
  }
  return `${prefix}${new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(abs)}`;
};

const DeltaBadge: React.FC<{ current: number; compare: number; type: 'currency' | 'percentage' | 'number'; currencySymbol?: string }> = ({ current, compare, type, currencySymbol }) => {
  const diff = compare - current;
  if (Math.abs(diff) < 0.0001) return <span className="text-slate-300">—</span>;
  
  const formatted = formatDelta(diff, type, currencySymbol);
  const color = diff > 0 ? 'text-emerald-500' : 'text-rose-500';

  return (
    <span className={`font-mono font-bold text-xs ${color}`}>
       {formatted}
    </span>
  );
};

/* --- Currency Input Component --- */
interface CurrencyInputProps {
  value: number;
  onChange: (val: number) => void;
  placeholder?: string;
  symbol: string;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({ value, onChange, placeholder, symbol }) => {
  const [displayValue, setDisplayValue] = useState('');

  useEffect(() => {
    if (value === 0 && displayValue === '') return;
    const numericDisplay = parseFloat(displayValue.replace(/,/g, ''));
    if (numericDisplay !== value) {
        setDisplayValue(value ? new Intl.NumberFormat('en-US', { maximumFractionDigits: 20 }).format(value) : '');
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (val === '') {
      setDisplayValue('');
      onChange(0);
      return;
    }
    const cleanVal = val.replace(/[^0-9.]/g, '');
    const parts = cleanVal.split('.');
    if (parts.length > 2) return;
    const integerPart = parts[0];
    const decimalPart = parts.length > 1 ? '.' + parts[1] : '';
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const newDisplayValue = formattedInteger + decimalPart;
    setDisplayValue(newDisplayValue);
    const num = parseFloat(cleanVal);
    if (!isNaN(num)) {
      onChange(num);
    }
  };

  return (
    <div className="relative group flex items-center w-full bg-slate-50 dark:bg-slate-900 border border-border rounded-xl focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all overflow-hidden min-h-[44px]">
      <span className="pl-3 shrink-0 text-slate-500 text-sm font-bold pointer-events-none select-none">{symbol}</span>
      <input
        type="text"
        inputMode="decimal"
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="block w-full bg-transparent border-none py-2.5 md:py-3 pl-2 pr-3 text-slate-900 dark:text-white outline-none focus:ring-0 text-sm md:text-base font-medium"
      />
    </div>
  );
};

/* --- Embed Modal --- */
const EmbedModal: React.FC<{ isOpen: boolean; onClose: () => void; calcId: string }> = ({ isOpen, onClose, calcId }) => {
  const [copied, setCopied] = useState(false);
  const embedCode = `<iframe src="${window.location.origin}/calculator/${calcId}?embed=true" width="100%" height="600" frameborder="0" style="border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);"></iframe>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-card dark:bg-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 dark:hover:text-white">
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3 mb-4">
           <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
             <Code className="w-5 h-5" />
           </div>
           <h3 className="text-xl font-bold text-slate-900 dark:text-white">Embed Calculator</h3>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
          Copy this code to add this calculator to your website or blog.
        </p>
        <div className="bg-slate-950 rounded-xl p-4 mb-4 relative group">
          <code className="text-xs text-indigo-300 font-mono break-all block leading-relaxed">
            {embedCode}
          </code>
        </div>
        <button 
          onClick={handleCopy}
          className="w-full py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
        >
          {copied ? <Check className="w-4 h-4" /> : <Code className="w-4 h-4" />}
          {copied ? 'Copied to Clipboard' : 'Copy Embed Code'}
        </button>
      </div>
    </div>
  );
};

const CalculatorRunner: React.FC<Props> = ({ calculator }) => {
  const [searchParams] = useSearchParams();
  const [showCopied, setShowCopied] = useState(false);
  const isEmbed = searchParams.get('embed') === 'true';
  const navigate = useNavigate();
  
  const { currencySymbol, unitSystem, formatCurrency } = useLocalization();
  const { currentTheme } = useSkin();

  // Initialize inputs efficiently, considering geolocation defaults
  const [inputs, setInputs] = useState<Record<string, any>>(() => {
    const defaults: Record<string, any> = {};
    calculator.inputs.forEach(inp => {
        const paramVal = searchParams.get(inp.id);
        if (paramVal !== null && paramVal !== undefined) {
             if (inp.type === 'number' || inp.type === 'currency' || inp.type === 'percentage') {
                 const num = parseFloat(paramVal);
                 defaults[inp.id] = isNaN(num) ? inp.defaultValue : num;
             } else {
                 defaults[inp.id] = paramVal;
             }
        } else {
            // Apply localized default for unit selection
            if (inp.id === 'units' && unitSystem === 'imperial') {
                defaults[inp.id] = 'imperial';
            } else {
                defaults[inp.id] = inp.defaultValue;
            }
        }
    });
    return defaults;
  });

  const { t, language } = useLanguage();
  const tGoal = (key: string) => GOAL_TRANSLATIONS[language]?.[key] || GOAL_TRANSLATIONS['en'][key];
  const tFeat = (key: string) => featureTranslations[language]?.[key] || featureTranslations['en'][key];
  const tNew = newFeatureTranslations[language as keyof typeof newFeatureTranslations] || newFeatureTranslations['en'];

  // Insight State Management
  const [dynamicInsight, setDynamicInsight] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [smartFeedback, setSmartFeedback] = useState<SmartSwitchFeedback | null>(null);
  const [isCalculated, setIsCalculated] = useState(false); // For visual feedback
  
  // Scenario Simulator State
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loadingScenarios, setLoadingScenarios] = useState(false);

  // Inflation Adjuster State
  const [adjustInflation, setAdjustInflation] = useState(false);
  // Change to string to allow empty input during editing
  const [inflationRate, setInflationRate] = useState<string>('3'); 
  
  // Memoize static insight with proper dependency on calculator and language
  const staticInsight = useMemo(() => {
    return getStaticInsight(calculator, language);
  }, [calculator, language]);
  
  const activeInsight = dynamicInsight || staticInsight;

  const [viewMode, setViewMode] = useState<'chart' | 'table'>('table');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isDownloadingImage, setIsDownloadingImage] = useState(false);
  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showPresetModal, setShowPresetModal] = useState(false);
  const [show3D, setShow3D] = useState(false);
  
  // Reverse Calculation State
  const [reverseTarget, setReverseTarget] = useState<number>(0);
  const [reverseInputId, setReverseInputId] = useState<string>('');
  
  const { addItem, items, isInComparison } = useComparison();
  const { addTab } = useWorkspace();
  const lt = LOCAL_TRANSLATIONS[language as keyof typeof LOCAL_TRANSLATIONS] || LOCAL_TRANSLATIONS.en;

  const { history, saveEntry } = useHistory(calculator.id);
  const { isFavorite, toggleFavorite } = useFavorites();
  const isFav = isFavorite(calculator.id);
  const contentRef = useRef<HTMLDivElement>(null);

  // Derived State
  const result = useMemo(() => {
    try {
      return calculator.calculate(inputs);
    } catch (e) {
      console.error("Calculation failed", e);
      return null;
    }
  }, [calculator, inputs]);

  // Sync reverse target when forward calculation changes (if not dragging)
  useEffect(() => {
    if (result) {
      const num = extractNumber(result.mainValue);
      setReverseTarget(num);
    }
  }, [result]);

  // Reset 3D view when calculator changes
  useEffect(() => {
    setShow3D(false);
    setScenarios([]); // Reset scenarios
  }, [calculator.id]);

  // Set default reverse input ID
  useEffect(() => {
    if (!reverseInputId && calculator.inverseCalculate) {
      // Pick first number/currency input as default
      const candidate = calculator.inputs.find(i => i.type === 'number' || i.type === 'currency');
      if (candidate) setReverseInputId(candidate.id);
    }
  }, [calculator, reverseInputId]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
            if (e.key === 'Escape') {
                (e.target as HTMLElement).blur();
            } else if (e.key === 'Enter') {
                (e.target as HTMLElement).blur();
                triggerCalcVisual();
            }
            return;
        }

        if (e.key === 'Enter') {
            triggerCalcVisual();
        } else if (e.key === 'Escape') {
            const defaults: Record<string, any> = {};
            calculator.inputs.forEach(i => defaults[i.id] = i.defaultValue);
            setInputs(defaults);
        }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [calculator]);

  const triggerCalcVisual = () => {
    setIsCalculated(true);
    setTimeout(() => setIsCalculated(false), 300);
  };

  const handleInputChange = (id: string, value: any) => {
    const switchResult = getAutoSwitchedInputs(id, value, inputs, calculator);
    
    if (switchResult) {
      setInputs(switchResult.newInputs);
      setSmartFeedback(switchResult.feedback);
    } else {
      setInputs(prev => ({ ...prev, [id]: value }));
      if (id === 'h' || id === 'height') setSmartFeedback(null);
    }
    setDynamicInsight(null);
    setScenarios([]); // Clear old scenarios on input change
  };

  const handleLoadPreset = (data: Record<string, any>) => {
    const newInputs = { ...inputs };
    Object.keys(data).forEach(key => {
        if (calculator.inputs.some(i => i.id === key)) {
            newInputs[key] = data[key];
        }
    });
    setInputs(newInputs);
    triggerCalcVisual();
  };

  const handleAddToWorkspace = () => {
    addTab(calculator.id, t(calculator.name));
    navigate('/workspace');
  };

  const handleUndoSwitch = () => {
    if (smartFeedback) {
      setInputs(prev => ({ ...prev, units: smartFeedback.previousUnits }));
      setSmartFeedback(null);
    }
  };
  
  const updateNumberValue = (input: any, delta: number) => {
     const currentVal = parseFloat(inputs[input.id]) || 0;
     const nextVal = currentVal + delta;
     if (input.min !== undefined && nextVal < input.min) return;
     if (input.max !== undefined && nextVal > input.max) return;
     const stepString = delta.toString();
     const decimalPlaces = stepString.includes('.') ? stepString.split('.')[1].length : 0;
     const factor = Math.pow(10, decimalPlaces > 0 ? decimalPlaces : 2);
     const rounded = Math.round(nextVal * factor) / factor;
     handleInputChange(input.id, rounded);
  };

  const handleReverseChange = (newTarget: number) => {
    setReverseTarget(newTarget);
    if (calculator.inverseCalculate && reverseInputId) {
       const newInputs = calculator.inverseCalculate(newTarget, reverseInputId, inputs);
       setInputs(newInputs);
    }
  };

  const fetchInsight = async () => {
    if (!result) return;
    setLoadingAi(true);
    const insight = await getCalculatorInsight(
      calculator.name,
      inputs,
      result.mainValue + (result.subText ? ` (${result.subText})` : ''),
      language
    );
    setDynamicInsight(insight);
    setLoadingAi(false);
  };

  const fetchScenarios = async () => {
    if (!result) return;
    setLoadingScenarios(true);
    const sims = await getScenarioSimulations(
      calculator.name,
      inputs,
      result.mainValue + (result.subText ? ` (${result.subText})` : ''),
      language
    );
    setScenarios(sims);
    setLoadingScenarios(false);
  };

  const handleShare = async () => {
    const params = new URLSearchParams();
    Object.keys(inputs).forEach(key => {
        params.append(key, String(inputs[key]));
    });
    const url = `${window.location.origin}/calculator/${calculator.id}?${params.toString()}`;
    try {
        await navigator.clipboard.writeText(url);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
    } catch (err) {
        console.error('Failed to copy', err);
    }
  };

  const handleDownloadImage = async () => {
    if (!result) return;
    setIsDownloadingImage(true);
    try {
        const dataUrl = await generateResultImage(
            t(calculator.name),
            t(calculator.category) || calculator.category,
            result.mainValue,
            result.subText ? translateLabel(result.subText) : ''
        );
        
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `${t(calculator.name).replace(/\s+/g, '_')}_Result.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } catch (e) {
        console.error('Failed to download image', e);
    } finally {
        setIsDownloadingImage(false);
    }
  };

  // PDF Generation function
  const generatePDF = async () => {
    setIsGeneratingPdf(true);
    try {
      const doc = new jsPDF();
      const fontDef = FONTS[language as keyof typeof FONTS];
      if (fontDef) {
         try {
             const fontBase64 = await loadFont(fontDef.url);
             doc.addFileToVFS(fontDef.name + ".ttf", fontBase64);
             doc.addFont(fontDef.name + ".ttf", fontDef.name, fontDef.style);
             doc.setFont(fontDef.name);
         } catch (e) {
             console.error("Failed to load custom font", e);
         }
      }
      doc.setFontSize(22);
      doc.setTextColor(99, 102, 241);
      doc.text(t('app.name'), 14, 20);
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text(`${t('terms.updated')}: ${new Date().toLocaleDateString()}`, 14, 26);
      doc.setFontSize(18);
      doc.setTextColor(30);
      doc.text(t(calculator.name), 14, 40);
      let yPos = 50;
      if (result) {
        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text(t('calc.result'), 14, yPos);
        yPos += 8;
        doc.setFontSize(24);
        doc.setTextColor(0);
        doc.text(result.mainValue, 14, yPos);
        yPos += 8;
        if (result.subText) {
           doc.setFontSize(12);
           doc.setTextColor(80);
           doc.text(translateLabel(result.subText), 14, yPos);
           yPos += 10;
        } else {
           yPos += 5;
        }
      }
      yPos += 5;
      const tableStyles = fontDef ? { font: fontDef.name, fontStyle: fontDef.style as any } : {};
      const inputRows = calculator.inputs.map(input => {
        let val = inputs[input.id];
        if (input.type === 'currency') {
             val = formatCurrency(val);
        } else if (input.type === 'percentage') {
             val = `${val}%`;
        } else if (input.type === 'select' && input.options) {
             const opt = input.options.find(o => o.value === val);
             val = opt ? translateLabel(opt.label) : val;
        }
        return [translateLabel(input.label), val];
      });
      autoTable(doc, {
        startY: yPos,
        head: [[t('calc.parameters'), t('Value')]],
        body: inputRows,
        theme: 'grid',
        headStyles: { fillColor: [99, 102, 241], textColor: 255, ...tableStyles },
        styles: { fontSize: 10, cellPadding: 3, ...tableStyles },
      });
      // @ts-ignore
      yPos = doc.lastAutoTable.finalY + 15;
      if (result?.details && result.details.length > 0) {
         const detailRows = result.details.map(d => [translateLabel(d.label), d.value]);
         doc.setFontSize(14);
         doc.setTextColor(50);
         doc.text(t('calc.table') || 'Details', 14, yPos - 5);
         autoTable(doc, {
            startY: yPos,
            head: [[t('Input') || 'Parameter', t('Value')]],
            body: detailRows,
            theme: 'striped',
            headStyles: { fillColor: [16, 185, 129], textColor: 255, ...tableStyles },
            styles: { fontSize: 10, cellPadding: 3, ...tableStyles },
         });
      }
      const pageCount = doc.getNumberOfPages();
      for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        const footerText = `CalcVerse - ${t(calculator.name)}`;
        doc.text(footerText, 14, doc.internal.pageSize.getHeight() - 10);
        doc.text(`${i} / ${pageCount}`, doc.internal.pageSize.getWidth() - 20, doc.internal.pageSize.getHeight() - 10, { align: 'right' });
      }
      doc.save(`${t(calculator.name).replace(/\s+/g, '_')}_Report.pdf`);
    } catch (error) {
      console.error('PDF Generation failed', error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleAddToCompare = () => {
    if (result) {
        addItem(calculator.id, t(calculator.name), inputs, result);
    }
  };

  const isScenarioPinned = isInComparison(inputs);

  const getCalcText = (keyType: 'desc'|'concept'|'formula'|'example'|'seo.intro'|'seo.how'|'seo.benefits', fallback?: string) => {
     const specificKey = `calc.${calculator.id}.${keyType}`;
     const translated = t(specificKey);
     if (translated !== specificKey) return translated;
     if (fallback && (language === 'en' || keyType === 'formula')) {
        return fallback;
     }
     const calcName = t(calculator.name);
     const genericMap: Record<string, string> = {
         'desc': t('calc.generic.description'),
         'concept': t('calc.generic.concept'),
         'formula': t('calc.generic.formula'),
         'example': t('calc.generic.example'),
         'seo.intro': t('calc.generic.seo.intro'),
         'seo.how': t('calc.generic.seo.how'),
         'seo.benefits': t('calc.generic.seo.benefits')
     };
     const template = genericMap[keyType];
     if (template) return template.replace('{name}', calcName);
     return fallback || '';
  };

  const translateLabel = (label: string) => {
    if (!label) return '';
    const direct = t(label);
    if (direct !== label) return direct;
    return label.split(/([^a-zA-Z0-9\u00C0-\u00FF]+)/).map(part => {
        if (!part.trim()) return part;
        const trans = t(part.trim());
        return trans !== part.trim() ? trans : part;
    }).join('');
  };

  const currentUnits = inputs['units'] || 'metric';
  const getDynamicUnit = (input: InputField) => {
    if (input.type === 'currency') return currencySymbol;
    if (input.type === 'percentage') return '%';
    if (currentUnits === 'imperial') {
        if (['w', 'weight', 'weight (kg)'].includes(input.id.toLowerCase())) return 'lbs';
        if (['h', 'height', 'height (cm)'].includes(input.id.toLowerCase())) return 'in';
        if (['temp', 'c'].includes(input.id.toLowerCase())) return '°F';
        if (['dist', 'km'].includes(input.id.toLowerCase())) return 'mi';
    } else {
        if (['w', 'weight', 'weight (kg)'].includes(input.id.toLowerCase())) return 'kg';
        if (['h', 'height', 'height (cm)'].includes(input.id.toLowerCase())) return 'cm';
        if (['temp', 'c'].includes(input.id.toLowerCase())) return '°C';
        if (['dist', 'km'].includes(input.id.toLowerCase())) return 'km';
    }
    const match = input.label.match(/\(([^)]+)\)/);
    if (match) return match[1];
    return '';
  };

  const comparisonData = useMemo(() => {
    if (!result && history.length === 0) return [];
    const historyItems = history.map((h, i) => {
        try {
            return {
                name: `${t('calc.saved')} ${history.length - i}`,
                label: `${t('calc.scenario')} ${history.length - i}`,
                value: extractNumber(h.result.mainValue),
                displayValue: h.result.mainValue,
                inputs: h.inputs,
                isCurrent: false,
                id: h.id
            };
        } catch (e) {
            return null;
        }
    }).filter(Boolean) as any[];

    const currentItem = result ? {
      name: t('calc.current'),
      label: t('calc.current'),
      value: extractNumber(result.mainValue),
      displayValue: result.mainValue,
      inputs: inputs,
      isCurrent: true,
      id: 'current'
    } : null;
    return currentItem ? [currentItem, ...historyItems] : historyItems;
  }, [result, inputs, history, t]);

  const chartData = useMemo(() => {
     return [...comparisonData].reverse();
  }, [comparisonData]);

  const relatedCalculators = useMemo(() => 
    CALCULATORS
    .filter(c => c.category === calculator.category && c.id !== calculator.id)
    .slice(0, 3), 
  [calculator]);

  // Inflation Adjustment Logic
  const isFutureValueCalc = ['compound', 'retirement', 'savings-goal', 'appreciation', 'pension-impact'].includes(calculator.id);
  const yearsInput = calculator.inputs.find(i => ['y', 'years', 'time', 'duration'].includes(i.id));

  const displayResult = useMemo(() => {
    if (!result) return null;
    
    // Check for Division by Zero / Infinity / NaN (Black Hole Easter Egg)
    const rawVal = result.mainValue;
    if (rawVal.includes('Infinity') || rawVal.includes('NaN') || rawVal.includes('∞')) {
       return {
          mainValue: "⚠️ Black Hole Detected",
          subText: "Universe.exe has stopped working",
          details: [],
          chartData: undefined,
          riskScore: 100 // High risk!
       };
    }
    
    // Check if result is monetary based on original string containing '$' or via manual override logic
    // But since backend returns '$', we rely on stripping.
    const isMonetary = result.mainValue.includes('$') || /^\W?\d/.test(result.mainValue) && calculator.inputs.some(i => i.type === 'currency');
    
    let mainValString = result.mainValue;
    
    if (isMonetary) {
       // Strip original formatting
       const num = extractNumber(result.mainValue);
       if (!isNaN(num)) {
          mainValString = formatCurrency(num);
       }
    }
    
    const rateNum = parseFloat(inflationRate) || 0;

    // Apply Inflation Adjustment if needed
    if (adjustInflation && isFutureValueCalc) {
        let years = 0;
        // Try to find years from input
        if (yearsInput) {
             years = parseFloat(inputs[yearsInput.id]) || 0;
        } 
        // Special Case: Savings Goal (Years derived from result months)
        else if (calculator.id === 'savings-goal') {
             // Parse months from result string "18 Months"
             const months = parseFloat(result.mainValue) || 0;
             if (months > 0) years = months / 12;
        }

        if (years > 0) {
            // Adjust Main Value if it's monetary (e.g. Compound Interest)
            if (isMonetary) {
                const nominalValue = extractNumber(result.mainValue);
                // Future Value in Real Terms: Nominal / (1+r)^t
                const realValue = nominalValue / Math.pow(1 + (rateNum / 100), years);
                mainValString = formatCurrency(realValue);
            }
            
            // Adjust Subtext if it contains monetary target (e.g. Savings Goal "To reach $10,000")
            // For Savings Goal, we want to know the NOMINAL amount needed to equal the target REAL power.
            // Target Nominal = Target Real * (1+r)^t
            if (calculator.id === 'savings-goal' && result.subText) {
                const targetMatch = result.subText.match(/[\$£€¥]?\s?([\d,]+(\.\d+)?)/);
                if (targetMatch) {
                   const targetReal = extractNumber(targetMatch[0]);
                   const targetNominal = targetReal * Math.pow(1 + (rateNum / 100), years);
                   const adjustedTargetStr = formatCurrency(targetNominal);
                   // Replace the number in subtext with adjusted nominal
                   const newSubText = result.subText.replace(targetMatch[0], adjustedTargetStr);
                   return {
                       ...result,
                       mainValue: mainValString, // Time stays same
                       subText: `${newSubText} (Inflation Adjusted)`
                   };
                }
            }
        }
        
        // Default inflation adjustment for standard monetary results
        if (years > 0 && isMonetary) {
             return {
                ...result,
                mainValue: mainValString,
                subText: `${result.subText || ''} (Inflation Adjusted)`
             };
        }
    }

    return {
        ...result,
        mainValue: mainValString,
        details: result.details?.map(d => {
             const valNum = extractNumber(d.value);
             if (d.value.includes('$') && !isNaN(valNum)) {
                 return { ...d, value: formatCurrency(valNum) };
             }
             return d;
        })
    };
  }, [result, adjustInflation, inflationRate, isFutureValueCalc, yearsInput, inputs, formatCurrency, calculator.inputs, calculator.id]);

  // Visualizer logic (unchanged)
  const renderVisualizer = () => {
    if (['bmi', 'bodyfat', 'bmr'].includes(calculator.id)) {
        const bmiVal = calculator.id === 'bmi' && result ? parseFloat(result.mainValue) : 
                       inputs['bmi'] ? parseFloat(inputs['bmi']) : 
                       24; 
        return (
          <Suspense fallback={
            <div className="w-full h-[400px] flex items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-2xl border border-border">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          }>
            <BodyVisualizer bmi={bmiVal} />
          </Suspense>
        );
    }
    
    if (['paint', 'floor', 'concrete', 'room'].includes(calculator.id)) {
        const w = inputs['l'] || inputs['width'] || inputs['length'] || 5;
        const l = inputs['w'] || inputs['width'] || 4;
        const h = inputs['h'] || inputs['height'] || 2.5;
        return (
          <Suspense fallback={
            <div className="w-full h-[300px] flex items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-2xl border border-border">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          }>
            <RoomVisualizer width={Number(w)} length={Number(l)} height={Number(h)} />
          </Suspense>
        );
    }

    if (['bpm', 'freq'].includes(calculator.id)) {
         const mode = calculator.id === 'bpm' ? 'metronome' : 'tone';
         let val = 0;
         if (calculator.id === 'bpm') val = Number(inputs['bpm'] || 120);
         else if (calculator.id === 'freq') val = Number(inputs['hz'] || 440);
         
         return (
             <div className="w-full flex items-center justify-center h-full">
                 <AudioVisualizer mode={mode} value={val} />
             </div>
         );
    }
    
    // --- NEW: Interactive Break-Even Chart Integration ---
    if (calculator.id === 'breakeven') {
       return (
         <InteractiveBreakEvenChart 
            inputs={inputs} 
            onInputChange={handleInputChange}
            currencySymbol={currencySymbol}
         />
       );
    }

    return null;
  };
  
  const visualizerContent = renderVisualizer();

  const showMealAnalyzer = calculator.category === Category.NUTRITION || ['macros', 'cal-lookup', 'tdee', 'keto'].includes(calculator.id);
  const isBlackHole = displayResult?.mainValue === "⚠️ Black Hole Detected";
  const rateNum = parseFloat(inflationRate) || 0;
  const hasVisuals = (displayResult?.chartData || visualizerContent) && !isBlackHole;

  return (
    <div className="animate-fade-in space-y-6 md:space-y-8">
      <style>{`
        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { 
          -webkit-appearance: none; 
          margin: 0; 
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes violent-shake {
          0% { transform: translate(1px, 1px) rotate(0deg); }
          10% { transform: translate(-3px, -2px) rotate(-1deg); }
          20% { transform: translate(-3px, 0px) rotate(1deg); }
          30% { transform: translate(3px, 2px) rotate(0deg); }
          40% { transform: translate(1px, -1px) rotate(1deg); }
          50% { transform: translate(-1px, 2px) rotate(-1deg); }
          60% { transform: translate(-3px, 1px) rotate(0deg); }
          70% { transform: translate(3px, 1px) rotate(-1deg); }
          80% { transform: translate(-1px, -1px) rotate(1deg); }
          90% { transform: translate(1px, 2px) rotate(0deg); }
          100% { transform: translate(1px, -2px) rotate(-1deg); }
        }
        .animate-shake {
          animation: violent-shake 0.5s infinite;
          border-color: #ef4444 !important; /* Red-500 */
          background: #000 !important;
          color: #ef4444 !important;
        }
        .animate-shake .text-slate-900, 
        .animate-shake .text-slate-500,
        .animate-shake .text-secondary {
            color: #ef4444 !important;
        }
      `}</style>

      <EmbedModal isOpen={showEmbedModal} onClose={() => setShowEmbedModal(false)} calcId={calculator.id} />
      <GoalCreationModal 
        isOpen={showGoalModal} 
        onClose={() => setShowGoalModal(false)} 
        calculator={calculator} 
        inputs={inputs} 
        result={result}
      />
      <PresetModal 
        isOpen={showPresetModal}
        onClose={() => setShowPresetModal(false)}
        currentInputs={inputs}
      />
      
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary text-sm font-semibold uppercase tracking-wider">
               <span className="px-2 py-1 bg-primary/10 rounded-md">{t(calculator.category) || calculator.category}</span>
            </div>
            
            {!isEmbed && (
              <div className="flex items-center gap-2">
                 <button 
                    onClick={handleAddToWorkspace}
                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-primary transition-colors"
                    title={tFeat('addToWorkspace')}
                 >
                    <LayoutIcon className="w-6 h-6" />
                 </button>
                 <button 
                    onClick={() => toggleFavorite(calculator.id)}
                    className={`p-2 rounded-full transition-all duration-300 active:scale-95 border ${isFav ? 'bg-rose-50 border-rose-200 dark:bg-rose-900/20 dark:border-rose-800' : 'bg-transparent border-transparent hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                    title={isFav ? "Remove from favorites" : "Add to favorites"}
                 >
                    <Heart className={`w-6 h-6 transition-colors ${isFav ? 'fill-rose-500 text-rose-500' : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'}`} />
                 </button>
              </div>
            )}
        </div>
        <h1 className="text-2xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight">{t(calculator.name)}</h1>
        
        <div className="flex flex-wrap items-center gap-3 md:gap-6 text-sm mb-4 animate-fade-in">
           <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/30 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>{t('calc.verified_formula')}</span>
           </div>
           
           <div className="flex items-center gap-1.5">
              <div className="flex text-amber-400">
                 <Star className="w-4 h-4 fill-current" />
                 <Star className="w-4 h-4 fill-current" />
                 <Star className="w-4 h-4 fill-current" />
                 <Star className="w-4 h-4 fill-current" />
                 <Star className="w-4 h-4 fill-current text-slate-300 dark:text-slate-600" /> 
              </div>
              <span className="font-bold text-slate-700 dark:text-slate-200">4.9</span>
              <span className="text-slate-400 text-xs">({t('calc.rating')})</span>
           </div>

           <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
              <CalendarCheck className="w-4 h-4 text-blue-500" />
              <span>{t('calc.updated').replace('{year}', '2025')}</span>
           </div>
        </div>

        <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg max-w-2xl">{getCalcText('desc', calculator.description)}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start">
        
        {/* Input Section */}
        <div className="space-y-6 lg:col-span-1 lg:sticky lg:top-24">
          <div className="bg-card rounded-2xl p-4 md:p-6 border border-border shadow-xl space-y-5">
            <div className="flex items-center justify-between">
                <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-1 h-5 md:h-6 bg-secondary rounded-full"></span>
                  {t('calc.parameters')}
                </h2>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setShowPresetModal(true)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-primary transition-colors"
                        title={tFeat('savePreset')}
                    >
                        <Save className="w-4 h-4" />
                    </button>
                    <PresetSelector onLoad={handleLoadPreset} />
                </div>
            </div>
            
            <div className="space-y-3 md:space-y-4">
              {/* Map Integration Check */}
              {(calculator.id === 'trip-cost' || calculator.id === 'drive-time') && (
                  <MapDistanceInput 
                      onDistanceFound={(km) => handleInputChange(calculator.id === 'trip-cost' ? 'km' : 'km', km)}
                      currentValue={inputs['km']}
                  />
              )}

              {calculator.inputs.map(input => {
                const unitLabel = getDynamicUnit(input);
                const hasFeedback = smartFeedback?.id === input.id;
                
                return (
                  <div key={input.id} className="space-y-2 relative">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-300 block">
                        {translateLabel(input.label)}
                        </label>
                        {hasFeedback && (
                            <SmartUnitCue 
                                feedback={smartFeedback} 
                                onUndo={handleUndoSwitch} 
                                language={language} 
                            />
                        )}
                    </div>
                    {input.type === 'select' ? (
                      <div className="relative">
                        <select
                          value={inputs[input.id]}
                          onChange={(e) => handleInputChange(input.id, e.target.value)}
                          className={`w-full bg-slate-50 dark:bg-slate-900 border border-border rounded-lg p-2.5 md:p-3 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary appearance-none outline-none transition-all text-sm md:text-base min-h-[44px]
                            ${hasFeedback ? 'ring-2 ring-indigo-500/20 border-indigo-500/40' : ''}
                          `}
                        >
                          {input.options?.map(opt => (
                            <option key={opt.value} value={opt.value}>{translateLabel(opt.label)}</option>
                          ))}
                        </select>
                        <div className="absolute end-3 top-3.5 pointer-events-none text-slate-400">▼</div>
                      </div>
                    ) : input.type === 'date' ? (
                      <div className="relative group">
                        <input
                          type="date"
                          value={inputs[input.id]}
                          onChange={(e) => handleInputChange(input.id, e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-border rounded-lg p-2.5 md:p-3 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all group-hover:border-slate-400 dark:group-hover:border-slate-500 placeholder-slate-400 text-sm md:text-base min-h-[44px]"
                        />
                        <Calendar className="absolute end-3 top-3 text-slate-500 w-4 h-4 md:w-5 md:h-5 pointer-events-none" />
                      </div>
                    ) : input.type === 'text' ? (
                      <div className="relative group">
                        <input
                          type="text"
                          value={inputs[input.id]}
                          onChange={(e) => handleInputChange(input.id, e.target.value)}
                          placeholder={input.placeholder ? translateLabel(input.placeholder) : ''}
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-border rounded-lg p-2.5 md:p-3 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all group-hover:border-slate-400 dark:group-hover:border-slate-500 placeholder-slate-400 text-sm md:text-base min-h-[44px]"
                        />
                        <Type className="absolute end-3 top-3 text-slate-500 w-4 h-4 md:w-5 md:h-5 pointer-events-none" />
                      </div>
                    ) : input.type === 'currency' ? (
                       <CurrencyInput 
                          value={inputs[input.id]}
                          onChange={(val) => handleInputChange(input.id, val)}
                          placeholder={input.placeholder ? translateLabel(input.placeholder) : ''}
                          symbol={currencySymbol}
                       />
                    ) : (
                      <div className="relative group">
                        <input
                          type="number"
                          value={inputs[input.id]}
                          onChange={(e) => handleInputChange(input.id, e.target.value)}
                          step={input.step || 1}
                          min={input.min}
                          max={input.max}
                          className={`block w-full bg-slate-50 dark:bg-slate-900 border border-border rounded-xl py-2.5 md:p-3 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm md:text-base font-medium min-h-[44px]
                              ps-3 
                              ${unitLabel ? 'pe-24' : 'pe-20'} 
                              ${hasFeedback ? 'ring-2 ring-indigo-500/20 border-indigo-500/40' : ''}
                          `}
                        />
                        <div className="absolute end-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            {unitLabel && (
                                <span className="text-slate-500 dark:text-slate-400 text-xs font-bold pointer-events-none bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded">{unitLabel}</span>
                            )}
                            <div className="flex items-center bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm h-8">
                              <button
                                  type="button"
                                  onClick={() => {
                                      const step = input.step || (input.type === 'percentage' ? 0.1 : 1);
                                      updateNumberValue(input, -step);
                                  }}
                                  className="h-full px-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 rounded-s-lg border-e border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center active:bg-slate-200 dark:active:bg-slate-600"
                                  aria-label="Decrease"
                              >
                                  <Minus className="w-3.5 h-3.5" />
                              </button>
                              <button
                                  type="button"
                                  onClick={() => {
                                      const step = input.step || (input.type === 'percentage' ? 0.1 : 1);
                                      updateNumberValue(input, step);
                                  }}
                                  className="h-full px-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 rounded-e-lg transition-colors flex items-center justify-center active:bg-slate-200 dark:active:bg-slate-600"
                                  aria-label="Increase"
                              >
                                  <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Time-Travel Dial Injection */}
                    {(input.id === 'y' || input.id === 'years' || input.id === 'term') && (
                       <div className="mt-4">
                          <TimeDial 
                             value={Number(inputs[input.id]) || 0}
                             onChange={(val) => handleInputChange(input.id, val)}
                             min={1}
                             max={input.max || 50}
                             label={translateLabel(input.label)}
                          />
                       </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          <AdUnit slot="calc-input-bottom" format="rectangle" />
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2 flex flex-col" ref={contentRef}>
          {/* Action Toolbar - Pill Shaped Background Behind */}
          <div className="relative z-0 -mb-8 w-full">
              <div className="bg-slate-100 dark:bg-slate-800/80 border border-border/60 rounded-t-3xl pb-10 pt-3 px-3 md:px-6 flex flex-wrap md:flex-nowrap justify-center md:justify-start items-center gap-2 md:gap-3 backdrop-blur-sm shadow-sm md:overflow-x-auto no-scrollbar">
                  {!isEmbed && (
                    <>
                    <button 
                        onClick={() => setShowEmbedModal(true)}
                        className="px-2.5 py-2 md:px-3 md:py-2 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-all active:scale-95 flex items-center gap-2 text-xs md:text-sm whitespace-nowrap shrink-0"
                        title="Embed Widget"
                    >
                        <Code className="w-4 h-4" />
                        <span>Embed</span>
                    </button>
                    <button
                      onClick={handleAddToCompare}
                      disabled={isScenarioPinned}
                      className={`px-2.5 py-2 md:px-3 md:py-2 ${isScenarioPinned ? 'bg-indigo-50 border border-indigo-200 text-indigo-400 cursor-not-allowed dark:bg-indigo-900/20 dark:border-indigo-800 dark:text-indigo-500' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20'} font-bold rounded-xl shadow-sm transition-all active:scale-95 flex items-center gap-2 text-xs md:text-sm whitespace-nowrap shrink-0`}
                      title={isScenarioPinned ? "Pinned to Compare" : "Add to Comparison Workspace"}
                    >
                      {isScenarioPinned ? <Check className="w-4 h-4" /> : <Scale className="w-4 h-4" />}
                      <span>{isScenarioPinned ? lt.pinned : lt.compare}</span>
                    </button>
                    </>
                  )}
                  <button
                      onClick={generatePDF}
                      disabled={isGeneratingPdf}
                      className="px-2.5 py-2 md:px-3 md:py-2 bg-emerald-600 text-white hover:bg-emerald-700 font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95 flex items-center gap-2 text-xs md:text-sm disabled:opacity-50 whitespace-nowrap shrink-0"
                      title="Download Report"
                  >
                      {isGeneratingPdf ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileTextIcon className="w-4 h-4" />}
                      <span>{isGeneratingPdf ? 'Generating...' : 'Report'}</span>
                  </button>
                  <button
                      onClick={handleDownloadImage}
                      disabled={isDownloadingImage}
                      className="px-2.5 py-2 md:px-3 md:py-2 bg-purple-600 text-white hover:bg-purple-700 font-bold rounded-xl shadow-lg shadow-purple-500/20 transition-all active:scale-95 flex items-center gap-2 text-xs md:text-sm disabled:opacity-50 whitespace-nowrap shrink-0"
                      title="Download Image"
                  >
                      {isDownloadingImage ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                      <span>Image</span>
                  </button>
                  <button
                      onClick={handleShare}
                      className="px-2.5 py-2 md:px-4 md:py-2 bg-slate-600 hover:bg-slate-700 text-white font-bold rounded-xl shadow-lg shadow-slate-500/20 transition-all active:scale-95 flex items-center gap-2 text-xs md:text-sm whitespace-nowrap shrink-0"
                  >
                      {showCopied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                      <span>{showCopied ? 'Copied' : 'Share'}</span>
                  </button>
                  {!isEmbed && (
                    <div className="flex gap-1 shrink-0">
                      <button 
                          onClick={() => setShowGoalModal(true)}
                          className="px-2.5 py-2 md:px-4 md:py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-l-xl shadow-lg shadow-rose-500/20 transition-all active:scale-95 flex items-center gap-2 border-r border-rose-600/30 text-xs md:text-sm"
                          title={tGoal('trackTitle')}
                      >
                          <Target className="w-4 h-4" />
                      </button>
                      <button 
                          onClick={() => displayResult && saveEntry(inputs, displayResult)}
                          className="px-2.5 py-2 md:px-4 md:py-2 bg-secondary hover:bg-secondary/90 text-white dark:text-slate-900 font-bold rounded-r-xl shadow-lg shadow-secondary/20 transition-all active:scale-95 flex items-center gap-2 text-xs md:text-sm whitespace-nowrap"
                          title={t('calc.save_scenario')}
                      >
                          <Plus className="w-4 h-4 md:w-5 md:h-5" />
                          <span>{t('calc.save_scenario')}</span>
                      </button>
                    </div>
                  )}
              </div>
          </div>

          <div className={`bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-950 rounded-2xl p-6 md:p-8 border border-border shadow-2xl relative overflow-visible group z-10 transition-all duration-300 ${isCalculated ? 'ring-2 ring-primary scale-[1.01]' : ''} ${isBlackHole ? 'animate-shake border-rose-600 bg-slate-950' : ''}`}>
            <div className="absolute top-0 end-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            
            <div className={`relative z-10 grid gap-8 items-start ${hasVisuals ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
              <div className="w-full">
                <h3 className="text-slate-500 dark:text-slate-400 font-medium mb-1 text-sm md:text-base">{t('calc.result')}</h3>
                <div className={`text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white tracking-tight mb-2 break-words text-start ${isBlackHole ? 'text-rose-500' : ''}`} dir="ltr">
                  {displayResult?.mainValue}
                </div>
                {displayResult?.subText && (
                  <p className={`text-secondary font-medium text-base md:text-lg flex items-center gap-2 ${isBlackHole ? 'text-rose-400' : ''}`}>
                    {isBlackHole ? <AlertTriangle className="w-4 h-4 md:w-5 md:h-5" /> : <Info className="w-4 h-4 md:w-5 md:h-5" />}
                    {translateLabel(displayResult.subText)}
                  </p>
                )}
                
                {/* Inflation Adjuster Toggle */}
                {isFutureValueCalc && !isBlackHole && (
                  <div className="mt-6 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                          <div className="relative inline-flex items-center cursor-pointer" onClick={() => setAdjustInflation(!adjustInflation)}>
                              <input type="checkbox" checked={adjustInflation} readOnly className="sr-only peer" />
                              <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          </div>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                              <TrendingUp className="w-4 h-4" /> 
                              {/* Dynamic label replacing the default 3% if present in translation */}
                              {tNew.runner.inflation.replace('(3%)', `(${parseFloat(inflationRate) || 0}%)`)}
                          </span>
                      </div>
                      
                      {/* New Input for Rate */}
                      {adjustInflation && (
                        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                           <label className="text-xs text-slate-500">Rate (%):</label>
                           <input 
                             type="text" 
                             inputMode="decimal"
                             value={inflationRate} 
                             onChange={(e) => {
                                 // Allow empty string or numbers only
                                 const val = e.target.value;
                                 if (val === '' || /^\d*\.?\d*$/.test(val)) {
                                     setInflationRate(val);
                                 }
                             }}
                             className="w-16 p-1 text-sm border border-slate-300 dark:border-slate-600 rounded bg-slate-50 dark:bg-slate-800 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                           />
                        </div>
                      )}
                  </div>
                )}
                
                {/* Reverse Calculation Slider */}
                {calculator.inverseCalculate && displayResult && !isNaN(extractNumber(displayResult.mainValue)) && calculator.id !== 'breakeven' && !isBlackHole && (
                   <div className="mt-6 pt-4 border-t border-border/50">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                           <RefreshCw className="w-3 h-3" /> {tNew.runner.adjustResult}
                        </label>
                        <select 
                           value={reverseInputId}
                           onChange={(e) => setReverseInputId(e.target.value)}
                           className="text-xs bg-slate-100 dark:bg-slate-800 border-none rounded px-2 py-0.5 text-primary font-bold cursor-pointer outline-none"
                        >
                           {calculator.inputs.filter(i => i.type === 'number' || i.type === 'currency').map(i => (
                             <option key={i.id} value={i.id}>{tNew.balancer.limit}: {translateLabel(i.label)}</option>
                           ))}
                        </select>
                      </div>
                      <input 
                         type="range"
                         min={reverseTarget * 0.5}
                         max={reverseTarget * 1.5}
                         step={reverseTarget / 100}
                         value={reverseTarget}
                         onChange={(e) => handleReverseChange(parseFloat(e.target.value))}
                         className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                      <div className="flex justify-between mt-1 text-[10px] text-slate-400">
                         <span>-50%</span>
                         <span>{t('calc.current')}: {formatDelta(reverseTarget, (displayResult.mainValue || '').includes(currencySymbol) ? 'currency' : 'number', currencySymbol).replace('+','')}</span>
                         <span>+50%</span>
                      </div>
                   </div>
                )}
              </div>
              
              {displayResult?.chartData && !isBlackHole ? (
                 <div className="h-40 md:h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={displayResult.chartData}
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {displayResult.chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px' }}
                            itemStyle={{ color: '#f8fafc' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                 </div>
              ) : visualizerContent && !isBlackHole ? (
                // 3D/Audio/Interactive Visualizer Slot
                <div className={`w-full ${['bpm','freq'].includes(calculator.id) ? '' : 'h-[300px] md:h-[400px] flex items-center justify-center bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-border overflow-hidden relative'}`}>
                    {['bpm','freq', 'breakeven'].includes(calculator.id) ? (
                        visualizerContent
                    ) : !show3D ? (
                        <button
                            onClick={() => setShow3D(true)}
                            className="flex flex-col items-center gap-3 p-6 transition-all hover:scale-105"
                        >
                            <div className="p-4 bg-white dark:bg-slate-800 rounded-full shadow-xl shadow-indigo-500/10 text-indigo-500 mb-2">
                                <Box className="w-8 h-8" />
                            </div>
                            <div className="text-center">
                                <span className="block font-bold text-slate-700 dark:text-slate-200 text-lg">Generate 3D Render</span>
                                <span className="text-xs text-slate-500 dark:text-slate-400">Click to load interactive visualization</span>
                            </div>
                        </button>
                    ) : (
                        <div className="w-full h-full animate-in fade-in zoom-in-95 duration-700">
                            {visualizerContent}
                            <button 
                                onClick={() => setShow3D(false)}
                                className="absolute top-4 right-4 p-2 bg-white/80 dark:bg-black/50 backdrop-blur-sm rounded-full text-slate-500 hover:text-rose-500 transition-colors z-20 shadow-sm border border-slate-200 dark:border-white/10"
                                title="Close 3D View"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
              ) : isBlackHole ? (
                  <div className="flex items-center justify-center h-full text-9xl animate-pulse grayscale opacity-50">
                    🕳️
                  </div>
              ) : null}
            </div>

            {displayResult?.details && !isBlackHole && (
              <div className="mt-8 pt-6 border-t border-border grid grid-cols-2 md:grid-cols-3 gap-4">
                {displayResult.details.map((detail, idx) => (
                  <div key={idx} className="bg-slate-100 dark:bg-white/5 rounded-xl p-3">
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">{translateLabel(detail.label)}</div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm md:text-base" dir="ltr">{detail.value}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <ContextualSuggestions currentCalcId={calculator.id} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
             <div className="flex flex-col gap-6">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-0.5 shadow-lg">
                  <div className="bg-white dark:bg-slate-900 rounded-[14px] p-4 pb-6 md:pb-4 w-full">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm md:text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center gap-2">
                        {loadingAi ? (
                          <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
                        ) : (
                          <Sparkles className="w-4 h-4 text-indigo-500" />
                        )}
                        {t('calc.ai_insights')}
                      </h3>
                      <div className="flex items-center gap-2">
                        {showMealAnalyzer && <MealPhotoAnalyzer />}
                        {!loadingAi && !isBlackHole && (
                          <button 
                            onClick={fetchInsight}
                            className="flex items-center gap-2 text-xs bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 px-4 py-2 rounded-lg font-bold shadow-md hover:shadow-lg transition-all transform active:scale-95"
                          >
                            <Brain className="w-3 h-3" />
                            {currentTheme.id === 'matrix' 
                                ? "Ask the Oracle" 
                                : (AI_BUTTON_LABELS[language as keyof typeof AI_BUTTON_LABELS] || AI_BUTTON_LABELS['en'])}
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {loadingAi ? (
                      <div className="mt-3 flex items-center gap-3 text-slate-400 animate-pulse">
                        <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-xs">{t('calc.analyzing')}</span>
                      </div>
                    ) : activeInsight && !isBlackHole ? (
                      <div className="mt-3 animate-fade-in">
                        <div className="prose prose-sm dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 text-sm leading-relaxed border-l-2 border-indigo-500/50 pl-3">
                          <p>{activeInsight}</p>
                        </div>
                      </div>
                    ) : isBlackHole ? (
                        <div className="mt-3 animate-fade-in text-rose-500 font-mono text-sm border-l-2 border-rose-500 pl-3">
                            <p>Singularity detected. All physics models suspended.</p>
                        </div>
                    ) : null}
                  </div>
                </div>
                
                {/* Scenario Simulator Component */}
                <ScenarioSimulator 
                   scenarios={scenarios} 
                   loading={loadingScenarios} 
                   onSimulate={fetchScenarios} 
                   hasResult={!!result && !isBlackHole}
                />

                {comparisonData.length > 0 && !isEmbed && (
                  <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex-1 mt-6">
                     <div className="p-3 border-b border-border flex items-center justify-between bg-slate-50 dark:bg-white/5">
                       <h3 className="font-bold flex items-center gap-2 text-sm">
                         <History className="w-4 h-4 text-primary" /> {t('calc.comparison_history')}
                       </h3>
                       <div className="flex bg-slate-200 dark:bg-slate-800 rounded-lg p-1">
                          <button 
                            onClick={() => setViewMode('table')}
                            className={`p-2 md:p-1.5 rounded-md transition-all ${viewMode === 'table' ? 'bg-white dark:bg-slate-600 shadow-sm' : 'text-slate-500'}`}
                          >
                            <TableIcon className="w-5 h-5 md:w-4 md:h-4" />
                          </button>
                          <button 
                            onClick={() => setViewMode('chart')}
                            className={`p-2 md:p-1.5 rounded-md transition-all ${viewMode === 'chart' ? 'bg-white dark:bg-slate-600 shadow-sm' : 'text-slate-500'}`}
                          >
                            <BarChart2 className="w-5 h-5 md:w-4 md:h-4" />
                          </button>
                       </div>
                     </div>

                     <div className="p-0">
                       {viewMode === 'table' ? (
                         <div className="overflow-x-auto max-h-60 scrollbar-thin">
                           <table className="w-full text-xs">
                             <thead className="bg-slate-50/50 dark:bg-white/5 sticky top-0 z-10">
                               <tr className="text-slate-500 border-b border-border text-left">
                                 <th className="py-2 px-3 font-medium">Scenario</th>
                                 <th className="py-2 px-3 text-end">{t('calc.result')}</th>
                                 <th className="py-2 px-3 text-end">Diff</th>
                               </tr>
                             </thead>
                             <tbody className="divide-y divide-border">
                               {comparisonData.map((item, idx) => (
                                 <tr key={item.id} className={`group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${item.isCurrent ? 'bg-primary/5' : ''}`}>
                                   <td className="py-2 px-3 font-medium">
                                     <div className="flex items-center gap-2">
                                       <div className={`w-1.5 h-1.5 rounded-full ${item.isCurrent ? 'bg-primary' : 'bg-slate-300'}`}></div>
                                       {item.name}
                                     </div>
                                   </td>
                                   <td className="py-2 px-3 text-end font-mono text-slate-700 dark:text-slate-200">
                                     {item.displayValue}
                                   </td>
                                   <td className="py-2 px-3 text-end">
                                     {idx === 0 ? (
                                       <span className="text-slate-300">—</span>
                                     ) : (
                                       <div className="flex justify-end scale-90 origin-right">
                                         <DeltaBadge 
                                           current={comparisonData[0].value} 
                                           compare={item.value} 
                                           type={
                                             (calculator.calculate(item.inputs).mainValue || '').includes(currencySymbol) ? 'currency' : 
                                             (calculator.calculate(item.inputs).mainValue || '').includes('%') ? 'percentage' : 'number'
                                           } 
                                           currencySymbol={currencySymbol}
                                         />
                                       </div>
                                     )}
                                   </td>
                                 </tr>
                               ))}
                             </tbody>
                           </table>
                         </div>
                       ) : (
                         <div className="h-48 w-full p-2">
                           <ResponsiveContainer width="100%" height="100%">
                             <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                               <defs>
                                 <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                   <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                                   <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                 </linearGradient>
                               </defs>
                               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                               <XAxis dataKey="label" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                               <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                               <Tooltip 
                                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px', fontSize: '12px' }}
                               />
                               <Area type="monotone" dataKey="value" stroke="#6366f1" fillOpacity={1} fill="url(#colorVal)" strokeWidth={2} />
                             </AreaChart>
                           </ResponsiveContainer>
                         </div>
                       )}
                     </div>
                  </div>
                )}
             </div>
             
             <div className="flex flex-col gap-6">
                <div className="bg-card border border-border rounded-2xl p-4 md:p-5 shadow-sm space-y-6 flex-1">
                  <div className="flex items-center gap-2 border-b border-border pb-3">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t('calc.user_guide')}</h2>
                  </div>
                  
                  <div className="space-y-4">
                     <div>
                       <h3 className="font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200 text-sm">
                          <GraduationCap className="w-4 h-4 text-secondary" /> {t('calc.intro')}
                       </h3>
                       <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed mt-1">
                         {getCalcText('concept', calculator.guide.concept)}
                       </p>
                     </div>
                     
                     <div>
                       <h3 className="font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200 text-sm mt-4">
                          <Sigma className="w-4 h-4 text-secondary" /> {t('calc.formula')}
                       </h3>
                       <div className="bg-slate-100 dark:bg-slate-800/50 border border-border p-3 rounded-lg font-mono text-xs text-slate-700 dark:text-slate-300 overflow-x-auto mt-1 tracking-tight">
                         {getCalcText('formula', calculator.guide.formula)}
                       </div>
                     </div>

                     <div>
                       <h3 className="font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200 text-sm mt-4">
                          <Zap className="w-4 h-4 text-secondary" /> {t('calc.example')}
                       </h3>
                       <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 p-3 rounded-lg text-xs text-slate-700 dark:text-slate-300 mt-1">
                         <p className="italic">"{getCalcText('example', calculator.guide.example)}"</p>
                       </div>
                     </div>

                     {(() => {
                        const verify = getVerificationSource(calculator.id, calculator.category);
                        if (verify) {
                          return (
                            <div className="mt-4 pt-3 border-t border-border/50">
                              <a 
                                href={verify.url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
                              >
                                <ExternalLink className="w-3 h-3" />
                                Formula verified against {verify.source}
                              </a>
                            </div>
                          );
                        }
                      })()}
                  </div>
                </div>
                
                {relatedCalculators.length > 0 && !isEmbed && (
                   <div className="space-y-3">
                      <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider opacity-70">{t('calc.related')}</h2>
                      <div className="grid grid-cols-1 gap-3">
                        {relatedCalculators.map(rel => (
                          <Link key={rel.id} to={`/calculator/${rel.id}`} className="group p-3 bg-card border border-border rounded-xl hover:border-primary/50 transition-all hover:shadow-md flex items-center gap-3">
                            <div className="p-1.5 bg-slate-100 dark:bg-slate-900 rounded-lg text-primary group-hover:scale-110 transition-transform shrink-0">
                              <CategoryIcon category={rel.category} className="w-4 h-4" />
                            </div>
                            <div className="overflow-hidden">
                              <span className="font-bold text-xs md:text-sm text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors block truncate">{t(rel.name)}</span>
                              <span className="text-[10px] text-slate-500 block truncate">{t(rel.category)}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                   </div>
                )}
             </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-border">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-primary rounded-full"></span>
              {t('calc.about')} {t(calculator.name)}
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
               <p className="lead text-lg">{getCalcText('seo.intro')}</p>
               
               <h3 className="text-xl font-bold mt-6 mb-3">{t('calc.how_it_works')}</h3>
               <p>{getCalcText('seo.how')}</p>
               
               <h3 className="text-xl font-bold mt-6 mb-3">{t('calc.benefits')}</h3>
               <p>{getCalcText('seo.benefits')}</p>
            </div>
          </div>

          {!isEmbed && <CalculatorSEOArticle calculator={calculator} />}

        </div>
      </div>
    </div>
  );
};

export default CalculatorRunner;
