'use client';

import { useState } from 'react';
import GameContainer from '@/components/GameContainer';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import AudioControls from '@/components/AudioControls';
import { SkinProvider } from '@/contexts/SkinContext';
import { AchievementProvider } from '@/contexts/AchievementContext';
import AchievementToast from '@/components/AchievementToast';
import AchievementModal from '@/components/AchievementModal';
import AchievementsButton from '@/components/AchievementsButton';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export default function Home() {
  const { t } = useTranslation();
  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false);

  return (
    <SkinProvider>
      <AchievementProvider>
        <div className="min-h-screen max-h-screen sm:max-h-max bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(120,119,198,0.3),transparent)] pointer-events-none"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,182,193,0.3),transparent)] pointer-events-none"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_80%,rgba(186,230,253,0.3),transparent)] pointer-events-none"></div>

          {/* Achievement Toast */}
          <AchievementToast />

          {/* Controls - 提高z-index确保可点击 */}
          <div className="fixed top-4 left-4 z-[100]">
            <LanguageSwitcher />
          </div>
          
          <div className="fixed top-4 right-4 z-[100] flex items-center gap-2">
            <AudioControls />
            <AchievementsButton onClick={() => setIsAchievementModalOpen(true)} />
          </div>

          <main className="flex min-h-screen flex-col items-center p-10 sm:p-12 md:p-20 relative z-10">
            {/* <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-1 sm:mb-6 md:mb-8 mt-6 flex flex-col items-center justify-center"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                {t('title')}
              </h1>
              <p className="hidden sm:block text-sm sm:text-base md:text-lg text-gray-600 max-w-xs sm:max-w-md px-4">
                {t('description')}
              </p>
            </motion.div> */}
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative mb-1 sm:mb-6 md:mb-8 mt-6"
            >
              <GameContainer />
            </motion.div>
          </main>

          <AchievementModal 
            isOpen={isAchievementModalOpen}
            onClose={() => setIsAchievementModalOpen(false)}
          />
        </div>
      </AchievementProvider>
    </SkinProvider>
  );
}