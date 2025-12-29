
import React, { useEffect, useRef } from 'react';

interface AdUnitProps {
  slot: string;
  format?: 'horizontal' | 'rectangle' | 'vertical' | 'auto';
  className?: string;
  label?: string;
}

const AdUnit: React.FC<AdUnitProps> = ({ slot, format = 'auto', className = '', label = 'Advertisement' }) => {
  const isLoaded = useRef(false);
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Prevent double injection in React Strict Mode or fast navigation
    if (isLoaded.current) return;
    
    const initAd = () => {
        try {
            // Check if adsbygoogle is loaded and element is visible/has width
            if (typeof window !== 'undefined' && adRef.current) {
                // Ensure the container has width to prevent "availableWidth=0" error
                if (adRef.current.offsetWidth > 0) {
                    // @ts-ignore
                    (window.adsbygoogle = window.adsbygoogle || []).push({});
                    isLoaded.current = true;
                } else {
                    // Retry once if width is 0 (layout shift or hidden)
                    setTimeout(() => {
                        if (!isLoaded.current && adRef.current && adRef.current.offsetWidth > 0) {
                             // @ts-ignore
                            (window.adsbygoogle = window.adsbygoogle || []).push({});
                            isLoaded.current = true;
                        }
                    }, 500);
                }
            }
        } catch (err) {
            console.error('AdSense error', err);
        }
    };

    // Small delay to allow layout paint
    const timer = setTimeout(initAd, 100);
    return () => clearTimeout(timer);
  }, []);

  const getFormatProps = () => {
    // Map internal formats to AdSense expected styles/attributes
    const baseStyle = { display: 'block', width: '100%' };
    
    switch(format) {
      case 'horizontal': 
        return { style: { ...baseStyle, height: '90px' }, 'data-ad-format': 'horizontal' };
      case 'rectangle': 
        return { style: { ...baseStyle, height: '250px' }, 'data-ad-format': 'rectangle' };
      case 'vertical': 
        return { style: { ...baseStyle, height: '600px' }, 'data-ad-format': 'vertical' };
      case 'auto': 
      default: 
        return { style: baseStyle, 'data-ad-format': 'auto' };
    }
  };

  const adProps = getFormatProps();

  return (
    <div ref={adRef} className={`w-full flex flex-col items-center justify-center my-6 overflow-hidden ${className}`}>
      <div className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-600 mb-1 w-full text-center">{label}</div>
      <div className="w-full bg-slate-100 dark:bg-slate-800/40 rounded-lg flex items-center justify-center relative min-h-[100px]">
        {/* AdSense Unit */}
        <ins 
          className="adsbygoogle"
          {...adProps}
          data-ad-client="ca-pub-2852136268636615" 
          data-ad-slot={slot} 
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
};

export default AdUnit;
