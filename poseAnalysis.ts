import { NormalizedLandmark } from '@mediapipe/tasks-vision';

export type Exercise = 'squat' | 'pushup';
export type Phase = 'initial' | 'descent' | 'bottom' | 'ascent';

interface PoseAnalysisResult {
  isCorrect: boolean;
  phase: Phase;
  issues: string[];
  problematicJoints: string[];
}

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

const calculateParallelism = (
  p1: NormalizedLandmark,
  p2: NormalizedLandmark,
  threshold: number = 0.1
): boolean => {
  return Math.abs(p1.y - p2.y) < threshold;
};

export const analyzeSquat = (landmarks: NormalizedLandmark[]): PoseAnalysisResult => {
  const issues: string[] = [];
  const problematicJoints: string[] = [];
  let phase: Phase = 'initial';
  
  // Key points for squat analysis
  const leftHip = landmarks[23];
  const rightHip = landmarks[24];
  const leftKnee = landmarks[25];
  const rightKnee = landmarks[26];
  const leftAnkle = landmarks[27];
  const rightAnkle = landmarks[28];
  const leftShoulder = landmarks[11];
  const rightShoulder = landmarks[12];

  // Calculate angles
  const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
  const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
  const rightHipAngle = calculateAngle(rightShoulder, rightHip, rightKnee);
  const leftHipAngle = calculateAngle(leftShoulder, leftHip, leftKnee);

  // Check hip symmetry
  const hipsParallel = calculateParallelism(leftHip, rightHip);
  const shouldersParallel = calculateParallelism(leftShoulder, rightShoulder);

  // Determine phase based on knee angles
  const avgKneeAngle = (rightKneeAngle + leftKneeAngle) / 2;
  if (avgKneeAngle > 160) {
    phase = 'initial';
  } else if (avgKneeAngle < 90) {
    phase = 'bottom';
  } else if (phase === 'initial') {
    phase = 'descent';
  } else {
    phase = 'ascent';
  }

  // Check form issues
  if (!hipsParallel || !shouldersParallel) {
    issues.push('Keep your hips and shoulders level');
    problematicJoints.push('leftHip', 'rightHip', 'leftShoulder', 'rightShoulder');
  }

  if (Math.abs(rightKneeAngle - leftKneeAngle) > 15) {
    issues.push('Keep your knees equally bent');
    problematicJoints.push('leftKnee', 'rightKnee');
  }

  if ((rightHipAngle < 45 || leftHipAngle < 45) && phase === 'bottom') {
    issues.push('Keep your chest up, back straight');
    problematicJoints.push('leftHip', 'rightHip');
  }

  if (avgKneeAngle > 100 && phase === 'bottom') {
    issues.push('Squat deeper - knees should bend to at least 90 degrees');
    problematicJoints.push('leftKnee', 'rightKnee');
  }

  return {
    isCorrect: issues.length === 0,
    phase,
    issues,
    problematicJoints
  };
};

export const analyzePushup = (landmarks: NormalizedLandmark[]): PoseAnalysisResult => {
  const issues: string[] = [];
  const problematicJoints: string[] = [];
  let phase: Phase = 'initial';

  // Key points for pushup analysis
  const leftShoulder = landmarks[11];
  const rightShoulder = landmarks[12];
  const leftElbow = landmarks[13];
  const rightElbow = landmarks[14];
  const leftWrist = landmarks[15];
  const rightWrist = landmarks[16];
  const leftHip = landmarks[23];
  const rightHip = landmarks[24];
  const leftAnkle = landmarks[27];
  const rightAnkle = landmarks[28];

  // Calculate angles
  const rightElbowAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);
  const leftElbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
  const backAngleRight = calculateAngle(rightShoulder, rightHip, rightAnkle);
  const backAngleLeft = calculateAngle(leftShoulder, leftHip, leftAnkle);

  // Check body alignment
  const shouldersParallel = calculateParallelism(leftShoulder, rightShoulder);
  const hipsParallel = calculateParallelism(leftHip, rightHip);
  const avgElbowAngle = (rightElbowAngle + leftElbowAngle) / 2;

  // Determine phase based on elbow angle
  if (avgElbowAngle > 160) {
    phase = 'initial';
  } else if (avgElbowAngle < 90) {
    phase = 'bottom';
  } else if (phase === 'initial') {
    phase = 'descent';
  } else {
    phase = 'ascent';
  }

  // Check form issues
  if (!shouldersParallel || !hipsParallel) {
    issues.push('Keep your body level - shoulders and hips should be parallel to the ground');
    problematicJoints.push('leftShoulder', 'rightShoulder', 'leftHip', 'rightHip');
  }

  if (Math.abs(rightElbowAngle - leftElbowAngle) > 15) {
    issues.push('Keep your arms equally bent');
    problematicJoints.push('leftElbow', 'rightElbow');
  }

  const avgBackAngle = (backAngleRight + backAngleLeft) / 2;
  if (avgBackAngle < 160) {
    issues.push('Keep your back straight - avoid sagging or lifting your hips');
    problematicJoints.push('leftHip', 'rightHip');
  }

  if (avgElbowAngle > 90 && phase === 'bottom') {
    issues.push('Lower your chest more - elbows should bend to at least 90 degrees');
    problematicJoints.push('leftElbow', 'rightElbow');
  }

  return {
    isCorrect: issues.length === 0,
    phase,
    issues,
    problematicJoints
  };
};
