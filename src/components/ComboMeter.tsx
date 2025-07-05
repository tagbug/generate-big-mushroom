'use client';

import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useSkin } from '@/contexts/SkinContext';

interface ComboMeterProps {
  comboCount: number;
  timeToDecay: number;
  maxTime: number;
}

const ComboMeter: React.FC<ComboMeterProps> = ({ comboCount, timeToDecay, maxTime }) => {
  const { t } = useTranslation();
  const { reduceManiaEffect } = useSkin();
  const prevComboCountRef = useRef(comboCount);
  const shouldAnimateRef = useRef(false);
  const rotateBaseRef = useRef(0);

  useEffect(() => {
    // 只在combo增加时设置动画标志
    if (comboCount > prevComboCountRef.current) {
      shouldAnimateRef.current = true;
    } else {
      shouldAnimateRef.current = false;
    }
    prevComboCountRef.current = comboCount;
    rotateBaseRef.current = Math.random() * 2 - 1;
  }, [comboCount]);

  const getBarColor = () => {
    if (comboCount > 15) return 'bg-red-500';
    if (comboCount > 8) return 'bg-orange-500';
    if (comboCount > 3) return 'bg-yellow-400';
    return 'bg-gray-300';
  };

  const getTextColor = () => {
    if (comboCount > 15) return 'text-red-500';
    if (comboCount > 8) return 'text-orange-500';
    if (comboCount > 3) return 'text-yellow-500';
    return 'text-gray-700';
  };

  const getBgColor = () => {
    if (comboCount > 15) return 'bg-red-100/60';
    if (comboCount > 8) return 'bg-orange-100/60';
    if (comboCount > 3) return 'bg-yellow-100/60';
    return 'bg-white/40';
  };

  const getGlowColor = () => {
    if (comboCount > 15) return 'shadow-red-500/50';
    if (comboCount > 8) return 'shadow-orange-500/50';
    if (comboCount > 3) return 'shadow-yellow-500/50';
    return 'shadow-gray-500/20';
  };

  const getShadowIntensity = () => {
    if (comboCount > 15) return 'shadow-2xl';
    if (comboCount > 8) return 'shadow-xl';
    if (comboCount > 3) return 'shadow-lg';
    return 'shadow-md';
  };

  const progress = maxTime > 0 ? (timeToDecay / maxTime) * 100 : 0;

  return (
    <AnimatePresence>
      {/* comboCount > 0 && */ (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="w-[calc(100%_-_theme(space.20))] max-w-xs sm:max-w-md mx-auto -mt-1 mb-2 sm:-mt-3 sm:mb-3"
        >
          <motion.div 
            className={`${getBgColor()} backdrop-blur-sm rounded-lg ${getShadowIntensity()} ${getGlowColor()} py-1 px-2.5 flex items-center gap-4 transition-all duration-300`}
            animate={!reduceManiaEffect ? {
              scale: shouldAnimateRef.current ? [1, 1 + 0.02 * Math.min(comboCount, 20), 1] : 1,
              boxShadow: shouldAnimateRef.current ? [
                `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`,
                `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 ${Math.min(comboCount * 2, 30)}px rgba(255, 215, 0, 0.3)`,
                `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`
              ] : undefined
            } : {}}
            transition={{ 
              duration: 0.4,
              times: [0, 0.5, 1],
              ease: "easeInOut"
            }}
          >
            <div className="flex-shrink-0 font-bold text-sm sm:text-lg text-gray-700 flex items-center">
              {t('combo')}
              <motion.span
                key={shouldAnimateRef.current ? comboCount : 'static'}
                initial={{
                  scale: 1,
                  rotate: 0,
                }}
                animate={{
                  scale: shouldAnimateRef.current ? [1, 1 + 1 - Math.exp(-0.1 * (comboCount - 1)), 1] : 1,
                  rotate: shouldAnimateRef.current ? [0, rotateBaseRef.current * (45 - 45 * Math.exp(-0.05 * (comboCount - 1))), 0] : 0,
                }}
                transition={{ duration: 0.3 }}
                className={`${getTextColor()} text-md sm:text-2xl font-bold ml-1 inline-block relative`}
                style={{ 
                  transformOrigin: 'center center',
                  textAlign: 'center',
                  zIndex: 10,
                  textShadow: comboCount > 8 ? `0 0 ${Math.min(comboCount, 20)}px currentColor` : undefined
                }}
              >
                {comboCount}
              </motion.span>
            </div>
            <div className="flex-grow bg-gray-50 rounded-full h-2 sm:h-4 overflow-hidden relative">
              <motion.div
                className={`h-full rounded-full transition-colors duration-300 ${getBarColor()}`}
                initial={{ width: '100%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.02, ease: 'linear' }}
              />
              {/* 进度条闪烁效果 */}
              {!reduceManiaEffect && comboCount > 10 && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{
                    x: ['-100%', '100%'],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              )}
            </div>
            <div className="flex-shrink-0 font-mono text-gray-600 text-xs sm:text-base w-8 sm:w-14 text-right">
              {(timeToDecay / 1000).toFixed(2)}s
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ComboMeter;
