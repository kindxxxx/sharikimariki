import Matter from 'matter-js';

export function createConveyorLevel(engine, width = 800, height = 600) {
  const { Bodies, Composite } = Matter;
  const obstacles = [];

  // Зигзагообразные горки
  const ramp1 = Bodies.rectangle(250, 260, 350, 16, {
    isStatic: true,
    angle: Math.PI / 12,
    render: { fillStyle: '#1abc9c' }
  });

  const ramp2 = Bodies.rectangle(550, 370, 350, 16, {
    isStatic: true,
    angle: -Math.PI / 12,
    render: { fillStyle: '#1abc9c' }
  });

  const ramp3 = Bodies.rectangle(280, 470, 300, 16, {
    isStatic: true,
    angle: Math.PI / 14,
    render: { fillStyle: '#1abc9c' }
  });

  obstacles.push(ramp1, ramp2, ramp3);
  Composite.add(engine.world, obstacles);
  return obstacles;
}

export default {
  id: 'conveyor',
  name: 'Conveyor Slopes (Наклонные рампы)',
  setup: createConveyorLevel
};
