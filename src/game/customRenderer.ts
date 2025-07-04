import Matter from 'matter-js';
import { SkinConfig } from '@/types/skins';
import { engine } from './engine';

// Emoji 缓存机制，避免重复渲染导致的闪烁
const emojiCache = new Map<string, HTMLCanvasElement>();

const createEmojiCanvas = (emoji: string, radius: number): HTMLCanvasElement => {
  const cacheKey = `${emoji}-${radius}`;
  
  if (emojiCache.has(cacheKey)) {
    return emojiCache.get(cacheKey)!;
  }
  
  const canvas = document.createElement('canvas');
  const size = radius * 2.4;
  canvas.width = size;
  canvas.height = size;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  
  // 启用抗锯齿
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  
  // 使用更好的字体栈
  const fontSize = radius * 1.6;
  ctx.font = `${fontSize}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Emoji", system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // 添加阴影效果
  ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
  ctx.shadowBlur = 2;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 1;
  
  // 绘制 Emoji
  ctx.fillText(emoji, size / 2, size / 2);
  
  // 缓存结果
  emojiCache.set(cacheKey, canvas);
  
  return canvas;
};

export const createCustomRenderer = (element: HTMLElement, skinConfig: SkinConfig) => {
  const render = Matter.Render.create({
    element,
    engine,
    options: {
      width: 400,
      height: 600,
      wireframes: false,
      background: '#F7F4C8',
      // 启用高质量渲染
      showVelocity: false,
      showAngleIndicator: false,
      pixelRatio: window.devicePixelRatio || 1,
    },
  });

  // 设置高质量canvas渲染
  const canvas = render.canvas;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // 启用抗锯齿和高质量文本渲染
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
  }

  // 自定义渲染逻辑
  Matter.Events.on(render, 'afterRender', () => {
    const canvas = render.canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置高质量渲染选项
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    engine.world.bodies.forEach((body: Matter.Body) => {
      if (body.plugin && (body.plugin as any).fruit) {
        const fruit = (body.plugin as any).fruit;
        const isGhost = (body.plugin as any).isGhost;
        const pos = body.position;
        const angle = body.angle;

        ctx.save();
        ctx.translate(pos.x, pos.y);
        ctx.rotate(angle);

        switch (skinConfig.type) {
          case 'emoji':
            if (fruit.emoji) {
              // 使用缓存的 Emoji canvas
              const emojiCanvas = createEmojiCanvas(fruit.emoji, fruit.radius);
              const size = fruit.radius * 2.4;
              
              // 如果是幽灵物体，添加透明效果
              if (isGhost) {
                ctx.globalAlpha = 0.4;
              }
              
              // 绘制缓存的 Emoji
              ctx.drawImage(emojiCanvas, -size / 2, -size / 2, size, size);
              
              // 重置透明度
              ctx.globalAlpha = 1;
              
              // 可选：添加一个很淡的圆形边框，帮助识别边界
              if (fruit.radius > 15) {
                ctx.beginPath();
                ctx.arc(0, 0, fruit.radius * 0.95, 0, Math.PI * 2);
                ctx.strokeStyle = isGhost ? 'rgba(128, 128, 128, 0.5)' : 'rgba(0, 0, 0, 0.08)';
                ctx.lineWidth = isGhost ? 2 : 1;
                ctx.stroke();
              }
            }
            break;
          
          case 'polygon':
            if (fruit.sides && fruit.sides > 2) {
              ctx.beginPath();
              const sides = fruit.sides;
              const radius = fruit.radius;
              
              for (let i = 0; i < sides; i++) {
                const angleStep = (Math.PI * 2) / sides;
                const x = Math.cos(i * angleStep) * radius;
                const y = Math.sin(i * angleStep) * radius;
                
                if (i === 0) {
                  ctx.moveTo(x, y);
                } else {
                  ctx.lineTo(x, y);
                }
              }
              
              ctx.closePath();
              
              if (isGhost) {
                ctx.globalAlpha = 0.3;
                ctx.fillStyle = fruit.color;
                ctx.fill();
                ctx.globalAlpha = 0.8;
                ctx.strokeStyle = fruit.color;
                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.globalAlpha = 1;
              } else {
                ctx.fillStyle = fruit.color;
                ctx.fill();
                ctx.strokeStyle = '#000000';
                ctx.lineWidth = 1;
                ctx.stroke();
              }
            }
            break;
          
          default:
            // 对于圆形，让 Matter.js 自己渲染
            break;
        }

        ctx.restore();
      }
    });
  });

  return render;
};

// 清理 Emoji 缓存
export const clearEmojiCache = () => {
  emojiCache.clear();
};

// 创建支持不同类型的物理体
export const createPhysicsBody = (x: number, y: number, fruit: any, skinType: string) => {
  let body: Matter.Body;
  
  switch (skinType) {
    case 'polygon':
      if (fruit.sides && fruit.sides > 2) {
        body = Matter.Bodies.polygon(x, y, fruit.sides, fruit.radius, {
          label: fruit.label,
          restitution: 0.2,
          friction: 0.5,
          render: {
            fillStyle: 'transparent', // 由自定义渲染器处理
          },
          plugin: {
            fruit,
            isActivated: false,
            creationTime: Date.now(),
            skinType,
          },
        });
      } else {
        // 备选圆形
        body = Matter.Bodies.circle(x, y, fruit.radius, {
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
            skinType,
          },
        });
      }
      break;
    
    case 'emoji':
      body = Matter.Bodies.circle(x, y, fruit.radius, {
        label: fruit.label,
        restitution: 0.2,
        friction: 0.5,
        render: {
          fillStyle: 'transparent', // 由自定义渲染器处理
        },
        plugin: {
          fruit,
          isActivated: false,
          creationTime: Date.now(),
          skinType,
        },
      });
      break;
    
    default:
      body = Matter.Bodies.circle(x, y, fruit.radius, {
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
          skinType,
        },
      });
      break;
  }

  return body;
};
