import React, { useState, useEffect } from 'react';
import Header from './components/UI/Header.jsx';
import EliminatedSidebar from './components/UI/EliminatedSidebar.jsx';
import ArenaView from './components/Arena/ArenaView.jsx';

import { arenaManager } from './managers/ArenaManager.js';
import { countryManager } from './managers/CountryManager.js';
import { roundManager, GameStates } from './managers/RoundManager.js';

import './index.css';

export default function App() {
  const [gameState, setGameState] = useState(GameStates.MENU);
  const [roundNumber, setRoundNumber] = useState(1);
  const [currentLevel, setCurrentLevel] = useState(null);

  const [currentPool, setCurrentPool] = useState([]);
  const [winners, setWinners] = useState([]);
  const [eliminatedFeed, setEliminatedFeed] = useState([]);

  // Инициализация игры
  useEffect(() => {
    countryManager.resetAll();
    const firstLevel = arenaManager.selectNextLevel();
    setCurrentLevel(firstLevel);
    setCurrentPool([...countryManager.currentPool]);
  }, []);

  // Старт раунда
  const handleStartRound = () => {
    roundManager.startRound();
    setGameState(GameStates.PLAYING);
  };

  // Переход к следующему раунду
  const handleNextRound = () => {
    countryManager.prepareNextRound();

    if (countryManager.currentPool.length <= 1) {
      roundManager.state = GameStates.GAME_OVER;
      setGameState(GameStates.GAME_OVER);
      return;
    }

    roundManager.nextRound();
    setRoundNumber(roundManager.roundNumber);

    // Выбираем НОВЫЙ случайный уровень без повтора последних 4
    const nextLevel = arenaManager.selectNextLevel();
    setCurrentLevel(nextLevel);

    setCurrentPool([...countryManager.currentPool]);
    setWinners([]);

    setGameState(GameStates.MENU);
  };

  // Полный сброс турнира
  const handleResetGame = () => {
    roundManager.reset();
    countryManager.resetAll();

    setRoundNumber(1);
    setWinners([]);
    setEliminatedFeed([]);

    const freshLevel = arenaManager.selectNextLevel();
    setCurrentLevel(freshLevel);
    setCurrentPool([...countryManager.currentPool]);

    setGameState(GameStates.MENU);
  };

  // Коллизия: шар коснулся красной зоны
  const handleEliminated = (countryFlag) => {
    countryManager.markEliminated(countryFlag);
    setEliminatedFeed([...countryManager.eliminatedFeed]);
    setCurrentPool(prev => prev.filter(c => c.id !== countryFlag.id));
  };

  // Коллизия: шар коснулся зеленой зоны
  const handleSafe = (countryFlag) => {
    countryManager.markSafe(countryFlag);
    setWinners([...countryManager.winners]);
    setCurrentPool(prev => prev.filter(c => c.id !== countryFlag.id));
  };

  const isChampion = (gameState === GameStates.ROUND_OVER || gameState === GameStates.GAME_OVER) 
    && (winners.length === 1 || currentPool.length === 1);
  const championName = winners[0]?.name || currentPool[0]?.name;

  return (
    <div className="fullscreen-app">
      <Header 
        currentLevel={currentLevel}
        roundNumber={roundNumber}
        inPlayCount={currentPool.length}
        safeCount={winners.length}
        eliminatedCount={eliminatedFeed.length}
        gameState={gameState}
        onStartRound={handleStartRound}
        onNextRound={handleNextRound}
        onResetGame={handleResetGame}
      />

      <main className="main-content">
        <section className="arena-section">
          {isChampion && (
            <div className="champion-banner">
              🏆 АБСОЛЮТНЫЙ ЧЕМПИОН: <span>{championName}</span> 🏆
            </div>
          )}
          
          <ArenaView 
            currentLevel={currentLevel}
            countriesToSpawn={currentPool}
            gameState={gameState}
            setGameState={setGameState}
            onEliminated={handleEliminated}
            onSafe={handleSafe}
          />
        </section>

        <EliminatedSidebar eliminatedFeed={eliminatedFeed} />
      </main>
    </div>
  );
}
