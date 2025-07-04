
import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Fruit } from '@/types/fruits';
import { useSkin } from '@/contexts/SkinContext';
import { useI18nSkin } from '@/hooks/useI18nSkin';

interface NextPreviewProps {
  fruits: Fruit[];
}

const NextPreview: React.FC<NextPreviewProps> = ({ fruits }) => {
  const { t } = useTranslation();
  const { currentSkin } = useSkin();
  const { getItemName } = useI18nSkin();
  
  return (
    <div className="flex items-center gap-2 sm:gap-3 bg-white/50 rounded-lg p-1.5 sm:px-3 sm:py-2 shadow-sm">
      <span className="text-xs sm:text-base font-medium text-gray-700">{t('next')}:</span>
      <div className="flex items-center gap-2">
        {fruits.map((fruit, index) => (
          <Fragment key={`Frag-${fruit.label}-${index}`}>
            <div
              key={`div-${fruit.label}-${index}`}
              className="w-3 h-3 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs"
              style={(!['emoji', 'polygon'].includes(currentSkin.type) ? { backgroundColor: fruit.color } : {})}
            >
              {currentSkin.type === 'emoji' && fruit.emoji ? (
                <span
                className="text-sm sm:text-xl leading-none"
                style={{ 
                  fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Emoji", system-ui, sans-serif',
                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))',
                  textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                }}
              >
                {fruit.emoji}
              </span>
              ) : currentSkin.type === 'polygon' && fruit.sides ? (
                <div 
                  className="w-2 h-2 sm:w-5 sm:h-5"
                  style={{
                    backgroundColor: fruit.color,
                    clipPath: fruit.sides === 3 ? 'polygon(50% 0%, 0% 100%, 100% 100%)' :
                            fruit.sides === 4 ? 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' :
                            fruit.sides === 5 ? 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' :
                            fruit.sides === 6 ? 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' :
                            'none'
                  }}
                />
              ) : null}
            </div>
            <span key={`span-${fruit.label}-${index}`} className="hidden sm:block text-xs sm:text-base text-gray-600 whitespace-nowrap">
              {getItemName(currentSkin.id, fruit.label)}
            </span>
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default React.memo(NextPreview);
