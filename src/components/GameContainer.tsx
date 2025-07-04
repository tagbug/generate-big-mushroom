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

const GameContainer = () => {
  const { currentSkin } = useSkin();
  const sceneRef = useRef<HTMLDivElement>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const [scale, setScale] = useState(1);

  const { score, isGameOver, addFruit, nextFruit, resetGame, showGhostFruit, hideGhostFruit, updateGhostFruitPosition } = useGameLogic(sceneRef);

  useEffect(() => {
    const handleResize = () => {
      if (sceneRef.current) {
        const containerWidth = sceneRef.current.parentElement?.clientWidth || 400;
        const newScale = Math.min(1, containerWidth / 400);
        setScale(newScale);
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
  }, [currentSkin]); // 依赖于当前皮肤

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
      // 限制 x 在画布范围内
      const x = (clientX - rect.left) / scale;
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
    const x = getEventX(event, { useChangedTouches: true });
    addFruit(x);
    hideGhostFruit();
  }, [addFruit, hideGhostFruit, scale]);

  const handleRestart = useCallback(() => {
    resetGame();
  }, [resetGame]);

  return (
    <div className="relative w-full max-w-[400px]">
      <div className="flex justify-between items-center mb-2 px-2">
        <Scoreboard score={score} />
        <div className="flex items-center gap-2">
          <NextPreview fruit={nextFruit} />
          <SkinSelector />
        </div>
      </div>
      <div
        ref={sceneRef}
        className="w-[400px] h-[600px] mx-auto border cursor-pointer bg-[#F7F4C8] relative origin-top"
        style={{ transform: `scale(${scale})`, transformOrigin: 'left top' }}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={hideGhostFruit}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Game Over Line */}
        <div 
          className="absolute top-[80px] left-0 w-full border-t-2 border-dashed border-red-500"
          style={{ zIndex: 1 }}
        />
      </div>
      {isGameOver && <GameOverModal score={score} onRestart={handleRestart} />}
    </div>
  );
};

export default GameContainer;
