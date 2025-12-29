
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProjectFolder, FolderCoverType } from '../types/folder';

interface FolderContextType {
  folders: ProjectFolder[];
  createFolder: (name: string, color: string) => void;
  deleteFolder: (id: string) => void;
  renameFolder: (id: string, newName: string) => void;
  updateFolderTheme: (id: string, color: string) => void;
  addCalculatorToFolder: (folderId: string, calculatorId: string) => void;
  removeCalculatorFromFolder: (folderId: string, calculatorId: string) => void;
  getFolder: (id: string) => ProjectFolder | undefined;
}

const FolderContext = createContext<FolderContextType | undefined>(undefined);
const STORAGE_KEY = 'calcverse_folders_v2';

export const FolderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [folders, setFolders] = useState<ProjectFolder[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(folders));
  }, [folders]);

  const createFolder = (name: string, color: string) => {
    const newFolder: ProjectFolder = {
      id: crypto.randomUUID(),
      name: name,
      cover: {
        type: 'color',
        value: color,
        icon: 'Folder'
      },
      calculatorIds: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isShared: false,
      itemCount: 0,
      colorTheme: 'indigo' // Default UI theme
    };
    setFolders(prev => [newFolder, ...prev]);
  };

  const deleteFolder = (id: string) => {
    setFolders(prev => prev.filter(f => f.id !== id));
  };

  const renameFolder = (id: string, newName: string) => {
    setFolders(prev => prev.map(f => f.id === id ? { ...f, name: newName, updatedAt: Date.now() } : f));
  };

  const updateFolderTheme = (id: string, color: string) => {
    setFolders(prev => prev.map(f => f.id === id ? { ...f, cover: { ...f.cover, value: color }, updatedAt: Date.now() } : f));
  };

  const addCalculatorToFolder = (folderId: string, calculatorId: string) => {
    setFolders(prev => prev.map(f => {
      if (f.id === folderId && !f.calculatorIds.includes(calculatorId)) {
        return {
          ...f,
          calculatorIds: [...f.calculatorIds, calculatorId],
          itemCount: f.itemCount + 1,
          updatedAt: Date.now()
        };
      }
      return f;
    }));
  };

  const removeCalculatorFromFolder = (folderId: string, calculatorId: string) => {
    setFolders(prev => prev.map(f => {
      if (f.id === folderId) {
        return {
          ...f,
          calculatorIds: f.calculatorIds.filter(id => id !== calculatorId),
          itemCount: Math.max(0, f.itemCount - 1),
          updatedAt: Date.now()
        };
      }
      return f;
    }));
  };

  const getFolder = (id: string) => folders.find(f => f.id === id);

  return (
    <FolderContext.Provider value={{ 
      folders, 
      createFolder, 
      deleteFolder, 
      renameFolder, 
      updateFolderTheme,
      addCalculatorToFolder, 
      removeCalculatorFromFolder,
      getFolder
    }}>
      {children}
    </FolderContext.Provider>
  );
};

export const useFolders = () => {
  const context = useContext(FolderContext);
  if (context === undefined) {
    throw new Error('useFolders must be used within a FolderProvider');
  }
  return context;
};
