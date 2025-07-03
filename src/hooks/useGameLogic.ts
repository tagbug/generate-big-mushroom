
'use client';

import { useState, useEffect, useCallback } from 'react';
import Matter from 'matter-js';
import { FRUITS } from '@/game/fruits';
import { engine, world } from '@/game/engine';
import { Fruit } from '@/types/fruits';

const GAME_OVER_LINE_Y = 80;

export const useGameLogic = (sceneRef: React.RefObject<HTMLDivElement | null>) => {
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [nextFruit, setNextFruit] = useState<Fruit>(FRUITS[0]);

  const resetGame = useCallback(() => {
    setIsGameOver(false);
    setScore(0);
    setNextFruit(FRUITS[0]);
    // Remove all non-static bodies (the fruits)
    const fruitsToRemove = world.bodies.filter(body => !body.isStatic);
    Matter.World.remove(world, fruitsToRemove);
  }, [world]);

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
        isActivated: false, // Fruit is not active until it collides
      },
    });

    Matter.World.add(world, body);
    setNextFruit(FRUITS[Math.floor(Math.random() * 5)]);
  }, [nextFruit, isGameOver]);

  useEffect(() => {
    const handleCollision = (event: Matter.IEventCollision<Matter.Engine>) => {
      if (isGameOver) return;

      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;

        // Activate both fruits on collision
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
                  isActivated: true, // The new fruit is already activated
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
        if (plugin && plugin.fruit && plugin.isActivated && body.position.y < GAME_OVER_LINE_Y && !body.isStatic && body.speed < 0.1 && body.angularSpeed < 0.1) {
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

  return { score, isGameOver, addFruit, nextFruit, resetGame };
};
