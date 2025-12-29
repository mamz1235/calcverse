
import React, { useState } from 'react';
import { MapPin, Navigation, Mountain, Loader2, AlertTriangle, ArrowRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';
import { newFeatureTranslations } from '../utils/newFeatureTranslations';

interface SlopeResult {
  elevationDiff: number; // meters
  distance: number; // meters
  slopePct: number; // %
  slopeDeg: number; // degrees
  startElevation: number;
  endElevation: number;
}

const SlopeCalculator: React.FC = () => {
  const [startPoint, setStartPoint] = useState('');
  const [endPoint, setEndPoint] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<SlopeResult | null>(null);

  const { language } = useLanguage();
  const t = newFeatureTranslations[language as keyof typeof newFeatureTranslations] || newFeatureTranslations['en'];
  const ts = t.slope;

  const calculateSlope = async () => {
    if (!startPoint || !endPoint) {
      setError(ts.error);
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/slope', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ startPoint, endPoint }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const apiData = await response.json();
      const text = apiData.text || '{}';
      const cleanText = text.replace(/```json|```/g, '').trim();
      
      try {
        const data = JSON.parse(cleanText);
        
        if (data.distanceMeters === 0) throw new Error("Distance is zero");

        const elevationDiff = Math.abs(data.endElevationMeters - data.startElevationMeters);
        const slopePct = (elevationDiff / data.distanceMeters) * 100;
        const slopeDeg = Math.atan(elevationDiff / data.distanceMeters) * (180 / Math.PI);

        setResult({
          elevationDiff,
          distance: data.distanceMeters,
          slopePct,
          slopeDeg,
          startElevation: data.startElevationMeters,
          endElevation: data.endElevationMeters
        });
      } catch (parseError) {
        console.error(parseError);
        setError("Could not parse slope data. Please try more specific locations.");
      }

    } catch (err) {
      console.error(err);
      setError("Failed to calculate slope. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Generate chart data for visualization
  const getChartData = () => {
    if (!result) return [];
    const steps = 10;
    const data = [];
    const heightStep = (result.endElevation - result.startElevation) / steps;
    const distStep = result.distance / steps;

    for (let i = 0; i <= steps; i++) {
      data.push({
        distance: Math.round(i * distStep),
        elevation: Math.round(result.startElevation + (i * heightStep))
      });
    }
    return data;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden max-w-4xl mx-auto">
      <div className="p-6 md:p-8 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Mountain className="w-8 h-8" />
          {ts.title}
        </h2>
        <p className="text-blue-100 mt-2">
          {ts.desc}
        </p>
      </div>

      <div className="p-6 md:p-8 space-y-8">
        <div className="grid md:grid-cols-2 gap-4 items-end">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">{ts.start}</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
              <input 
                type="text" 
                value={startPoint}
                onChange={(e) => setStartPoint(e.target.value)}
                placeholder={ts.placeholder}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">{ts.end}</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
              <input 
                type="text" 
                value={endPoint}
                onChange={(e) => setEndPoint(e.target.value)}
                placeholder={ts.placeholder}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <button 
          onClick={calculateSlope}
          disabled={loading}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Navigation className="w-5 h-5" />}
          {loading ? ts.analyzing : ts.calc}
        </button>

        {error && (
          <div className="p-4 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {result && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-center">
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">{ts.grade}</div>
                <div className="text-3xl font-black text-blue-600 dark:text-blue-400">{result.slopePct.toFixed(1)}%</div>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-center">
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">{ts.angle}</div>
                <div className="text-3xl font-black text-slate-900 dark:text-white">{result.slopeDeg.toFixed(1)}°</div>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-center">
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">{ts.rise}</div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{result.elevationDiff.toFixed(1)}m</div>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-center">
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">{ts.run}</div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{(result.distance / 1000).toFixed(2)}km</div>
              </div>
            </div>

            <div className="h-64 w-full bg-slate-50 dark:bg-slate-800/30 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={getChartData()}>
                   <defs>
                     <linearGradient id="colorElev" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <XAxis dataKey="distance" unit="m" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                   <YAxis dataKey="elevation" unit="m" domain={['auto', 'auto']} stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                   <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                   <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                   />
                   <Area type="monotone" dataKey="elevation" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorElev)" />
                 </AreaChart>
               </ResponsiveContainer>
            </div>
            
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
               <h3 className="font-bold text-slate-900 dark:text-white mb-2">{ts.interpretation}</h3>
               <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex items-start gap-2">
                     <span className={`w-2 h-2 rounded-full mt-1.5 ${result.slopePct < 5 ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                     <span>{ts.easy}</span>
                  </li>
                  <li className="flex items-start gap-2">
                     <span className={`w-2 h-2 rounded-full mt-1.5 ${result.slopePct >= 5 && result.slopePct < 10 ? 'bg-yellow-500' : 'bg-slate-300'}`}></span>
                     <span>{ts.moderate}</span>
                  </li>
                  <li className="flex items-start gap-2">
                     <span className={`w-2 h-2 rounded-full mt-1.5 ${result.slopePct >= 10 && result.slopePct < 15 ? 'bg-orange-500' : 'bg-slate-300'}`}></span>
                     <span>{ts.steep}</span>
                  </li>
                  <li className="flex items-start gap-2">
                     <span className={`w-2 h-2 rounded-full mt-1.5 ${result.slopePct >= 15 ? 'bg-red-500' : 'bg-slate-300'}`}></span>
                     <span>{ts.verySteep}</span>
                  </li>
               </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SlopeCalculator;
