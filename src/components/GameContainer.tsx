'use client';

import { useEffect, useRef, useCallback } from 'react';
import Matter from 'matter-js';
import { engine, createRenderer, createBoundaries, runEngine, runRender, world } from '@/game/engine';
import { useGameLogic } from '@/hooks/useGameLogic';
import Scoreboard from './Scoreboard';
import NextPreview from './NextPreview';
import GameOverModal from './GameOverModal';

const GameContainer = () => {
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);

  const { score, isGameOver, addFruit, nextFruit, resetGame } = useGameLogic(sceneRef);

  useEffect(() => {
    if (sceneRef.current && !renderRef.current) {
      const render = createRenderer(sceneRef.current);
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
  }, []);

  const handleClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (sceneRef.current) {
      const rect = sceneRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      addFruit(x);
    }
  }, [addFruit]);

  const handleRestart = useCallback(() => {
    resetGame();
  }, [resetGame]);

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-2 px-2">
        <Scoreboard score={score} />
        <NextPreview fruit={nextFruit} />
      </div>
      <div
        ref={sceneRef}
        className="w-[400px] h-[600px] mx-auto border cursor-pointer bg-[#F7F4C8] relative" // Added relative positioning
        onClick={handleClick}
      >
        {/* Game Over Line */}
        <div 
          className="absolute top-[80px] left-0 w-full border-t-2 border-dashed border-red-500"
          style={{ zIndex: 1 }} // Ensure line is visible but behind fruits
        />
      </div>
      {isGameOver && <GameOverModal score={score} onRestart={handleRestart} />}
    </div>
  );
};

export default GameContainer;