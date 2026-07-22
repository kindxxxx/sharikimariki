import Matter from 'matter-js';

export function createFunnelLevel(engine, width = 800, height = 600) {
  const { Bodies, Composite } = Matter;
  const obstacles = [];

  // Направляющие воронки
  const leftFunnel = Bodies.rectangle(220, 320, 300, 20, {
    isStatic: true,
    angle: Math.PI / 6,
    render: { fillStyle: '#9b59b6' }
  });

  const rightFunnel = Bodies.rectangle(580, 320, 300, 20, {
    isStatic: true,
    angle: -Math.PI / 6,
    render: { fillStyle: '#9b59b6' }
  });

  // Маленькая центральная перегородка вузкости
  const centerSpinner = Bodies.circle(400, 420, 15, {
    isStatic: true,
    restitution: 1.5,
    render: { fillStyle: '#e67e22' }
  });

  obstacles.push(leftFunnel, rightFunnel, centerSpinner);
  Composite.add(engine.world, obstacles);
  return obstacles;
}

export default {
  id: 'funnel',
  name: 'Deadly Funnel (Смертельная воронка)',
  setup: createFunnelLevel
};
