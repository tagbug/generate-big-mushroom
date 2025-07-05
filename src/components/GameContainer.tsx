'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import Matter from 'matter-js';
import { engine, createRenderer, createBoundaries, runEngine, runRender, world } from '@/game/engine';
import { createCustomRenderer } from '@/game/customRenderer';
import { useGameLogic } from '@/hooks/useGameLogic';
import { useSkin } from '@/contexts/SkinContext';
import Scoreboard from './Scoreboard';
import NextPreview from './NextPreview';
import GameOverModal from './GameOverModal';
import SkinSelector from './SkinSelector';
import MergePath from './MergePath';
import ComboMeter from './ComboMeter';
import ComboEffects from './ComboEffects';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '@/game/constant';

const GameContainer = () => {
  const { currentSkin, maniaMode, reduceManiaEffect } = useSkin();
  const sceneRef = useRef<HTMLDivElement>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const [scale, setScale] = useState(1);

  const { score, isGameOver, addFruit, nextFruit, resetGame, showGhostFruit, hideGhostFruit, updateGhostFruitPosition, comboCount, timeToDecay } = useGameLogic(sceneRef);

  useEffect(() => {
    const handleResize = () => {
      if (sceneRef.current) {
        const containerWidth = window.innerWidth - 64; // 减去 padding
        // 只在屏幕宽度小于游戏区域宽度时进行缩放
        const gameAreaWidth = CANVAS_WIDTH;
        const newScale = containerWidth < gameAreaWidth ? containerWidth / gameAreaWidth : 1;
        setScale(Math.max(0.5, Math.min(1, newScale))); // 最小缩放到0.5，最大1
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (sceneRef.current && !renderRef.current) {
      // 根据皮肤类型选择渲染器
      const render = (currentSkin.type === 'emoji' || currentSkin.type === 'polygon')
        ? createCustomRenderer(sceneRef.current, currentSkin)
        : createRenderer(sceneRef.current);
      
      renderRef.current = render;

      createBoundaries(render.options.width!, render.options.height!);
      
      const runner = Matter.Runner.create();
      runnerRef.current = runner;
      
      runEngine(runner);
      runRender(render);
    }

    return () => {
      if (renderRef.current) {
        Matter.Render.stop(renderRef.current);
        Matter.World.clear(engine.world, false);
        Matter.Engine.clear(engine);
        renderRef.current.canvas.remove();
        renderRef.current.textures = {};
        renderRef.current = null;
      }
      if (runnerRef.current) {
        Matter.Runner.stop(runnerRef.current);
        runnerRef.current = null;
      }
    };
  }, [currentSkin, maniaMode]); // 依赖于当前皮肤和模式

  const getEventX = (
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
    opts?: { useChangedTouches?: boolean }
  ) => {
    if (sceneRef.current) {
      const rect = sceneRef.current.getBoundingClientRect();
      let clientX = 0;
      if ('touches' in event) {
        if (opts?.useChangedTouches && 'changedTouches' in event && event.changedTouches.length > 0) {
          clientX = event.changedTouches[0].clientX;
        } else if (event.touches.length > 0) {
          clientX = event.touches[0].clientX;
        }
      } else {
        clientX = event.clientX;
      }
      // 获取相对于画布的 x 坐标
      const x = (clientX - rect.left) / scale;
      // 限制在画布范围内，边界限制在 useGameLogic 中处理
      return Math.max(0, Math.min(x, rect.width / scale));
    }
    return 0;
  };

  const handleClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const x = getEventX(event);
    addFruit(x);
  }, [addFruit, scale]);

  const handleMouseEnter = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const x = getEventX(event);
    showGhostFruit(x);
  }, [showGhostFruit, scale]);

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const x = getEventX(event);
    updateGhostFruitPosition(x);
  }, [updateGhostFruitPosition, scale]);

  const handleTouchStart = useCallback((event: React.TouchEvent<HTMLDivElement>) => {
    const x = getEventX(event);
    showGhostFruit(x);
  }, [showGhostFruit, updateGhostFruitPosition, scale]);

  const handleTouchMove = useCallback((event: React.TouchEvent<HTMLDivElement>) => {
    const x = getEventX(event);
    updateGhostFruitPosition(x);
  }, [updateGhostFruitPosition, scale]);

  const handleTouchEnd = useCallback((event: React.TouchEvent<HTMLDivElement>) => {
    event.preventDefault();
    const x = getEventX(event, { useChangedTouches: true });
    addFruit(x);
    hideGhostFruit();
  }, [addFruit, hideGhostFruit, scale]);

  const handleRestart = useCallback(() => {
    resetGame();
  }, [resetGame]);

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center">
      {/* Header with game stats - 响应式设计 */}
      <div className="relative z-20 flex flex-row sm:flex-row justify-between items-center gap-2 sm:gap-6 mb-3 sm:mb-6 px-2 sm:px-8 py-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
        <div className="flex-shrink-0">
          <Scoreboard score={Math.floor(score)} comboCount={maniaMode ? comboCount : 0} />
        </div>
        <div className="flex flex-row sm:flex-row items-center gap-2 sm:gap-4">
          <NextPreview fruits={nextFruit} />
          <div className="relative z-40"> {/* 确保皮肤选择器在最上层 */}
            <SkinSelector />
          </div>
          <MergePath />
        </div>
      </div>

      {/* Combo Meter */}
      {maniaMode && (
        <ComboMeter 
          comboCount={comboCount} 
          timeToDecay={timeToDecay}
          maxTime={100 + (3000 - 100) * Math.exp(-0.1 * (comboCount - 1))}
        />
      )}
      
      {/* Game canvas container - 使用flex布局优化大屏幕显示 */}
      <div
        className="relative w-fit bg-gradient-to-b from-white/90 to-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden touch-none"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          touchAction: 'none' // 防止触摸手势导致的页面滚动
        }}
      >
        {/* 在大屏幕下使用flex布局，小屏幕下保持原有布局 */}
        <div className="flex justify-center items-center p-4 md:p-8">
          <div
            ref={sceneRef}
            className={`w-[${CANVAS_WIDTH}px] h-[${CANVAS_HEIGHT}px] cursor-pointer relative transition-transform duration-300 touch-none`}
            style={{ 
              background: 'transparent',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              touchAction: 'none' // 防止触摸手势导致的页面滚动
            }}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={hideGhostFruit}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Game Over Line with improved styling */}
            <div 
              className="absolute top-[80px] left-0 w-full border-t-2 border-dashed border-red-500/80 z-10"
              style={{ 
                filter: 'drop-shadow(0 0 4px rgba(239, 68, 68, 0.3))',
              }}
            />
            
            {/* Corner decorations */}
            {/* <div className="absolute top-2 left-2 w-4 h-4 bg-white/30 rounded-full"></div>
            <div className="absolute top-2 right-2 w-4 h-4 bg-white/30 rounded-full"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 bg-white/30 rounded-full"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 bg-white/30 rounded-full"></div> */}
          </div>
        </div>
        
        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10 pointer-events-none rounded-b-2xl"></div>
      </div>
      
      {isGameOver && <GameOverModal score={Math.floor(score)} onRestart={handleRestart} noSave={maniaMode} />}
      
      {/* Combo Effects */}
      {maniaMode && !reduceManiaEffect && <ComboEffects comboCount={comboCount} />}
    </div>
  );
};

export default GameContainer;
