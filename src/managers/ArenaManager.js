import { levelRegistry } from '../levels/registry.js';

export class ArenaManager {
  constructor() {
    this.registry = levelRegistry;
    this.history = []; // Хранит до 4 последних сыгранных уровня (IDs)
  }

  /**
   * Выбирает следующий уровень случайным образом,
   * исключая последние 4 сыгранных уровня.
   */
  selectNextLevel() {
    if (!this.registry || this.registry.length === 0) {
      throw new Error('Реестр уровней пуст!');
    }

    // Исключаем 4 последних уровня из выбора
    const availableLevels = this.registry.filter(
      level => !this.history.includes(level.id)
    );

    // Если все уровни в истории (мало уровней в игре), берутся все за исключением самого последнего
    const pool = availableLevels.length > 0
      ? availableLevels
      : this.registry.filter(level => level.id !== this.history[this.history.length - 1]);

    const randomIndex = Math.floor(Math.random() * pool.length);
    const selectedLevel = pool[randomIndex];

    // Добавляем в историю и ограничиваем историю 4 записями
    this.history.push(selectedLevel.id);
    if (this.history.length > 4) {
      this.history.shift();
    }

    return selectedLevel;
  }

  getHistory() {
    return [...this.history];
  }
}

export const arenaManager = new ArenaManager();
