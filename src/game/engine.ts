import Matter from 'matter-js';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constant';

const { Engine, Render, World, Bodies, Runner } = Matter;

export const engine = Engine.create();
export const world = engine.world;

export const createRenderer = (element: HTMLElement) => {
  return Render.create({
    element,
    engine,
    options: {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      wireframes: false,
      background: 'transparent',
    },
  });
};

export const createBoundaries = (width: number, height: number) => {
  const ground = Bodies.rectangle(width / 2, height, width, 20, { 
    isStatic: true, 
    render: { fillStyle: '#d97706' } 
  });
  const leftWall = Bodies.rectangle(0, height / 2, 20, height, { 
    isStatic: true, 
    render: { fillStyle: '#d97706' } 
  });
  const rightWall = Bodies.rectangle(width, height / 2, 20, height, { 
    isStatic: true, 
    render: { fillStyle: '#d97706' } 
  });
  World.add(world, [ground, leftWall, rightWall]);
};

export const runEngine = (runner: Matter.Runner) => {
  Runner.run(runner, engine);
};

export const runRender = (render: Matter.Render) => {
  Render.run(render);
};