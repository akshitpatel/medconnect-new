'use client';

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, useTexture, RoundedBox, MeshWobbleMaterial, MeshDistortMaterial, Environment, Float, useGLTF, OrbitControls } from '@react-three/drei';
import { Vector3, Euler, Group } from 'three';
import { motion } from 'framer-motion';
import { useTheme } from '@/app/contexts/ThemeContext';

// Define step data type
interface Step {
  number: string;
  title: string;
  description: string;
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
  icon: 'search' | 'calendar' | 'care';
}

// Define step data
const steps: Step[] = [
  {
    number: "1",
    title: "Search",
    description: "Find doctors, labs, or medicines based on your needs and location.",
    position: [-3, 0, 0],
    rotation: [0, 0.2, 0],
    color: "#0d9488", // teal-600
    icon: "search"
  },
  {
    number: "2",
    title: "Book",
    description: "Schedule appointments at your convenient time with just a few clicks.",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    color: "#0f766e", // teal-700
    icon: "calendar"
  },
  {
    number: "3",
    title: "Receive Care",
    description: "Get treated by top healthcare professionals with quality care.",
    position: [3, 0, 0],
    rotation: [0, -0.2, 0],
    color: "#0891b2", // cyan-600
    icon: "care"
  }
];

interface Step3DProps {
  step: Step;
  isHovered: boolean;
  onHover: (stepNumber: string | null) => void;
}

// Helper component for each step
const Step3D: React.FC<Step3DProps> = ({ step, isHovered, onHover }) => {
  const groupRef = useRef<Group>(null);
  const { isDarkMode } = useTheme();
  
  // Rotate animation
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.1 + step.rotation[1];
      groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.8) * 0.1 + 0;
    }
  });
  
  // Scale effect on hover
  const scale = isHovered ? 1.15 : 1;
  
  return (
    <group 
      ref={groupRef} 
      position={new Vector3(...step.position)} 
      onPointerOver={() => onHover(step.number)} 
      onPointerOut={() => onHover(null)}
      scale={[scale, scale, scale]}
    >
      <RoundedBox args={[2, 3, 0.2]} radius={0.1} smoothness={4}>
        <MeshWobbleMaterial 
          factor={0.1} 
          speed={0.5} 
          color={step.color} 
          metalness={0.3} 
          roughness={0.7} 
          opacity={0.95}
          transparent
        />
      </RoundedBox>
      
      {/* Step number */}
      <group position={[0, 1, 0.15]}>
        <RoundedBox args={[0.8, 0.8, 0.1]} radius={0.4} smoothness={4}>
          <meshStandardMaterial color="#ffffff" />
        </RoundedBox>
        <Text
          position={[0, 0, 0.16]}
          fontSize={0.4}
          color={step.color}
          font="/fonts/Inter-Bold.woff"
          anchorX="center"
          anchorY="middle"
        >
          {step.number}
        </Text>
      </group>
      
      {/* Icon */}
      <IconMesh icon={step.icon} position={[0, 0.3, 0.15]} />
      
      {/* Title */}
      <Text
        position={[0, -0.4, 0.15]}
        fontSize={0.25}
        color={isDarkMode ? "#ffffff" : "#111827"}
        font="/fonts/Inter-Bold.woff"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.8}
      >
        {step.title}
      </Text>
      
      {/* Description */}
      <Text
        position={[0, -1, 0.15]}
        fontSize={0.13}
        color={isDarkMode ? "#9ca3af" : "#4b5563"}
        font="/fonts/Inter-Regular.woff"
        anchorX="center"
        anchorY="middle"
        textAlign="center"
        maxWidth={1.8}
      >
        {step.description}
      </Text>
    </group>
  );
};

interface IconMeshProps {
  icon: 'search' | 'calendar' | 'care';
  position: [number, number, number];
}

