
import React from 'react';
import { useComparison, ComparisonItem } from '../contexts/ComparisonContext';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Plus, Scale, AlertCircle } from 'lucide-react';
import { CALCULATORS } from '../utils/calculatorRegistry';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';

const COLORS = ['#6366f1', '#10b981', '#f43f5e'];

const LOCAL_TRANSLATIONS = {
  en: { 
    empty: "Workspace Empty", 
    emptyDesc: "You haven't pinned any scenarios yet. Go to any calculator and click \"Compare\" to start building your matrix.",
    explore: "Explore Calculators",
    matrix: "Comparison Matrix",
    scenarios: "Scenarios",
    clear: "Clear Workspace",
    mainResult: "Main Result",
    visual: "Visual Comparison",
    breakdown: "Breakdown",
    add: "Add Scenario",
    scenario: "Scenario",
    parameter: "Parameter"
  },
  es: {
    empty: "Espacio Vacío",
    emptyDesc: "Aún no has fijado escenarios. Ve a una calculadora y haz clic en \"Comparar\" para comenzar.",
    explore: "Explorar Calculadoras",
    matrix: "Matriz de Comparación",
    scenarios: "Escenarios",
    clear: "Limpiar Espacio",
    mainResult: "Resultado Principal",
    visual: "Comparación Visual",
    breakdown: "Desglose",
    add: "Añadir Escenario",
    scenario: "Escenario",
    parameter: "Parámetro"
  },
  fr: {
    empty: "Espace Vide",
    emptyDesc: "Vous n'avez pas encore épinglé de scénarios. Allez sur une calculatrice et cliquez sur \"Comparer\" pour commencer.",
    explore: "Explorer",
    matrix: "Matrice de Comparaison",
    scenarios: "Scénarios",
    clear: "Effacer l'Espace",
    mainResult: "Résultat Principal",
    visual: "Comparaison Visuelle",
    breakdown: "Détails",
    add: "Ajouter",
    scenario: "Scénario",
    parameter: "Paramètre"
  },
  ru: {
    empty: "Нет данных",
    emptyDesc: "Вы еще не добавили сценарии. Перейдите к калькулятору и нажмите «Сравнить», чтобы начать.",
    explore: "Калькуляторы",
    matrix: "Матрица сравнения",
    scenarios: "Сценарии",
    clear: "Очистить все",
    mainResult: "Результат",
    visual: "Визуальное сравнение",
    breakdown: "Детали",
    add: "Добавить",
    scenario: "Сценарий",
    parameter: "Параметр"
  },
  hi: {
    empty: "कार्यक्षेत्र खाली है",
    emptyDesc: "आपने अभी तक कोई परिदृश्य पिन नहीं किया है। किसी भी कैलकुलेटर पर जाएं और शुरू करने के लिए \"तुलना करें\" पर क्लिक करें।",
    explore: "कैलकुलेटर खोजें",
    matrix: "तुलना मैट्रिक्स",
    scenarios: "परिदृश्य",
    clear: "कार्यक्षेत्र साफ़ करें",
    mainResult: "मुख्य परिणाम",
    visual: "दृश्य तुलना",
    breakdown: "विवरण",
    add: "परिदृश्य जोड़ें",
    scenario: "परिदृश्य",
    parameter: "पैरामीटर"
  },
  ar: {
    empty: "المساحة فارغة",
    emptyDesc: "لم تقم بتثبيت أي سيناريوهات. انتقل إلى أي آلة حاسبة وانقر على \"قارن\" للبدء.",
    explore: "تصفح الآلات الحاسبة",
    matrix: "مصفوفة المقارنة",
    scenarios: "سيناريوهات",
    clear: "مسح المساحة",
    mainResult: "النتيجة الرئيسية",
    visual: "مقارنة بصرية",
    breakdown: "تفاصيل",
    add: "إضافة",
    scenario: "سيناريو",
    parameter: "عامل"
  }
};

const extractNumber = (val: string | number): number => {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    const clean = val.replace(/,/g, '').replace(/[^0-9.-]/g, '');
    const num = parseFloat(clean);
    return isNaN(num) ? 0 : num;
};

