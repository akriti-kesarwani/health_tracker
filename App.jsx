import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import ExerciseSelector from './components/ExerciseSelector';
import PoseDetector from './components/PoseDetector';
import ThemeToggle from './components/ThemeToggle';
import MotivationalQuote from './components/MotivationalQuote';
import AnimatedBackground from './components/AnimatedBackground';
import WorkoutTimer from './components/WorkoutTimer';
import WorkoutHistory from './components/WorkoutHistory';
import './App.css';

const AppContent = () => {
  const navigate = useNavigate();
  // Initialize theme from localStorage or system preference
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return false;
  });
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [workoutSessions, setWorkoutSessions] = useState(() => {
    const saved = localStorage.getItem('workoutSessions');
    return saved ? JSON.parse(saved, (key, value) => {
      if (key === 'startTime' || key === 'endTime') {
        return new Date(value);
      }
      return value;
    }) : [];
  });
  const [currentSessionStart, setCurrentSessionStart] = useState(null);

  useEffect(() => {
    localStorage.setItem('workoutSessions', JSON.stringify(workoutSessions));
  }, [workoutSessions]);

  const handleExerciseStart = (exercise) => {
    setSelectedExercise(exercise);
    setCurrentSessionStart(new Date());
  };

  const handleExerciseStop = () => {
    if (selectedExercise && currentSessionStart) {
      const endTime = new Date();
      const duration = Math.floor((endTime.getTime() - currentSessionStart.getTime()) / 1000);
      
      const newSession = {
        id: Date.now().toString(),
        exercise: selectedExercise,
        startTime: currentSessionStart,
        endTime: endTime,
        duration: duration
      };

      setWorkoutSessions(prev => [...prev, newSession]);
      setSelectedExercise(null);
      setCurrentSessionStart(null);
      navigate('/history');
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const newTheme = !prev;
      localStorage.setItem('theme', newTheme ? 'dark' : 'light');
      return newTheme;
    });
  };

  return (
    <div className={`app ${isDarkMode ? 'dark' : 'light'}`}>
      <AnimatedBackground isDarkMode={isDarkMode} />
      <ThemeToggle isDarkMode={isDarkMode} onToggle={toggleTheme} />
      <MotivationalQuote />
      <Routes>
        <Route path="/" element={
          !selectedExercise ? (
            <ExerciseSelector onSelectExercise={handleExerciseStart} />
          ) : (
            <div className="workout-container">
              <PoseDetector exercise={selectedExercise} onStop={handleExerciseStop} />
              <WorkoutTimer startTime={currentSessionStart} />
            </div>
          )
        } />
        <Route path="/history" element={<WorkoutHistory sessions={workoutSessions} />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
