
'use client';

import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="absolute top-4 right-4">
      <button
        onClick={() => changeLanguage('en')}
        disabled={i18n.language === 'en'}
        className="px-3 py-1 mr-2 text-sm font-semibold text-white bg-blue-500 rounded disabled:bg-gray-400"
      >
        English
      </button>
      <button
        onClick={() => changeLanguage('zh')}
        disabled={i18n.language === 'zh'}
        className="px-3 py-1 text-sm font-semibold text-white bg-green-500 rounded disabled:bg-gray-400"
      >
        中文
      </button>
    </div>
  );
};

export default LanguageSwitcher;
