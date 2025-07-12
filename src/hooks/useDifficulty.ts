import { useState, useCallback } from 'react';
import { DifficultyLevel, DIFFICULTY_CONFIGS } from '../types/difficulty';

export const useDifficulty = (initialDifficulty: DifficultyLevel = DifficultyLevel.NORMAL) => {
  const [currentDifficulty, setCurrentDifficulty] = useState<DifficultyLevel>(initialDifficulty);

  const getDifficultyConfig = useCallback(() => {
    return DIFFICULTY_CONFIGS[currentDifficulty];
  }, [currentDifficulty]);

  const changeDifficulty = useCallback((newDifficulty: DifficultyLevel) => {
    setCurrentDifficulty(newDifficulty);
  }, []);

  return {
    currentDifficulty,
    difficultyConfig: getDifficultyConfig(),
    changeDifficulty
  };
};
