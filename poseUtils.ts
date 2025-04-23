import { PoseLandmarker, DrawingUtils } from '@mediapipe/tasks-vision';

export interface Point2D {
  x: number;
  y: number;
}

export interface Point3D extends Point2D {
  z: number;
}

export const calculateAngle = (p1: Point2D, p2: Point2D, p3: Point2D): number => {
  const radians = Math.atan2(p3.y - p2.y, p3.x - p2.x) -
                 Math.atan2(p1.y - p2.y, p1.x - p2.x);
  let angle = Math.abs(radians * 180.0 / Math.PI);
  
  if (angle > 180.0) {
    angle = 360 - angle;
  }
  
  return angle;
};

export const drawPose = (
  ctx: CanvasRenderingContext2D,
  landmarks: any[],
  connections: any[],
  color: string
) => {
  const drawingUtils = new DrawingUtils(ctx);
  
  // Draw landmarks
  landmarks.forEach(landmark => {
    drawingUtils.drawLandmark(landmark, {
      color: color,
      lineWidth: 2,
      radius: 4
    });
  });
  
  // Draw connections
  connections.forEach(([start, end]) => {
    drawingUtils.drawConnector(
      landmarks[start],
      landmarks[end],
      { color: color, lineWidth: 2 }
    );
  });
}; 