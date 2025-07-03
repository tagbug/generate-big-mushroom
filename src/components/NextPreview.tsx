
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Fruit } from '@/types/fruits';

interface NextPreviewProps {
  fruit: Fruit;
}

const NextPreview: React.FC<NextPreviewProps> = ({ fruit }) => {
  const { t } = useTranslation();
  return (
    <div className="text-lg font-semibold">
      {t('next')}: {t(`fruits.${fruit.label}`)}
    </div>
  );
};

export default React.memo(NextPreview);
