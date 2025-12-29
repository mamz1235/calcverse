import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls, Stars, Float, useCursor } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { ArrowRight, X, Rocket } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { visualDiscoveryTranslations } from '../../utils/visualDiscoveryTranslations';
import '../../types';

const SOLAR_ZONES_BASE = [
  { id: 'sun', category: 'Energy', color: '#f59e0b', size: 1.5, distance: 0, speed: 0, tools: ['solar', 'light'] },
  { id: 'mercury', category: 'Physics', color: '#a1a1aa', size: 0.2, distance: 2.5, speed: 1.5, tools: ['temp', 'throw'] },
  { id: 'venus', category: 'Atmosphere', color: '#fbbf24', size: 0.35, distance: 3.5, speed: 1.2, tools: ['time-diff'] },
  { id: 'earth', category: 'Life', color: '#3b82f6', size: 0.4, distance: 5, speed: 1, tools: ['timezone', 'flight-co2', 'rain'] },
  { id: 'mars', category: 'Physics', color: '#ef4444', size: 0.3, distance: 6.5, speed: 0.8, tools: ['throw', 'trip-cost'] },
  { id: 'jupiter', category: 'Gravity', color: '#d97706', size: 0.9, distance: 9, speed: 0.4, tools: ['bmi', 'weight'] },
  { id: 'saturn', category: 'Time', color: '#fcd34d', size: 0.8, distance: 12, speed: 0.3, tools: ['time-lapse'], ring: { inner: 1.1, outer: 1.8, color: '#fef3c7' } },
  { id: 'uranus', category: 'Science', color: '#22d3ee', size: 0.5, distance: 15, speed: 0.2, tools: ['trig'] },
  { id: 'neptune', category: 'Fluids', color: '#3b82f6', size: 0.5, distance: 17.5, speed: 0.1, tools: ['water'] }
];

const Planet = ({ planet, onSelect, active }: any) => {
    const mesh = useRef<THREE.Mesh>(null);
    const [hovered, setHover] = useState(false);
    useCursor(hovered);

    useFrame((state) => {
        if (mesh.current && planet.distance > 0) {
            // Orbit
            const t = state.clock.getElapsedTime() * planet.speed * 0.1;
            mesh.current.position.x = Math.cos(t) * planet.distance;
            mesh.current.position.z = Math.sin(t) * planet.distance;
            // Rotate
            mesh.current.rotation.y += 0.01;
        }
    });

    return (
        <group>
            {/* Orbit Path */}
            {planet.distance > 0 && (
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[planet.distance - 0.02, planet.distance + 0.02, 64]} />
                    <meshBasicMaterial color="#ffffff" opacity={0.1} transparent side={THREE.DoubleSide} />
                </mesh>
            )}

            <mesh 
                ref={mesh}
                onClick={(e) => { e.stopPropagation(); onSelect(planet); }}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
            >
                <sphereGeometry args={[planet.size, 32, 32]} />
                <meshStandardMaterial 
                    color={planet.color} 
                    emissive={planet.id === 'sun' ? planet.color : '#000000'}
                    emissiveIntensity={planet.id === 'sun' ? 2 : 0}
                    roughness={0.7}
                    metalness={0.2}
                />
                
                {/* Rings for Saturn */}
                {planet.ring && (
                    <mesh rotation={[Math.PI / 2.5, 0, 0]}>
                        <ringGeometry args={[planet.ring.inner, planet.ring.outer, 32]} />
                        <meshStandardMaterial color={planet.ring.color} side={THREE.DoubleSide} transparent opacity={0.8} />
                    </mesh>
                )}

                {/* Label on Hover */}
                {(hovered || active) && (
                    <Html position={[0, planet.size + 0.5, 0]} center distanceFactor={15}>
                        <div className="pointer-events-none bg-black/60 text-white px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap border border-white/20 backdrop-blur-sm">
                            {planet.name}
                        </div>
                    </Html>
                )}
            </mesh>
        </group>
    );
};

const SolarScene = ({ onSelectZone }: { onSelectZone: (zone: any) => void }) => {
    const { language, t: tGlobal } = useLanguage();
    const tVis = visualDiscoveryTranslations[language] || visualDiscoveryTranslations['en'];

    const zones = useMemo(() => SOLAR_ZONES_BASE.map(z => ({
        ...z,
        // @ts-ignore
        name: tVis.solarZones[z.id],
        category: tGlobal(z.category) || z.category
    })), [language, tVis, tGlobal]);

    return (
        <>
            <ambientLight intensity={0.2} />
            <pointLight position={[0, 0, 0]} intensity={2} color="#ffaa00" distance={50} decay={2} />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            
            {zones.map(planet => (
                <Planet 
                    key={planet.id} 
                    planet={planet} 
                    onSelect={onSelectZone} 
                />
            ))}

            <OrbitControls enablePan={true} minDistance={5} maxDistance={40} maxPolarAngle={Math.PI / 1.5} />
        </>
    );
};

export const InteractiveSolarSystem = () => {
    const [selectedZone, setSelectedZone] = useState<any>(null);
    const navigate = useNavigate();
    const { t } = useLanguage();

    return (
        <div className="w-full h-[600px] relative bg-black overflow-hidden rounded-3xl border border-slate-800 shadow-2xl">
             <div className="absolute top-6 left-6 z-10">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Rocket className="w-6 h-6 text-orange-500" /> Solar System
                </h2>
                <p className="text-slate-400 text-xs">Physics & Universal Constants</p>
            </div>

            <Canvas camera={{ position: [10, 10, 10], fov: 45 }}>
                <SolarScene onSelectZone={setSelectedZone} />
            </Canvas>

            {selectedZone && (
                <div className="absolute bottom-6 right-6 z-20 w-72 animate-in slide-in-from-bottom-5 fade-in duration-300">
                    <div className="bg-slate-900/90 backdrop-blur-xl border border-orange-500/30 rounded-2xl p-5 shadow-2xl">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="text-lg font-bold text-white">{selectedZone.name}</h3>
                                <span className="text-xs font-bold text-orange-400 uppercase">{selectedZone.category}</span>
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
                                    className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-800 hover:bg-orange-600 text-white transition-colors text-sm font-medium group"
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