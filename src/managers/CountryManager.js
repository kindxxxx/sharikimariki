import countriesData from '../data/countries.json';

export class CountryManager {
  constructor() {
    this.allCountries = countriesData;
    this.currentPool = [...this.allCountries];
    this.winners = [];
    this.eliminatedFeed = []; // Порядок выбывания для боковой панели зрителей
  }

  resetAll() {
    this.currentPool = [...this.allCountries];
    this.winners = [];
    this.eliminatedFeed = [];
  }

  prepareNextRound() {
    // В новый раунд проходят ТОЛЬКО победители предыдущего раунда
    this.currentPool = [...this.winners];
    this.winners = [];
  }

  markEliminated(countryFlag) {
    // Добавляем в начало ленты выбывших для UI зрителей
    if (!this.eliminatedFeed.some(c => c.id === countryFlag.id)) {
      this.eliminatedFeed.unshift({
        ...countryFlag,
        timestamp: Date.now()
      });
    }
  }

  markSafe(countryFlag) {
    if (!this.winners.some(c => c.id === countryFlag.id)) {
      this.winners.push(countryFlag);
    }
  }
}

export const countryManager = new CountryManager();
