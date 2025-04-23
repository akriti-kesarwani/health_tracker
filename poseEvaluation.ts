import { Results, NormalizedLandmark } from '@mediapipe/tasks-vision';

interface JointAngles {
  knee: number;
  hip: number;
  ankle: number;
  elbow: number;
  shoulder: number;
  wrist: number;
}

export interface PoseEvaluation {
  isCorrect: boolean;
  feedback: string[];
  problematicJoints: string[];
}

// Calculate angle between three points
const calculateAngle = (
  p1: NormalizedLandmark,
  p2: NormalizedLandmark,
  p3: NormalizedLandmark
): number => {
  const radians = Math.atan2(p3.y - p2.y, p3.x - p2.x) -
                 Math.atan2(p1.y - p2.y, p1.x - p2.x);
  let angle = Math.abs(radians * 180.0 / Math.PI);
  if (angle > 180.0) angle = 360 - angle;
  return angle;
};

// Evaluate squat form
export const evaluateSquat = (results: Results): PoseEvaluation => {
  const landmarks = results.landmarks[0];
  const feedback: string[] = [];
  const problematicJoints: string[] = [];

  // Get relevant landmarks for squat
  const hip = landmarks[24]; // Right hip
  const knee = landmarks[26]; // Right knee
  const ankle = landmarks[28]; // Right ankle
  const shoulder = landmarks[12]; // Right shoulder

  // Calculate angles
  const kneeAngle = calculateAngle(hip, knee, ankle);
  const hipAngle = calculateAngle(shoulder, hip, knee);

  // Check knee bend (should be around 90 degrees in bottom position)
  if (kneeAngle > 100) {
    feedback.push("Knees not bent enough");
    problematicJoints.push("knee");
  }

  // Check back angle (should be relatively straight)
  if (hipAngle < 45 || hipAngle > 100) {
    feedback.push("Back angle incorrect - keep chest up");
    problematicJoints.push("hip");
  }

  return {
    isCorrect: feedback.length === 0,
    feedback,
    problematicJoints
  };
};

// Evaluate push-up form
export const evaluatePushup = (results: Results): PoseEvaluation => {
  const landmarks = results.landmarks[0];
  const feedback: string[] = [];
  const problematicJoints: string[] = [];

  // Get relevant landmarks for push-up
  const shoulder = landmarks[12]; // Right shoulder
  const elbow = landmarks[14]; // Right elbow
  const wrist = landmarks[16]; // Right wrist
  const hip = landmarks[24]; // Right hip
  const ankle = landmarks[28]; // Right ankle

  // Calculate angles
  const elbowAngle = calculateAngle(shoulder, elbow, wrist);
  const backAngle = calculateAngle(shoulder, hip, ankle);

  // Check elbow bend (should be around 90 degrees in bottom position)
  if (elbowAngle > 100) {
    feedback.push("Lower your chest - elbows should bend to 90 degrees");
    problematicJoints.push("elbow");
  }

  // Check back alignment (should be straight)
  if (backAngle < 160) {
    feedback.push("Keep your back straight - no sagging");
    problematicJoints.push("hip");
  }

  return {
    isCorrect: feedback.length === 0,
    feedback,
    problematicJoints
  };
}; 