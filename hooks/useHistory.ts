import { useState, useEffect } from 'react';
import { HistoryItem, CalculationResult } from '../types';

const STORAGE_KEY = 'calcverse_history_v1';

export const useHistory = (calculatorId: string) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: HistoryItem[] = JSON.parse(stored);
        // Filter for specific calculator
        setHistory(parsed.filter(item => item.calculatorId === calculatorId));
      }
    } catch (e) {
      console.error("Failed to load history", e);
    }
  }, [calculatorId]);

  const saveEntry = (inputs: Record<string, any>, result: CalculationResult) => {
    const newItem: HistoryItem = {
      id: crypto.randomUUID(),
      calculatorId,
      timestamp: Date.now(),
      inputs: { ...inputs }, // Snapshot inputs
      result: { ...result }  // Snapshot result
    };

    setHistory(prev => {
      const updated = [newItem, ...prev];
      // Save to global storage
      try {
        const globalStored = localStorage.getItem(STORAGE_KEY);
        const globalParsed: HistoryItem[] = globalStored ? JSON.parse(globalStored) : [];
        const newGlobal = [newItem, ...globalParsed].slice(0, 100); // Limit total global history
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newGlobal));
      } catch (e) {
        console.error("Failed to save history", e);
      }
      return updated;
    });
  };

  const deleteEntry = (id: string) => {
    setHistory(prev => {
      const updated = prev.filter(i => i.id !== id);
      try {
        const globalStored = localStorage.getItem(STORAGE_KEY);
        if (globalStored) {
          const globalParsed: HistoryItem[] = JSON.parse(globalStored);
          const newGlobal = globalParsed.filter(i => i.id !== id);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newGlobal));
        }
      } catch (e) { console.error(e); }
      return updated;
    });
  };

  return { history, saveEntry, deleteEntry };
};
