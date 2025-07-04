
import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Trophy, Star } from 'lucide-react';

interface GameOverModalProps {
  score: number;
  onRestart: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ score, onRestart }) => {
  const { t } = useTranslation();
  
  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute top-0 left-0 w-full h-full bg-black/60 backdrop-blur-sm flex justify-center items-center z-50"
      >
        <motion.div 
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl text-center border border-white/20 max-w-sm mx-4"
        >
          {/* Animated stars */}
          <div className="relative mb-6">
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
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="mb-6"
          >
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {t('gameOver')}
            </h2>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <p className="text-lg mb-2 text-gray-600">{t('yourScore', { score })}</p>
            <div className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              {score.toLocaleString()}
            </div>
          </motion.div>
          
          <motion.button
            onClick={onRestart}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-semibold shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <RefreshCw className="w-5 h-5" />
            {t('restart')}
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GameOverModal;
