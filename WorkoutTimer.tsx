import React, { useState, useEffect } from 'react';
import './WorkoutTimer.css';

interface WorkoutTimerProps {
  isActive: boolean;
  onSessionEnd: () => void;
}

const WorkoutTimer: React.FC<WorkoutTimerProps> = ({ isActive, onSessionEnd }) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let interval: number;

    if (isActive) {
      interval = window.setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        window.clearInterval(interval);
      }
    };
  }, [isActive]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="workout-timer">
      <div className="timer-display">
        <span className="time">{formatTime(time)}</span>
      </div>
    </div>
  );
};

export default WorkoutTimer;