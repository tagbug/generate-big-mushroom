export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  isSecret?: boolean; // 是否是隐藏成就
}

export interface UnlockedAchievement {
  id: string;
  date: string;
}

export type AchievementStatus = Achievement & {
  unlocked: boolean;
  unlockedDate?: string;
};

export interface AchievementContextType {
  achievements: AchievementStatus[];
  unlockAchievement: (id: string) => void;
  newlyUnlocked: Achievement[];
  clearNewlyUnlocked: () => void;
}
