import React, { useRef, useEffect, useState } from 'react';
import './PoseDetection.css';

interface PoseDetectionProps {
  exercise: 'squat' | 'pushup';
}

interface FormFeedback {
  message: string;
  type: 'success' | 'warning' | 'error';
}

const PoseDetection: React.FC<PoseDetectionProps> = ({ exercise }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [repCount, setRepCount] = useState(0);
  const [formFeedback, setFormFeedback] = useState<FormFeedback[]>([]);
  const [isCorrectForm, setIsCorrectForm] = useState(true);

  // Exercise-specific angle thresholds
  const thresholds = {
    squat: {
      kneeMin: 60,
      kneeMax: 170,
      hipMin: 50,
      hipMax: 160,
    },
    pushup: {
      elbowMin: 70,
      elbowMax: 160,
      shoulderMin: 40,
      shoulderMax: 90,
    }
  };

  const addFeedback = (message: string, type: FormFeedback['type']) => {
    setFormFeedback(prev => [...prev, { message, type }].slice(-3));
  };

  const checkSquatForm = (keypoints: any) => {
    // Example form checking logic for squats
    const kneeAngle = calculateAngle(keypoints.hip, keypoints.knee, keypoints.ankle);
    const hipAngle = calculateAngle(keypoints.shoulder, keypoints.hip, keypoints.knee);

    if (kneeAngle < thresholds.squat.kneeMin) {
      addFeedback('Knees too bent - rise up slightly', 'warning');
      setIsCorrectForm(false);
    } else if (kneeAngle > thresholds.squat.kneeMax) {
      addFeedback('Bend your knees more', 'warning');
      setIsCorrectForm(false);
    } else if (hipAngle < thresholds.squat.hipMin) {
      addFeedback('Keep your back straighter', 'warning');
      setIsCorrectForm(false);
    } else {
      setIsCorrectForm(true);
      addFeedback('Good form!', 'success');
    }
  };

  const checkPushupForm = (keypoints: any) => {
    // Example form checking logic for push-ups
    const elbowAngle = calculateAngle(keypoints.shoulder, keypoints.elbow, keypoints.wrist);
    const shoulderAngle = calculateAngle(keypoints.elbow, keypoints.shoulder, keypoints.hip);

    if (elbowAngle < thresholds.pushup.elbowMin) {
      addFeedback('Going too low - push up', 'warning');
      setIsCorrectForm(false);
    } else if (elbowAngle > thresholds.pushup.elbowMax) {
      addFeedback('Lower your body more', 'warning');
      setIsCorrectForm(false);
    } else if (shoulderAngle < thresholds.pushup.shoulderMin) {
      addFeedback('Keep your body aligned', 'warning');
      setIsCorrectForm(false);
    } else {
      setIsCorrectForm(true);
      addFeedback('Perfect form!', 'success');
    }
  };

  return (
    <div className="pose-detection-container">
      <div className="video-container">
        <video ref={videoRef} autoPlay playsInline />
        <canvas ref={canvasRef} className="pose-canvas" />
        
        <div className="rep-counter">
          Reps: {repCount}
        </div>

        <div className="form-feedback">
          {formFeedback.map((feedback, index) => (
            <div key={index} className={`feedback-message ${feedback.type}`}>
              {feedback.message}
            </div>
          ))}
        </div>

        <div className="form-guidelines">
          {exercise === 'squat' ? (
            'Keep your back straight and feet shoulder-width apart'
          ) : (
            'Keep your core tight and elbows close to your body'
          )}
        </div>

        <div className="exercise-progress">
          <div 
            className="progress-fill" 
            style={{ width: `${(repCount / 10) * 100}%` }} 
          />
        </div>
      </div>
    </div>
  );
};

export default PoseDetection; 