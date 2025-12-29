import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Text, Edges } from '@react-three/drei';
import '../../types';

interface Props {
  width: number;
  length: number;
  height?: number; // Optional height, defaults for floor plans
}

const RoomMesh = ({ width, length, height = 2.5 }: Props) => {
  // Normalize scale to fit in view
  const maxDim = Math.max(width, length);
  const scale = 4 / maxDim;

  return (
    <group scale={scale}>
        {/* Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -height/2, 0]}>
            <planeGeometry args={[width, length]} />
            <meshStandardMaterial color="#e2e8f0" />
            <Edges color="#94a3b8" />
        </mesh>

        {/* Walls (Transparent) */}
        <mesh position={[0, 0, 0]}>
            <boxGeometry args={[width, height, length]} />
            <meshBasicMaterial color="#3b82f6" transparent opacity={0.1} wireframe={false} side={2} />
            <Edges color="#3b82f6" threshold={15} />
        </mesh>

        {/* Dimensions Text */}
        <Text position={[0, -height/2 + 0.1, length/2 + 0.2]} fontSize={0.3} color="#0f172a" rotation={[-Math.PI/2, 0, 0]}>
            {width}m Width
        </Text>
        <Text position={[width/2 + 0.2, -height/2 + 0.1, 0]} fontSize={0.3} color="#0f172a" rotation={[-Math.PI/2, 0, -Math.PI/2]}>
            {length}m Length
        </Text>
    </group>
  );
};

export const RoomVisualizer: React.FC<Props> = ({ width, length, height }) => {
  return (
    <div className="w-full h-[300px] bg-slate-50 dark:bg-slate-900 rounded-2xl overflow-hidden border border-border shadow-inner relative">
        <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-white/90 dark:bg-black/80 rounded-full text-xs font-bold shadow-sm">
            3D Preview
        </div>
      <Canvas camera={{ position: [5, 5, 5], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} />
        <RoomMesh width={width || 5} length={length || 4} height={height || 2.5} />
        <Grid infiniteGrid fadeDistance={20} sectionColor="#cbd5e1" cellColor="#e2e8f0" />
        <OrbitControls autoRotate autoRotateSpeed={1} />
      </Canvas>
    </div>
  );
};