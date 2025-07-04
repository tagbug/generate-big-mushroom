'use client';

import GameContainer from '@/components/GameContainer';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 lg:p-24">
      <LanguageSwitcher />
      <h1 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-8">{t('title')}</h1>
      <GameContainer />
    </main>
  );
}