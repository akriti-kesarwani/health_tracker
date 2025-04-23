import React from 'react';
import './ExerciseCard.css';

interface ExerciseCardProps {
  title: string;
  description: string;
  icon: string;
  onClick: () => void;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({
  title,
  description,
  icon,
  onClick
}) => {
  return (
    <div className="exercise-card" onClick={onClick}>
      <div className="exercise-icon">{icon}</div>
      <h3 className="exercise-title">{title}</h3>
      <p className="exercise-description">{description}</p>
      <div className="exercise-arrow">→</div>
    </div>
  );
};

export default ExerciseCard; 