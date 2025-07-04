'use client';

import React, { useState } from 'react';
import { useSkin } from '@/contexts/SkinContext';
import { useI18nSkin } from '@/hooks/useI18nSkin';
import { useTranslation } from 'react-i18next';

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
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
      >
        <span className="text-sm font-medium">{getSkinName(currentSkin.id)}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-2">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">{t('selectSkin')}</h3>
            {availableSkins.map((skin) => (
              <button
                key={skin.id}
                onClick={() => handleSkinChange(skin.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  currentSkin.id === skin.id
                    ? 'bg-blue-50 border-2 border-blue-200'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    {skin.items.slice(0, 3).map((item, index) => (
                      <div
                        key={index}
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                        style={{ backgroundColor: item.color }}
                      >
                        {skin.type === 'emoji' && item.emoji ? (
                          <span className="text-sm">{item.emoji}</span>
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
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{getSkinName(skin.id)}</div>
                    <div className="text-xs text-gray-500">{getSkinDescription(skin.id)}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SkinSelector;
