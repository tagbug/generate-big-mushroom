
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Trophy, Star, Award } from 'lucide-react';
import { getLeaderboard, saveScore, LeaderboardEntry } from '@/utils/leaderboard';
import { useSkin } from '@/contexts/SkinContext';
import Leaderboard from './Leaderboard';
import { audioManager } from '@/utils/audioManager';

interface GameOverModalProps {
  score: number;
  onRestart: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ score, onRestart }) => {
  const { t } = useTranslation();
  const { currentSkin } = useSkin();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [newRecordRank, setNewRecordRank] = useState<number | undefined>();
  const [hasPlayedSound, setHasPlayedSound] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // 只在第一次加载时保存分数和获取排行榜
    if (!hasInitialized) {
      const result = saveScore(score, currentSkin.id);
      const updatedLeaderboard = getLeaderboard();
      
      setLeaderboard(updatedLeaderboard);
      setIsNewRecord(result.isNewRecord);
      setNewRecordRank(result.rank);
      setHasInitialized(true);

      // 播放音效
      if (result.isNewRecord) {
        audioManager.playNewRecord();
      } else if (result.rank <= 10) {
        audioManager.playGameOver();
      }
    }
  }, [score, currentSkin.id, hasInitialized]);
  
  if (!mounted) {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-100 p-4"
      >
        <motion.div 
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-white/95 backdrop-blur-md p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl text-center border border-white/20 max-w-md w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Animated stars */}
          <div className="relative mb-4 sm:mb-6">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${-10 + Math.sin(i) * 10}px`,
                }}
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              >
                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400" />
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="mb-0 sm:mb-6"
          >
            <Trophy className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-500 mx-auto mb-2 sm:mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold mb-0 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {t('gameOver')}
            </h2>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-2 sm:mb-6 flex flex-row gap-2 items-center justify-center"
          >
            {/* <p className="text-base sm:text-lg mb-2 text-gray-600">{t('yourScore', { score })}</p> */}
            <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              {score.toLocaleString()}
            </div>
            {isNewRecord && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-sm sm:text-base font-semibold text-yellow-600"
              >
                {newRecordRank === 1 ? t('new_record') : t('new_entry')}
              </motion.div>
            )}
          </motion.div>

          {/* 排行榜 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-4 sm:mb-6"
          >
            <Leaderboard 
              entries={leaderboard} 
              currentScore={score}
              newRecordRank={newRecordRank}
            />
          </motion.div>
          
          <motion.button
            onClick={onRestart}
            className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-semibold shadow-lg hover:from-green-600 hover:to-teal-600 transition-all duration-50 mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
            {t('restart')}
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default GameOverModal;
