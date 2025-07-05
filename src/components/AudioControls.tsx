'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { audioManager } from '@/utils/audioManager';

const AudioControls: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // 初始化音频设置
    const savedEnabled = localStorage.getItem('audioEnabled');
    const savedVolume = localStorage.getItem('audioVolume');
    
    if (savedEnabled !== null) {
      const enabled = savedEnabled === 'true';
      setIsEnabled(enabled);
      audioManager.setEnabled(enabled);
    }
    
    if (savedVolume !== null) {
      const vol = parseFloat(savedVolume);
      setVolume(vol);
      audioManager.setVolume(vol);
    }
  }, []);

  const toggleAudio = () => {
    const newEnabled = !isEnabled;
    setIsEnabled(newEnabled);
    audioManager.setEnabled(newEnabled);
    localStorage.setItem('audioEnabled', newEnabled.toString());
    
    // 播放点击音效
    if (newEnabled) {
      audioManager.play('click');
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioManager.setVolume(newVolume);
    localStorage.setItem('audioVolume', newVolume.toString());
    
    // 播放音量测试音效
    if (isEnabled) {
      audioManager.play('click');
    }
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
    if (isEnabled) {
      audioManager.play('click');
    }
  };

  return (
    <div className="relative">
      <motion.div
        className="flex items-center gap-1 sm:gap-2 bg-white/80 backdrop-blur-sm rounded-lg p-1 sm:p-2 shadow-lg duration-75"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <motion.button
          onClick={toggleAudio}
          className="p-1 sm:p-2 rounded-lg bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600 transition-all duration-200 shadow-md"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isEnabled ? (
            <Volume2 size={16} className="sm:w-5 sm:h-5" />
          ) : (
            <VolumeX size={16} className="sm:w-5 sm:h-5" />
          )}
        </motion.button>
        
        <motion.button
          onClick={toggleSettings}
          className="p-1 sm:p-2 rounded-lg bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600 transition-all duration-200 shadow-md"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Settings size={16} className="sm:w-5 sm:h-5" />
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-white/20 min-w-[180px] sm:min-w-[200px] z-[110]"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  音效
                </span>
                <motion.div
                  onClick={toggleAudio}
                  className={`w-10 h-6 sm:w-12 sm:h-6 flex items-center rounded-full p-1 transition-colors duration-300 cursor-pointer ${
                    isEnabled ? 'bg-gradient-to-r from-green-500 to-teal-500' : 'bg-gray-300'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="w-4 h-4 bg-white rounded-full shadow-md"
                    layout
                    transition={{ type: 'spring', stiffness: 700, damping: 30 }}
                    style={{ 
                      marginLeft: isEnabled ? 'auto' : '0',
                      marginRight: isEnabled ? '0' : 'auto',
                    }}
                  />
                </motion.div>
              </div>
              
              {isEnabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <label className="text-sm font-medium text-gray-700">
                    音量
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="text-xs text-gray-500 text-center">
                    {Math.round(volume * 100)}%
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--color-green-500), var(--color-teal-500));
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--color-green-500), var(--color-teal-500));
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};

export default AudioControls;
