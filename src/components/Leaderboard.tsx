'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { LeaderboardEntry } from '@/utils/leaderboard';
import { useSkin } from '@/contexts/SkinContext';
import { useI18nSkin } from '@/hooks/useI18nSkin';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentScore?: number;
  newRecordRank?: number;
  className?: string;
  hasTitle?: boolean;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ 
  entries, 
  currentScore, 
  newRecordRank,
  className = '',
  hasTitle = true
}) => {
  const { t, i18n } = useTranslation();
  const { currentSkin } = useSkin();
  const { getSkinName } = useI18nSkin();
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 640);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language, { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const isCurrentEntry = (entry: LeaderboardEntry) => {
    return currentScore === entry.score && newRecordRank === entry.rank;
  };

  // 在小屏幕下只显示前3名
  const displayEntries = isSmallScreen ? entries.slice(0, 3) : entries;

  return (
    <div className={`bg-white/90 backdrop-blur-sm rounded-xl p-3 sm:p-4 shadow-lg border border-white/20 ${className}`}>
      {hasTitle && <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-sm sm:text-lg font-semibold text-gray-800">
          {t('leaderboard')}
        </h3>
        {entries.length > 0 && (
          <span className="text-xs sm:text-sm text-gray-500">
            {isSmallScreen && entries.length > 3 
              ? t('top_scores', { count: 3 }) + `+` 
              : t('top_scores', { count: entries.length })
            }
          </span>
        )}
      </div>}

      {entries.length === 0 ? (
        <div className="text-center py-4 sm:py-6">
          <div className="text-2xl sm:text-3xl mb-2">🎯</div>
          <p className="text-xs sm:text-sm text-gray-500">
            {t('no_scores_yet')}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {displayEntries.map((entry, index) => (
            <motion.div
              key={`${entry.score}-${entry.date}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center justify-between p-2 sm:p-3 rounded-lg transition-all duration-300 ${
                isCurrentEntry(entry)
                  ? 'bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-400/50 shadow-md'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-3 flex-1">
                <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8">
                  {typeof getRankIcon(entry.rank) === 'string' && getRankIcon(entry.rank).includes('#') ? (
                    <span className="text-xs sm:text-sm font-bold text-gray-600">
                      {getRankIcon(entry.rank)}
                    </span>
                  ) : (
                    <span className="text-sm sm:text-lg">
                      {getRankIcon(entry.rank)}
                    </span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span className="text-sm sm:text-base font-semibold text-gray-800">
                      {entry.score.toLocaleString()}
                    </span>
                    {isCurrentEntry(entry) && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-xs sm:text-sm bg-yellow-500 text-white px-1.5 py-0.5 rounded-full font-medium"
                      >
                        {newRecordRank === 1 ? t('new_record') : t('new_entry')}
                      </motion.span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <span>{getSkinName(entry.skinId)}</span>
                    <span>•</span>
                    <span>{formatDate(entry.date)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          
          {/* 小屏幕下显示还有更多记录的提示 */}
          {isSmallScreen && entries.length > 3 && (
            <div className="text-center">
              <span className="text-xs text-gray-400">
                {t('and_more', { count: entries.length - 3 })}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default React.memo(Leaderboard);
