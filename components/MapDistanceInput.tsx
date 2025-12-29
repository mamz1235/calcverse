
import React, { useState } from 'react';
import { MapPin, Navigation, Loader2 } from 'lucide-react';

interface Props {
  onDistanceFound: (km: number) => void;
  currentValue: number;
}

const MapDistanceInput: React.FC<Props> = ({ onDistanceFound, currentValue }) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mapUrl, setMapUrl] = useState('');

  const handleCalculateDistance = async () => {
    if (!origin || !destination) return;
    setLoading(true);
    setError('');

    // Update map URL to show route
    const newMapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(origin)}+to+${encodeURIComponent(destination)}&t=&z=10&ie=UTF8&iwloc=&output=embed`;
    setMapUrl(newMapUrl);

    try {
       const response = await fetch('/api/distance', {
           method: 'POST',
           headers: {
               'Content-Type': 'application/json',
           },
           body: JSON.stringify({ origin, destination }),
       });
       
       if (!response.ok) {
           throw new Error('API request failed');
       }

       const apiData = await response.json();
       const text = apiData.text || '';
       const dist = parseFloat(text.replace(/[^0-9.]/g, ''));
       
       if (!isNaN(dist) && dist > 0) {
           onDistanceFound(dist);
       } else {
           setError("Could not calculate distance.");
       }
    } catch (e) {
        console.error(e);
        setError("Connection failed.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 border border-border rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <Navigation className="w-3 h-3" /> Trip Distance Estimator
        </div>
        
        <div className="grid grid-cols-2 gap-2">
            <div className="relative">
                <MapPin className="absolute left-2 top-2.5 w-4 h-4 text-indigo-500" />
                <input 
                    type="text" 
                    placeholder="Origin (City)" 
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-white dark:bg-slate-800 border border-border rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none"
                    onKeyDown={(e) => e.key === 'Enter' && handleCalculateDistance()}
                />
            </div>
            <div className="relative">
                <MapPin className="absolute left-2 top-2.5 w-4 h-4 text-rose-500" />
                <input 
                    type="text" 
                    placeholder="Destination" 
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-white dark:bg-slate-800 border border-border rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none"
                    onKeyDown={(e) => e.key === 'Enter' && handleCalculateDistance()}
                />
            </div>
        </div>
        
        <button 
            onClick={handleCalculateDistance}
            disabled={loading || !origin || !destination}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors"
        >
            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Navigation className="w-3 h-3" />}
            {loading ? 'Calculating Route...' : 'Get Distance & Route'}
        </button>
        
        {error && <div className="text-xs text-rose-500 text-center">{error}</div>}
        
        {/* Map Visual */}
        <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-lg overflow-hidden relative flex items-center justify-center border border-border">
            {mapUrl ? (
                <iframe 
                    width="100%" 
                    height="100%" 
                    src={mapUrl} 
                    frameBorder="0" 
                    scrolling="no" 
                    marginHeight={0} 
                    marginWidth={0}
                    title="Route Map"
                    className="opacity-90 hover:opacity-100 transition-opacity"
                ></iframe>
            ) : (
                <div className="flex flex-col items-center gap-2 text-slate-400">
                     <MapPin className="w-6 h-6 opacity-50" />
                     <div className="text-xs font-mono">Enter locations to view map</div>
                </div>
            )}
        </div>
    </div>
  );
};

export default MapDistanceInput;
