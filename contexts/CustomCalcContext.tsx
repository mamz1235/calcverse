
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CustomCalculator } from '../types/customCalc';

interface CustomCalcContextType {
  customCalculators: CustomCalculator[];
  saveCustomCalculator: (calc: Omit<CustomCalculator, 'id' | 'createdAt'>) => void;
  deleteCustomCalculator: (id: string) => void;
  getCustomCalculator: (id: string) => CustomCalculator | undefined;
}

const CustomCalcContext = createContext<CustomCalcContextType | undefined>(undefined);
const STORAGE_KEY = 'calcverse_custom_calcs_v1';

export const CustomCalcProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customCalculators, setCustomCalculators] = useState<CustomCalculator[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Failed to load custom calculators", e);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customCalculators));
  }, [customCalculators]);

  const saveCustomCalculator = (calcData: Omit<CustomCalculator, 'id' | 'createdAt'>) => {
    const newCalc: CustomCalculator = {
      ...calcData,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    setCustomCalculators(prev => [newCalc, ...prev]);
  };

  const deleteCustomCalculator = (id: string) => {
    setCustomCalculators(prev => prev.filter(c => c.id !== id));
  };

  const getCustomCalculator = (id: string) => {
    return customCalculators.find(c => c.id === id);
  };

  return (
    <CustomCalcContext.Provider value={{ customCalculators, saveCustomCalculator, deleteCustomCalculator, getCustomCalculator }}>
      {children}
    </CustomCalcContext.Provider>
  );
};

export const useCustomCalc = () => {
  const context = useContext(CustomCalcContext);
  if (context === undefined) {
    throw new Error('useCustomCalc must be used within a CustomCalcProvider');
  }
  return context;
};