// Icon Mesh component
const IconMesh: React.FC<IconMeshProps> = ({ icon, position }) => {
  switch (icon) {
    case 'search':
      return (
        <group position={position}>
          <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
            <RoundedBox args={[0.7, 0.7, 0.05]} radius={0.35} smoothness={4}>
              <MeshDistortMaterial speed={0.5} distort={0.2} color="#14b8a6" />
            </RoundedBox>
            {/* Simplified Search Icon */}
            <mesh position={[0, 0, 0.1]}>
              <ringGeometry args={[0.15, 0.25, 32]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0.2, -0.2, 0.1]} rotation={[0, 0, Math.PI/4]}>
              <boxGeometry args={[0.25, 0.05, 0.01]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
          </Float>
        </group>
      );
    case 'calendar':
      return (
        <group position={position}>
          <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
            <RoundedBox args={[0.7, 0.7, 0.05]} radius={0.35} smoothness={4}>
              <MeshDistortMaterial speed={0.5} distort={0.2} color="#0d9488" />
            </RoundedBox>
            {/* Simplified Calendar Icon */}
            <mesh position={[0, 0, 0.1]}>
              <boxGeometry args={[0.4, 0.4, 0.01]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0, 0.1, 0.12]}>
              <boxGeometry args={[0.35, 0.15, 0.01]} />
              <meshStandardMaterial color="#0d9488" />
            </mesh>
            <mesh position={[-0.1, -0.05, 0.12]}>
              <boxGeometry args={[0.05, 0.05, 0.01]} />
              <meshStandardMaterial color="#0d9488" />
            </mesh>
            <mesh position={[0.1, -0.05, 0.12]}>
              <boxGeometry args={[0.05, 0.05, 0.01]} />
              <meshStandardMaterial color="#0d9488" />
            </mesh>
          </Float>
        </group>
      );
    case 'care':
      return (
        <group position={position}>
          <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
            <RoundedBox args={[0.7, 0.7, 0.05]} radius={0.35} smoothness={4}>
              <MeshDistortMaterial speed={0.5} distort={0.2} color="#0891b2" />
            </RoundedBox>
            {/* Simplified Heart Icon */}
            <mesh position={[0, 0, 0.1]}>
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0.18, 0.18, 0.1]}>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            <mesh position={[-0.18, 0.18, 0.1]}>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
          </Float>
        </group>
      );
    default:
      return null;
  }
};

// Main scene component
const Scene: React.FC = () => {
  const [hoveredStep, setHoveredStep] = useState<string | null>(null);
  const { isDarkMode } = useTheme();
  
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} />
      
      {/* Environment for realistic lighting */}
      <Environment preset="city" />
      
      {/* Background plane */}
      <mesh position={[0, 0, -1]} rotation={[0, 0, 0]}>
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial color={isDarkMode ? "#1f2937" : "#f3f4f6"} />
      </mesh>
      
      {/* Render steps */}
      {steps.map((step) => (
        <Step3D 
          key={step.number}
          step={step}
          isHovered={hoveredStep === step.number}
          onHover={setHoveredStep}
        />
      ))}
      
      {/* Controls */}
      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        minPolarAngle={Math.PI / 2} 
        maxPolarAngle={Math.PI / 2}
        minAzimuthAngle={-Math.PI / 8}
        maxAzimuthAngle={Math.PI / 8}
      />
    </>
  );
};

// Responsive wrapper for the 3D canvas
const HowItWorks3D: React.FC = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <motion.div 
      className="relative h-[500px] w-full mb-8"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <Canvas 
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 2]} // Optimize performance
        style={{ background: isDarkMode ? '#111827' : '#f9fafb' }}
      >
        <Scene />
      </Canvas>
      
      {/* Fallback content for mobile - will show in case 3D doesn't work on device */}
      <div className="block md:hidden absolute inset-0 flex items-center justify-center">
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-lg`}>
          <p className="text-center">
            Please view on a larger screen for the full 3D experience.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default HowItWorks3D; 