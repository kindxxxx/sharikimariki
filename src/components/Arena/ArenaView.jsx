import React, { useEffect, useRef } from 'react';
import { PhysicsManager } from '../../managers/PhysicsManager.js';

export default function ArenaView({ 
  currentLevel, 
  countriesToSpawn, 
  gameState, 
  setGameState,
  onEliminated, 
  onSafe 
}) {
  const containerRef = useRef(null);
  const physicsRef = useRef(null);

  // Инициализация PhysicsManager
  useEffect(() => {
    if (!containerRef.current) return;

    const pm = new PhysicsManager();
    pm.onEliminatedCallback = onEliminated;
    pm.onSafeCallback = onSafe;

    pm.init(containerRef.current, 800, 600);
    physicsRef.current = pm;

    return () => {
      pm.destroy();
    };
  }, []);

  // Смена уровня
  useEffect(() => {
    if (physicsRef.current && currentLevel) {
      physicsRef.current.loadLevel(currentLevel);
    }
  }, [currentLevel]);

  // Управление состояниями (Menu / Playing / Round Over)
  useEffect(() => {
    const pm = physicsRef.current;
    if (!pm) return;

    if (gameState === 'menu') {
      pm.restoreFloor();
      if (countriesToSpawn && countriesToSpawn.length > 0) {
        pm.spawnBalls(countriesToSpawn);
      }
    } else if (gameState === 'playing') {
      pm.dropFloor();

      // Мониторинг завершения раунда (когда все шары упали в зоны)
      const interval = setInterval(() => {
        if (pm.activeBalls.length === 0) {
          setGameState('round_over');
        }
      }, 300);

      return () => clearInterval(interval);
    }
  }, [gameState, countriesToSpawn, setGameState]);

  return <div ref={containerRef} className="canvas-wrapper" />;
}
