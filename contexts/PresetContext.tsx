
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Preset } from '../types/preset';

interface PresetContextType {
  presets: Preset[];
  addPreset: (name: string, data: Record<string, any>) => void;
  deletePreset: (id: string) => void;
}

const PresetContext = createContext<PresetContextType | undefined>(undefined);
const STORAGE_KEY = 'calcverse_presets_v1';

export const PresetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [presets, setPresets] = useState<Preset[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Failed to load presets", e);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
  }, [presets]);

  const addPreset = (name: string, data: Record<string, any>) => {
    const newPreset: Preset = {
      id: crypto.randomUUID(),
      name,
      data,
      createdAt: Date.now()
    };
    setPresets(prev => [newPreset, ...prev]);
  };

  const deletePreset = (id: string) => {
    setPresets(prev => prev.filter(p => p.id !== id));
  };

  return (
    <PresetContext.Provider value={{ presets, addPreset, deletePreset }}>
      {children}
    </PresetContext.Provider>
  );
};

export const usePresets = () => {
  const context = useContext(PresetContext);
  if (context === undefined) {
    throw new Error('usePresets must be used within a PresetProvider');
  }
  return context;
};
