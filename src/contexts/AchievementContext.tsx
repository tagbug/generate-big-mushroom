'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Achievement, AchievementContextType, AchievementStatus } from '@/types/achievements';
import { ALL_ACHIEVEMENTS } from '@/game/achievements';
import { getUnlockedAchievements, saveUnlockedAchievement } from '@/utils/achievementManager';
import { audioManager } from '@/utils/audioManager';

const AchievementContext = createContext<AchievementContextType | undefined>(undefined);

export const useAchievements = () => {
  const context = useContext(AchievementContext);
  if (!context) {
    throw new Error('useAchievements must be used within an AchievementProvider');
  }
  return context;
};

interface AchievementProviderProps {
  children: ReactNode;
}

export const AchievementProvider: React.FC<AchievementProviderProps> = ({ children }) => {
  const [achievements, setAchievements] = useState<AchievementStatus[]>([]);
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement[]>([]);

  useEffect(() => {
    const unlocked = getUnlockedAchievements();
    const statuses = ALL_ACHIEVEMENTS.map(ach => {
      const unlockedData = unlocked.find(u => u.id === ach.id);
      return {
        ...ach,
        unlocked: !!unlockedData,
        unlockedDate: unlockedData?.date,
      };
    });
    setAchievements(statuses);
  }, []);

  const unlockAchievement = useCallback((id: string) => {
    setAchievements(prevAchievements => {
      const achievement = prevAchievements.find(a => a.id === id);
      if (achievement && !achievement.unlocked) {
        const saved = saveUnlockedAchievement(id);
        if (saved) {
          const fullAchievement = ALL_ACHIEVEMENTS.find(a => a.id === id);
          if (fullAchievement) {
            setNewlyUnlocked(prev => [...prev, fullAchievement]);
            audioManager.play('newRecord'); // 复用新纪录的音效
          }
          return prevAchievements.map(a =>
            a.id === id ? { ...a, unlocked: true, unlockedDate: saved.date } : a
          );
        }
      }
      return prevAchievements;
    });
  }, []);

  const clearNewlyUnlocked = () => {
    setNewlyUnlocked([]);
  };

  const value: AchievementContextType = {
    achievements,
    unlockAchievement,
    newlyUnlocked,
    clearNewlyUnlocked,
  };

  return (
    <AchievementContext.Provider value={value}>
      {children}
    </AchievementContext.Provider>
  );
};
