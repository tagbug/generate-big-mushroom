'use client';

import { useTranslation } from 'react-i18next';

export const useI18nSkin = () => {
  const { t, i18n } = useTranslation();
  
  const getSkinName = (skinId: string): string => {
    const skins = t('skins', { returnObjects: true }) as any[];
    const skin = skins.find(s => s.id === skinId);
    return skin?.name || skinId;
  };

  const getSkinDescription = (skinId: string): string => {
    const skins = t('skins', { returnObjects: true }) as any[];
    const skin = skins.find(s => s.id === skinId);
    return skin?.desc || '';
  };

  const getItemName = (skinId: string, itemLabel: string): string => {
    const skins = t('skins', { returnObjects: true }) as any[];
    const skin = skins.find(s => s.id === skinId);
    const item = skin?.items?.find((i: any) => i.label === itemLabel);
    return item?.name || itemLabel;
  };

  return {
    getSkinName,
    getSkinDescription,
    getItemName,
    currentLanguage: i18n.language,
  };
};
