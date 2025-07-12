import React, { useState, useEffect, useCallback } from 'react';
import { DifficultySelector } from './DifficultySelector';
import { useDifficulty } from '../hooks/useDifficulty';
import { DifficultyLevel } from '../types/difficulty';

export const Game: React.FC = () => {
  const { currentDifficulty, difficultyConfig, changeDifficulty } = useDifficulty();
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(difficultyConfig.timeLimit);

  // Update game logic to use difficulty config
  const checkWinCondition = useCallback(() => {
    return score >= difficultyConfig.pointsToWin;
  }, [score, difficultyConfig.pointsToWin]);

  const checkLoseCondition = useCallback(() => {
    return timeRemaining <= 0;
  }, [timeRemaining]);

  // Timer effect
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameOver]);

  // Update drop spawning rate based on difficulty
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const spawnInterval = 1000 / difficultyConfig.spawnRate;
    const spawnTimer = setInterval(() => {
      // ...existing drop spawn logic...
    }, spawnInterval);

    return () => clearInterval(spawnTimer);
  }, [gameStarted, gameOver, difficultyConfig.spawnRate]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setTimeRemaining(difficultyConfig.timeLimit);
    // ...existing game start logic...
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setScore(0);
    setTimeRemaining(difficultyConfig.timeLimit);
    // ...existing reset logic...
  };

  return (
    <div className="game-container">
      {!gameStarted ? (
        <div className="game-menu">
          <h1>Water Drop Game</h1>
          <DifficultySelector
            selectedDifficulty={currentDifficulty}
            onDifficultyChange={changeDifficulty}
          />
          <button onClick={startGame} className="start-button">
            Start Game