const Compare: React.FC = () => {
  const { items, removeItem, clearItems } = useComparison();
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const lt = LOCAL_TRANSLATIONS[language as keyof typeof LOCAL_TRANSLATIONS] || LOCAL_TRANSLATIONS.en;

  // Group items by calculator type to render comparison matrices
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.calculatorId]) acc[item.calculatorId] = [];
    acc[item.calculatorId].push(item);
    return acc;
  }, {} as Record<string, ComparisonItem[]>);

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center animate-fade-in">
        <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Scale className="w-12 h-12 text-slate-400" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{lt.empty}</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
            {lt.emptyDesc}
        </p>
        <Link to="/explore" className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors">
            {lt.explore}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
            <Link to="/" className="p-2 bg-slate-200 dark:bg-slate-800 rounded-full hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
                <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300 transform rtl:rotate-180" />
            </Link>
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    {lt.matrix}
                    <span className="text-sm bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800/50">
                        {items.length} {lt.scenarios}
                    </span>
                </h1>
            </div>
        </div>
        <button 
            onClick={clearItems}
            className="text-rose-500 hover:text-rose-600 font-medium flex items-center gap-2 px-4 py-2 hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-lg transition-colors"
        >
            <Trash2 className="w-4 h-4" /> {lt.clear}
        </button>
      </div>

      {(Object.entries(groupedItems) as [string, ComparisonItem[]][]).map(([calcId, groupItems]) => {
        const calculator = CALCULATORS.find(c => c.id === calcId);
        if (!calculator) return null;

        // Prepare chart data
        const chartData = groupItems.map((item, idx) => ({
            name: `${lt.scenario} ${idx + 1}`,
            value: extractNumber(item.result.mainValue),
            display: item.result.mainValue
        }));

        const isMonetary = groupItems[0].result.mainValue.includes('$'); // Simple heuristic

        return (
            <div key={calcId} className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
                <div className="p-6 border-b border-border flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        {t(calculator.name)} <span className="text-slate-400 font-normal text-sm">({groupItems.length} vs 3)</span>
                    </h2>
                    <Link to={`/calculator/${calcId}`} className="text-sm text-primary font-bold hover:underline flex items-center gap-1">
                        <Plus className="w-4 h-4" /> {lt.add}
                    </Link>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-border">
                    {/* Visual Chart Column (if relevant) or Summary */}
                    <div className="lg:col-span-1 p-6 bg-slate-50/50 dark:bg-slate-800/20">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">{lt.visual}</h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                                    <XAxis dataKey="name" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                                    <YAxis hide />
                                    <Tooltip 
                                        cursor={{fill: 'transparent'}}
                                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px' }}
                                    />
                                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        {isMonetary && (
                            <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/50 text-xs text-indigo-800 dark:text-indigo-300">
                                <AlertCircle className="w-4 h-4 inline mr-2 mb-0.5" />
                                Lower values might be better for costs, higher for savings.
                            </div>
                        )}
                    </div>

                    {/* Data Matrix */}
                    <div className="lg:col-span-2 overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead>
                                <tr className="border-b border-border bg-slate-50 dark:bg-slate-900/50">
                                    <th className="p-4 w-1/4 font-medium text-slate-500">{lt.parameter}</th>
                                    {groupItems.map((item, idx) => (
                                        <th key={item.id} className="p-4 font-bold text-slate-900 dark:text-white min-w-[140px] relative group">
                                            <div className="flex items-center justify-between">
                                                <span>{lt.scenario} {idx + 1}</span>
                                                <button onClick={() => removeItem(item.id)} className="text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="text-[10px] text-slate-400 font-normal mt-1">
                                                {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </div>
                                            <div className={`absolute top-0 left-0 w-full h-1`} style={{backgroundColor: COLORS[idx % COLORS.length]}}></div>
                                        </th>
                                    ))}
                                    {/* Fill remaining columns */}
                                    {Array.from({ length: 3 - groupItems.length }).map((_, i) => (
                                        <th key={i} className="p-4 bg-slate-50/30 dark:bg-slate-900/30 min-w-[140px]"></th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {/* Result Row - Highlighted */}
                                <tr className="bg-indigo-50/50 dark:bg-indigo-900/10">
                                    <td className="p-4 font-bold text-indigo-900 dark:text-indigo-200">{lt.mainResult}</td>
                                    {groupItems.map(item => (
                                        <td key={item.id} className="p-4 font-bold text-2xl text-slate-900 dark:text-white">
                                            {item.result.mainValue}
                                            {item.result.subText && <div className="text-xs font-normal text-slate-500 mt-1">{item.result.subText}</div>}
                                        </td>
                                    ))}
                                    {Array.from({ length: 3 - groupItems.length }).map((_, i) => (
                                        <td key={i} className="p-4 bg-slate-50/30 dark:bg-slate-900/30 text-center">
                                            <Link to={`/calculator/${calcId}`} className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-dashed border-slate-300 text-slate-400 hover:text-primary hover:border-primary transition-colors">
                                                <Plus className="w-4 h-4" />
                                            </Link>
                                        </td>
                                    ))}
                                </tr>

                                {/* Inputs */}
                                {calculator.inputs.map(input => (
                                    <tr key={input.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="p-4 text-slate-600 dark:text-slate-400 font-medium">{t(input.label)}</td>
                                        {groupItems.map(item => {
                                            let val = item.inputs[input.id];
                                            if (input.type === 'currency' && typeof val === 'number') {
                                                val = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
                                            } else if (input.type === 'percentage' && typeof val === 'number') {
                                                val = `${val}%`;
                                            }
                                            return (
                                                <td key={item.id} className="p-4 text-slate-900 dark:text-slate-200 font-mono">
                                                    {val}
                                                </td>
                                            );
                                        })}
                                        {Array.from({ length: 3 - groupItems.length }).map((_, i) => (
                                            <td key={i} className="p-4 bg-slate-50/30 dark:bg-slate-900/30"></td>
                                        ))}
                                    </tr>
                                ))}
                                
                                {/* Detailed breakdown if available */}
                                {groupItems.some(i => i.result.details && i.result.details.length > 0) && (
                                    <>
                                        <tr>
                                            <td colSpan={4} className="p-2 bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-500 uppercase tracking-widest pl-4">{lt.breakdown}</td>
                                        </tr>
                                        {/* Create a union of all detail keys to handle rows */}
                                        {Array.from(new Set(groupItems.flatMap(i => i.result.details?.map(d => d.label) || []))).map(label => (
                                            <tr key={label} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="p-4 text-slate-600 dark:text-slate-400">{t(label)}</td>
                                                {groupItems.map(item => {
                                                    const detail = item.result.details?.find(d => d.label === label);
                                                    return (
                                                        <td key={item.id} className="p-4 text-slate-700 dark:text-slate-300">
                                                            {detail ? detail.value : '-'}
                                                        </td>
                                                    );
                                                })}
                                                {Array.from({ length: 3 - groupItems.length }).map((_, i) => (
                                                    <td key={i} className="p-4 bg-slate-50/30 dark:bg-slate-900/30"></td>
                                                ))}
                                            </tr>
                                        ))}
                                    </>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
      })}
    </div>
  );
};

export default Compare;
