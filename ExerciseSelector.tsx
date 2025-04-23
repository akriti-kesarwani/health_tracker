import React from 'react';
import '../styles/components.css';

export type Exercise = 'squat' | 'pushup' | null;

interface ExerciseSelectorProps {
  onSelectExercise: (exercise: Exercise) => void;
}

const ExerciseSelector: React.FC<ExerciseSelectorProps> = ({ onSelectExercise }) => {
  return (
    <div className="exercise-selector">
      <h2>Choose Your Exercise</h2>
      <div className="button-container">
        <button 
          className="exercise-button"
          onClick={() => onSelectExercise('squat')}
        >
          Start Squats
        </button>
        <button 
          className="exercise-button"
          onClick={() => onSelectExercise('pushup')}
        >
          Start Push-Ups
        </button>
      </div>
    </div>
  );
};

export default ExerciseSelector; 