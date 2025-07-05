'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAchievements } from '@/contexts/AchievementContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useI18nAchievement } from '@/hooks/useI18nAchievement';

const AchievementToast: React.FC = () => {
  const { newlyUnlocked, clearNewlyUnlocked } = useAchievements();
  const { t } = useTranslation();
  const { getAchievementName } = useI18nAchievement();

  useEffect(() => {
    if (newlyUnlocked.length > 0) {
      const timer = setTimeout(() => {
        clearNewlyUnlocked();
      }, 5000); // 5秒后自动消失
      return () => clearTimeout(timer);
    }
  }, [newlyUnlocked, clearNewlyUnlocked]);

  if (newlyUnlocked.length === 0 || typeof window === 'undefined') {
    return null;
  }

  const toastContent = (
    <div className="fixed top-2 sm:top-4 right-2 sm:right-4 z-[9999]">
      <AnimatePresence>
        {newlyUnlocked.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            // style={{ marginTop: index > 0 ? '1rem' : '0' }}
            className="bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl shadow-lg sm:shadow-2xl border border-yellow-300/50 p-4 max-w-sm w-full flex items-start gap-2 sm:gap-4 mb-2 sm:mb-4"
          >
            <div className="flex-shrink-0 text-yellow-500 bg-yellow-100 p-1 sm:p-2 rounded-full">
              <Award size={24} className='w-4 h-4 sm:w-6 sm:h-6' />
            </div>
            <div className="flex-grow">
              <h3 className="text-sm sm:text-base font-bold text-gray-800">{t('achievement_unlocked')}</h3>
              <p className="text-xs sm:text-sm text-gray-600">{getAchievementName(achievement.id)}</p>
            </div>
            <button
              onClick={clearNewlyUnlocked}
              className="p-0.5 sm:p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <X size={18} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );

  return createPortal(toastContent, document.body);
};

export default AchievementToast;
