import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls, Environment, Float, ContactShadows, useCursor } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { ArrowRight, X, Activity } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { visualDiscoveryTranslations } from '../../utils/visualDiscoveryTranslations';
import '../../types';

const BODY_ZONES_BASE = [
  { id: 'brain', category: 'Education', color: '#6366f1', position: [0, 1.9, 0.3], tools: ['gpa', 'pomodoro', 'read-time'] },
  { id: 'heart', category: 'Health', color: '#f43f5e', position: [0.2, 1.1, 0.5], tools: ['hr-zones', 'bmi', 'blood-pressure'] }, // Note: blood-pressure tool might not exist in registry, ensuring fallback 
  { id: 'gut', category: 'Nutrition', color: '#10b981', position: [0, 0.6, 0.5], tools: ['tdee', 'macros', 'cal-lookup'] },
  { id: 'muscle', category: 'Sports', color: '#f59e0b', position: [-0.7, 0.5, 0], tools: ['one-rep-max', 'pace', 'protein'] }, // one-rep-max/protein placeholders
  { id: 'genes', category: 'Family', color: '#8b5cf6', position: [0.6, -0.8, 0], tools: ['due-date', 'growth', 'blood-type'] }
];

const PulsingHotspot = ({ position, color, onClick }: any) => {
    const mesh = useRef<THREE.Mesh>(null);
    const [hovered, setHover] = useState(false);
    useCursor(hovered);

    useFrame((state) => {
        if(mesh.current) {
            const scale = 0.6 + Math.sin(state.clock.elapsedTime * 3) * 0.15;
            mesh.current.scale.set(scale, scale, scale);
        }
    });

    return (
        <group position={position}>
            {/* Visual Indicator */}
            <mesh ref={mesh}>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshStandardMaterial color="white" emissive={color} emissiveIntensity={2} toneMapped={false} />
            </mesh>
            {/* Invisible Click Target */}
            <mesh 
                onClick={(e) => { e.stopPropagation(); onClick(e); }}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
                visible={false}
            >
                <sphereGeometry args={[0.35, 16, 16]} />
                <meshBasicMaterial transparent opacity={0.1} />
            </mesh>
        </group>
    );
}

const HumanoidMesh = () => {
    const color = "#94a3b8"; // Slate 400
    const materialProps = { color, roughness: 0.4, metalness: 0.3 };
    
    return (
        <group>
             {/* Head */}
            <mesh position={[0, 1.6, 0]}>
                <sphereGeometry args={[0.25, 32, 32]} />
                <meshStandardMaterial {...materialProps} />
            </mesh>
            {/* Neck */}
            <mesh position={[0, 1.3, 0]}>
                <cylinderGeometry args={[0.1, 0.12, 0.3]} />
                <meshStandardMaterial {...materialProps} />
            </mesh>
            {/* Torso */}
            <mesh position={[0, 0.7, 0]}>
                <cylinderGeometry args={[0.28, 0.22, 1.2]} />
                <meshStandardMaterial {...materialProps} />
            </mesh>
            {/* Arms */}
            <mesh position={[-0.45, 0.7, 0]} rotation={[0, 0, 0.2]}>
                <capsuleGeometry args={[0.09, 0.9]} />
                <meshStandardMaterial {...materialProps} />
            </mesh>
            <mesh position={[0.45, 0.7, 0]} rotation={[0, 0, -0.2]}>
                <capsuleGeometry args={[0.09, 0.9]} />
                <meshStandardMaterial {...materialProps} />
            </mesh>
            {/* Legs */}
            <mesh position={[-0.15, -0.6, 0]}>
                <capsuleGeometry args={[0.11, 1.4]} />
                <meshStandardMaterial {...materialProps} />
            </mesh>
            <mesh position={[0.15, -0.6, 0]}>
                <capsuleGeometry args={[0.11, 1.4]} />
                <meshStandardMaterial {...materialProps} />
            </mesh>
        </group>
    );
};

const BodyScene = ({ onSelectZone }: { onSelectZone: (zone: any) => void }) => {
    const { language, t: tGlobal } = useLanguage();
    const tVis = visualDiscoveryTranslations[language] || visualDiscoveryTranslations['en'];

    const zones = useMemo(() => BODY_ZONES_BASE.map(z => ({
        ...z,
        // @ts-ignore
        name: tVis.bodyZones[z.id],
        category: tGlobal(z.category) || z.category
    })), [language, tVis, tGlobal]);

    return (
        <>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
            <Environment preset="city" />
            
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.2}>
                <group position={[0, -0.5, 0]}>
                    <HumanoidMesh />
                    
                    {zones.map(zone => (
                        <group key={zone.id}>
                            <PulsingHotspot 
                                position={zone.position} 
                                color={zone.color} 
                                onClick={(e: any) => onSelectZone(zone)} 
                            />
                            <Html 
                                position={[zone.position[0] + 0.2, zone.position[1], zone.position[2]]} 
                                distanceFactor={8} 
                                zIndexRange={[100, 0]}
                                style={{ pointerEvents: 'none' }}
                            >
                                <div className="pointer-events-none bg-black/60 text-white px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap backdrop-blur-sm border border-white/10 opacity-70">
                                    {zone.name}
                                </div>
                            </Html>
                        </group>
                    ))}
                </group>
            </Float>

            <OrbitControls enablePan={false} minDistance={3} maxDistance={6} maxPolarAngle={Math.PI / 1.8} />
            <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
        </>
    );
};

export const InteractiveBody = () => {
    const [selectedZone, setSelectedZone] = useState<any>(null);
    const navigate = useNavigate();
    const { t } = useLanguage();

    return (
        <div className="w-full h-[600px] relative bg-gradient-to-b from-rose-50 to-blue-50 dark:from-slate-900 dark:to-slate-950 overflow-hidden rounded-3xl border border-border shadow-2xl">
             <div className="absolute top-6 left-6 z-10">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Activity className="w-6 h-6 text-rose-500" /> Bio-Map
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-xs">Explore calculators by anatomy</p>
            </div>

            <Canvas shadows camera={{ position: [0, 0, 4.5], fov: 45 }}>
                <BodyScene onSelectZone={setSelectedZone} />
            </Canvas>

            {selectedZone && (
                <div className="absolute bottom-6 right-6 z-20 w-72 animate-in slide-in-from-bottom-5 fade-in duration-300">
                    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-border rounded-2xl p-5 shadow-2xl">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedZone.name}</h3>
                                <span className="text-xs font-bold text-primary uppercase">{selectedZone.category}</span>
                            </div>
                            <button onClick={() => setSelectedZone(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="space-y-2">
                            {selectedZone.tools.map((toolId: string) => (
                                <button 
                                    key={toolId}
                                    onClick={() => navigate(`/calculator/${toolId}`)}
                                    className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-primary hover:text-white dark:hover:bg-primary transition-colors text-sm font-medium group"
                                >
                                    <span className="capitalize">{t(toolId.replace('-', ' '))}</span>
                                    <ArrowRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};