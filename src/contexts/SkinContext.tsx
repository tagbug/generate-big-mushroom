'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SkinConfig, SkinContextType } from '@/types/skins';
import { AVAILABLE_SKINS, getSkinById } from '@/game/skins';
import { clearEmojiCache } from '@/game/customRenderer';

const SkinContext = createContext<SkinContextType | undefined>(undefined);

export const useSkin = () => {
  const context = useContext(SkinContext);
  if (!context) {
    throw new Error('useSkin must be used within a SkinProvider');
  }
  return context;
};

interface SkinProviderProps {
  children: ReactNode;
}

export const SkinProvider: React.FC<SkinProviderProps> = ({ children }) => {
  const [currentSkin, setCurrentSkin] = useState<SkinConfig>(AVAILABLE_SKINS[0]);

  useEffect(() => {
    // 从本地存储加载皮肤设置
    const savedSkinId = localStorage.getItem('selectedSkin');
    if (savedSkinId) {
      setCurrentSkin(getSkinById(savedSkinId));
    }
  }, []);

  const changeSkin = (skinId: string) => {
    const newSkin = getSkinById(skinId);
    setCurrentSkin(newSkin);
    localStorage.setItem('selectedSkin', skinId);
    
    // 清理 Emoji 缓存，避免旧皮肤残留
    clearEmojiCache();
  };

  const value: SkinContextType = {
    currentSkin,
    availableSkins: AVAILABLE_SKINS,
    changeSkin,
  };

  return (
    <SkinContext.Provider value={value}>
      {children}
    </SkinContext.Provider>
  );
};
