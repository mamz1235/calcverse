
import React, { useMemo, useState, useRef } from 'react';
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
  ReferenceLine
} from 'recharts';
import { MoveHorizontal, Info } from 'lucide-react';

interface Props {
  inputs: Record<string, any>;
  onInputChange: (id: string, value: number) => void;
  currencySymbol: string;
}

const InteractiveBreakEvenChart: React.FC<Props> = ({ inputs, onInputChange, currencySymbol }) => {
  const [isDragging, setIsDragging] = useState(false);
  const chartRef = useRef<any>(null);

  const fixedCost = Number(inputs['fix'] || 0);
  const pricePerUnit = Number(inputs['price'] || 0);
  const varCostPerUnit = Number(inputs['var'] || 0);

  // Safety check to prevent division by zero or negative infinity
  const contributionMargin = pricePerUnit - varCostPerUnit;
  const breakEvenUnits = contributionMargin > 0 ? fixedCost / contributionMargin : 0;
  
  // Define chart domain (X Axis)
  // We show a bit more than the break even point for context
  const maxUnits = Math.max(breakEvenUnits * 2, 100); 
  const domainMax = Math.ceil(maxUnits / 10) * 10;

  // Generate simple 2-point lines for performance and linearity
  const data = useMemo(() => {
    return [
      { units: 0, revenue: 0, totalCost: fixedCost },
      { 
        units: domainMax, 
        revenue: domainMax * pricePerUnit, 
        totalCost: fixedCost + (domainMax * varCostPerUnit) 
      }
    ];
  }, [fixedCost, pricePerUnit, varCostPerUnit, domainMax]);

  const handleMouseMove = (e: any) => {
    if (!isDragging || !e || !e.activeCoordinate) return;

    // Calculate new Units based on mouse X position
    // Recharts doesn't give us direct domain values easily on mouse move without activePayload
    // So we estimate based on the chart layout if possible, or use the activeLabel if available.
    
    // However, e.activeLabel is available in Categorical charts. For numeric XAxis, it might be e.activeLabel or we need to calculate.
    // For numeric axis in Recharts, activeLabel is usually the X value.
    
    const newUnits = Number(e.activeLabel);
    
    if (!isNaN(newUnits) && newUnits > 0) {
      // Reverse Calculate: If Break Even is at `newUnits`, what must Fixed Cost be?
      // BE = Fixed / (Price - Var)
      // Fixed = BE * (Price - Var)
      const newFixedCost = newUnits * contributionMargin;
      
      // Update parent state
      // Round to nearest whole number for cleaner UX
      onInputChange('fix', Math.max(0, Math.round(newFixedCost)));
    }
  };

  const CustomCursor = (props: any) => {
    const { points } = props;
    if (!points || points.length === 0) return null;
    return (
      <line 
        x1={points[0].x} y1={0} 
        x2={points[0].x} y2={1000} 
        stroke="#6366f1" 
        strokeDasharray="3 3" 
        strokeOpacity={0.5} 
      />
    );
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-border p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MoveHorizontal className="w-4 h-4 text-indigo-500" /> 
            Interactive Break-Even Chart
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Drag the dot horizontally to adjust Fixed Costs.
          </p>
        </div>
        <div className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-600 dark:text-slate-300">
           BE: {Math.round(breakEvenUnits)} Units
        </div>
      </div>

      <div 
        className={`h-[300px] w-full select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseLeave={() => setIsDragging(false)}
        onMouseUp={() => setIsDragging(false)}
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            ref={chartRef}
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            onMouseDown={() => setIsDragging(true)}
            onMouseMove={handleMouseMove}
            onMouseUp={() => setIsDragging(false)}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis 
              dataKey="units" 
              type="number" 
              domain={[0, domainMax]} 
              allowDataOverflow={false}
              label={{ value: 'Units Sold', position: 'insideBottom', offset: -10, fontSize: 12, fill: '#94a3b8' }}
              stroke="#94a3b8"
              tick={{ fontSize: 10 }}
            />
            <YAxis 
              label={{ value: 'Currency', angle: -90, position: 'insideLeft', fontSize: 12, fill: '#94a3b8' }} 
              stroke="#94a3b8"
              tick={{ fontSize: 10 }}
              tickFormatter={(val) => `${currencySymbol}${val}`}
            />
            
            <Tooltip 
              cursor={<CustomCursor />}
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px', fontSize: '12px' }}
              itemStyle={{ color: '#fff' }}
              labelFormatter={(val) => `Units: ${Math.round(val)}`}
              formatter={(value: number) => [`${currencySymbol}${value.toLocaleString()}`]}
            />

            {/* Revenue Line */}
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#10b981" 
              strokeWidth={2} 
              name="Revenue" 
              dot={false}
              activeDot={false}
              isAnimationActive={false}
            />

            {/* Total Cost Line */}
            <Line 
              type="monotone" 
              dataKey="totalCost" 
              stroke="#ef4444" 
              strokeWidth={2} 
              name="Total Cost" 
              dot={false}
              activeDot={false}
              isAnimationActive={false}
            />

            {/* Break-Even Dot (Interactive) */}
            <ReferenceDot 
              x={breakEvenUnits} 
              y={breakEvenUnits * pricePerUnit} 
              r={8} 
              fill="#6366f1" 
              stroke="#fff"
              strokeWidth={2}
              style={{ cursor: 'pointer' }}
            >
              {/* Optional label directly on chart */}
            </ReferenceDot>
            
            {/* Visual Guide for Fixed Cost Y-Intercept */}
             <ReferenceDot 
              x={0} 
              y={fixedCost} 
              r={4} 
              fill="#ef4444" 
              stroke="none"
            />
            
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-2 flex justify-center gap-6 text-xs font-medium text-slate-500">
         <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Revenue
         </div>
         <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span> Total Costs
         </div>
         <div className="flex items-center gap-1 text-indigo-500">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Break-Even Point
         </div>
      </div>
    </div>
  );
};

export default InteractiveBreakEvenChart;
