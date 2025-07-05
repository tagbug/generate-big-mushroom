
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Matter from 'matter-js';
import { engine, world } from '@/game/engine';
import { createPhysicsBody } from '@/game/customRenderer';
import { Fruit } from '@/types/fruits';
import { useSkin } from '@/contexts/SkinContext';
import { useAchievements } from '@/contexts/AchievementContext';
import { audioManager } from '@/utils/audioManager';
import { LEFT_BOUNDARY, RIGHT_BOUNDARY, GAME_OVER_LINE_Y } from '@/game/constant';



// 根据水果半径计算边界限制
const getBoundaryLimits = (fruitRadius: number) => {
  const minX = LEFT_BOUNDARY + fruitRadius;
  const maxX = RIGHT_BOUNDARY - fruitRadius;
  return { minX, maxX };
};

// 限制x坐标在边界内
const clampToBoundary = (x: number, fruitRadius: number) => {
  const { minX, maxX } = getBoundaryLimits(fruitRadius);
  return Math.max(minX, Math.min(maxX, x));
};

// Helper to convert hex color to rgba
const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const useGameLogic = (sceneRef: React.RefObject<HTMLDivElement | null>) => {
  const { currentSkin } = useSkin();
  const { unlockAchievement } = useAchievements();
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  // 存放两个接下来的水果
  const availableFruits = currentSkin.items.slice(0, 5);
  const [nextFruit, setNextFruit] = useState<Fruit[]>([availableFruits[Math.floor(Math.random() * availableFruits.length)], availableFruits[Math.floor(Math.random() * availableFruits.length)]]);
  const ghostFruitBodyRef = useRef<Matter.Body | null>(null);
  const mergeCountRef = useRef(0);

  // 监听分数变化以解锁成就
  useEffect(() => {
    if (score >= 1000) unlockAchievement('reach_1000_score');
    if (score >= 5000) unlockAchievement('reach_5000_score');
  }, [score, unlockAchievement]);

  const showGhostFruit = useCallback((x?: number) => {
    if (ghostFruitBodyRef.current) {
      Matter.World.remove(world, ghostFruitBodyRef.current);
    }

    const fruit = nextFruit[0];
    let ghostBody: Matter.Body;
    
    // 根据皮肤类型创建不同的幽灵物体
    switch (currentSkin.type) {
      case 'polygon':
        if (fruit.sides && fruit.sides > 2) {
          ghostBody = Matter.Bodies.polygon(0, 50, fruit.sides, fruit.radius, {
            isStatic: true,
            isSensor: true,
            label: 'ghost',
            render: {
              fillStyle: hexToRgba(fruit.color, 0.3),
              strokeStyle: hexToRgba(fruit.color, 0.8),
              lineWidth: 2,
            },
          });
        } else {
          // 备选圆形
          ghostBody = Matter.Bodies.circle(0, 50, fruit.radius, {
            isStatic: true,
            isSensor: true,
            label: 'ghost',
            render: {
              fillStyle: hexToRgba(fruit.color, 0.3),
              strokeStyle: hexToRgba(fruit.color, 0.8),
              lineWidth: 2,
            },
          });
        }
        break;
      
      case 'emoji':
        ghostBody = Matter.Bodies.circle(0, 50, fruit.radius, {
          isStatic: true,
          isSensor: true,
          label: 'ghost',
          render: {
            fillStyle: 'rgba(255, 255, 255, 0.3)',
            strokeStyle: 'rgba(128, 128, 128, 0.8)',
            lineWidth: 2,
          },
          plugin: {
            fruit: { ...fruit, emoji: fruit.emoji },
            isGhost: true,
          },
        });
        break;
      
      default:
        ghostBody = Matter.Bodies.circle(0, 50, fruit.radius, {
          isStatic: true,
          isSensor: true,
          label: 'ghost',
          render: {
            fillStyle: hexToRgba(fruit.color, 0.3),
            strokeStyle: hexToRgba(fruit.color, 0.8),
            lineWidth: 2,
          },
        });
        break;
    }
    
    ghostFruitBodyRef.current = ghostBody;
    Matter.World.add(world, ghostBody);
    if (x !== undefined) {
      // 应用边界限制
      const clampedX = clampToBoundary(x, fruit.radius);
      Matter.Body.setPosition(ghostBody, { x: clampedX, y: 50 });
    }
  }, [nextFruit, currentSkin]);

  const hideGhostFruit = useCallback(() => {
    if (ghostFruitBodyRef.current) {
      Matter.World.remove(world, ghostFruitBodyRef.current);
      ghostFruitBodyRef.current = null;
    }
  }, []);

  const updateGhostFruitPosition = useCallback((x: number) => {
    if (ghostFruitBodyRef.current) {
      const fruit = nextFruit[0];
      // 应用边界限制
      const clampedX = clampToBoundary(x, fruit.radius);
      Matter.Body.setPosition(ghostFruitBodyRef.current, { x: clampedX, y: 50 });
    }
  }, [nextFruit]);

  const resetGame = useCallback(() => {
    setIsGameOver(false);
    setScore(0);
    mergeCountRef.current = 0;
    setNextFruit([availableFruits[Math.floor(Math.random() * availableFruits.length)], availableFruits[Math.floor(Math.random() * availableFruits.length)]]);
    const fruitsToRemove = world.bodies.filter(body => !body.isStatic);
    Matter.World.remove(world, fruitsToRemove);
  }, [currentSkin]);

  const addFruit = useCallback((x: number) => {
    if (isGameOver) return;

    const fruit = nextFruit[0];
    // 应用边界限制
    const clampedX = clampToBoundary(x, fruit.radius);
    const body = createPhysicsBody(clampedX, 50, fruit, currentSkin.type);
    Matter.World.add(world, body);
    
    // 播放掉落音效
    audioManager.play('drop');
    
    // 随机选择前5个水果中的一个作为下一个水果
    setNextFruit(prev => [prev[1], availableFruits[Math.floor(Math.random() * availableFruits.length)]]);
  }, [nextFruit, isGameOver, currentSkin]);

  // 当皮肤改变时重置游戏并检查成就
  useEffect(() => {
    resetGame();
    const playedSkins = JSON.parse(localStorage.getItem('playedSkins') || '[]');
    if (!playedSkins.includes(currentSkin.id)) {
      playedSkins.push(currentSkin.id);
      localStorage.setItem('playedSkins', JSON.stringify(playedSkins));
    }
    if (playedSkins.length >= 3) {
      unlockAchievement('play_3_skins');
    }
  }, [currentSkin.id, unlockAchievement, resetGame]);

  useEffect(() => {
    if (ghostFruitBodyRef.current) {
      showGhostFruit(ghostFruitBodyRef.current.position.x);
    }
  }, [nextFruit, showGhostFruit]);

  useEffect(() => {
    const handleCollision = (event: Matter.IEventCollision<Matter.Engine>) => {
      if (isGameOver) return;

      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;

        if (bodyA.label === 'ghost' || bodyB.label === 'ghost') {
          // 如果是幽灵物体，直接跳过
          return;
        }

        if (bodyA.plugin && (bodyA.plugin as any).fruit) {
          (bodyA.plugin as any).isActivated = true;
        }
        if (bodyB.plugin && (bodyB.plugin as any).fruit) {
          (bodyB.plugin as any).isActivated = true;
        }

        const fruitA = (bodyA.plugin as any).fruit as Fruit | undefined;
        const fruitB = (bodyB.plugin as any).fruit as Fruit | undefined;

        if (fruitA && fruitB && fruitA.label === fruitB.label) {
          const currentFruitIndex = currentSkin.items.findIndex(f => f.label === fruitA.label);
          if (currentFruitIndex < currentSkin.items.length - 1) {
            const nextFruitInLine = currentSkin.items[currentFruitIndex + 1];
            Matter.World.remove(world, [bodyA, bodyB]);
            // 计算新水果的位置并应用边界限制
            const newX = (bodyA.position.x + bodyB.position.x) / 2;
            const newY = (bodyA.position.y + bodyB.position.y) / 2;
            const clampedX = clampToBoundary(newX, nextFruitInLine.radius);
            const newFruitBody = createPhysicsBody(
              clampedX,
              newY,
              nextFruitInLine,
              currentSkin.type
            );
            (newFruitBody.plugin as any).isActivated = true;
            Matter.World.add(world, newFruitBody);
            setScore((prevScore) => prevScore + fruitA.score);
            
            // 播放合成音效
            audioManager.play('merge');
          }
        }
      });

      // 判断成就
      event.pairs.forEach(pair => {
        const { bodyA, bodyB } = pair;
        const fruitA = (bodyA.plugin as any).fruit as Fruit | undefined;
        const fruitB = (bodyB.plugin as any).fruit as Fruit | undefined;

        if (fruitA && fruitB && fruitA.label === fruitB.label) {
          const currentFruitIndex = currentSkin.items.findIndex(f => f.label === fruitA.label);
          if (currentFruitIndex < currentSkin.items.length - 1) {
            const nextFruitInLine = currentSkin.items[currentFruitIndex + 1];
            mergeCountRef.current += 1;
            if (mergeCountRef.current === 1) {
              unlockAchievement('first_merge');
            }
            if (currentSkin.id === 'classic-fruits' && nextFruitInLine.label === 'watermelon') {
              unlockAchievement('unlock_watermelon');
            }
            if (currentSkin.id === 'emoji' && nextFruitInLine.label === 'diamond') {
              unlockAchievement('unlock_diamond');
            }
            if (currentSkin.id === 'mushroom' && nextFruitInLine.label === 'red_mushroom') {
              unlockAchievement('unlock_red_mushroom');
            }
            if (currentSkin.id === 'small-mushroom' && nextFruitInLine.label === 'red_mushroom') {
              unlockAchievement('unlock_small_mushroom');
            }
          }
        }
      });
      if (currentSkin.id === 'mushroom') { 
        const mushroomCount = world.bodies.filter(body => {
          const plugin = body.plugin as any;
          return plugin && plugin.fruit && plugin.fruit.label === 'red_mushroom' && plugin.isActivated;
        }).length;
        if (mushroomCount >= 5) {
          unlockAchievement('5_mushrooms');
        }
        if (mushroomCount >= 8) {
          unlockAchievement('8_mushrooms');
        }
      }
    };

    const checkGameOver = () => {
      if (isGameOver) return;

      world.bodies.forEach(body => {
        const plugin = body.plugin as any;
        if (plugin && plugin.fruit && plugin.isActivated && (Date.now() - plugin.creationTime > 1500) && body.position.y < GAME_OVER_LINE_Y && !body.isStatic && body.speed < 0.1 && body.angularSpeed < 0.1) {
          setIsGameOver(true);
          // 播放游戏结束音效
          audioManager.play('gameOver');
          const gameOverCount = parseInt(localStorage.getItem('gameOverCount') || '0') + 1;
          localStorage.setItem('gameOverCount', gameOverCount.toString());
          if (gameOverCount >= 5) {
            unlockAchievement('game_over_5_times');
          }
        }
      });
    };

    Matter.Events.on(engine, 'collisionStart', handleCollision);
    Matter.Events.on(engine, 'afterUpdate', checkGameOver);

    return () => {
      Matter.Events.off(engine, 'collisionStart', handleCollision);
      Matter.Events.off(engine, 'afterUpdate', checkGameOver);
    };
  }, [isGameOver, currentSkin, unlockAchievement]);

  return { score, isGameOver, addFruit, nextFruit, resetGame, showGhostFruit, hideGhostFruit, updateGhostFruitPosition };
};
