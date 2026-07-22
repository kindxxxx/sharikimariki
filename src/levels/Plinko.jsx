import Matter from 'matter-js';

export function createPlinkoLevel(engine, width = 800, height = 600) {
  const { Bodies, Composite } = Matter;
  const obstacles = [];

  // Сетка колышков (Plinko)
  const rows = 7;
  const startY = 250;
  const rowSpacing = 40;

  for (let r = 0; r < rows; r++) {
    const cols = r % 2 === 0 ? 9 : 8;
    const offsetX = r % 2 === 0 ? 50 : 85;
    const colSpacing = (width - 100) / 8;

    for (let c = 0; c < cols; c++) {
      const x = offsetX + c * colSpacing;
      const y = startY + r * rowSpacing;
      const peg = Bodies.circle(x, y, 6, {
        isStatic: true,
        restitution: 1.2,
        render: { fillStyle: '#f1c40f' }
      });
      obstacles.push(peg);
    }
  }

  Composite.add(engine.world, obstacles);
  return obstacles;
}

export default {
  id: 'plinko',
  name: 'Plinko Field (Поле колышков)',
  setup: createPlinkoLevel
};
