
import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

// Lazy load
const InteractiveHouse = React.lazy(() => import('../components/Three/InteractiveHouse').then(module => ({ default: module.InteractiveHouse })));

const HouseExplore: React.FC = () => {
    const { t } = useLanguage();
    
    return (
        <div className="animate-fade-in space-y-4 h-full">
             <div>
                <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors font-medium">
                <ArrowLeft className="w-4 h-4 rtl:rotate-180" /> {t('common.go_home')}
                </Link>
            </div>
            <div className="relative h-[85vh] w-full rounded-3xl border border-border overflow-hidden">
                <Suspense fallback={
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-900">
                        <div className="flex flex-col items-center gap-3">
                            <Loader2 className="w-10 h-10 animate-spin text-primary" />
                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading House...</span>
                        </div>
                    </div>
                }>
                    <InteractiveHouse />
                </Suspense>
            </div>
        </div>
    );
};

export default HouseExplore;
