import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls, Environment, Float, ContactShadows, useCursor } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { ArrowRight, X, Car } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { visualDiscoveryTranslations } from '../../utils/visualDiscoveryTranslations';
import '../../types';

const CAR_ZONES_BASE = [
  { id: 'engine', category: 'Performance', color: '#f59e0b', position: [0, 0.9, 1.8], tools: ['mpg', 'trip-cost', 'ev-range'] },
  { id: 'finance', category: 'Money', color: '#10b981', position: [0, 1.7, 0], tools: ['car-loan', 'lease', 'depreciation'] },
  { id: 'wheels', category: 'Maintenance', color: '#ef4444', position: [1.2, 0.4, 1.2], tools: ['tire', 'towing', 'insurance'] }
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
            {/* Visual Mesh */}
            <mesh ref={mesh}>
                <sphereGeometry args={[0.25, 32, 32]} />
                <meshStandardMaterial color="white" emissive={color} emissiveIntensity={2} toneMapped={false} />
            </mesh>
            
            {/* Hit Box (Invisible larger sphere for easier clicking) */}
            <mesh 
                onClick={(e) => { e.stopPropagation(); onClick(e); }}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
            >
                <sphereGeometry args={[0.5, 16, 16]} />
                <meshBasicMaterial transparent opacity={0} />
            </mesh>
        </group>
    );
}

const CarModel = () => {
    const bodyColor = "#3b82f6"; // Blue
    const glassColor = "#1e293b"; // Dark tint
    
    return (
        <group position={[0, 0.3, 0]}>
             {/* Chassis Main Body */}
            <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
                <boxGeometry args={[1.8, 0.6, 4]} />
                <meshStandardMaterial color={bodyColor} roughness={0.3} metalness={0.5} />
            </mesh>

            {/* Cabin */}
            <mesh position={[0, 1.0, -0.3]} castShadow>
                 <boxGeometry args={[1.6, 0.7, 2.2]} />
                 <meshStandardMaterial color={bodyColor} roughness={0.3} metalness={0.5} />
            </mesh>

            {/* Windows (Simple blocks for style) */}
            <mesh position={[0, 1.05, -0.3]}>
                <boxGeometry args={[1.62, 0.55, 1.8]} />
                <meshStandardMaterial color={glassColor} roughness={0.1} metalness={0.8} />
            </mesh>

            {/* Wheels */}
            {[[-0.9, 0, 1.2], [0.9, 0, 1.2], [-0.9, 0, -1.2], [0.9, 0, -1.2]].map((pos, i) => (
                <mesh key={i} position={new THREE.Vector3(...pos)} rotation={[0, 0, Math.PI / 2]} castShadow>
                    <cylinderGeometry args={[0.35, 0.35, 0.4, 32]} />
                    <meshStandardMaterial color="#1f2937" roughness={0.8} />
                </mesh>
            ))}

            {/* Headlights */}
            <mesh position={[-0.6, 0.5, 2.01]}>
                <boxGeometry args={[0.4, 0.2, 0.1]} />
                <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={2} />
            </mesh>
            <mesh position={[0.6, 0.5, 2.01]}>
                <boxGeometry args={[0.4, 0.2, 0.1]} />
                <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={2} />
            </mesh>
        </group>
    );
};

const CarScene = ({ onSelectZone }: { onSelectZone: (zone: any) => void }) => {
    const { language, t: tGlobal } = useLanguage();
    const tVis = visualDiscoveryTranslations[language] || visualDiscoveryTranslations['en'];

    const zones = useMemo(() => CAR_ZONES_BASE.map(z => ({
        ...z,
        // @ts-ignore
        name: tVis.carZones[z.id],
        category: tGlobal(z.category) || z.category
    })), [language, tVis, tGlobal]);

    return (
        <>
            <ambientLight intensity={0.6} />
            <spotLight position={[10, 10, 10]} angle={0.5} penumbra={1} intensity={1} castShadow />
            <Environment preset="city" />
            
            <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
                <group rotation={[0, -Math.PI / 6, 0]}>
                    <CarModel />
                    
                    {zones.map(zone => (
                        <group key={zone.id}>
                            <PulsingHotspot 
                                position={zone.position} 
                                color={zone.color} 
                                onClick={(e: any) => onSelectZone(zone)} 
                            />
                            <Html 
                                position={[zone.position[0], zone.position[1] + 0.4, zone.position[2]]} 
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
                    
                    {/* Shadow Catcher Mesh */}
                    <mesh position={[0, -0.1, 0]} receiveShadow>
                         <cylinderGeometry args={[4, 4, 0.1, 64]} />
                         <meshStandardMaterial color="#0f172a" transparent opacity={0.3} />
                    </mesh>
                </group>
            </Float>

            <OrbitControls enablePan={false} minDistance={5} maxDistance={9} maxPolarAngle={Math.PI / 2.1} />
            <ContactShadows position={[0, -1, 0]} opacity={0.5} scale={15} blur={2} far={4} />
        </>
    );
};

export const InteractiveCar = () => {
    const [selectedZone, setSelectedZone] = useState<any>(null);
    const navigate = useNavigate();
    const { t } = useLanguage();

    return (
        <div className="w-full h-[600px] relative bg-gradient-to-br from-slate-800 to-slate-950 overflow-hidden rounded-3xl border border-slate-700 shadow-2xl">
             <div className="absolute top-6 left-6 z-10">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Car className="w-6 h-6 text-blue-500" /> Auto Showroom
                </h2>
                <p className="text-slate-400 text-xs">Vehicle Cost & Performance</p>
            </div>

            <Canvas shadows camera={{ position: [5, 2, 5], fov: 40 }}>
                <CarScene onSelectZone={setSelectedZone} />
            </Canvas>

            {selectedZone && (
                <div className="absolute bottom-6 right-6 z-20 w-72 animate-in slide-in-from-bottom-5 fade-in duration-300">
                    <div className="bg-slate-900/90 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-5 shadow-2xl">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="text-lg font-bold text-white">{selectedZone.name}</h3>
                                <span className="text-xs font-bold text-blue-400 uppercase">{selectedZone.category}</span>
                            </div>
                            <button onClick={() => setSelectedZone(null)} className="text-slate-400 hover:text-white">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="space-y-2">
                            {selectedZone.tools.map((toolId: string) => (
                                <button 
                                    key={toolId}
                                    onClick={() => navigate(`/calculator/${toolId}`)}
                                    className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-white transition-colors text-sm font-medium group"
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