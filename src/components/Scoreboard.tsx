
'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

interface ScoreboardProps {
  score: number;
  comboCount?: number;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ score, comboCount = 0 }) => {
  const { t } = useTranslation();
  const hasCombo = comboCount > 0;

  return (
    <motion.div 
      className="relative flex items-center gap-1 sm:gap-2 px-1 sm:px-4 py-1.5 sm:py-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg shadow-lg"
      initial={{ scale: 1 }}
      animate={{ scale: score > 0 ? [1, 1.1, 1] : 1 }}
      transition={{ duration: 0.3 }}
    >
      {hasCombo && (
        <>
          <motion.div
            className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-yellow-400 rounded-lg blur opacity-75"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-0 bg-black/20 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
          />
        </>
      )}
      <Trophy className="relative z-10 w-3 h-3 sm:w-5 sm:h-5 text-white" />
      <span className="relative z-10 text-xs sm:text-sm font-bold text-white whitespace-nowrap">
        {t('score')}: {score.toLocaleString()}
      </span>
    </motion.div>
  );
};

export default React.memo(Scoreboard);
