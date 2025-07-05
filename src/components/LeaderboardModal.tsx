'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Eye, X } from 'lucide-react';
import { getLeaderboard, LeaderboardEntry } from '@/utils/leaderboard';
import { useSkin } from '@/contexts/SkinContext';
import Leaderboard from './Leaderboard';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { currentSkin } = useSkin();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    // 只在第一次加载时获取排行榜
    if (!hasInitialized) {
      setLeaderboard(getLeaderboard());
      setHasInitialized(true);
    }
  }, [currentSkin.id, hasInitialized]);
  
  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-100 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl text-center border border-white/20 max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="flex items-center justify-between p-2.5 sm:p-4 border-b border-gray-200">
              <h2 className="text-md sm:text-2xl font-bold text-gray-800">{t('leaderboard')}</h2>
              <button
                onClick={onClose}
                className="p-1 sm:p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <X size={18} className="sm:w-5 sm:h-5" />
              </button>
            </header>
            {/* 排行榜 */}
            <div className="p-2 sm:p-4 flex-grow overflow-y-auto">
              <Leaderboard
                entries={leaderboard}
                hasTitle={false}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default LeaderboardModal;
