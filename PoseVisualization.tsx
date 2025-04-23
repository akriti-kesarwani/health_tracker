import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';

interface Joint {
  position: THREE.Vector3;
  color: string;
  feedback?: string;
}

interface PoseVisualizationProps {
  joints: Joint[];
  connections: [number, number][];
}

function JointMesh({ position, color, feedback }: Joint) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.03, 32, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {feedback && (
        <Text
          position={[0, 0.1, 0]}
          fontSize={0.05}
          color={color}
          anchorX="center"
          anchorY="middle"
        >
          {feedback}
        </Text>
      )}
    </group>
  );
}

function Connections({ joints, connections }: PoseVisualizationProps) {
  return (
    <>
      {connections.map(([start, end], index) => {
        const startJoint = joints[start];
        const endJoint = joints[end];
        
        const points = [startJoint.position, endJoint.position];
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        
        return (
          <line key={index} geometry={lineGeometry}>
            <lineBasicMaterial color={startJoint.color} linewidth={2} />
          </line>
        );
      })}
    </>
  );
}

function Scene({ joints, connections }: PoseVisualizationProps) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Connections joints={joints} connections={connections} />
      {joints.map((joint, index) => (
        <JointMesh key={index} {...joint} />
      ))}
      <OrbitControls />
    </>
  );
}

const PoseVisualization: React.FC<PoseVisualizationProps> = ({ joints, connections }) => {
  return (
    <div className="pose-visualization">
      <Canvas camera={{ position: [0, 0, 2] }}>
        <Scene joints={joints} connections={connections} />
      </Canvas>
    </div>
  );
};

export default PoseVisualization; 