import { UnlockedAchievement } from '@/types/achievements';

const ACHIEVEMENTS_KEY = 'generate-big-mushroom-achievements';

// 获取所有已解锁的成就
export const getUnlockedAchievements = (): UnlockedAchievement[] => {
  try {
    const data = localStorage.getItem(ACHIEVEMENTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading achievements:', error);
    return [];
  }
};

// 保存一个新解锁的成就
export const saveUnlockedAchievement = (id: string): UnlockedAchievement | null => {
  try {
    const unlocked = getUnlockedAchievements();
    if (unlocked.some(ach => ach.id === id)) {
      return null; // 已经解锁了
    }
    const newAchievement: UnlockedAchievement = {
      id,
      date: new Date().toISOString(),
    };
    const updatedAchievements = [...unlocked, newAchievement];
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(updatedAchievements));
    return newAchievement;
  } catch (error) {
    console.error('Error saving achievement:', error);
    return null;
  }
};

// (可选) 用于调试：清除所有成就
export const clearAchievements = (): void => {
  try {
    localStorage.removeItem(ACHIEVEMENTS_KEY);
  } catch (error) {
    console.error('Error clearing achievements:', error);
  }
};
