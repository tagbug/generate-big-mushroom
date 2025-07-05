import { useTranslation } from 'react-i18next';

export const useI18nAchievement = () => {
  const { t, i18n } = useTranslation();

  const getAchievementName = (achievementId: string): string => {
    const achievements = t('achievement_items', { returnObjects: true }) as any[];
    const achievement = achievements.find(a => a.id === achievementId);
    return achievement?.name || achievementId;
  };

  const getAchievementDescription = (achievementId: string): string => {
    const achievements = t('achievement_items', { returnObjects: true }) as any[];
    const achievement = achievements.find(a => a.id === achievementId);
    return achievement?.description || '';
  };

  return {
    getAchievementName,
    getAchievementDescription,
    currentLanguage: i18n.language,
  };
};
