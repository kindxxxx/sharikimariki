import Matter from 'matter-js';

export function createWindLevel(engine, width = 800, height = 600) {
  const { Bodies, Composite } = Matter;
  const obstacles = [];

  // Парящие платформы
  const platform1 = Bodies.rectangle(200, 280, 140, 16, {
    isStatic: true,
    angle: 0.1,
    render: { fillStyle: '#3498db' }
  });

  const platform2 = Bodies.rectangle(400, 360, 140, 16, {
    isStatic: true,
    angle: -0.1,
    render: { fillStyle: '#3498db' }
  });

  const platform3 = Bodies.rectangle(600, 280, 140, 16, {
    isStatic: true,
    angle: 0.1,
    render: { fillStyle: '#3498db' }
  });

  obstacles.push(platform1, platform2, platform3);
  Composite.add(engine.world, obstacles);
  return obstacles;
}

export default {
  id: 'wind',
  name: 'Floating Islands (Островки)',
  setup: createWindLevel
};
