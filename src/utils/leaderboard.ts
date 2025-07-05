export interface LeaderboardEntry {
  score: number;
  date: string;
  skinId: string;
  rank: number;
}

export type ScoreSavedResult = {
  isSkinNewRecord: boolean;
  skinRank: number;
  isOverallNewRecord: boolean;
  overallRank: number;
};

const LEADERBOARD_KEY = 'generate-big-mushroom-leaderboard';
const MAX_ENTRIES = 10;

// 获取所有分数，不进行筛选
const getAllScores = (): Omit<LeaderboardEntry, 'rank'>[] => {
  try {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(LEADERBOARD_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading scores:', error);
    return [];
  }
};

// 获取排行榜，可按皮肤ID筛选
export const getLeaderboard = (skinId?: string | null): LeaderboardEntry[] => {
  let scores = getAllScores();
  if (skinId) {
    scores = scores.filter(entry => entry.skinId === skinId);
  }
  return scores
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_ENTRIES)
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
};

export const saveScore = (score: number, skinId: string): ScoreSavedResult => {
  try {
    if (typeof window === 'undefined') {
      return { isSkinNewRecord: false, skinRank: MAX_ENTRIES + 1, isOverallNewRecord: false, overallRank: MAX_ENTRIES + 1 };
    }
    
    const allScores = getAllScores();
    
    const newEntry: Omit<LeaderboardEntry, 'rank'> = {
      score,
      date: new Date().toISOString(),
      skinId,
    };

    // 添加新分数并保存
    const updatedScores = [...allScores, newEntry];
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updatedScores));

    // 获取特定皮肤的排行榜来确定排名
    const skinLeaderboard = getLeaderboard(skinId);
    const currentEntry = skinLeaderboard.find(entry => 
      entry.score === score && entry.skinId === skinId && entry.date === newEntry.date
    );
    
    const skinRank = currentEntry?.rank || MAX_ENTRIES + 1;
    const isSkinNewRecord = skinRank === 1;

    // 获取总体排行榜
    const overallLeaderboard = getLeaderboard();
    const overallEntry = overallLeaderboard.find(entry => 
      entry.score === score && entry.skinId === skinId && entry.date === newEntry.date
    );

    const overallRank = overallEntry?.rank || MAX_ENTRIES + 1;
    const isOverallNewRecord = overallRank === 1;

    return { isSkinNewRecord: isSkinNewRecord, skinRank: skinRank, isOverallNewRecord: isOverallNewRecord, overallRank: overallRank };
  } catch (error) {
    console.error('Error saving score:', error);
    return { isSkinNewRecord: false, skinRank: MAX_ENTRIES + 1, isOverallNewRecord: false, overallRank: MAX_ENTRIES + 1 };
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
  const leaderboard = getLeaderboard(skinId);
  return leaderboard.length > 0 ? leaderboard[0].score : 0;
};

