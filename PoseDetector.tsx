import React, { useEffect, useRef, useState } from 'react';
import { FilesetResolver, DrawingUtils, PoseLandmarker } from '@mediapipe/tasks-vision';
import { useNavigate } from 'react-router-dom';
import '../styles/components.css';

interface Props {
  exercise: 'squat' | 'pushup';
  onStop: () => void;
}

const PoseDetector: React.FC<Props> = ({ exercise, onStop }) => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [landmarker, setLandmarker] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [repCount, setRepCount] = useState(0);
  const [isInDownPosition, setIsInDownPosition] = useState(false);
  const [feedback, setFeedback] = useState<string>('Start exercising!');
  const [isCorrectForm, setIsCorrectForm] = useState(true);
  const [formFeedback, setFormFeedback] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isExerciseStarted, setIsExerciseStarted] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: 640,
          height: 480,
          facingMode: 'user',
          frameRate: 30
        }
      });

      const videoElement = videoRef.current;
      if (!videoElement) {
        throw new Error('Video element not found');
      }

      streamRef.current = stream;
      videoElement.srcObject = stream;
      
      await videoElement.play();
      
      const canvasElement = canvasRef.current;
      if (canvasElement) {
        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;
      }
      
      setIsCameraOn(true);
      setIsLoading(false);
      console.log('Camera started successfully');
      
      // Initialize pose detection after camera is ready
      await initializePoseLandmarker();
    } catch (err) {
      console.error('Camera initialization error:', err);
      setError('Could not access camera. Please grant camera permissions.');
      setIsLoading(false);
      setIsCameraOn(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsCameraOn(false);
    setIsExerciseStarted(false);
    setRepCount(0);
    setFeedback('Start exercising!');
    setFormFeedback([]);
    console.log('Camera stopped');
    
    // Navigate back to home page
    navigate('/');
  };

  const initializePoseLandmarker = async () => {
    try {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );
      const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
          delegate: "GPU"
        },
        runningMode: "VIDEO",
        numPoses: 1
      });
      setLandmarker(poseLandmarker);
      console.log('Pose landmarker initialized successfully');
    } catch (err) {
      console.error('Error initializing pose detection:', err);
      setError('Failed to initialize pose detection');
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Pose detection loop
  useEffect(() => {
    let animationFrameId: number;

    const detectPose = async () => {
      if (!landmarker || !videoRef.current || !canvasRef.current || !isExerciseStarted) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Update canvas size if needed
      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      try {
        // Detect pose
        const results = await landmarker.detectForVideo(video, performance.now());

        // Clear and draw video frame
        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, 0, 0);

        if (results.landmarks && results.landmarks.length > 0) {
          const landmarks = results.landmarks[0];
          const drawingUtils = new DrawingUtils(ctx);

          // Process exercise form
          if (exercise === 'pushup') {
            const shoulder = landmarks[11]; // Right shoulder
            const elbow = landmarks[13]; // Right elbow
            const wrist = landmarks[15]; // Right wrist
            const hip = landmarks[23]; // Right hip
            const ankle = landmarks[27]; // Right ankle

            const elbowAngle = calculateAngle(shoulder, elbow, wrist);
            const bodyAngle = calculateAngle(shoulder, hip, ankle);

            // Check form and count reps
            if (bodyAngle > 160) { // Body is straight
              setIsCorrectForm(true);
              setFormFeedback(['Great form! Keep your back straight']);
              
              if (!isInDownPosition && elbowAngle < 90) {
                setIsInDownPosition(true);
                setFeedback('Good form! Now push up');
              } else if (isInDownPosition && elbowAngle > 160) {
                setIsInDownPosition(false);
                setRepCount(prev => prev + 1);
                setFeedback(`Great! ${repCount + 1} push-ups completed`);
              }
            } else {
              setIsCorrectForm(false);
              setFormFeedback(['Keep your body straight']);
            }

            // Draw pose
            const color = isCorrectForm ? '#00ffff' : '#ff0066';
            drawingUtils.drawConnectors(landmarks, PoseLandmarker.POSE_CONNECTIONS, { color });
            drawingUtils.drawLandmarks(landmarks, { color, radius: 4 });
          } else {
            // Squat detection
            const hip = landmarks[23];
            const knee = landmarks[25];
            const ankle = landmarks[27];

            const hipKneeDistance = Math.abs(hip.y - knee.y);
            const kneeAnkleDistance = Math.abs(knee.y - ankle.y);

            if (hipKneeDistance > kneeAnkleDistance * 0.5) {
              setIsCorrectForm(true);
              setFormFeedback(['Good squat depth!']);

              if (!isInDownPosition) {
                setIsInDownPosition(true);
                setFeedback('Great depth! Now stand up');
              }
            } else if (hipKneeDistance < kneeAnkleDistance * 0.3 && isInDownPosition) {
              setIsInDownPosition(false);
              setRepCount(prev => prev + 1);
              setFeedback(`Excellent! ${repCount + 1} squats completed`);
              setFormFeedback(['Good form! Keep going']);
            } else {
              setIsCorrectForm(false);
              setFormFeedback(['Bend your knees more']);
            }

            // Draw pose
            const color = isCorrectForm ? '#00ffff' : '#ff0066';
            drawingUtils.drawConnectors(landmarks, PoseLandmarker.POSE_CONNECTIONS, { color });
            drawingUtils.drawLandmarks(landmarks, { color, radius: 4 });
          }
        }

        ctx.restore();
      } catch (err) {
        console.error('Error in pose detection:', err);
      }

      // Continue detection loop
      animationFrameId = requestAnimationFrame(detectPose);
    };

    if (landmarker && videoRef.current && isExerciseStarted) {
      detectPose();
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [landmarker, isExerciseStarted, exercise, isInDownPosition, repCount]);

  // Calculate angle between three points
  const calculateAngle = (p1: any, p2: any, p3: any) => {
    const radians = Math.atan2(p3.y - p2.y, p3.x - p2.x) -
                   Math.atan2(p1.y - p2.y, p1.x - p2.x);
    let angle = Math.abs(radians * 180.0 / Math.PI);
    if (angle > 180.0) angle = 360 - angle;
    return angle;
  };

  return (
    <div className="pose-detector">
      {isLoading && <div className="loading">Loading camera...</div>}
      {error && <div className="error">{error}</div>}
      
      <div className="camera-controls">
        {!isCameraOn ? (
          <button className="camera-button start-camera" onClick={startCamera}>
            Start Camera
          </button>
        ) : (
          <button className="camera-button stop-camera" onClick={stopCamera}>
            Stop Camera
          </button>
        )}
      </div>

      <div className="video-container">
        <video
          ref={videoRef}
          playsInline
          style={{ transform: 'scaleX(-1)' }}
        />
        <canvas
          ref={canvasRef}
          className="pose-canvas"
          style={{ transform: 'scaleX(-1)' }}
        />
      </div>

      {isCameraOn && (
        <>
          <div className="feedback-overlay">
            <div className="rep-counter">Reps: {repCount}</div>
            <div className={`form-feedback ${isCorrectForm ? 'correct' : 'incorrect'}`}>
              {formFeedback.map((msg, i) => (
                <div key={i} className="feedback-item">{msg}</div>
              ))}
            </div>
            <div className="current-status">{feedback}</div>
          </div>

          <div className="control-buttons">
            {!isExerciseStarted ? (
              <button 
                className="start-button" 
                onClick={() => setIsExerciseStarted(true)}
              >
                Start {exercise === 'pushup' ? 'Push-ups' : 'Squats'}
              </button>
            ) : (
              <button 
                className="stop-button" 
                onClick={() => {
                  setIsExerciseStarted(false);
                  setRepCount(0);
                  onStop();
                }}
              >
                Stop Exercise
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PoseDetector;