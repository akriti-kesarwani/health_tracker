import React, { useRef, useEffect } from 'react';

interface Point {
  x: number;
  y: number;
  confidence: number;
}

interface MovementPathVisualizerProps {
  points: Point[];
  width: number;
  height: number;
  color: string;
}

const MovementPathVisualizer: React.FC<MovementPathVisualizerProps> = ({
  points,
  width,
  height,
  color
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    if (points.length > 1) {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);

      for (let i = 1; i < points.length; i++) {
        const point = points[i];
        const prevPoint = points[i - 1];
        
        // Draw line with opacity based on confidence
        ctx.globalAlpha = (point.confidence + prevPoint.confidence) / 2;
        ctx.lineTo(point.x, point.y);
      }

      ctx.stroke();
    }
  }, [points, width, height, color]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none'
      }}
    />
  );
};

export default MovementPathVisualizer; 