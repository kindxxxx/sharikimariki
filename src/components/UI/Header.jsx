import React from 'react';

export default function Header({ 
  currentLevel, 
  roundNumber, 
  inPlayCount, 
  safeCount, 
  eliminatedCount,
  gameState, 
  onStartRound, 
  onNextRound, 
  onResetGame 
}) {
  return (
    <header className="game-header">
      <div className="header-left">
        <h1 className="game-title">Sharikimariki</h1>
        <div className="level-badge">
          Уровень: <span>{currentLevel ? currentLevel.name : 'Инициализация'}</span>
        </div>
      </div>

      <div className="header-stats">
        <div className="stat-pill">
          <span className="stat-label">Раунд</span>
          <span className="stat-val">{roundNumber}</span>
        </div>
        <div className="stat-pill in-play">
          <span className="stat-label">В игре</span>
          <span className="stat-val">{inPlayCount}</span>
        </div>
        <div className="stat-pill safe">
          <span className="stat-label">Спаслись</span>
          <span className="stat-val">{safeCount}</span>
        </div>
        <div className="stat-pill eliminated">
          <span className="stat-label">Выбыло</span>
          <span className="stat-val">{eliminatedCount}</span>
        </div>
      </div>

      <div className="header-controls">
        {gameState === 'menu' && (
          <button className="btn btn-primary" onClick={onStartRound}>
            ▶ Начать раунд {roundNumber}
          </button>
        )}

        {gameState === 'round_over' && (
          <button className="btn btn-success" onClick={onNextRound}>
            ⏭ Следующий раунд ({safeCount} стран)
          </button>
        )}

        <button className="btn btn-secondary" onClick={onResetGame}>
          🔄 Сброс (254 страны)
        </button>
      </div>
    </header>
  );
}
