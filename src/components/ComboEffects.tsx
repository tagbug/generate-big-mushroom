'use client';

import React, { useEffect, useRef } from 'react';

interface ComboEffectsProps {
  comboCount: number;
  onComboIncrease?: (comboCount: number) => void;
}

const ComboEffects: React.FC<ComboEffectsProps> = ({ comboCount, onComboIncrease }) => {
  const prevComboCountRef = useRef(comboCount);
  const animationIdRef = useRef<number>(0);

  useEffect(() => {
    // 检测combo增加
    if (comboCount > prevComboCountRef.current) {
      onComboIncrease?.(comboCount);
      
      // 屏幕震动效果 - 应用到整个页面body
      const intensity = Math.min(comboCount * 0.5, 10);
      const duration = Math.max(0.3, Math.min(comboCount * 0.1, 1));
      
      // 生成唯一的动画ID和随机化的关键帧
      const animationId = ++animationIdRef.current;
      const keyframes = generateRandomShakeKeyframes(intensity);
      
      // 动态创建CSS动画
      const style = document.createElement('style');
      style.textContent = `
        @keyframes gameShake${animationId} {
          ${keyframes}
        }
      `;
      document.head.appendChild(style);
      
      // 应用动画到body
      document.body.style.animation = `gameShake${animationId} ${duration}s ease-in-out`;
      
      setTimeout(() => {
        document.body.style.animation = '';
        // 清理样式
        document.head.removeChild(style);
      }, duration * 1000);
    }
    prevComboCountRef.current = comboCount;
  }, [comboCount, onComboIncrease]);

  // 生成随机化的震动关键帧
  const generateRandomShakeKeyframes = (intensity: number): string => {
    const steps = 20; // 增加关键帧数量让抖动更细腻
    let keyframes = '0% { transform: translateX(0) translateY(0); }\n';
    
    for (let i = 1; i < steps; i++) {
      const percentage = (i / steps) * 100;
      // 随机方向和强度，但整体强度受intensity控制
      const randomX = (Math.random() - 0.5) * 2 * intensity;
      const randomY = (Math.random() - 0.5) * 2 * intensity;
      // 添加衰减效果，让震动逐渐减弱
      const decay = Math.max(0.1, 1 - (i / steps) * 0.7);
      const finalX = randomX * decay;
      const finalY = randomY * decay;
      
      keyframes += `${percentage.toFixed(1)}% { transform: translateX(${finalX.toFixed(2)}px) translateY(${finalY.toFixed(2)}px); }\n`;
    }
    
    keyframes += '100% { transform: translateX(0) translateY(0); }';
    return keyframes;
  };

  return (
    <>
    </>
  );
};

export default ComboEffects;
