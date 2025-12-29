
import React, { useState, useMemo } from 'react';
import { DollarSign, Search, Map as MapIcon, Globe, ArrowLeft, Building2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { newFeatureTranslations } from '../utils/newFeatureTranslations';

// --- DATA: GLOBAL COUNTRIES ---
// Base: US Average = 100
interface CountryData {
  name: string;
  code: string; // ISO code
  index: number; // Cost of Living Index
  currency: string;
  rate: number; // 1 USD = rate LOCAL
  symbol: string;
  hasStates?: boolean;
}

const COUNTRY_DATA: CountryData[] = [
  { name: 'United States', code: 'US', index: 100, currency: 'USD', rate: 1, symbol: '$', hasStates: true },
  { name: 'Switzerland', code: 'CH', index: 114.2, currency: 'CHF', rate: 0.90, symbol: 'Fr.' },
  { name: 'Singapore', code: 'SG', index: 85.9, currency: 'SGD', rate: 1.35, symbol: 'S$' },
  { name: 'Norway', code: 'NO', index: 88.6, currency: 'NOK', rate: 10.9, symbol: 'kr' },
  { name: 'Iceland', code: 'IS', index: 83.3, currency: 'ISK', rate: 138, symbol: 'kr' },
  { name: 'Denmark', code: 'DK', index: 78.6, currency: 'DKK', rate: 6.9, symbol: 'kr' },
  { name: 'Australia', code: 'AU', index: 75.3, currency: 'AUD', rate: 1.52, symbol: 'A$' },
  { name: 'Canada', code: 'CA', index: 70.2, currency: 'CAD', rate: 1.36, symbol: 'C$' },
  { name: 'United Kingdom', code: 'GB', index: 69.1, currency: 'GBP', rate: 0.79, symbol: '£' },
  { name: 'Germany', code: 'DE', index: 66.5, currency: 'EUR', rate: 0.93, symbol: '€' },
  { name: 'France', code: 'FR', index: 64.9, currency: 'EUR', rate: 0.93, symbol: '€' },
  { name: 'Japan', code: 'JP', index: 56.6, currency: 'JPY', rate: 155, symbol: '¥' },
  { name: 'South Korea', code: 'KR', index: 63.8, currency: 'KRW', rate: 1370, symbol: '₩' },
  { name: 'China', code: 'CN', index: 39.2, currency: 'CNY', rate: 7.23, symbol: '¥' },
  { name: 'India', code: 'IN', index: 22.9, currency: 'INR', rate: 83.5, symbol: '₹' },
  { name: 'Brazil', code: 'BR', index: 36.7, currency: 'BRL', rate: 5.15, symbol: 'R$' },
  { name: 'Mexico', code: 'MX', index: 38.6, currency: 'MXN', rate: 16.9, symbol: '$' },
  { name: 'Russia', code: 'RU', index: 29.5, currency: 'RUB', rate: 92.5, symbol: '₽' },
  { name: 'Turkey', code: 'TR', index: 31.2, currency: 'TRY', rate: 32.4, symbol: '₺' },
  { name: 'United Arab Emirates', code: 'AE', index: 58.3, currency: 'AED', rate: 3.67, symbol: 'د.إ' },
  { name: 'Saudi Arabia', code: 'SA', index: 48.8, currency: 'SAR', rate: 3.75, symbol: '﷼' },
  { name: 'South Africa', code: 'ZA', index: 34.5, currency: 'ZAR', rate: 18.8, symbol: 'R' },
  { name: 'Italy', code: 'IT', index: 61.2, currency: 'EUR', rate: 0.93, symbol: '€' },
  { name: 'Spain', code: 'ES', index: 53.8, currency: 'EUR', rate: 0.93, symbol: '€' },
  { name: 'Thailand', code: 'TH', index: 35.6, currency: 'THB', rate: 36.8, symbol: '฿' },
  { name: 'Vietnam', code: 'VN', index: 30.4, currency: 'VND', rate: 25400, symbol: '₫' },
  { name: 'Indonesia', code: 'ID', index: 31.8, currency: 'IDR', rate: 16100, symbol: 'Rp' },
  { name: 'Philippines', code: 'PH', index: 32.5, currency: 'PHP', rate: 57.5, symbol: '₱' },
  { name: 'Egypt', code: 'EG', index: 21.6, currency: 'EGP', rate: 47.5, symbol: '£' },
  { name: 'Argentina', code: 'AR', index: 28.5, currency: 'ARS', rate: 880, symbol: '$' },
  { name: 'Pakistan', code: 'PK', index: 18.5, currency: 'PKR', rate: 278, symbol: '₨' },
  { name: 'Nigeria', code: 'NG', index: 23.4, currency: 'NGN', rate: 1300, symbol: '₦' },
  { name: 'Netherlands', code: 'NL', index: 68.3, currency: 'EUR', rate: 0.93, symbol: '€' },
  { name: 'Sweden', code: 'SE', index: 65.4, currency: 'SEK', rate: 10.8, symbol: 'kr' },
  { name: 'Poland', code: 'PL', index: 40.5, currency: 'PLN', rate: 3.98, symbol: 'zł' },
];

// --- DATA: US STATES ---
// Base: National Avg = 100
const US_STATE_DATA: Record<string, { name: string; index: number; abbr: string }> = {
  AL: { name: 'Alabama', index: 88.1, abbr: 'AL' },
  AK: { name: 'Alaska', index: 125.8, abbr: 'AK' },
  AZ: { name: 'Arizona', index: 106.4, abbr: 'AZ' },
  AR: { name: 'Arkansas', index: 89.2, abbr: 'AR' },
  CA: { name: 'California', index: 139.8, abbr: 'CA' },
  CO: { name: 'Colorado', index: 105.6, abbr: 'CO' },
  CT: { name: 'Connecticut', index: 116.7, abbr: 'CT' },
  DE: { name: 'Delaware', index: 101.4, abbr: 'DE' },
  FL: { name: 'Florida', index: 102.3, abbr: 'FL' },
  GA: { name: 'Georgia', index: 89.2, abbr: 'GA' },
  HI: { name: 'Hawaii', index: 184.9, abbr: 'HI' },
  ID: { name: 'Idaho', index: 92.3, abbr: 'ID' },
  IL: { name: 'Illinois', index: 91.8, abbr: 'IL' },
  IN: { name: 'Indiana', index: 90.0, abbr: 'IN' },
  IA: { name: 'Iowa', index: 89.7, abbr: 'IA' },
  KS: { name: 'Kansas', index: 87.7, abbr: 'KS' },
  KY: { name: 'Kentucky', index: 93.8, abbr: 'KY' },
  LA: { name: 'Louisiana', index: 93.6, abbr: 'LA' },
  ME: { name: 'Maine', index: 111.5, abbr: 'ME' },
  MD: { name: 'Maryland', index: 119.5, abbr: 'MD' },
  MA: { name: 'Massachusetts', index: 148.4, abbr: 'MA' },
  MI: { name: 'Michigan', index: 92.7, abbr: 'MI' },
  MN: { name: 'Minnesota', index: 97.5, abbr: 'MN' },
  MS: { name: 'Mississippi', index: 86.1, abbr: 'MS' },
  MO: { name: 'Missouri', index: 88.4, abbr: 'MO' },
  MT: { name: 'Montana', index: 102.3, abbr: 'MT' },
  NE: { name: 'Nebraska', index: 90.1, abbr: 'NE' },
  NV: { name: 'Nevada', index: 103.2, abbr: 'NV' },
  NH: { name: 'New Hampshire', index: 115.6, abbr: 'NH' },
  NJ: { name: 'New Jersey', index: 115.8, abbr: 'NJ' },
  NM: { name: 'New Mexico', index: 89.6, abbr: 'NM' },
  NY: { name: 'New York', index: 125.1, abbr: 'NY' },
  NC: { name: 'North Carolina', index: 96.1, abbr: 'NC' },
  ND: { name: 'North Dakota', index: 94.5, abbr: 'ND' },
  OH: { name: 'Ohio', index: 92.2, abbr: 'OH' },
  OK: { name: 'Oklahoma', index: 86.0, abbr: 'OK' },
  OR: { name: 'Oregon', index: 114.7, abbr: 'OR' },
  PA: { name: 'Pennsylvania', index: 99.0, abbr: 'PA' },
  RI: { name: 'Rhode Island', index: 112.9, abbr: 'RI' },
  SC: { name: 'South Carolina', index: 95.9, abbr: 'SC' },
  SD: { name: 'South Dakota', index: 93.8, abbr: 'SD' },
  TN: { name: 'Tennessee', index: 90.4, abbr: 'TN' },
  TX: { name: 'Texas', index: 93.0, abbr: 'TX' },
  UT: { name: 'Utah', index: 102.8, abbr: 'UT' },
  VT: { name: 'Vermont', index: 114.9, abbr: 'VT' },
  VA: { name: 'Virginia', index: 101.4, abbr: 'VA' },
  WA: { name: 'Washington', index: 115.1, abbr: 'WA' },
  WV: { name: 'West Virginia', index: 88.5, abbr: 'WV' },
  WI: { name: 'Wisconsin', index: 95.2, abbr: 'WI' },
  WY: { name: 'Wyoming', index: 92.8, abbr: 'WY' }
};

// --- COMPONENTS ---

interface StateTileProps {
  abbr: string;
  salaryUSD: number;
  onHover: (d: any) => void;
}

const StateTile: React.FC<StateTileProps> = ({ abbr, salaryUSD, onHover }) => {
  const data = US_STATE_DATA[abbr];
  if (!data) return <div className="w-full h-full bg-transparent" />;

  const realValue = salaryUSD * (100 / data.index);
  const diff = ((realValue - salaryUSD) / salaryUSD) * 100;
  
  let bg = 'bg-slate-200 dark:bg-slate-800';
  let text = 'text-slate-600 dark:text-slate-400';
  
  if (diff > 15) { bg = 'bg-emerald-500'; text = 'text-white'; }
  else if (diff > 5) { bg = 'bg-emerald-400'; text = 'text-white'; }
  else if (diff > 0) { bg = 'bg-emerald-300'; text = 'text-slate-900'; }
  else if (diff > -5) { bg = 'bg-slate-300 dark:bg-slate-700'; text = 'text-slate-900 dark:text-white'; }
  else if (diff > -15) { bg = 'bg-rose-300'; text = 'text-slate-900'; }
  else { bg = 'bg-rose-500'; text = 'text-white'; }

  return (
    <div 
      className={`w-full aspect-square rounded-lg flex items-center justify-center cursor-pointer transition-transform hover:scale-110 shadow-sm ${bg}`}
      onMouseEnter={() => onHover({ name: data.name, index: data.index, value: realValue, type: 'state' })}
    >
      <span className={`text-xs font-bold ${text}`}>{abbr}</span>
    </div>
  );
};

interface CountryTileProps {
  country: CountryData;
  salaryUSD: number;
  onHover: (c: any) => void;
  onClick: (c: CountryData) => void;
}

const CountryTile: React.FC<CountryTileProps> = ({ country, salaryUSD, onHover, onClick }) => {
  const realValueUSD = salaryUSD * (100 / country.index);
  const diff = ((realValueUSD - salaryUSD) / salaryUSD) * 100;
  
  let bg = 'bg-slate-200 dark:bg-slate-800';
  let text = 'text-slate-600 dark:text-slate-400';
  
  if (diff > 100) { bg = 'bg-emerald-600'; text = 'text-white'; }
  else if (diff > 50) { bg = 'bg-emerald-500'; text = 'text-white'; }
  else if (diff > 25) { bg = 'bg-emerald-400'; text = 'text-white'; }
  else if (diff > 0) { bg = 'bg-emerald-300'; text = 'text-slate-900'; }
  else if (diff > -10) { bg = 'bg-slate-300 dark:bg-slate-700'; text = 'text-slate-900 dark:text-white'; }
  else if (diff > -25) { bg = 'bg-rose-300'; text = 'text-slate-900'; }
  else { bg = 'bg-rose-500'; text = 'text-white'; }

  return (
    <div 
      className={`w-full aspect-square rounded-lg flex flex-col items-center justify-center cursor-pointer transition-transform hover:scale-105 shadow-sm ${bg} p-1 relative group`}
      onMouseEnter={() => onHover({ country, value: realValueUSD, type: 'country' })}
      onClick={() => onClick(country)}
    >
      <span className={`text-xs md:text-sm font-bold ${text} truncate w-full text-center`}>{country.code}</span>
      {country.hasStates && (
        <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full opacity-50"></div>
      )}
    </div>
  );
};

export const SalaryHeatmap: React.FC = () => {
  const [view, setView] = useState<'WORLD' | 'US'>('WORLD');
  const [salary, setSalary] = useState<number>(50000);
  const [hoveredData, setHoveredData] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { language } = useLanguage();
  const t = newFeatureTranslations[language as keyof typeof newFeatureTranslations] || newFeatureTranslations['en'];
  const ts = t.salary;

  const formatCurrency = (val: number, currency: string = 'USD', symbol: string = '$') => {
      try {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(val);
      } catch (e) {
          return `${symbol}${val.toLocaleString()}`;
      }
  };

  const filteredCountries = useMemo(() => {
    return COUNTRY_DATA.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.code.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery]);

  const handleCountryClick = (country: CountryData) => {
    if (country.code === 'US') {
      setView('US');
      setHoveredData(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Input Section */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
                {view === 'US' && (
                    <button 
                        onClick={() => setView('WORLD')}
                        className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                    </button>
                )}
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                        {view === 'US' ? ts.titleUS : ts.titleWorld}
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {view === 'US' 
                            ? ts.descUS 
                            : ts.descWorld}
                    </p>
                </div>
            </div>
            
            <div className="relative w-full md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-slate-400" />
                </div>
                <input
                    type="number"
                    value={salary}
                    onChange={(e) => setSalary(Number(e.target.value))}
                    className="block w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none font-bold text-lg text-slate-900 dark:text-white"
                    placeholder={ts.annualSalary}
                />
            </div>
        </div>
        
        {view === 'WORLD' && (
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                    type="text" 
                    placeholder={ts.search} 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none"
                />
            </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Map Grid */}
        <div className="lg:col-span-2 bg-slate-100 dark:bg-slate-900/50 rounded-2xl p-6 border border-border overflow-hidden relative min-h-[400px]">
           
           {view === 'WORLD' ? (
               <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                  {filteredCountries.map(country => (
                      <CountryTile 
                        key={country.code} 
                        country={country} 
                        salaryUSD={salary} 
                        onHover={setHoveredData} 
                        onClick={handleCountryClick}
                      />
                  ))}
               </div>
           ) : (
               <div className="grid grid-cols-11 gap-2 max-w-2xl mx-auto">
                  {/* US State Grid Layout */}
                  {/* Row 1 */}
                  <div className="col-span-1"><StateTile abbr="AK" salaryUSD={salary} onHover={setHoveredData} /></div>
                  <div className="col-span-9"></div>
                  <div className="col-span-1"><StateTile abbr="ME" salaryUSD={salary} onHover={setHoveredData} /></div>
                  {/* Row 2 */}
                  <div className="col-span-10"></div>
                  <div className="col-span-1"><StateTile abbr="VT" salaryUSD={salary} onHover={setHoveredData} /></div>
                  {/* Row 3 */}
                  <div className="col-span-1"><StateTile abbr="WA" salaryUSD={salary} onHover={setHoveredData} /></div>
                  <div className="col-span-1"><StateTile abbr="ID" salaryUSD={salary} onHover={setHoveredData} /></div>
                  <div className="col-span-1"><StateTile abbr="MT" salaryUSD={salary} onHover={setHoveredData} /></div>
                  <div className="col-span-1"><StateTile abbr="ND" salaryUSD={salary} onHover={setHoveredData} /></div>
                  <div className="col-span-1"><StateTile abbr="MN" salaryUSD={salary} onHover={setHoveredData} /></div>
                  <div className="col-span-1"><StateTile abbr="IL" salaryUSD={salary} onHover={setHoveredData} /></div>
                  <div className="col-span-1"><StateTile abbr="WI" salaryUSD={salary} onHover={setHoveredData} /></div>
                  <div className="col-span-1"><StateTile abbr="MI" salaryUSD={salary} onHover={setHoveredData} /></div>
                  <div className="col-span-1"><StateTile abbr="NY" salaryUSD={salary} onHover={setHoveredData} /></div>
                  <div className="col-span-1"><StateTile abbr="RI" salaryUSD={salary} onHover={setHoveredData} /></div>
                  <div className="col-span-1"><StateTile abbr="MA" salaryUSD={salary} onHover={setHoveredData} /></div>
                  {/* Row 4 */}
                  <div className="col-span-1"><StateTile abbr="OR" salaryUSD={salary} onHover={setHoveredData} /></div>
                  <div className="col-span-1"><StateTile abbr="NV" salaryUSD={salary} onHover={setHoveredData} /></div>
                  <div className="col-span-1"><StateTile abbr="WY" salaryUSD={salary} onHover={setHoveredData} /></div>
                  <div className="col-span-1"><StateTile abbr="SD" salaryUSD={salary} onHover={setHoveredData} /></div>
                  <div className="col-span-1"><StateTile abbr="IA" salaryUSD={salary} onHover={setHoveredData} /></div>
                  <div className="col-span-1"><StateTile abbr="IN" salaryUSD={salary} onHover={setHoveredData} /></div>
                  <div className="col-span-1"><StateTile abbr="OH" salaryUSD={salary} onHover={setHoveredData} /></div>
                  <div className="col-span-1"><StateTile abbr="PA" salaryUSD={salary} onHover={setHoveredData} /></div>
                  <div className="col-span-1"><StateTile abbr="NJ" salaryUSD={salary} onHover={setHoveredData} /></div>
                  <div className="col-span-1"><StateTile abbr="CT" salaryUSD={salary} onHover={setHoveredData} /></div>
                  <div className="col-span-1"><StateTile abbr="NH" salaryUSD={salary} onHover={setHoveredData} /></div>
                  {/* Row 5 */}
                  <div className="col-span-1"><StateTile abbr="CA" salaryUSD={salary} onHover={setHoveredData} /></div>
                  <div className="col-span-1"><StateTile abbr="UT" salaryUSD={salary} onHover={setHoveredData} /></div>
                  <div className="col-span-1"><StateTile abbr="CO" salaryUSD={salary} onHover={setHoveredData} /></div>
                  <div className="col-span-1"><StateTile abbr="NE" salaryUSD={salary} onHover={setHoveredData} /></div>
                  <div className="col-span-1"><StateTile abbr="MO" salaryUSD={salary} onHover={setHoveredData} /></div>
                  <div className="col-span-1"><StateTile abbr="KY" salaryUSD={salary} onHover={setHoveredData} /></div>
                  <div className="col-span-1"><StateTile abbr="WV" salaryUSD={salary} onHover={setHoveredData} /></div>
                  <div className="col-span-1"><StateTile abbr="VA" salaryUSD={salary} onHover={setHoveredData} /></div>
                  <div className="col-span-1"><StateTile abbr="MD" salaryUSD={salary} onHover={setHoveredData} /></div>
                  <div className="col-span-1"><StateTile abbr="DE" salaryUSD={salary} onHover={setHoveredData} /></div>
                  <div className="col-span-1"></div>
                  {/* Row 6 */}
                  <div className="col-span-1"></div>
                  <div className="col-span-1"><StateTile abbr="AZ" salaryUSD={salary} onHover={setHoveredData} /></div>
                  <div className="col-span-1"><StateTile abbr="NM" salaryUSD={salary} onHover={setHoveredData} /></div>
                  <div className="col-span-1"><StateTile abbr="KS" salaryUSD={salary} onHover={setHoveredData} /></div>
                  <div className="col-span-1"><StateTile abbr="AR" salaryUSD={salary} onHover={setHoveredData} /></div>
                  <div className="col-span-1"><StateTile abbr="TN" salaryUSD={salary} onHover={setHoveredData} /></div>
                  <div className="col-span-1"><StateTile abbr="NC" salaryUSD={salary} onHover={setHoveredData} /></div>
                  <div className="col-span-1"><StateTile abbr="SC" salaryUSD={salary} onHover={setHoveredData} /></div>
                  <div className="col-span-3"></div>
                  {/* Row 7 */}
                  <div className="col-span-3"></div>
                  <div className="col-span-1"><StateTile abbr="OK" salaryUSD={salary} onHover={setHoveredData} /></div>
                  <div className="col-span-1"><StateTile abbr="LA" salaryUSD={salary} onHover={setHoveredData} /></div>
                  <div className="col-span-1"><StateTile abbr="MS" salaryUSD={salary} onHover={setHoveredData} /></div>
                  <div className="col-span-1"><StateTile abbr="AL" salaryUSD={salary} onHover={setHoveredData} /></div>
                  <div className="col-span-1"><StateTile abbr="GA" salaryUSD={salary} onHover={setHoveredData} /></div>
                  <div className="col-span-3"></div>
                  {/* Row 8 */}
                  <div className="col-span-1"><StateTile abbr="HI" salaryUSD={salary} onHover={setHoveredData} /></div>
                  <div className="col-span-2"></div>
                  <div className="col-span-1"><StateTile abbr="TX" salaryUSD={salary} onHover={setHoveredData} /></div>
                  <div className="col-span-3"></div>
                  <div className="col-span-1"><StateTile abbr="FL" salaryUSD={salary} onHover={setHoveredData} /></div>
                  <div className="col-span-3"></div>
               </div>
           )}
           
           {view === 'WORLD' && filteredCountries.length === 0 && (
               <div className="flex flex-col items-center justify-center h-full text-slate-400">
                   <Globe className="w-8 h-8 mb-2 opacity-50" />
                   <p>No countries found.</p>
               </div>
           )}

           <div className="mt-6 flex flex-wrap gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded-sm"></div> {ts.highPower}</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-slate-300 dark:bg-slate-600 rounded-sm"></div> {ts.average}</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-rose-500 rounded-sm"></div> {ts.lowPower}</div>
           </div>
        </div>

        {/* Details Panel */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm h-full flex flex-col justify-center">
           {hoveredData ? (
             <div className="text-center animate-fade-in space-y-4">
                {hoveredData.type === 'country' ? (
                    <>
                        <div className="flex flex-col items-center">
                            <div className="text-4xl font-bold text-slate-900 dark:text-white mb-1">
                            {hoveredData.country.name}
                            </div>
                            <div className="text-xs text-slate-500 font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                                {hoveredData.country.code} • {hoveredData.country.currency}
                            </div>
                        </div>

                        <div className="py-4 border-t border-b border-border space-y-4">
                            <div>
                                <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">{ts.localValue}</div>
                                <div className="text-xl font-bold text-slate-700 dark:text-slate-300">
                                    {formatCurrency(salary * hoveredData.country.rate, hoveredData.country.currency, hoveredData.country.symbol)}
                                </div>
                                <div className="text-[10px] text-slate-400">{ts.exchangeRate}: 1 USD = {hoveredData.country.rate} {hoveredData.country.currency}</div>
                            </div>

                            <div>
                                <div className="text-xs text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1 font-bold">{ts.purchasingPower}</div>
                                <div className="text-3xl font-bold text-slate-900 dark:text-white">
                                    {formatCurrency(hoveredData.value, 'USD', '$')}
                                </div>
                                <div className="text-xs text-slate-500 mt-1">
                                {ts.realValue} {formatCurrency(salary)} {ts.in} {hoveredData.country.name}.
                                </div>
                            </div>
                            
                            {hoveredData.country.code === 'US' && (
                                <div className="mt-2 text-xs text-indigo-500 font-bold animate-pulse">
                                    Click to view States →
                                </div>
                            )}
                        </div>
                        
                        <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-slate-500">{ts.colIndex}</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{hoveredData.country.index}</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                            <div 
                            className={`h-full ${hoveredData.country.index > 100 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                            style={{ width: `${Math.min(100, (hoveredData.country.index / 120) * 100)}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                            <span>{ts.cheap} (20)</span>
                            <span>{ts.expensive} (100+)</span>
                        </div>
                        </div>
                    </>
                ) : (
                    // State Details
                    <>
                        <div className="flex flex-col items-center">
                            <div className="text-sm text-slate-500 uppercase tracking-widest mb-1">{ts.in} {hoveredData.name}</div>
                            <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                            {formatCurrency(hoveredData.value)}
                            </div>
                            <div className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-6">
                            {ts.realValue} {formatCurrency(salary)}.
                            </div>
                            
                            <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-4 mb-4 w-full">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs text-slate-500">{ts.colIndex}</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200">{hoveredData.index}</span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                                <div 
                                className={`h-full ${hoveredData.index > 100 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                                style={{ width: `${Math.min(100, (hoveredData.index / 150) * 100)}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                                <span>{ts.cheap} (85)</span>
                                <span>{ts.expensive} (150+)</span>
                            </div>
                            </div>

                            <div className="flex items-center gap-2 p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-xs text-indigo-700 dark:text-indigo-300">
                                <Building2 className="w-3 h-3" />
                                {ts.comparedTo}
                            </div>
                        </div>
                    </>
                )}
             </div>
           ) : (
             <div className="text-center text-slate-400 flex flex-col items-center">
                <MapIcon className="w-12 h-12 mb-4 opacity-50" />
                <p>Hover over a location to see detailed purchasing power.</p>
                {view === 'WORLD' && (
                    <p className="text-xs mt-2 opacity-70">Click US to see states.</p>
                )}
             </div>
           )}
        </div>
      </div>
      
      <div className="text-[10px] text-slate-400 text-center italic">
          * Data is approximate based on 2024/2025 Cost of Living Indices relative to US Average (Index 100). Exchange rates are estimated.
      </div>
    </div>
  );
};
