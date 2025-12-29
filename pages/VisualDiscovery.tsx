
import React, { useState, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home, Activity, Gamepad2, Car, Sparkles, Camera, Rocket, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { visualDiscoveryTranslations } from '../utils/visualDiscoveryTranslations';

// Lazy load 3D components
const InteractiveHouse = React.lazy(() => import('../components/Three/InteractiveHouse').then(module => ({ default: module.InteractiveHouse })));
const InteractiveBody = React.lazy(() => import('../components/Three/InteractiveBody').then(module => ({ default: module.InteractiveBody })));
const InteractiveGaming = React.lazy(() => import('../components/Three/InteractiveGaming').then(module => ({ default: module.InteractiveGaming })));
const InteractiveCar = React.lazy(() => import('../components/Three/InteractiveCar').then(module => ({ default: module.InteractiveCar })));
const InteractiveMedia = React.lazy(() => import('../components/Three/InteractiveMedia').then(module => ({ default: module.InteractiveMedia })));
const InteractiveSolarSystem = React.lazy(() => import('../components/Three/InteractiveSolarSystem').then(module => ({ default: module.InteractiveSolarSystem })));

type SceneType = 'house' | 'body' | 'gaming' | 'car' | 'media' | 'solar';

const VisualDiscovery: React.FC = () => {
    const { t, language } = useLanguage();
    const [activeScene, setActiveScene] = useState<SceneType>('house');
    
    const tVis = visualDiscoveryTranslations[language] || visualDiscoveryTranslations['en'];

    return (
        <div className="animate-fade-in space-y-6 pb-20">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors font-medium mb-2">
                        <ArrowLeft className="w-4 h-4 rtl:rotate-180" /> {t('common.go_home')}
                    </Link>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <Sparkles className="w-8 h-8 text-primary" /> {tVis.title}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">{tVis.subtitle}</p>
                </div>
                
                {/* Scene Switcher */}
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl overflow-x-auto max-w-full no-scrollbar">
                    <button 
                        onClick={() => setActiveScene('house')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeScene === 'house' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                        <Home className="w-4 h-4" /> {tVis.scenes.house}
                    </button>
                    <button 
                        onClick={() => setActiveScene('body')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeScene === 'body' ? 'bg-white dark:bg-slate-700 text-rose-500 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                        <Activity className="w-4 h-4" /> {tVis.scenes.body}
                    </button>
                    <button 
                        onClick={() => setActiveScene('gaming')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeScene === 'gaming' ? 'bg-white dark:bg-slate-700 text-indigo-500 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                        <Gamepad2 className="w-4 h-4" /> {tVis.scenes.gaming}
                    </button>
                    <button 
                        onClick={() => setActiveScene('car')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeScene === 'car' ? 'bg-white dark:bg-slate-700 text-blue-500 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                        <Car className="w-4 h-4" /> {tVis.scenes.car}
                    </button>
                    <button 
                        onClick={() => setActiveScene('media')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeScene === 'media' ? 'bg-white dark:bg-slate-700 text-teal-500 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                        <Camera className="w-4 h-4" /> {tVis.scenes.media}
                    </button>
                    <button 
                        onClick={() => setActiveScene('solar')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeScene === 'solar' ? 'bg-white dark:bg-slate-700 text-orange-500 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                        <Rocket className="w-4 h-4" /> {tVis.scenes.solar}
                    </button>
                </div>
            </div>
            
            <div className="animate-in fade-in zoom-in-95 duration-500 min-h-[600px] relative">
                <Suspense fallback={
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-900 rounded-3xl border border-border">
                        <div className="flex flex-col items-center gap-3">
                            <Loader2 className="w-10 h-10 animate-spin text-primary" />
                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading 3D Environment...</span>
                        </div>
                    </div>
                }>
                    {activeScene === 'house' && <InteractiveHouse />}
                    {activeScene === 'body' && <InteractiveBody />}
                    {activeScene === 'gaming' && <InteractiveGaming />}
                    {activeScene === 'car' && <InteractiveCar />}
                    {activeScene === 'media' && <InteractiveMedia />}
                    {activeScene === 'solar' && <InteractiveSolarSystem />}
                </Suspense>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mt-8">
                <div 
                    onClick={() => setActiveScene('house')} 
                    className={`p-6 rounded-2xl border cursor-pointer transition-all ${activeScene === 'house' ? 'bg-primary/5 border-primary ring-1 ring-primary' : 'bg-card border-border hover:border-primary/50'}`}
                >
                    <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                        <Home className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1">{tVis.cards.house.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{tVis.cards.house.desc}</p>
                </div>

                <div 
                    onClick={() => setActiveScene('body')} 
                    className={`p-6 rounded-2xl border cursor-pointer transition-all ${activeScene === 'body' ? 'bg-rose-500/5 border-rose-500 ring-1 ring-rose-500' : 'bg-card border-border hover:border-rose-500/50'}`}
                >
                    <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
                        <Activity className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1">{tVis.cards.body.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{tVis.cards.body.desc}</p>
                </div>

                <div 
                    onClick={() => setActiveScene('gaming')} 
                    className={`p-6 rounded-2xl border cursor-pointer transition-all ${activeScene === 'gaming' ? 'bg-indigo-500/5 border-indigo-500 ring-1 ring-indigo-500' : 'bg-card border-border hover:border-indigo-500/50'}`}
                >
                    <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                        <Gamepad2 className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1">{tVis.cards.gaming.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{tVis.cards.gaming.desc}</p>
                </div>

                <div 
                    onClick={() => setActiveScene('car')} 
                    className={`p-6 rounded-2xl border cursor-pointer transition-all ${activeScene === 'car' ? 'bg-blue-500/5 border-blue-500 ring-1 ring-blue-500' : 'bg-card border-border hover:border-blue-500/50'}`}
                >
                    <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                        <Car className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1">{tVis.cards.car.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{tVis.cards.car.desc}</p>
                </div>

                <div 
                    onClick={() => setActiveScene('media')} 
                    className={`p-6 rounded-2xl border cursor-pointer transition-all ${activeScene === 'media' ? 'bg-teal-500/5 border-teal-500 ring-1 ring-teal-500' : 'bg-card border-border hover:border-teal-500/50'}`}
                >
                    <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4">
                        <Camera className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1">{tVis.cards.media.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{tVis.cards.media.desc}</p>
                </div>

                <div 
                    onClick={() => setActiveScene('solar')} 
                    className={`p-6 rounded-2xl border cursor-pointer transition-all ${activeScene === 'solar' ? 'bg-orange-500/5 border-orange-500 ring-1 ring-orange-500' : 'bg-card border-border hover:border-orange-500/50'}`}
                >
                    <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-4">
                        <Rocket className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1">{tVis.cards.solar.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{tVis.cards.solar.desc}</p>
                </div>
            </div>
        </div>
    );
};

export default VisualDiscovery;
