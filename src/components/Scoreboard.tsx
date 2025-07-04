
import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

interface ScoreboardProps {
  score: number;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ score }) => {
  const { t } = useTranslation();
  
  return (
    <motion.div 
      className="flex items-center gap-1 sm:gap-2 px-1 sm:px-4 py-1.5 sm:py-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg shadow-lg"
      initial={{ scale: 1 }}
      animate={{ scale: score > 0 ? [1, 1.1, 1] : 1 }}
      transition={{ duration: 0.3 }}
    >
      <Trophy className="w-3 h-3 sm:w-6 sm:h-6 text-white" />
      <span className="text-xs sm:text-lg md:text-xl font-bold text-white whitespace-nowrap">
        {t('score')}: {score.toLocaleString()}
      </span>
    </motion.div>
  );
};

export default React.memo(Scoreboard);
