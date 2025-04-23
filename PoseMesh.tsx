import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { NormalizedLandmark } from '@mediapipe/tasks-vision';

interface PoseMeshProps {
  landmarks: NormalizedLandmark[];
  isCorrect: boolean;
  problematicJoints: string[];
}

// Map joint names to landmark indices
const jointIndices: { [key: string]: number } = {
  leftShoulder: 11,
  rightShoulder: 12,
  leftElbow: 13,
  rightElbow: 14,
  leftWrist: 15,
  rightWrist: 16,
  leftHip: 23,
  rightHip: 24,
  leftKnee: 25,
  rightKnee: 26,
  leftAnkle: 27,
  rightAnkle: 28,
};

const PoseMesh: React.FC<PoseMeshProps> = ({ landmarks, isCorrect, problematicJoints }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const problematicPointsRef = useRef<THREE.Points>(null);

  // Convert normalized coordinates to scene coordinates
  const transformCoordinates = (landmark: NormalizedLandmark) => {
    return new THREE.Vector3(
      (landmark.x - 0.5) * 2,
      (0.5 - landmark.y) * 2,
      -landmark.z * 2
    );
  };

  // Define connections between landmarks for skeleton visualization
  const connections = [
    // Torso
    [11, 12], [12, 24], [24, 23], [23, 11],
    // Right arm
    [12, 14], [14, 16],
    // Left arm
    [11, 13], [13, 15],
    // Right leg
    [24, 26], [26, 28], [28, 32],
    // Left leg
    [23, 25], [25, 27], [27, 31],
  ];

  useFrame(() => {
    if (!pointsRef.current || !linesRef.current || !problematicPointsRef.current || landmarks.length === 0) return;

    // Update regular points positions
    const positions = new Float32Array(landmarks.length * 3);
    landmarks.forEach((landmark, i) => {
      const point = transformCoordinates(landmark);
      positions[i * 3] = point.x;
      positions[i * 3 + 1] = point.y;
      positions[i * 3 + 2] = point.z;
    });
    pointsRef.current.geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );

    // Update problematic points positions
    const problematicPositions = new Float32Array(problematicJoints.length * 3);
    problematicJoints.forEach((joint, i) => {
      const landmarkIndex = jointIndices[joint];
      if (landmarkIndex !== undefined) {
        const point = transformCoordinates(landmarks[landmarkIndex]);
        problematicPositions[i * 3] = point.x;
        problematicPositions[i * 3 + 1] = point.y;
        problematicPositions[i * 3 + 2] = point.z;
      }
    });
    problematicPointsRef.current.geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(problematicPositions, 3)
    );

    // Update lines positions
    const linePositions = new Float32Array(connections.length * 6);
    connections.forEach((connection, i) => {
      const start = transformCoordinates(landmarks[connection[0]]);
      const end = transformCoordinates(landmarks[connection[1]]);
      linePositions[i * 6] = start.x;
      linePositions[i * 6 + 1] = start.y;
      linePositions[i * 6 + 2] = start.z;
      linePositions[i * 6 + 3] = end.x;
      linePositions[i * 6 + 4] = end.y;
      linePositions[i * 6 + 5] = end.z;
    });
    linesRef.current.geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(linePositions, 3)
    );
  });

  const baseColor = isCorrect ? '#00ff00' : '#ffff00';

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry />
        <pointsMaterial
          size={0.05}
          color={baseColor}
          transparent
          opacity={0.8}
          sizeAttenuation
        />
      </points>
      <points ref={problematicPointsRef}>
        <bufferGeometry />
        <pointsMaterial
          size={0.08}
          color="#ff0000"
          transparent
          opacity={0.9}
          sizeAttenuation
        />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry />
        <lineBasicMaterial color={baseColor} linewidth={2} />
      </lineSegments>
    </>
  );
};

export default PoseMesh;
