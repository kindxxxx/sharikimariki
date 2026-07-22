export const GameStates = {
  MENU: 'menu',
  PLAYING: 'playing',
  ROUND_OVER: 'round_over',
  GAME_OVER: 'game_over'
};

export class RoundManager {
  constructor() {
    this.roundNumber = 1;
    this.state = GameStates.MENU;
  }

  startRound() {
    this.state = GameStates.PLAYING;
  }

  endRound() {
    this.state = GameStates.ROUND_OVER;
  }

  nextRound() {
    this.roundNumber += 1;
    this.state = GameStates.MENU;
  }

  reset() {
    this.roundNumber = 1;
    this.state = GameStates.MENU;
  }
}

export const roundManager = new RoundManager();
