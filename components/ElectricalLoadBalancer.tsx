
import React, { useState, useRef } from 'react';
import { Zap, Plus, Trash2, AlertTriangle, CheckCircle, RotateCcw, GripVertical } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { newFeatureTranslations } from '../utils/newFeatureTranslations';

interface Appliance {
  id: string;
  nameKey: string; // Changed to key for translation lookup
  watts: number;
  icon: string;
}

interface Circuit {
  id: string;
  name: string;
  maxAmps: number;
  appliances: Appliance[];
}

const DEFAULT_APPLIANCES: Appliance[] = [
  { id: 'fridge', nameKey: 'fridge', watts: 600, icon: '❄️' },
  { id: 'micro', nameKey: 'micro', watts: 1000, icon: '🥘' },
  { id: 'toaster', nameKey: 'toaster', watts: 850, icon: '🍞' },
  { id: 'kettle', nameKey: 'kettle', watts: 1500, icon: '🫖' },
  { id: 'tv', nameKey: 'tv', watts: 150, icon: '📺' },
  { id: 'pc', nameKey: 'pc', watts: 500, icon: '💻' },
  { id: 'ac', nameKey: 'ac', watts: 1200, icon: '🌬️' },
  { id: 'heater', nameKey: 'heater', watts: 1500, icon: '🔥' },
  { id: 'lamp', nameKey: 'lamp', watts: 60, icon: '💡' },
  { id: 'hair', nameKey: 'hair', watts: 1800, icon: '💨' },
];

