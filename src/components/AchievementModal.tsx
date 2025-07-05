'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import { useAchievements } from '@/contexts/AchievementContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Unlock, EyeOff } from 'lucide-react';
import { AchievementStatus } from '@/types/achievements';
import { useTranslation } from 'react-i18next';
import { useI18nAchievement } from '@/hooks/useI18nAchievement';

interface AchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AchievementCard: React.FC<{ achievement: AchievementStatus }> = ({ achievement }) => {
  const isSecretAndLocked = achievement.isSecret && !achievement.unlocked;
  const { t, i18n } = useTranslation();
  const { getAchievementName, getAchievementDescription } = useI18nAchievement();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`p-2 sm:p-4 rounded-md sm:rounded-lg border-2 transition-all duration-300 ${
        achievement.unlocked
          ? 'bg-yellow-50 border-yellow-300 shadow-md sm:shadow-lg'
          : 'bg-gray-100 border-gray-200'
      }`}
    >
      <div className="flex items-center gap-2 sm:gap-4">
        <div className={`text-lg sm:text-3xl ${achievement.unlocked ? '' : 'opacity-50'}`}>
          {isSecretAndLocked ? '❓' : achievement.icon}
        </div>
        <div className="flex-1">
          <h3 className={`text-xs sm:text-base font-bold ${achievement.unlocked ? 'text-yellow-800' : 'text-gray-600'}`}>
            {isSecretAndLocked ? t('secret_achievement') : getAchievementName(achievement.id)}
          </h3>
          <p className="text-[0.625rem] sm:text-sm text-gray-500">
            {isSecretAndLocked ? t('secret_achievement_desc') : getAchievementDescription(achievement.id)}
          </p>
        </div>
        <div className="flex flex-col items-center">
          {achievement.unlocked ? (
            <Unlock className="text-green-500 w-4 h-4 sm:w-5 sm:h-5" />
          ) : (
            <Lock className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
          )}
          {achievement.isSecret && !achievement.unlocked && (
            <EyeOff size={16} className="text-xs sm:text-base text-gray-400 mt-1">
              <title>{t('secret_achievement')}</title>
            </EyeOff>
          )}
        </div>
      </div>
      {achievement.unlockedDate && (
        <p className="text-[0.625rem] sm:text-sm text-right text-gray-400 mt-2">
          {t('unlocked_on', { date: new Date(achievement.unlockedDate).toLocaleDateString(i18n.language) })}
        </p>
      )}
    </motion.div>
  );
};

const AchievementModal: React.FC<AchievementModalProps> = ({ isOpen, onClose }) => {
  const { achievements } = useAchievements();
  const { t } = useTranslation();

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[9999] p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="bg-white/95 backdrop-blur-md rounded-lg sm:rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="flex items-center justify-between p-2 sm:p-6 border-b border-gray-200">
              <h2 className="text-sm sm:text-2xl font-bold text-gray-800">{t('achievements')}</h2>
              <button
                onClick={onClose}
                className="p-0.5 sm:p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <X size={18} className="sm:w-6 sm:h-6" />
              </button>
            </header>
            <div className="p-3 sm:p-6 flex-grow overflow-y-auto">
              <div className="flex justify-between items-center mb-2 sm:mb-6">
                <p className="text-xs sm:text-base font-semibold text-gray-700">
                  {t('progress')}: {unlockedCount} / {totalCount}
                </p>
                <div className="w-1/2 bg-gray-200 rounded-full h-2 sm:h-4">
                  <motion.div
                    className="bg-yellow-400 h-2 sm:h-4 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(unlockedCount / totalCount) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
              <div className="space-y-2 sm:space-y-4">
                {achievements.map(ach => (
                  <AchievementCard key={ach.id} achievement={ach} />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default AchievementModal;
