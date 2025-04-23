import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import ExerciseSelector, { Exercise } from './components/ExerciseSelector';
import PoseDetector from './components/PoseDetector';
import ThemeToggle from './components/ThemeToggle';
import MotivationalQuote from './components/MotivationalQuote';
import AnimatedBackground from './components/AnimatedBackground';
import WorkoutTimer from './components/WorkoutTimer';
import WorkoutHistory, { WorkoutSession } from './components/WorkoutHistory';
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
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [workoutSessions, setWorkoutSessions] = useState<WorkoutSession[]>(() => {
    const saved = localStorage.getItem('workoutSessions');
    return saved ? JSON.parse(saved, (key, value) => {
      if (key === 'startTime' || key === 'endTime') {
        return new Date(value);
      }
      return value;
    }) : [];
  });
  const [currentSessionStart, setCurrentSessionStart] = useState<Date | null>(null);

  useEffect(() => {
    localStorage.setItem('workoutSessions', JSON.stringify(workoutSessions));
  }, [workoutSessions]);

  const handleExerciseStart = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setCurrentSessionStart(new Date());
  };

  const handleExerciseStop = () => {
    if (selectedExercise && currentSessionStart) {
      const endTime = new Date();
      const duration = Math.floor((endTime.getTime() - currentSessionStart.getTime()) / 1000);
      
      const newSession: WorkoutSession = {
        id: Date.now().toString(),
        exercise: selectedExercise,
        startTime: currentSessionStart,
        endTime: endTime,
        duration: duration,
        date: currentSessionStart.toISOString().split('T')[0],
      };
      
      setWorkoutSessions(prev => [...prev, newSession]);
      setSelectedExercise(null);
      setCurrentSessionStart(null);
      navigate('/');
    }
  };

  const handleDeleteSession = (id: string) => {
    setWorkoutSessions(prev => prev.filter(session => session.id !== id));
  };

  return (
    <div className={`app ${isDarkMode ? 'dark' : 'light'}`}>
      <AnimatedBackground />
      <ThemeToggle isDarkMode={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />
      
      {selectedExercise ? (
        <>
          <WorkoutTimer 
            isActive={true}
            onSessionEnd={() => {}}
          />
          <PoseDetector 
            exercise={selectedExercise} 
            onStop={handleExerciseStop}
          />
        </>
      ) : (
        <>
          <MotivationalQuote />
          <ExerciseSelector onSelectExercise={handleExerciseStart} />
          <WorkoutHistory 
            sessions={workoutSessions} 
            onDeleteSession={handleDeleteSession}
          />
        </>
      )}
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppContent />} />
      </Routes>
    </Router>
  );
}

export default App;