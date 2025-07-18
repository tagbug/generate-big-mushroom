'use client';

import React from 'react';
import { useSkin } from '@/contexts/SkinContext';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Zap, Sparkle } from 'lucide-react';
import { audioManager } from '@/utils/audioManager';

const ManiaModeSwitcher: React.FC = () => {
  const { maniaMode, toggleManiaMode, reduceManiaEffect, setReduceManiaEffect } = useSkin();
  const { t } = useTranslation();

  return (
    <div className="p-1 sm:p-4">
      <div
        onClick={() => {
          toggleManiaMode();
          if (!maniaMode) {
            audioManager.playMania();
          }
        }}
        className="flex items-center justify-between cursor-pointer p-1 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <Zap className={`w-3 h-3 sm:w-5 sm:h-5 transition-colors ${maniaMode ? 'text-yellow-500' : 'text-gray-400'}`} />
          <div>
            <div className="font-medium text-[12px] sm:text-sm text-gray-800">{t('mania_mode')}</div>
            <div className="text-[10px] sm:text-xs text-gray-500">{t('mania_mode_desc')}</div>
          </div>
        </div>
        <div
          className={`w-8 h-4 sm:w-12 sm:h-7 flex items-center rounded-full p-0.5 transition-colors duration-300 ${
            maniaMode ? 'bg-gradient-to-r from-yellow-400 to-orange-400' : 'bg-gray-300'
          }`}
        >
          <motion.div
            className="w-3 h-3 sm:w-5 sm:h-5 bg-white rounded-full shadow-md"
            layout
            transition={{ type: 'spring', stiffness: 700, damping: 30 }}
            style={{
              marginLeft: maniaMode ? 'auto' : '0',
              marginRight: maniaMode ? '0' : 'auto',
            }}
          />
        </div>
      </div>
      {maniaMode && (
        <div
          onClick={() => {
            setReduceManiaEffect(prev => !prev);
          }}
          className="flex items-center justify-between cursor-pointer p-1 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <Sparkle className={`w-3 h-3 sm:w-5 sm:h-5 transition-colors text-gray-400`} />
            <div>
              <div className="font-medium text-[12px] sm:text-sm text-gray-800">{t('reduce_mania_effect')}</div>
              <div className="text-[10px] sm:text-xs text-gray-500">{t('reduce_mania_effect_desc')}</div>
            </div>
          </div>
          <div
            className={`w-8 h-4 sm:w-12 sm:h-7 flex items-center rounded-full p-0.5 transition-colors duration-300 ${
              reduceManiaEffect ? 'bg-gradient-to-r from-yellow-400 to-orange-400' : 'bg-gray-300'
            }`}
          >
            <motion.div
              className="w-3 h-3 sm:w-5 sm:h-5 bg-white rounded-full shadow-md"
              layout
              transition={{ type: 'spring', stiffness: 700, damping: 30 }}
              style={{
                marginLeft: reduceManiaEffect ? 'auto' : '0',
                marginRight: reduceManiaEffect ? '0' : 'auto',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ManiaModeSwitcher;
