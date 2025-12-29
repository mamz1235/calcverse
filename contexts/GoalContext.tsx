
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Goal } from '../types';
import { useLanguage } from './LanguageContext';
import { GOAL_TRANSLATIONS } from '../utils/goalTranslations';

interface GoalContextType {
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  requestNotificationPermission: () => Promise<boolean>;
}

const GoalContext = createContext<GoalContextType | undefined>(undefined);

const STORAGE_KEY = 'calcverse_goals_v1';

export const GoalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language } = useLanguage();
  const t = (key: string) => GOAL_TRANSLATIONS[language]?.[key] || GOAL_TRANSLATIONS['en'][key];

  const [goals, setGoals] = useState<Goal[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Failed to load goals", e);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
  }, [goals]);

  // Check for notification triggers on mount
  useEffect(() => {
    const triggerNotifications = async () => {
        if (goals.length === 0) return;
        if (!('Notification' in window)) return;
        if (Notification.permission !== 'granted') return;

        // Simple logic: If it's been a while, remind about a random goal
        const lastNotif = localStorage.getItem('last_goal_notif');
        const now = Date.now();
        // 24 hours cooldown
        if (!lastNotif || now - parseInt(lastNotif) > 86400000) {
             const randomGoal = goals[Math.floor(Math.random() * goals.length)];
             const progress = Math.min(100, Math.max(0, (randomGoal.currentValue / randomGoal.targetValue) * 100));
             
             new Notification(t('notifUpdate').replace('{title}', randomGoal.title), {
                 body: t('notifProgress').replace('{progress}', progress.toFixed(0)),
                 icon: '/vite.svg'
             });
             localStorage.setItem('last_goal_notif', now.toString());
        }
    };
    triggerNotifications();
  }, [goals, language]); // Added language dep to ensure fresh translation if language changes (though notifications are usually once-off)

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) return false;
    if (Notification.permission === 'granted') return true;
    const result = await Notification.requestPermission();
    return result === 'granted';
  };

  const addGoal = (goalData: Omit<Goal, 'id' | 'createdAt'>) => {
    const newGoal: Goal = {
      ...goalData,
      id: crypto.randomUUID(),
      createdAt: Date.now()
    };
    setGoals(prev => [newGoal, ...prev]);
    
    // Trigger an immediate "Goal Set" notification if permissible
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(t('notifSet'), {
            body: t('notifStarted').replace('{title}', newGoal.title),
        });
    }
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  return (
    <GoalContext.Provider value={{ goals, addGoal, updateGoal, deleteGoal, requestNotificationPermission }}>
      {children}
    </GoalContext.Provider>
  );
};

export const useGoals = () => {
  const context = useContext(GoalContext);
  if (context === undefined) {
    throw new Error('useGoals must be used within a GoalProvider');
  }
  return context;
};
