
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Matter from 'matter-js';
import { FRUITS } from '@/game/fruits';
import { engine, world } from '@/game/engine';
import { Fruit } from '@/types/fruits';

const GAME_OVER_LINE_Y = 80;

// Helper to convert hex color to rgba
const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const useGameLogic = (sceneRef: React.RefObject<HTMLDivElement | null>) => {
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [nextFruit, setNextFruit] = useState<Fruit>(FRUITS[0]);
  const ghostFruitBodyRef = useRef<Matter.Body | null>(null);

  const showGhostFruit = useCallback(() => {
    if (ghostFruitBodyRef.current) {
      Matter.World.remove(world, ghostFruitBodyRef.current);
    }

    const fruit = nextFruit;
    const ghostBody = Matter.Bodies.circle(0, 50, fruit.radius, {
      isStatic: true,
      isSensor: true,
      label: 'ghost',
      render: {
        fillStyle: hexToRgba(fruit.color, 0.3),
        strokeStyle: hexToRgba(fruit.color, 0.8),
        lineWidth: 2,
      },
    });
    ghostFruitBodyRef.current = ghostBody;
    Matter.World.add(world, ghostBody);
  }, [nextFruit]);

  const hideGhostFruit = useCallback(() => {
    if (ghostFruitBodyRef.current) {
      Matter.World.remove(world, ghostFruitBodyRef.current);
      ghostFruitBodyRef.current = null;
    }
  }, []);

  const updateGhostFruitPosition = useCallback((x: number) => {
    if (ghostFruitBodyRef.current) {
      Matter.Body.setPosition(ghostFruitBodyRef.current, { x, y: 50 });
    }
  }, []);

  const resetGame = useCallback(() => {
    setIsGameOver(false);
    setScore(0);
    setNextFruit(FRUITS[0]);
    const fruitsToRemove = world.bodies.filter(body => !body.isStatic);
    Matter.World.remove(world, fruitsToRemove);
  }, []);

  const addFruit = useCallback((x: number) => {
    if (isGameOver) return;

    const fruit = nextFruit;
    const body = Matter.Bodies.circle(x, 50, fruit.radius, {
      label: fruit.label,
      restitution: 0.2,
      friction: 0.5,
      render: {
        fillStyle: fruit.color,
      },
      plugin: {
        fruit,
        isActivated: false,
        creationTime: Date.now(),
      },
    });

    Matter.World.add(world, body);
    setNextFruit(FRUITS[Math.floor(Math.random() * 5)]);
  }, [nextFruit, isGameOver]);

  useEffect(() => {
    if (ghostFruitBodyRef.current) {
      showGhostFruit();
    }
  }, [nextFruit, showGhostFruit]);

  useEffect(() => {
    const handleCollision = (event: Matter.IEventCollision<Matter.Engine>) => {
      if (isGameOver) return;

      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;

        if (bodyA.plugin && (bodyA.plugin as any).fruit) {
          (bodyA.plugin as any).isActivated = true;
        }
        if (bodyB.plugin && (bodyB.plugin as any).fruit) {
          (bodyB.plugin as any).isActivated = true;
        }

        const fruitA = (bodyA.plugin as any).fruit as Fruit | undefined;
        const fruitB = (bodyB.plugin as any).fruit as Fruit | undefined;

        if (fruitA && fruitB && fruitA.label === fruitB.label) {
          const currentFruitIndex = FRUITS.findIndex(f => f.label === fruitA.label);
          if (currentFruitIndex < FRUITS.length - 1) {
            const nextFruitInLine = FRUITS[currentFruitIndex + 1];
            Matter.World.remove(world, [bodyA, bodyB]);
            const newFruitBody = Matter.Bodies.circle(
              (bodyA.position.x + bodyB.position.x) / 2,
              (bodyA.position.y + bodyB.position.y) / 2,
              nextFruitInLine.radius,
              {
                label: nextFruitInLine.label,
                restitution: 0.2,
                friction: 0.5,
                render: {
                  fillStyle: nextFruitInLine.color,
                },
                plugin: {
                  fruit: nextFruitInLine,
                  isActivated: true,
                  creationTime: Date.now(),
                },
              }
            );
            Matter.World.add(world, newFruitBody);
            setScore((prevScore) => prevScore + fruitA.score);
          }
        }
      });
    };

    const checkGameOver = () => {
      if (isGameOver) return;

      world.bodies.forEach(body => {
        const plugin = body.plugin as any;
        if (plugin && plugin.fruit && plugin.isActivated && (Date.now() - plugin.creationTime > 1500) && body.position.y < GAME_OVER_LINE_Y && !body.isStatic && body.speed < 0.1 && body.angularSpeed < 0.1) {
          setIsGameOver(true);
        }
      });
    };

    Matter.Events.on(engine, 'collisionStart', handleCollision);
    Matter.Events.on(engine, 'afterUpdate', checkGameOver);

    return () => {
      Matter.Events.off(engine, 'collisionStart', handleCollision);
      Matter.Events.off(engine, 'afterUpdate', checkGameOver);
    };
  }, [isGameOver]);

  return { score, isGameOver, addFruit, nextFruit, resetGame, showGhostFruit, hideGhostFruit, updateGhostFruitPosition };
};