const ElectricalLoadBalancer: React.FC = () => {
  const { language } = useLanguage();
  const t = newFeatureTranslations[language as keyof typeof newFeatureTranslations] || newFeatureTranslations['en'];
  const tb = t.balancer;

  const [circuits, setCircuits] = useState<Circuit[]>([
    { id: 'c1', name: 'Kitchen', maxAmps: 20, appliances: [] },
    { id: 'c2', name: 'Living Room', maxAmps: 15, appliances: [] },
  ]);
  
  const [availableAppliances, setAvailableAppliances] = useState<Appliance[]>(DEFAULT_APPLIANCES);
  const [voltage, setVoltage] = useState(120);
  const [draggedItem, setDraggedItem] = useState<{ item: Appliance, source: 'pool' | string } | null>(null);

  // Helper to calculate amps from watts
  const getAmps = (watts: number) => watts / voltage;

  const handleDragStart = (e: React.DragEvent, item: Appliance, source: 'pool' | string) => {
    setDraggedItem({ item, source });
    // Required for Firefox
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetCircuitId: string) => {
    e.preventDefault();
    if (!draggedItem) return;

    const { item, source } = draggedItem;

    if (source === targetCircuitId) return; // Dropped on same circuit

    // Update Circuits
    setCircuits(prev => prev.map(c => {
      // Remove from source if it was a circuit
      if (c.id === source) {
        return { ...c, appliances: c.appliances.filter(a => a.id !== item.id) };
      }
      // Add to target
      if (c.id === targetCircuitId) {
        return { ...c, appliances: [...c.appliances, item] };
      }
      return c;
    }));

    // If source was pool, remove from pool? 
    // Let's allow unlimited instances from pool for simplicity, OR unique.
    // For this specific tool, let's treat them as unique physical items to "balance".
    // So remove from available list if moving from pool.
    if (source === 'pool') {
      setAvailableAppliances(prev => prev.filter(a => a.id !== item.id));
    }

    setDraggedItem(null);
  };

  const handleReturnToPool = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedItem) return;
    const { item, source } = draggedItem;
    
    if (source === 'pool') return;

    setCircuits(prev => prev.map(c => {
      if (c.id === source) {
        return { ...c, appliances: c.appliances.filter(a => a.id !== item.id) };
      }
      return c;
    }));
    
    setAvailableAppliances(prev => [...prev, item]);
    setDraggedItem(null);
  };

  const addCircuit = () => {
    const newId = `c${Date.now()}`;
    setCircuits([...circuits, { id: newId, name: `Circuit ${circuits.length + 1}`, maxAmps: 15, appliances: [] }]);
  };

  const removeCircuit = (id: string) => {
    const circuit = circuits.find(c => c.id === id);
    if (circuit && circuit.appliances.length > 0) {
      // Return items to pool
      setAvailableAppliances(prev => [...prev, ...circuit.appliances]);
    }
    setCircuits(circuits.filter(c => c.id !== id));
  };

  const resetAll = () => {
    setAvailableAppliances(DEFAULT_APPLIANCES);
    setCircuits([
      { id: 'c1', name: 'Kitchen', maxAmps: 20, appliances: [] },
      { id: 'c2', name: 'Living Room', maxAmps: 15, appliances: [] },
    ]);
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      {/* Header & Controls */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Zap className="w-6 h-6 text-amber-500" /> {tb.title}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{tb.subtitle}</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
              <button 
                onClick={() => setVoltage(120)}
                className={`px-3 py-1.5 rounded-md text-sm font-bold transition-colors ${voltage === 120 ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'}`}
              >
                120V
              </button>
              <button 
                onClick={() => setVoltage(240)}
                className={`px-3 py-1.5 rounded-md text-sm font-bold transition-colors ${voltage === 240 ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'}`}
              >
                240V
              </button>
           </div>
           <button onClick={resetAll} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors" title="Reset">
             <RotateCcw className="w-5 h-5" />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Available Appliances Pool */}
        <div 
          className="lg:col-span-1 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col min-h-[400px]"
          onDragOver={handleDragOver}
          onDrop={handleReturnToPool}
        >
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 px-2">{tb.available}</h3>
          <div className="grid grid-cols-2 gap-3 content-start">
            {availableAppliances.map(app => (
              <div
                key={app.id}
                draggable
                onDragStart={(e) => handleDragStart(e, app, 'pool')}
                className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm cursor-grab active:cursor-grabbing hover:border-indigo-400 transition-colors flex flex-col items-center text-center gap-1 group"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform duration-200">{app.icon}</span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 leading-tight">{tb.appliances[app.nameKey] || app.nameKey}</span>
                <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded">{app.watts}W</span>
              </div>
            ))}
            {availableAppliances.length === 0 && (
              <div className="col-span-2 text-center py-10 text-slate-400 text-sm italic">
                {tb.allPlaced}
              </div>
            )}
          </div>
          
          <div className="mt-auto pt-6 text-xs text-slate-400 text-center">
            {tb.dragHint} →
          </div>
        </div>

        {/* Circuits Area */}
        <div className="lg:col-span-2 space-y-4">
           {circuits.map(circuit => {
             const totalWatts = circuit.appliances.reduce((acc, cur) => acc + cur.watts, 0);
             const totalAmps = getAmps(totalWatts);
             const loadPct = (totalAmps / circuit.maxAmps) * 100;
             const isOverloaded = totalAmps > circuit.maxAmps;
             const isWarning = loadPct > 80 && !isOverloaded;

             return (
               <div 
                  key={circuit.id}
                  className={`border rounded-2xl p-4 transition-colors ${isOverloaded ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900' : 'bg-card border-border'}`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, circuit.id)}
               >
                 <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                       <div className={`p-2 rounded-lg ${isOverloaded ? 'bg-rose-100 text-rose-600' : isWarning ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                          {isOverloaded ? <AlertTriangle className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                       </div>
                       <div>
                          <input 
                            type="text" 
                            value={circuit.name}
                            onChange={(e) => setCircuits(prev => prev.map(c => c.id === circuit.id ? {...c, name: e.target.value} : c))}
                            className="font-bold text-slate-900 dark:text-white bg-transparent outline-none focus:border-b border-primary w-32 md:w-auto"
                          />
                          <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                             <span>{tb.limit}:</span>
                             <select 
                                value={circuit.maxAmps}
                                onChange={(e) => setCircuits(prev => prev.map(c => c.id === circuit.id ? {...c, maxAmps: parseInt(e.target.value)} : c))}
                                className="bg-slate-200 dark:bg-slate-700 rounded px-1 py-0.5 text-xs outline-none cursor-pointer"
                             >
                                <option value="15">15A</option>
                                <option value="20">20A</option>
                                <option value="30">30A</option>
                                <option value="50">50A</option>
                             </select>
                          </div>
                       </div>
                    </div>

                    <div className="text-right">
                       <div className={`text-2xl font-black ${isOverloaded ? 'text-rose-600' : isWarning ? 'text-amber-500' : 'text-emerald-500'}`}>
                          {totalAmps.toFixed(1)}A
                       </div>
                       <div className="text-xs text-slate-400">{totalWatts}W / {voltage}V</div>
                    </div>
                 </div>

                 {/* Progress Bar */}
                 <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-4 relative">
                    <div 
                      className={`h-full transition-all duration-500 ${isOverloaded ? 'bg-rose-500' : isWarning ? 'bg-amber-400' : 'bg-emerald-500'}`}
                      style={{ width: `${Math.min(100, loadPct)}%` }}
                    ></div>
                    {/* 80% Marker */}
                    <div className="absolute top-0 bottom-0 w-0.5 bg-black/20 left-[80%] border-l border-white/50"></div>
                 </div>

                 {/* Dropped Items */}
                 <div className="min-h-[80px] bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-2 flex flex-wrap gap-2">
                    {circuit.appliances.length === 0 && (
                       <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs py-4">{tb.dropHere}</div>
                    )}
                    {circuit.appliances.map(app => (
                       <div 
                         key={app.id} 
                         draggable
                         onDragStart={(e) => handleDragStart(e, app, circuit.id)}
                         className="flex items-center gap-2 bg-white dark:bg-slate-800 pl-2 pr-3 py-1.5 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 cursor-grab active:cursor-grabbing hover:border-primary/50"
                       >
                          <span>{app.icon}</span>
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{tb.appliances[app.nameKey] || app.nameKey}</span>
                          <span className="text-xs text-slate-400 border-l border-slate-200 dark:border-slate-700 pl-2 ml-1">{app.watts}W</span>
                       </div>
                    ))}
                 </div>
                 
                 <div className="mt-3 flex justify-end">
                    <button 
                      onClick={() => removeCircuit(circuit.id)}
                      className="text-xs text-rose-400 hover:text-rose-600 flex items-center gap-1 opacity-50 hover:opacity-100 transition-opacity"
                    >
                       <Trash2 className="w-3 h-3" /> {tb.remove}
                    </button>
                 </div>
               </div>
             );
           })}

           <button 
             onClick={addCircuit}
             className="w-full py-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl flex items-center justify-center gap-2 text-slate-500 hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all font-bold"
           >
              <Plus className="w-5 h-5" /> {tb.add}
           </button>
        </div>
      </div>
    </div>
  );
};

export default ElectricalLoadBalancer;
