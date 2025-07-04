
'use client';

import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <motion.div 
      className="flex items-center gap-1 sm:gap-2 bg-white/80 backdrop-blur-sm rounded-lg p-0.5 sm:p-2 shadow-lg border border-white/20"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Globe size={16} className="sm:w-5 sm:h-5 text-gray-600" />
      <div className="flex items-center gap-1">
        <motion.button
          onClick={() => changeLanguage('en')}
          className={`px-1 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-semibold rounded-md transition-all duration-200 ${
            i18n.language === 'en'
              ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-md'
              : 'text-gray-600 hover:text-green-500 hover:bg-green-50'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={i18n.language === 'en'}
        >
          EN
        </motion.button>
        <motion.button
          onClick={() => changeLanguage('zh')}
          className={`px-1 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-semibold rounded-md transition-all duration-200 ${
            i18n.language === 'zh'
              ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-md'
              : 'text-gray-600 hover:text-green-500 hover:bg-green-50'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={i18n.language === 'zh'}
        >
          中文
        </motion.button>
      </div>
    </motion.div>
  );
};

export default LanguageSwitcher;
