
import React, { useState, useRef } from 'react';
import { Camera, Loader2, X, AlertCircle, Utensils } from 'lucide-react';
import { analyzeMealPhoto } from '../services/imageAnalysisService';

const LIMIT_KEY = 'calcverse_meal_analyzer_limit';
const DAILY_LIMIT = 3;

interface LimitState {
  count: number;
  resetAt: number;
}

const MealPhotoAnalyzer: React.FC = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getLimitState = (): LimitState => {
    try {
      const stored = localStorage.getItem(LIMIT_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }
    return { count: 0, resetAt: Date.now() + 24 * 60 * 60 * 1000 };
  };

  const checkAndIncrementLimit = (): boolean => {
    const now = Date.now();
    let state = getLimitState();

    // Reset if time passed
    if (now > state.resetAt) {
      state = { count: 0, resetAt: now + 24 * 60 * 60 * 1000 };
    }

    if (state.count >= DAILY_LIMIT) {
      const hoursLeft = Math.ceil((state.resetAt - now) / (1000 * 60 * 60));
      setError(`Daily limit reached (${DAILY_LIMIT}/${DAILY_LIMIT}). Resets in ${hoursLeft} hours.`);
      localStorage.setItem(LIMIT_KEY, JSON.stringify(state)); // Update timestamp if it was reset logic
      return false;
    }

    state.count += 1;
    localStorage.setItem(LIMIT_KEY, JSON.stringify(state));
    return true;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset UI
    setError(null);
    setResult(null);

    // Check Limit
    if (!checkAndIncrementLimit()) {
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setAnalyzing(true);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = (reader.result as string).split(',')[1];
        const mimeType = file.type;
        
        const analysis = await analyzeMealPhoto(base64String, mimeType);
        setResult(analysis);
        setAnalyzing(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError("Failed to process image.");
      setAnalyzing(false);
    }
    
    // Clear input to allow re-selecting same file
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const triggerSelect = () => fileInputRef.current?.click();

  const closeResult = () => {
    setResult(null);
    setError(null);
  };

  return (
    <>
      <button
        onClick={triggerSelect}
        disabled={analyzing}
        className="flex items-center gap-2 text-xs bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 px-4 py-2 rounded-lg font-bold shadow-md hover:shadow-lg transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Analyze Food Photo"
      >
        {analyzing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Camera className="w-3 h-3" />}
        <span>Photo Analysis</span>
      </button>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />

      {/* Result Modal / Overlay */}
      {(result || error) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden border border-slate-200 dark:border-slate-800">
            
            <div className={`p-4 flex items-center justify-between ${error ? 'bg-rose-50 dark:bg-rose-900/20' : 'bg-emerald-50 dark:bg-emerald-900/20'}`}>
              <h3 className={`font-bold flex items-center gap-2 ${error ? 'text-rose-700 dark:text-rose-300' : 'text-emerald-700 dark:text-emerald-300'}`}>
                {error ? <AlertCircle className="w-5 h-5" /> : <Utensils className="w-5 h-5" />}
                {error ? "Limit Reached" : "Meal Analysis"}
              </h3>
              <button onClick={closeResult} className="text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {error ? (
                <p className="text-slate-600 dark:text-slate-300 text-sm">{error}</p>
              ) : (
                <div className="prose prose-sm dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {result}
                </div>
              )}
              
              {!error && (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 text-center">
                  Estimates generated by AI. Actual values may vary.
                </div>
              )}
            </div>
            
            <div className="p-4 bg-slate-50 dark:bg-slate-950 flex justify-end">
               <button 
                 onClick={closeResult}
                 className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-bold transition-colors"
               >
                 Close
               </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default MealPhotoAnalyzer;
