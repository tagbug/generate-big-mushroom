'use client';

import React, { useState } from 'react';
import { useSkin } from '@/contexts/SkinContext';
import { useI18nSkin } from '@/hooks/useI18nSkin';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, ChevronDown } from 'lucide-react';
import ManiaModeSwitcher from './ManiaModeSwitcher';

const SkinSelector: React.FC = () => {
  const { currentSkin, availableSkins, changeSkin } = useSkin();
  const { getSkinName, getSkinDescription } = useI18nSkin();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleSkinChange = (skinId: string) => {
    changeSkin(skinId);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 sm:gap-2 px-1 sm:px-4 py-1 sm:py-3 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-lg shadow-md hover:from-indigo-600 hover:to-blue-600 transition-all duration-75"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Palette className="w-3 h-3 sm:w-5 sm:h-5" />
        <span className="hidden sm:block text-xs sm:text-sm font-medium whitespace-nowrap">
          {getSkinName(currentSkin.id)}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-52 sm:w-72 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 z-[110] overflow-hidden"
          >
            <div className="p-2 sm:p-0">
              <div className="p-2 sm:p-4">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-3 flex items-center gap-2">
                  <Palette className="w-3 h-3 sm:w-4 sm:h-4" />
                  {t('selectSkin')}
                </h3>
                
                <div className="space-y-2">
                  {availableSkins.map((skin) => (
                    <motion.button
                      key={skin.id}
                      onClick={() => handleSkinChange(skin.id)}
                      className={`w-full text-left p-1 sm:p-3 rounded-lg transition-all duration-200 ${
                        currentSkin.id === skin.id
                          ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 shadow-md'
                          : 'hover:bg-gray-50 border-2 border-transparent'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="flex gap-1">
                          {skin.items.slice(0, 3).map((item, index) => (
                            <motion.div
                              key={index}
                              className="w-4 h-4 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs shadow-sm border border-white/50"
                              style={(!['emoji', 'polygon'].includes(skin.type) ? { backgroundColor: item.color } : {})}
                              whileHover={{ scale: 1.1 }}
                            >
                              {skin.type === 'emoji' && item.emoji ? (
                                <span 
                                  className="text-sm"
                                  style={{ 
                                    fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Emoji", system-ui, sans-serif',
                                  }}
                                >
                                  {item.emoji}
                                </span>
                              ) : skin.type === 'polygon' && item.sides ? (
                                <div 
                                  className="w-4 h-4"
                                  style={{
                                    backgroundColor: item.color,
                                    clipPath: item.sides === 3 ? 'polygon(50% 0%, 0% 100%, 100% 100%)' :
                                             item.sides === 4 ? 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' :
                                             item.sides === 5 ? 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' :
                                             item.sides === 6 ? 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' :
                                             'none'
                                  }}
                                />
                              ) : null}
                            </motion.div>
                          ))}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-xs sm:text-sm text-gray-800">{getSkinName(skin.id)}</div>
                          <div className="text-xs text-gray-500">{getSkinDescription(skin.id)}</div>
                        </div>
                        {currentSkin.id === skin.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 bg-indigo-500 rounded-full"
                          />
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
              <hr />
              {/* Mania Mode Switcher */}
              <ManiaModeSwitcher />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[105]"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SkinSelector;
