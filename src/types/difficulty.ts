export enum DifficultyLevel {
  EASY = 'easy',
  NORMAL = 'normal',
  HARD = 'hard'
}

export interface DifficultyConfig {
  pointsToWin: number;
  timeLimit: number; // in seconds
  dropSpeed: number;
  spawnRate: number; // drops per second
  label: string;
  description: string;
}

export const DIFFICULTY_CONFIGS: Record<DifficultyLevel, DifficultyConfig> = {
  [DifficultyLevel.EASY]: {
    pointsToWin: 50,
    timeLimit: 120,
    dropSpeed: 1,
    spawnRate: 0.5,
    label: 'Easy',
    description: 'Relaxed pace, more time to collect drops'
  },
  [DifficultyLevel.NORMAL]: {
    pointsToWin: 100,
    timeLimit: 90,
    dropSpeed: 1.5,
    spawnRate: 1,
    label: 'Normal',
    description: 'Standard game experience'
  },
  [DifficultyLevel.HARD]: {
    pointsToWin: 150,
    timeLimit: 60,
    dropSpeed: 2,
    spawnRate: 1.5,
    label: 'Hard',
    description: 'Fast-paced challenge for experienced players'
  }
};
