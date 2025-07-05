export interface LeaderboardEntry {
  score: number;
  date: string;
  skinId: string;
  rank: number;
}

const LEADERBOARD_KEY = 'generate-big-mushroom-leaderboard';
const MAX_ENTRIES = 10;

export const getLeaderboard = (): LeaderboardEntry[] => {
  try {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(LEADERBOARD_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading leaderboard:', error);
    return [];
  }
};

export const saveScore = (score: number, skinId: string): { isNewRecord: boolean; rank: number } => {
  try {
    if (typeof window === 'undefined') {
      return { isNewRecord: false, rank: MAX_ENTRIES + 1 };
    }
    
    const leaderboard = getLeaderboard();
    
    // 检查是否已经存在相同的分数记录（在最近的1秒内）
    const now = new Date();
    const recentEntries = leaderboard.filter(entry => {
      const entryDate = new Date(entry.date);
      const timeDiff = now.getTime() - entryDate.getTime();
      return entry.score === score && entry.skinId === skinId && timeDiff < 1000; // 1秒内
    });
    
    if (recentEntries.length > 0) {
      // 如果已存在相同的最近记录，返回现有记录的信息
      const existingEntry = recentEntries[0];
      const existingRank = leaderboard.findIndex(entry => 
        entry.score === existingEntry.score && 
        entry.date === existingEntry.date && 
        entry.skinId === existingEntry.skinId
      ) + 1;
      
      return { 
        isNewRecord: existingRank === 1, 
        rank: existingRank 
      };
    }
    
    const newEntry: Omit<LeaderboardEntry, 'rank'> = {
      score,
      date: new Date().toISOString(),
      skinId,
    };

    // 添加新分数并排序
    const updatedLeaderboard = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_ENTRIES)
      .map((entry, index) => ({
        ...entry,
        rank: index + 1,
      }));

    // 保存到localStorage
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updatedLeaderboard));

    // 检查是否是新纪录
    const currentEntry = updatedLeaderboard.find(entry => 
      entry.score === score && entry.skinId === skinId && entry.date === newEntry.date
    );
    
    const rank = currentEntry?.rank || MAX_ENTRIES + 1;
    const isNewRecord = rank === 1 && updatedLeaderboard.length > 0;

    return { isNewRecord, rank };
  } catch (error) {
    console.error('Error saving score:', error);
    return { isNewRecord: false, rank: MAX_ENTRIES + 1 };
  }
};

export const clearLeaderboard = (): void => {
  try {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(LEADERBOARD_KEY);
  } catch (error) {
    console.error('Error clearing leaderboard:', error);
  }
};

export const getPersonalBest = (skinId?: string): number => {
  const leaderboard = getLeaderboard();
  if (!skinId) {
    return leaderboard.length > 0 ? leaderboard[0].score : 0;
  }
  
  const skinEntries = leaderboard.filter(entry => entry.skinId === skinId);
  return skinEntries.length > 0 ? skinEntries[0].score : 0;
};
