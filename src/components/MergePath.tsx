'use client';

import React, { Fragment, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useSkin } from '@/contexts/SkinContext';
import { useI18nSkin } from '@/hooks/useI18nSkin';
import { SkinItem } from '@/types/skins';
import { motion } from 'framer-motion';

interface MergePathProps {
  className?: string;
}

const MergePath: React.FC<MergePathProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation();
  const { currentSkin } = useSkin();
  const { getItemName } = useI18nSkin();

  useEffect(() => {
    setMounted(true);
  }, []);

  // 获取当前皮肤的合成路线（所有水果项）
  const mergeItems = currentSkin.items;

  const renderItem = (item: SkinItem, index: number) => {
    const key = `merge-${item.label}-${index}`;
    
    return (
      <Fragment key={`frag-${key}`}>
        <div
          key={`item-${key}`}
          className="flex flex-col items-center gap-1 sm:gap-2 px-1 sm:px-2"
        >
          <div
            className="w-6 h-6 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-xs relative"
            style={(!['emoji', 'polygon'].includes(currentSkin.type) ? { backgroundColor: item.color } : {})}
          >
            {currentSkin.type === 'emoji' && item.emoji ? (
              <span
                className="text-sm sm:text-lg md:text-xl leading-none"
                style={{ 
                  fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Emoji", system-ui, sans-serif',
                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))',
                  textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                }}
              >
                {item.emoji}
              </span>
            ) : currentSkin.type === 'polygon' && item.sides ? (
              <div 
                className="w-3 h-3 sm:w-6 sm:h-6 md:w-8 md:h-8"
                style={{
                  backgroundColor: item.color,
                  clipPath: item.sides === 3 ? 'polygon(50% 0%, 0% 100%, 100% 100%)' :
                          item.sides === 4 ? 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' :
                          item.sides === 5 ? 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' :
                          item.sides === 6 ? 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' :
                          item.sides === 7 ? 'polygon(50% 0%, 90% 20%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 10% 20%)' :
                          item.sides === 8 ? 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' :
                          item.sides === 10 ? 'polygon(50% 0%, 80% 10%, 100% 35%, 100% 70%, 80% 90%, 50% 100%, 20% 90%, 0% 70%, 0% 35%, 20% 10%)' :
                          item.sides === 12 ? 'polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)' :
                          item.sides === 16 ? 'polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)' :
                          'none'
                }}
              />
            ) : (
              <div 
                className="w-3 h-3 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-full"
                style={{ backgroundColor: item.color }}
              />
            )}
          </div>
          <span className="text-xs text-gray-600 text-center leading-tight min-w-0 max-w-10 sm:max-w-16 md:max-w-20 truncate">
            {getItemName(currentSkin.id, item.label)}
          </span>
        </div>
        
        {/* 箭头指示器 */}
        {index < mergeItems.length - 1 && (
          <div key={`arrow-${key}`} className="flex items-center justify-center text-gray-400 text-sm sm:text-base md:text-lg px-0.5 sm:px-1">
            →
          </div>
        )}
      </Fragment>
    );
  };

  return (
    <>
      {/* 按钮形式的触发器 */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-1 sm:gap-2 px-1 sm:px-3 py-1 sm:py-2 bg-white/50 backdrop-blur-sm rounded-lg shadow-sm border border-white/20 hover:bg-white/70 transition-colors ${className}`}
        title={t('merge_path')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-xs sm:text-lg">❓</span>
        <span className="hidden sm:block text-xs sm:text-sm font-medium text-gray-700">
          {t('merge_path')}
        </span>
      </motion.button>

      {/* 使用 Portal 渲染弹窗到 body */}
      {mounted && isOpen && createPortal(
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4"
          style={{ zIndex: 99999 }}
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-2xl border border-white/20 w-full max-w-xs sm:max-w-2xl max-h-[90vh] sm:max-h-[80vh] overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 弹窗头部 */}
            <div className="flex items-center justify-between p-2 sm:p-4 border-b border-gray-200/50">
              <h2 className="text-sm sm:text-lg font-semibold text-gray-800">
                {t('merge_path')}
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <span className="text-sm sm:text-lg text-gray-600">×</span>
              </button>
            </div>

            {/* 弹窗内容 */}
            <div className="p-2 sm:p-4 overflow-y-auto">
              <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-4">
                {t('merge_path_description')}
              </p>
              
              {/* 使用滚动容器来适应不同屏幕尺寸 */}
              <div className="overflow-x-auto">
                <div className="flex items-center justify-start gap-1 sm:gap-2 min-w-max px-1 sm:px-2">
                  {mergeItems.map((item, index) => renderItem(item, index))}
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default React.memo(MergePath);
