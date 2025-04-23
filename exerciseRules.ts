import { Point2D, calculateAngle } from './poseUtils';

export interface PoseEvaluation {
  isCorrect: boolean;
  feedback: string[];
  problemAreas: string[];
}

interface Point {
  x: number;
  y: number;
  z: number;
}

interface Evaluation {
  isCorrect: boolean;
  feedback: string[];
}

export const calculateAngle = (p1: Point, p2: Point, p3: Point): number => {
  const radians = Math.atan2(p3.y - p2.y, p3.x - p2.x) -
                 Math.atan2(p1.y - p2.y, p1.x - p2.x);
  let angle = Math.abs(radians * 180.0 / Math.PI);
  
  if (angle > 180.0) {
    angle = 360 - angle;
  }
  
  return angle;
};

export const evaluateSquat = (landmarks: Point[]): Evaluation => {
  const feedback: string[] = [];
  
  // Check knee angle
  const kneeAngle = calculateAngle(
    landmarks[23], // hip
    landmarks[25], // knee
    landmarks[27]  // ankle
  );
  
  // Check hip angle
  const hipAngle = calculateAngle(
    landmarks[11], // shoulder
    landmarks[23], // hip
    landmarks[25]  // knee
  );
  
  if (kneeAngle > 170) {
    feedback.push('Bend your knees more');
  }
  
  if (hipAngle < 45) {
    feedback.push('Lower your hips more');
  }
  
  return {
    isCorrect: feedback.length === 0,
    feedback
  };
};

export const evaluatePushup = (landmarks: Point[]): Evaluation => {
  const feedback: string[] = [];
  
  // Check elbow angle
  const elbowAngle = calculateAngle(
    landmarks[11], // shoulder
    landmarks[13], // elbow
    landmarks[15]  // wrist
  );
  
  // Check back alignment
  const backAngle = calculateAngle(
    landmarks[11], // shoulder
    landmarks[23], // hip
    landmarks[25]  // knee
  );
  
  if (elbowAngle > 90) {
    feedback.push('Lower your chest more');
  }
  
  if (backAngle < 160) {
    feedback.push('Keep your back straight');
  }
  
  return {
    isCorrect: feedback.length === 0,
    feedback
  };
}; 