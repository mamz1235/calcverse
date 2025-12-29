
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeDef } from '../types/themes';
import { THEMES } from '../utils/themeRegistry';
import { useKonamiCode } from '../hooks/useKonamiCode';

interface SkinContextType {
  currentTheme: ThemeDef;
  setThemeId: (id: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const SkinContext = createContext<SkinContextType | undefined>(undefined);

const STORAGE_KEY = 'calcverse_theme_id';
const MODE_KEY = 'calcverse_theme_mode'; // 'light' or 'dark'

export const SkinProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme State
  const [currentThemeId, setCurrentThemeId] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY) || 'default';
  });

  // Mode State (Light/Dark) - Independent of theme unless forced
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(MODE_KEY);
    return saved ? saved === 'dark' : true; // Default to dark
  });

  const currentTheme = THEMES.find(t => t.id === currentThemeId) || THEMES[0];

  // Konami Code Detection
  useKonamiCode(() => {
    setCurrentThemeId('matrix');
  });

  // Effect to apply theme variables
  useEffect(() => {
    const root = document.documentElement;
    const palette = isDarkMode ? currentTheme.colors.dark : currentTheme.colors.light;
    
    // Apply Theme ID for Advanced CSS Targeting (Glassmorphism etc)
    root.setAttribute('data-theme', currentTheme.id);

    // Apply Colors
    root.style.setProperty('--color-primary', palette.primary);
    root.style.setProperty('--color-secondary', palette.secondary);
    root.style.setProperty('--bg-main', palette.bgMain);
    root.style.setProperty('--bg-card', palette.bgCard);
    root.style.setProperty('--border-color', palette.border);
    root.style.setProperty('--text-main', palette.textMain);
    root.style.setProperty('--text-muted', palette.textMuted);
    
    // Apply Radius
    root.style.setProperty('--radius-base', currentTheme.radius);

    // Apply Font (using CSS variable to override Tailwind sans stack)
    if (currentTheme.fontFamily) {
      root.style.setProperty('--font-sans', currentTheme.fontFamily);
    } else {
      // Revert to default stack
      root.style.setProperty('--font-sans', "'Inter', 'Cairo', 'Noto Sans Devanagari', sans-serif");
    }

    // Force Mode if Theme requires it
    if (currentTheme.mode === 'dark') {
      root.classList.add('dark');
      if (!isDarkMode) setIsDarkMode(true);
    } else if (currentTheme.mode === 'light') {
      root.classList.remove('dark');
      if (isDarkMode) setIsDarkMode(false);
    } else {
      // System/User choice
      if (isDarkMode) root.classList.add('dark');
      else root.classList.remove('dark');
    }

    localStorage.setItem(STORAGE_KEY, currentThemeId);
    localStorage.setItem(MODE_KEY, isDarkMode ? 'dark' : 'light');

  }, [currentTheme, isDarkMode]);

  const setThemeId = (id: string) => {
    setCurrentThemeId(id);
  };

  const toggleDarkMode = () => {
    // Only allow toggle if theme supports system/both
    if (currentTheme.mode === 'system') {
      setIsDarkMode(prev => !prev);
    }
  };

  return (
    <SkinContext.Provider value={{ currentTheme, setThemeId, isDarkMode, toggleDarkMode }}>
      {children}
    </SkinContext.Provider>
  );
};

export const useSkin = () => {
  const context = useContext(SkinContext);
  if (context === undefined) {
    throw new Error('useSkin must be used within a SkinProvider');
  }
  return context;
};
