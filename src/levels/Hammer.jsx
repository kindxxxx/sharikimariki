import Matter from 'matter-js';

export function createHammerLevel(engine, width = 800, height = 600) {
  const { Bodies, Composite } = Matter;
  const obstacles = [];

  // Препятствия с отталкивающими дисками
  const bumper1 = Bodies.circle(280, 300, 35, {
    isStatic: true,
    restitution: 2.0,
    render: { fillStyle: '#e74c3c' }
  });

  const bumper2 = Bodies.circle(520, 300, 35, {
    isStatic: true,
    restitution: 2.0,
    render: { fillStyle: '#e74c3c' }
  });

  const bumperCenter = Bodies.circle(400, 420, 25, {
    isStatic: true,
    restitution: 2.2,
    render: { fillStyle: '#f39c12' }
  });

  obstacles.push(bumper1, bumper2, bumperCenter);
  Composite.add(engine.world, obstacles);
  return obstacles;
}

export default {
  id: 'hammer',
  name: 'Bumper Zone (Базовые отбойники)',
  setup: createHammerLevel
};
