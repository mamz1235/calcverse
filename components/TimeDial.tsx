
import React, { useState, useRef, useEffect } from 'react';
import { History, RotateCw } from 'lucide-react';

interface Props {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  label?: string;
}

const TimeDial: React.FC<Props> = ({ value, onChange, min = 1, max = 50, label = "Time Horizon" }) => {
  const dialRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [angle, setAngle] = useState(0);
  
  // Convert value to angle (0 to 360)
  // Maps min-max to 0-300 degrees (leaving a gap at bottom)
  useEffect(() => {
    const range = max - min;
    const percentage = (value - min) / range;
    setAngle(percentage * 300);
  }, [value, min, max]);

  const handleInteraction = (clientX: number, clientY: number) => {
    if (!dialRef.current) return;
    const rect = dialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate angle from center
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    
    // ATAN2 returns -PI to PI. Convert to degrees.
    // 0 is usually 3 o'clock. We want 0 to be ~7 o'clock for a dial start.
    let deg = Math.atan2(dy, dx) * (180 / Math.PI);
    
    // Rotate so 0 is at bottom left (-120deg visual start)
    deg = (deg + 90 + 360) % 360;
    
    // Constrain to 0-300 range (approx)
    // This simple logic maps the radial movement to value
    // Let's simplify: treat it like a volume knob
    // Just map rotation to value based on start point
    
    // Simplified: value increases clockwise
    // Shift degree frame
    let effectiveDeg = deg - 150; // Offset start
    if (effectiveDeg < 0) effectiveDeg += 360;
    
    // Clamp
    if (effectiveDeg > 300) effectiveDeg = 300; 
    
    // Convert back to value
    const range = max - min;
    const newValue = Math.round(min + (effectiveDeg / 300) * range);
    
    if (newValue >= min && newValue <= max) {
        onChange(newValue);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleInteraction(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      handleInteraction(e.clientX, e.clientY);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-border select-none">
       <div className="flex items-center gap-2 mb-4 text-slate-500 font-bold text-xs uppercase tracking-widest">
          <History className="w-4 h-4" /> {label}
       </div>
       
       <div className="relative w-40 h-40">
          {/* Dial Background */}
          <div className="absolute inset-0 rounded-full bg-slate-200 dark:bg-slate-800 border-4 border-slate-300 dark:border-slate-700 shadow-inner"></div>
          
          {/* Dial Ticks */}
          {Array.from({ length: 12 }).map((_, i) => (
             <div 
                key={i} 
                className="absolute w-1 h-3 bg-slate-400 dark:bg-slate-600 rounded-full top-2 left-1/2 -translate-x-1/2 origin-[50%_72px]"
                style={{ transform: `translateX(-50%) rotate(${i * 30}deg)` }}
             ></div>
          ))}

          {/* Interactive Knob */}
          <div 
             ref={dialRef}
             onMouseDown={handleMouseDown}
             className="absolute top-1/2 left-1/2 w-24 h-24 -mt-12 -ml-12 bg-gradient-to-br from-slate-100 to-slate-300 dark:from-slate-700 dark:to-slate-900 rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.3)] cursor-grab active:cursor-grabbing flex items-center justify-center border border-slate-200 dark:border-slate-600"
             style={{ transform: `rotate(${angle - 150}deg)` }}
          >
             {/* Indicator Dot */}
             <div className="w-2 h-2 bg-primary rounded-full absolute top-3 shadow-[0_0_8px_currentColor]"></div>
             
             {/* Center Label inside rotating knob (counter-rotated to stay upright) */}
             <div className="text-xl font-bold text-slate-700 dark:text-white" style={{ transform: `rotate(${-(angle - 150)}deg)` }}>
                {value}
             </div>
          </div>
          
          {/* Label under */}
          <div className="absolute -bottom-2 w-full text-center text-xs font-bold text-slate-400">
             YEARS
          </div>
       </div>
       
       <div className="flex justify-between w-full mt-2 px-2 text-xs text-slate-400 font-mono">
          <span>{min}y</span>
          <span>{Math.round((max+min)/2)}y</span>
          <span>{max}y</span>
       </div>
    </div>
  );
};

export default TimeDial;
