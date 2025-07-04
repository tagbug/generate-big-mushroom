
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Fruit } from '@/types/fruits';
import { useSkin } from '@/contexts/SkinContext';
import { useI18nSkin } from '@/hooks/useI18nSkin';

interface NextPreviewProps {
  fruit: Fruit;
}

const NextPreview: React.FC<NextPreviewProps> = ({ fruit }) => {
  const { t } = useTranslation();
  const { currentSkin } = useSkin();
  const { getItemName } = useI18nSkin();
  
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">{t('next')}:</span>
      <div className="flex items-center gap-1">
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
          style={{ backgroundColor: fruit.color }}
        >
          {currentSkin.type === 'emoji' && fruit.emoji ? (
            <span 
              className="text-lg leading-none"
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
              className="w-4 h-4"
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
        <span className="text-sm">{getItemName(currentSkin.id, fruit.label)}</span>
      </div>
    </div>
  );
};

export default React.memo(NextPreview);
