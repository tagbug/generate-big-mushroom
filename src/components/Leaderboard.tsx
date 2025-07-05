'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { getLeaderboard, LeaderboardEntry, ScoreSavedResult } from '@/utils/leaderboard';
import { useSkin } from '@/contexts/SkinContext';
import { useI18nSkin } from '@/hooks/useI18nSkin';
import { List, User } from 'lucide-react';

interface LeaderboardProps {
  currentScore?: number;
  newRecord?: ScoreSavedResult;
  newRecordSkinId?: string;
  className?: string;
  hasTitle?: boolean;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ 
  currentScore, 
  newRecord,
  newRecordSkinId,
  className = '',
  hasTitle = true
}) => {
  const { t, i18n } = useTranslation();
  const { currentSkin, availableSkins } = useSkin();
  const { getSkinName } = useI18nSkin();
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const [selectedTab, setSelectedTab] = useState<'overall' | 'skin'>('overall');
  const [filter, setFilter] = useState<string | null>(null); // skinId
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 640);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    const data = getLeaderboard(filter);
    setLeaderboardData(data);
  }, [filter]);

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
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const isCurrentEntry = (entry: LeaderboardEntry) => {
    if (selectedTab === 'overall') {
      return currentScore === entry.score && newRecord?.overallRank === entry.rank
    }
    if (selectedTab === 'skin') {
      return filter === newRecordSkinId && currentScore === entry.score && newRecord?.skinRank === entry.rank;
    }
    return false;
  };

  const FilterButton: React.FC<{ tabId: string; name: string; icon: React.ReactNode, onClick: () => void }> = ({ tabId, name, icon, onClick }) => (
    <button
      onClick={onClick}
      className={`relative flex-1 px-2 py-2 text-xs sm:text-sm font-semibold transition-colors duration-50 flex items-center justify-center gap-2 ${
        (tabId === selectedTab) ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-500'
      }`}
    >
      {icon}
      {name}
    </button>
  );

  // 在小屏幕下只显示前3名
  const displayEntries = isSmallScreen ? leaderboardData.slice(0, 3) : leaderboardData;

  return (
    <div className={`bg-white/90 backdrop-blur-sm rounded-xl p-3 sm:p-4 shadow-lg border border-white/20 ${className}`}>
      {hasTitle && <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-sm sm:text-lg font-semibold text-gray-800">
          {t('leaderboard')}
        </h3>
        {leaderboardData.length > 0 && (
          <span className="text-xs sm:text-sm text-gray-500">
            {isSmallScreen && leaderboardData.length > 3 
              ? t('top_scores', { count: 3 }) + `+` 
              : t('top_scores', { count: leaderboardData.length })
            }
          </span>
        )}
      </div>}

      <div className="mb-4 bg-gray-100/80 rounded-lg p-1 flex items-center justify-around">
        <FilterButton
          tabId="overall"
          name={t('leaderboard_overall')}
          icon={<List size={16} />}
          onClick={() => {
            setSelectedTab('overall');
            setFilter(null);
          }}
        />
        <FilterButton
          tabId={"skin"}
          name={t('leaderboard_skin')}
          icon={<User size={16} />}
          onClick={() => {
            setSelectedTab('skin');
            setFilter(newRecordSkinId || currentSkin.id);
          }}
        />
      </div>

      {selectedTab === 'skin' && (
        <div className="mb-4">
          <select
            value={filter || ""}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full p-2 text-sm text-gray-800 bg-white border border-gray-200 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            {availableSkins.map(skin => (
              <option className='text-gray-800' key={skin.id} value={skin.id}>
                {getSkinName(skin.id)}
              </option>
            ))}
          </select>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={filter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {leaderboardData.length === 0 ? (
            <div className="text-center py-4 sm:py-6">
              <div className="text-2xl sm:text-3xl mb-2">🎯</div>
              <p className="text-xs sm:text-sm text-gray-500">
                {t('no_scores_yet')}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {displayEntries.map((entry) => (
                <motion.div
                  key={`${entry.score}-${entry.date}`}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, type: 'spring' }}
                  className={`flex items-center justify-between p-2 sm:p-3 rounded-lg transition-all duration-50 ${
                    isCurrentEntry(entry)
                      ? 'bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-400/50 shadow-md'
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                >
                  <div className="flex items-center gap-2 sm:gap-3 flex-1">
                    <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 font-bold text-gray-600 text-xs sm:text-sm">
                      {getRankIcon(entry.rank)}
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
                            className="text-xs bg-yellow-500 text-white px-1.5 py-0.5 rounded-full font-medium"
                          >
                            {t('new_entry')}
                          </motion.span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        {selectedTab !== 'skin' && <span>{getSkinName(entry.skinId)} •</span>}
                        <span>{formatDate(entry.date)}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
                
              {/* 小屏幕下显示还有更多记录的提示 */}
              {isSmallScreen && leaderboardData.length > 3 && (
                <div className="text-center">
                  <span className="text-xs text-gray-400">
                    {t('and_more', { count: leaderboardData.length - 3 })}
                  </span>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default React.memo(Leaderboard);
