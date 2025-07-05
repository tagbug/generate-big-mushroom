'use client';

import React from 'react';
import { Award, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

interface LeaderboardButtonProps {
  onClick: () => void;
}

const LeaderboardButton: React.FC<LeaderboardButtonProps> = ({ onClick }) => {
  return (
    <motion.div
      className="flex items-center gap-1 sm:gap-2 bg-white/80 backdrop-blur-sm rounded-lg p-1 sm:p-2 shadow-lg duration-75"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <motion.button
        onClick={onClick}
        className="p-1 sm:p-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 transition-all duration-75 shadow-md"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Leaderboard"
      >
        <Trophy size={16} className="sm:w-5 sm:h-5" />
      </motion.button>
    </motion.div>
  );
};

export default LeaderboardButton;
