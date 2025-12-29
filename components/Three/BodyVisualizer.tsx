
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';
import '../../types';

interface Props {
  bmi: number;
}

const HumanoidModel = ({ color, bmi }: { color: string, bmi: number }) => {
  const group = useRef<THREE.Group>(null);
  
  // Normalize BMI (Base 22). Range typically 15 to 45+
  // f = General Scale Factor
  const f = useMemo(() => {
     const val = isNaN(bmi) || bmi < 10 ? 22 : bmi;
     return Math.max(0.7, Math.min(2.5, val / 22));
  }, [bmi]);

  // Width multiplier (Shoulders/Chest)
  const w = Math.pow(f, 0.7);
  
  // Belly/Hips multiplier (Scales faster with higher BMI)
  const belly = Math.pow(f, 1.3); 
  
  // Limbs thickness
  const limbThick = Math.pow(f, 0.5);

  // Gentle idle animation
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.15;
      group.current.position.y = -1 + Math.sin(state.clock.getElapsedTime() * 1.5) * 0.05; // Bobbing
    }
  });

  const materialProps = {
    color: color,
    roughness: 0.5,
    metalness: 0.1,
    emissive: color,
    emissiveIntensity: 0.15
  };

  return (
    <group ref={group}>
      {/* Head - Scales slightly */}
      <mesh position={[0, 1.65, 0]} scale={[1 + (f-1)*0.15, 1 + (f-1)*0.1, 1 + (f-1)*0.15]}>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>
      
      {/* Torso - Morphing Cylinder */}
      <mesh position={[0, 0.95, 0]}>
        {/* Top Radius scales with width, Bottom Radius scales with belly */}
        <cylinderGeometry args={[0.25 * w, 0.22 * belly, 1, 32]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>

      {/* Shoulders - Widens with body */}
      <mesh position={[0, 1.35, 0]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.1 * limbThick, 0.8 + (w-1)*0.4, 4, 16]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>

      {/* Arms - Move outward and thicken */}
      <mesh position={[-0.45 - (w-1)*0.2, 0.8, 0]} rotation={[0, 0, 0.2 + (f-1)*0.05]}>
        <capsuleGeometry args={[0.08 * limbThick, 0.9, 4, 16]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>
      <mesh position={[0.45 + (w-1)*0.2, 0.8, 0]} rotation={[0, 0, -0.2 - (f-1)*0.05]}>
        <capsuleGeometry args={[0.08 * limbThick, 0.9, 4, 16]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>

      {/* Hips - Scales significantly */}
      <mesh position={[0, 0.35, 0]} scale={[belly, 1, belly*0.9]}>
        <sphereGeometry args={[0.26, 32, 32]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>

      {/* Legs - Move apart and thicken */}
      <mesh position={[-0.15 - (belly-1)*0.12, -0.6, 0]} rotation={[0, 0, (f > 1.3 ? -0.05 : 0)]}>
        <capsuleGeometry args={[0.11 * limbThick, 1.4, 4, 16]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>
      <mesh position={[0.15 + (belly-1)*0.12, -0.6, 0]} rotation={[0, 0, (f > 1.3 ? 0.05 : 0)]}>
        <capsuleGeometry args={[0.11 * limbThick, 1.4, 4, 16]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>
    </group>
  );
};

export const BodyVisualizer: React.FC<Props> = ({ bmi }) => {
  let color = '#10b981'; // Healthy (Green)
  
  if (bmi < 18.5) color = '#3b82f6'; // Underweight (Blue)
  else if (bmi >= 25 && bmi < 30) color = '#f59e0b'; // Overweight (Amber)
  else if (bmi >= 30) color = '#ef4444'; // Obese (Red)

  const safeBmi = isNaN(bmi) ? 22 : bmi;

  return (
    <div className="w-full h-[400px] bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-950 rounded-2xl overflow-hidden relative border border-border shadow-inner">
        <div className="absolute top-4 left-4 z-10 bg-white/80 dark:bg-black/50 backdrop-blur-md p-2 rounded-lg border border-border text-xs font-mono">
            <div className="font-bold mb-1 border-b border-gray-500/20 pb-1">Status: {safeBmi.toFixed(1)} BMI</div>
            <div className="flex items-center gap-2 mb-1 opacity-80">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div> &lt; 18.5
            </div>
            <div className="flex items-center gap-2 mb-1 opacity-80">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div> 18.5 - 25
            </div>
            <div className="flex items-center gap-2 mb-1 opacity-80">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div> 25 - 30
            </div>
            <div className="flex items-center gap-2 opacity-80">
                <div className="w-2 h-2 rounded-full bg-red-500"></div> 30+
            </div>
        </div>
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={50} />
        <ambientLight intensity={0.6} />
        <spotLight position={[10, 10, 10]} angle={0.2} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -5, -10]} intensity={0.5} color={color} />
        
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
            <HumanoidModel color={color} bmi={safeBmi} />
        </Float>
        
        <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 1.5} />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};
