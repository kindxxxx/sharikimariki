import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

// Загружаем картинки из корня public/
const flagsContext = import.meta.glob('/public/*.png', { eager: true, as: 'url' });
const allFlags = Object.keys(flagsContext).map(key => {
  return {
    url: key.replace('/public', ''),
    country: key.split('/').pop().replace('.png', '').toUpperCase()
  };
});

const BALL_RADIUS = 12;

export default function Arena({ 
  gameState, setGameState, 
  currentPool, setCurrentPool, 
  winners, setWinners, 
  setTotalLosers 
}) {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const runnerRef = useRef(null);
  const renderRef = useRef(null);
  
  const activeBallsRef = useRef([]);
  const flagImagesRef = useRef({});
  const [isInit, setIsInit] = useState(false);

  // 1. Инициализация физического движка (выполняется один раз)
  useEffect(() => {
    const Engine = Matter.Engine,
          Render = Matter.Render,
          Runner = Matter.Runner,
          Composite = Matter.Composite,
          Bodies = Matter.Bodies,
          Events = Matter.Events;

    const engine = Engine.create();
    engineRef.current = engine;

    const width = 800;
    const height = 600;

    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width, height,
        wireframes: false,
        background: '#1a1a1a'
      }
    });
    renderRef.current = render;

    // Предзагрузка изображений
    allFlags.forEach((flag) => {
      const img = new Image();
      img.src = flag.url;
      flagImagesRef.current[flag.country] = img;
    });

    const leftWall = Bodies.rectangle(0, 300, 60, 600, { isStatic: true, render: { fillStyle: '#333' } });
    const rightWall = Bodies.rectangle(800, 300, 60, 600, { isStatic: true, render: { fillStyle: '#333' } });
    
    const startFloor = Bodies.rectangle(400, 200, 800, 20, { 
      isStatic: true, label: 'StartFloor', render: { fillStyle: '#555' } 
    });
    
    const greenZone = Bodies.rectangle(400, 590, 400, 60, { 
      isStatic: true, label: 'GreenZone', render: { fillStyle: '#2ecc71' } 
    });
    const redZoneLeft = Bodies.rectangle(100, 590, 200, 60, { 
      isStatic: true, label: 'RedZone', render: { fillStyle: '#e74c3c' } 
    });
    const redZoneRight = Bodies.rectangle(700, 590, 200, 60, { 
      isStatic: true, label: 'RedZone', render: { fillStyle: '#e74c3c' } 
    });

    Composite.add(engine.world, [leftWall, rightWall, startFloor, greenZone, redZoneLeft, redZoneRight]);

    // Кастомный рендер: отрисовка флагов в круглых рамках
    Events.on(render, 'afterRender', () => {
      const ctx = render.context;
      const bodies = activeBallsRef.current;

      bodies.forEach((ball) => {
        const flag = ball.plugin?.flag;
        if (!flag) return;
        const img = flagImagesRef.current[flag.country];
        if (!img || !img.complete || img.naturalWidth === 0) return;

        const pos = ball.position;
        const r = BALL_RADIUS;

        ctx.save();
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        const size = r * 2;
        ctx.drawImage(img, pos.x - r, pos.y - r, size, size);
        ctx.restore();

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255,255,255,0.6)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });
    });

    // Обработка коллизий (попадание в красную или зеленую зону)
    Events.on(engine, 'collisionStart', (event) => {
      const pairs = event.pairs;
      for (let i = 0; i < pairs.length; i++) {
        const bodyA = pairs[i].bodyA;
        const bodyB = pairs[i].bodyB;

        const ball = bodyA.label === 'Ball' ? bodyA : (bodyB.label === 'Ball' ? bodyB : null);
        const redZone = bodyA.label === 'RedZone' ? bodyA : (bodyB.label === 'RedZone' ? bodyB : null);
        const greenZone = bodyA.label === 'GreenZone' ? bodyA : (bodyB.label === 'GreenZone' ? bodyB : null);

        if (ball && ball.plugin.isProcessed !== true) {
          if (redZone) {
            ball.plugin.isProcessed = true;
            Matter.Composite.remove(engine.world, ball);
            activeBallsRef.current = activeBallsRef.current.filter(b => b.id !== ball.id);
            setTotalLosers(prev => [...prev, ball.plugin.flag]);
          }
          else if (greenZone) {
            ball.plugin.isProcessed = true;
            Matter.Composite.remove(engine.world, ball);
            activeBallsRef.current = activeBallsRef.current.filter(b => b.id !== ball.id);
            setWinners(prev => [...prev, ball.plugin.flag]);
          }
        }
      }
    });

    Render.run(render);
    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);

    setIsInit(true);

    return () => {
      Render.stop(render);
      Runner.stop(runner);
      Engine.clear(engine);
      if (render.canvas) render.canvas.remove();
    };
  }, []);

  // 2. Инициализация или сброс пула стран (если pool пуст)
  useEffect(() => {
    if (currentPool.length === 0 && allFlags.length > 0) {
      setCurrentPool(allFlags);
    }
  }, [currentPool, setCurrentPool]);

  // 3. Синхронизация физических тел с текущим пулом стран при состоянии 'menu'
  useEffect(() => {
    if (!isInit || !engineRef.current) return;
    const engine = engineRef.current;

    if (gameState === 'menu') {
      // Очищаем старые шары из физического мира
      activeBallsRef.current.forEach(ball => {
        Matter.Composite.remove(engine.world, ball);
      });
      activeBallsRef.current = [];

      // Восстанавливаем стартовую платформу
      let startFloor = Matter.Composite.allBodies(engine.world).find(b => b.label === 'StartFloor');
      if (!startFloor) {
        startFloor = Matter.Bodies.rectangle(400, 200, 800, 20, { 
          isStatic: true, label: 'StartFloor', render: { fillStyle: '#555' } 
        });
        Matter.Composite.add(engine.world, startFloor);
      }

      // Создаем новые физические шары ТОЛЬКО для стран из текущего пула
      const newBalls = [];
      const poolToSpawn = currentPool.length > 0 ? currentPool : allFlags;

      poolToSpawn.forEach((flag) => {
        const x = 50 + Math.random() * 700;
        const y = -1200 + Math.random() * 1300; 

        const ball = Matter.Bodies.circle(x, y, BALL_RADIUS, {
          restitution: 0.8,
          friction: 0.005,
          render: { fillStyle: '#ffffff' },
          label: 'Ball',
          plugin: { flag: flag, isProcessed: false }
        });
        newBalls.push(ball);
      });

      activeBallsRef.current = newBalls;
      Matter.Composite.add(engine.world, newBalls);
    }
  }, [gameState, isInit, currentPool]);

  // 4. Отслеживание игрового процесса и автоматическое завершение раунда
  useEffect(() => {
    if (!isInit || !engineRef.current) return;
    const engine = engineRef.current;
    let checkInterval;

    if (gameState === 'playing') {
      // Убираем стартовую платформу
      const startFloor = Matter.Composite.allBodies(engine.world).find(b => b.label === 'StartFloor');
      if (startFloor) {
        Matter.Composite.remove(engine.world, startFloor);
      }

      // Проверяем, когда опустится последний шар
      checkInterval = setInterval(() => {
        if (activeBallsRef.current.length === 0) {
          setGameState('round_over');
        }
      }, 300);
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
    };
  }, [gameState, isInit, setGameState]);

  return <div ref={sceneRef} />;
}
