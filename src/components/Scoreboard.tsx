
import React from 'react';
import { useTranslation } from 'react-i18next';

interface ScoreboardProps {
  score: number;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ score }) => {
  const { t } = useTranslation();
  return (
    <div className="text-lg font-semibold">
      {t('score')}: {score}
    </div>
  );
};

export default React.memo(Scoreboard);
