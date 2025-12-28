export interface StatSet {
  people: number;
  military: number;
  economy: number;
  authority: number;
}

export interface HiddenStats {
  coupRisk: number;
  rebellionRisk: number;
  corruption: number;
  spyInfluence: number; // Represents foreign influence/spy activity
}

export interface StatChanges extends Partial<StatSet> {
  coupRisk?: number;
  rebellionRisk?: number;
  corruption?: number;
  spyInfluence?: number;
}

export enum Era {
  FOUNDATION = 'Kuruluş',          // 1299-1453
  RISE = 'Yükselme',              // 1453-1600
  STAGNATION = 'Duraklama',       // 1600-1700
  DECLINE = 'Gerileme',           // 1700-1800
  DISSOLUTION = 'Dağılma',        // 1800-1922
  REPUBLIC_EARLY = 'Erken Cumhuriyet', // 1923-1950
  REPUBLIC_MULTI = 'Çok Partili Dönem', // 1950-2000
  MODERN = 'Modern Türkiye'       // 2000-2025
}

export interface Leader {
  name: string;
  startYear: number;
  endYear: number;
  title: string;
  era: Era;
  description?: string;
  mapState?: MapState; // For visualizer
}

export type MapState = 'small' | 'growing' | 'peak' | 'stagnant' | 'shrinking' | 'republic';

export interface Card {
  id: string;
  character: string; // The person presenting the dilemma
  role: string;
  text: string;
  leftChoice: string;
  rightChoice: string;
  leftEffects: StatChanges;
  rightEffects: StatChanges;
  image?: string; // Optional background image URL
  
  // Historical constraints
  minYear?: number;
  maxYear?: number;
  requiredEra?: Era;
  
  // Conditions
  conditions?: {
    minPeople?: number; maxPeople?: number;
    minMilitary?: number; maxMilitary?: number;
    minEconomy?: number; maxEconomy?: number;
    minAuthority?: number; maxAuthority?: number;
  };

  // Turn logic
  yearJump?: number; // How many years pass after this card
  
  // Chaining
  leftFollowUp?: { cardId: string; delay: number };
  rightFollowUp?: { cardId: string; delay: number };
}

export interface DelayedEffect {
  turnDue: number; // In terms of turn count, not year
  cardId: string;
}

export interface GameState {
  stats: StatSet;
  hiddenStats: HiddenStats;
  year: number;
  currentLeader: Leader;
  turnCount: number; // Sequential turn number
  currentCard: Card | null;
  gameOver: boolean;
  gameOverReason: string;
  gameOverTitle: string;
  delayedQueue: DelayedEffect[];
  history: string[];
}

export enum SwipeDirection {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  NONE = 'NONE'
}

export type AppView = 'MENU' | 'GAME' | 'TIMELINE';

export interface SaveData {
  maxYear: number;
  unlockedEras: Era[];
  runs: number;
}
