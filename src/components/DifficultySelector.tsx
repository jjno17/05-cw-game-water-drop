import React from 'react';
import { DifficultyLevel, DIFFICULTY_CONFIGS } from '../types/difficulty';

interface DifficultySelectorProps {
  selectedDifficulty: DifficultyLevel;
  onDifficultyChange: (difficulty: DifficultyLevel) => void;
  disabled?: boolean;
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  selectedDifficulty,
  onDifficultyChange,
  disabled = false
}) => {
  return (
    <div className="difficulty-selector">
      <h3>Select Difficulty</h3>
      <div className="difficulty-options">
        {Object.entries(DIFFICULTY_CONFIGS).map(([key, config]) => (
          <div 
            key={key}
            className={`difficulty-option ${selectedDifficulty === key ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
            onClick={() => !disabled && onDifficultyChange(key as DifficultyLevel)}
          >
            <h4>{config.label}</h4>
            <p>{config.description}</p>
            <div className="difficulty-stats">
              <span>Points to win: {config.pointsToWin}</span>
              <span>Time limit: {config.timeLimit}s</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
