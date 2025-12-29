
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CalculationResult } from '../types';

export interface ComparisonItem {
  id: string;
  calculatorId: string;
  calculatorName: string;
  timestamp: number;
  inputs: Record<string, any>;
  result: CalculationResult;
}

interface ComparisonContextType {
  items: ComparisonItem[];
  addItem: (calculatorId: string, calculatorName: string, inputs: Record<string, any>, result: CalculationResult) => void;
  removeItem: (id: string) => void;
  clearItems: () => void;
  isInComparison: (inputs: Record<string, any>) => boolean;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

const STORAGE_KEY = 'calcverse_compare_workspace_v1';

export const ComparisonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<ComparisonItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Failed to load comparison workspace", e);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (calculatorId: string, calculatorName: string, inputs: Record<string, any>, result: CalculationResult) => {
    if (items.length >= 3) {
      // Optional: Alert user or replace oldest
      return;
    }
    const newItem: ComparisonItem = {
      id: crypto.randomUUID(),
      calculatorId,
      calculatorName,
      timestamp: Date.now(),
      inputs: { ...inputs },
      result: { ...result }
    };
    setItems(prev => [...prev, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const clearItems = () => {
    setItems([]);
  };

  const isInComparison = (inputs: Record<string, any>) => {
    // Simple deep equality check for inputs to see if this scenario is already pinned
    return items.some(item => JSON.stringify(item.inputs) === JSON.stringify(inputs));
  };

  return (
    <ComparisonContext.Provider value={{ items, addItem, removeItem, clearItems, isInComparison }}>
      {children}
    </ComparisonContext.Provider>
  );
};

export const useComparison = () => {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
};
