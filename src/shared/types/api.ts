export type InitResponse = {
  type: 'init';
  postId: string;
  count: number;
  username: string;
};

export type IncrementResponse = {
  type: 'increment';
  postId: string;
  count: number;
};

export type DecrementResponse = {
  type: 'decrement';
  postId: string;
  count: number;
};

// Hide N' Snoo Game Types
export type GameInitResponse = {
  type: 'game-init';
  postId: string;
  backgroundImage: string;
  snooPosition: { x: number; y: number };
  gameId: string;
};

export type GameClickResponse = {
  type: 'game-click';
  postId: string;
  gameId: string;
  hit: boolean;
  livesRemaining: number;
};

export type GameCompleteResponse = {
  type: 'game-complete';
  postId: string;
  gameId: string;
  won: boolean;
  timeFinished?: number;
  finalScore: number;
  leaderboard: Array<{
    username: string;
    score: number;
    timeFinished: number;
  }>;
  playerRank: number;
};

// Game State Types for new design
export type GameScreen = 'homescreen' | 'guidelines' | 'game' | 'try-again' | 'congratulations' | 'end-game';

export interface GameState {
  screen: GameScreen;
  lives: number;
  timeLeft: number;
  backgroundImage: string;
  snooPosition: { x: number; y: number };
  gameId: string;
  showGuidelinesPopup: boolean;
  gameStartTime: number;
}

// UI Color System
export const UI_COLORS = {
  PRIMARY_BRAND: '#FF4500',      // Orangered - Primary buttons, logo
  POSITIVE_FEEDBACK: '#FF8B60',   // Crusta - Success, correct actions  
  NEGATIVE_FEEDBACK: '#9494FF',   // Portage - Errors, life loss
  BACKGROUND_MAIN: '#FFFFFF',     // White - Main UI clarity
  BACKGROUND_POPUP: '#000000'     // Black - Popups, overlays, contrast
} as const;
