
import React from 'react';
import { useTranslation } from 'react-i18next';

interface GameOverModalProps {
  score: number;
  onRestart: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ score, onRestart }) => {
  const { t } = useTranslation();
  return (
    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">{t('gameOver')}</h2>
        <p className="text-lg mb-4">{t('yourScore', { score })}</p>
        <button
          onClick={onRestart}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {t('restart')}
        </button>
      </div>
    </div>
  );
};

export default GameOverModal;
