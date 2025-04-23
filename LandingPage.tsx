import React from 'react';
import './LandingPage.css';

const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Track Your Fitness Journey</h1>
          <p>Real-time pose detection and form correction for perfect workouts</p>
          <button className="start-button">Start Training</button>
        </div>
        <div className="hero-decoration">
          <div className="circle-decoration"></div>
          <div className="mandala-decoration"></div>
        </div>
      </div>

      <div className="features-section">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Real-time Tracking</h3>
            <p>Advanced pose detection for accurate form analysis</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Progress Tracking</h3>
            <p>Detailed history and performance metrics</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🗓️</div>
            <h3>Smart Calendar</h3>
            <p>Schedule and track your workout sessions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 