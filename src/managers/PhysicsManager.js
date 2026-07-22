import Matter from 'matter-js';
import { ballRenderer } from '../components/Ball/BallRenderer.js';

export class PhysicsManager {
  constructor() {
    this.engine = null;
    this.render = null;
    this.runner = null;
    this.activeBalls = [];
    this.currentObstacles = [];
    this.onEliminatedCallback = null;
    this.onSafeCallback = null;
  }

  init(containerElement, width = 800, height = 600) {
    const { Engine, Render, Runner, Composite, Bodies, Events } = Matter;

    this.engine = Engine.create();
    this.render = Render.create({
      element: containerElement,
      engine: this.engine,
      options: {
        width,
        height,
        wireframes: false,
        background: '#141419'
      }
    });

    // Ограничительные стены
    const leftWall = Bodies.rectangle(0, height / 2, 60, height, { isStatic: true, render: { fillStyle: '#2c2c38' } });
    const rightWall = Bodies.rectangle(width, height / 2, 60, height, { isStatic: true, render: { fillStyle: '#2c2c38' } });

    // Стартовый пол (исчезает при старте раунда)
    const startFloor = Bodies.rectangle(width / 2, 180, width, 20, {
      isStatic: true,
      label: 'StartFloor',
      render: { fillStyle: '#4a4a5a' }
    });

    // Зеленая зона спасения (по центру)
    const greenZone = Bodies.rectangle(width / 2, height - 15, width * 0.5, 40, {
      isStatic: true,
      label: 'GreenZone',
      render: { fillStyle: '#2ecc71' }
    });

    // Красные зоны смерти (по бокам)
    const redZoneLeft = Bodies.rectangle(width * 0.125, height - 15, width * 0.25, 40, {
      isStatic: true,
      label: 'RedZone',
      render: { fillStyle: '#e74c3c' }
    });
    const redZoneRight = Bodies.rectangle(width * 0.875, height - 15, width * 0.25, 40, {
      isStatic: true,
      label: 'RedZone',
      render: { fillStyle: '#e74c3c' }
    });

    Composite.add(this.engine.world, [leftWall, rightWall, startFloor, greenZone, redZoneLeft, redZoneRight]);

    // Кастомный клиппинг флагов
    Events.on(this.render, 'afterRender', () => {
      const ctx = this.render.context;
      this.activeBalls.forEach(ball => ballRenderer.drawCircularBall(ctx, ball));
    });

    // Коллизии
    Events.on(this.engine, 'collisionStart', (event) => {
      event.pairs.forEach(pair => {
        const { bodyA, bodyB } = pair;
        const ball = bodyA.label === 'Ball' ? bodyA : (bodyB.label === 'Ball' ? bodyB : null);
        const redZone = bodyA.label === 'RedZone' ? bodyA : (bodyB.label === 'RedZone' ? bodyB : null);
        const greenZone = bodyA.label === 'GreenZone' ? bodyA : (bodyB.label === 'GreenZone' ? greenZone : null);

        if (ball && ball.plugin && !ball.plugin.isProcessed) {
          if (redZone) {
            ball.plugin.isProcessed = true;
            Matter.Composite.remove(this.engine.world, ball);
            this.activeBalls = this.activeBalls.filter(b => b.id !== ball.id);
            if (this.onEliminatedCallback) this.onEliminatedCallback(ball.plugin.flag);
          } else if (greenZone) {
            ball.plugin.isProcessed = true;
            Matter.Composite.remove(this.engine.world, ball);
            this.activeBalls = this.activeBalls.filter(b => b.id !== ball.id);
            if (this.onSafeCallback) this.onSafeCallback(ball.plugin.flag);
          }
        }
      });
    });

    Render.run(this.render);
    this.runner = Runner.create();
    Runner.run(this.runner, this.engine);
  }

  loadLevel(levelModule) {
    // Удаляем прошлые препятствия
    if (this.currentObstacles.length > 0) {
      Matter.Composite.remove(this.engine.world, this.currentObstacles);
      this.currentObstacles = [];
    }

    if (levelModule && typeof levelModule.setup === 'function') {
      this.currentObstacles = levelModule.setup(this.engine, 800, 600) || [];
    }
  }

  spawnBalls(countries) {
    this.clearBalls();
    ballRenderer.preloadFlags(countries);

    const { Bodies, Composite } = Matter;
    const newBalls = [];

    countries.forEach(flag => {
      const x = 60 + Math.random() * 680;
      const y = -1400 + Math.random() * 1400;

      const ball = Bodies.circle(x, y, 12, {
        restitution: 0.8,
        friction: 0.005,
        render: { fillStyle: '#ffffff' },
        label: 'Ball',
        plugin: { flag, isProcessed: false }
      });
      newBalls.push(ball);
    });

    this.activeBalls = newBalls;
    Composite.add(this.engine.world, newBalls);
  }

  dropFloor() {
    const startFloor = Matter.Composite.allBodies(this.engine.world).find(b => b.label === 'StartFloor');
    if (startFloor) {
      Matter.Composite.remove(this.engine.world, startFloor);
    }
  }

  restoreFloor() {
    let startFloor = Matter.Composite.allBodies(this.engine.world).find(b => b.label === 'StartFloor');
    if (!startFloor) {
      startFloor = Matter.Bodies.rectangle(400, 180, 800, 20, {
        isStatic: true,
        label: 'StartFloor',
        render: { fillStyle: '#4a4a5a' }
      });
      Matter.Composite.add(this.engine.world, startFloor);
    }
  }

  clearBalls() {
    if (this.activeBalls.length > 0) {
      Matter.Composite.remove(this.engine.world, this.activeBalls);
      this.activeBalls = [];
    }
  }

  destroy() {
    const { Render, Runner, Engine } = Matter;
    if (this.render) Render.stop(this.render);
    if (this.runner) Runner.stop(this.runner);
    if (this.engine) Engine.clear(this.engine);
    if (this.render && this.render.canvas) this.render.canvas.remove();
  }
}
