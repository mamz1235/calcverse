
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface WorkspaceTab {
  instanceId: string;
  calculatorId: string;
  label: string; // Cached name to avoid lookup issues
}

interface WorkspaceContextType {
  tabs: WorkspaceTab[];
  activeInstanceId: string | null;
  addTab: (calculatorId: string, label: string) => void;
  closeTab: (instanceId: string) => void;
  switchTab: (instanceId: string) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);
const STORAGE_KEY = 'calcverse_workspace_v1';

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tabs, setTabs] = useState<WorkspaceTab[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  const [activeInstanceId, setActiveInstanceId] = useState<string | null>(() => {
    // Attempt to restore active tab, or pick first if exists
    if (typeof window === 'undefined') return null;
    try {
        const storedTabs = localStorage.getItem(STORAGE_KEY);
        const parsedTabs = storedTabs ? JSON.parse(storedTabs) : [];
        return parsedTabs.length > 0 ? parsedTabs[0].instanceId : null;
    } catch { return null; }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tabs));
  }, [tabs]);

  const addTab = (calculatorId: string, label: string) => {
    // Check if already open (optional - for now let's allow duplicates for comparing scenarios)
    const newTab: WorkspaceTab = {
      instanceId: crypto.randomUUID(),
      calculatorId,
      label
    };
    setTabs(prev => [...prev, newTab]);
    setActiveInstanceId(newTab.instanceId);
  };

  const closeTab = (instanceId: string) => {
    setTabs(prev => {
      const newTabs = prev.filter(t => t.instanceId !== instanceId);
      if (activeInstanceId === instanceId) {
        // If closing active tab, switch to the last one or null
        setActiveInstanceId(newTabs.length > 0 ? newTabs[newTabs.length - 1].instanceId : null);
      }
      return newTabs;
    });
  };

  const switchTab = (instanceId: string) => {
    setActiveInstanceId(instanceId);
  };

  return (
    <WorkspaceContext.Provider value={{ tabs, activeInstanceId, addTab, closeTab, switchTab }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};
