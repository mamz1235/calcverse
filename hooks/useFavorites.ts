import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'calcverse_favorites_v1';
const EVENT_KEY = 'favorites-updated';

export const useFavorites = () => {
  // Helper to read from storage
  const getStoredFavorites = (): string[] => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Failed to load favorites", e);
      return [];
    }
  };

  const [favorites, setFavorites] = useState<string[]>(getStoredFavorites);

  useEffect(() => {
    const handleUpdate = () => {
        setFavorites(getStoredFavorites());
    };

    window.addEventListener(EVENT_KEY, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(EVENT_KEY, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    const current = getStoredFavorites();
    const newFavorites = current.includes(id)
      ? current.filter(favId => favId !== id)
      : [...current, id];
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
      window.dispatchEvent(new Event(EVENT_KEY));
      setFavorites(newFavorites);
    } catch (e) {
      console.error("Failed to save favorites", e);
    }
  }, []);

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  return { favorites, toggleFavorite, isFavorite };
};