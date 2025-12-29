import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls, Environment, Float, ContactShadows, useCursor } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { ArrowRight, X, Monitor } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { visualDiscoveryTranslations } from '../../utils/visualDiscoveryTranslations';
import '../../types';

const TECH_ZONES_BASE = [
  { id: 'screen', category: 'Tech', color: '#06b6d4', position: [0, 0.9, -0.3], tools: ['vid-bit', 'fps', 'ppi'] },
  { id: 'tower', category: 'Gaming', color: '#8b5cf6', position: [1.2, 0.8, 0], tools: ['dps', 'bitrate', 'storage'] },
  { id: 'input', category: 'Gaming', color: '#ef4444', position: [0, 0.3, 0.4], tools: ['elo', 'sensitivity', 'kda'] },
  { id: 'network', category: 'Tech', color: '#10b981', position: [-1.2, 0.4, 0.1], tools: ['download', 'ping', 'bandwidth'] }
];

// Reusable materials defined outside component to avoid recreation
const deskMat = new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.15, metalness: 0.5 }); 
const monitorStandMat = new THREE.MeshStandardMaterial({ color: '#475569', roughness: 0.5, metalness: 0.8 });
const screenBodyMat = new THREE.MeshStandardMaterial({ color: '#0f172a', roughness: 0.2 });
const screenOnMat = new THREE.MeshStandardMaterial({ color: '#000000', emissive: '#0ea5e9', emissiveIntensity: 1.2, roughness: 0.2 });
const towerMat = new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.2, metalness: 0.7 });
const glassPanelMat = new THREE.MeshPhysicalMaterial({ color: '#000000', transmission: 0.5, opacity: 0.8, transparent: true, roughness: 0 });
const keyboardMat = new THREE.MeshStandardMaterial({ color: '#0f172a' });
const keyLightMat = new THREE.MeshStandardMaterial({ color: '#000000', emissive: '#d946ef', emissiveIntensity: 2 });
const routerMat = new THREE.MeshStandardMaterial({ color: '#0f172a', roughness: 0.3 });
const routerLightMat = new THREE.MeshStandardMaterial({ color: '#000000', emissive: '#22c55e', emissiveIntensity: 4 });
const rgbStripMat = new THREE.MeshStandardMaterial({ color: '#000000', emissive: '#8b5cf6', emissiveIntensity: 3 });

const PulsingHotspot = ({ position, color, onClick }: any) => {
    const mesh = useRef<THREE.Mesh>(null);
    const [hovered, setHover] = useState(false);
    useCursor(hovered);

    useFrame((state) => {
        if(mesh.current) {
            const scale = 0.6 + Math.sin(state.clock.elapsedTime * 4) * 0.15;
            mesh.current.scale.set(scale, scale, scale);
        }
    });

    return (
        <group position={position}>
            {/* Visual Marker */}
            <mesh ref={mesh}>
                <octahedronGeometry args={[0.15, 0]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} toneMapped={false} />
            </mesh>
            {/* Invisible Hit Box */}
            <mesh 
                onClick={(e) => { e.stopPropagation(); onClick(e); }}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
                visible={false}
            >
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshBasicMaterial transparent opacity={0.1} />
            </mesh>
        </group>
    );
}

const GamingSetupMesh = () => {
    return (
        <group position={[0, -0.5, 0]}>
            {/* Desk */}
            <mesh position={[0, 0, 0]} castShadow receiveShadow>
                <boxGeometry args={[3.2, 0.1, 1.6]} />
                <primitive object={deskMat} attach="material" />
            </mesh>
            
            {/* Monitor */}
            <group position={[0, 0.8, -0.4]}>
                {/* Screen Bezel/Back */}
                <mesh castShadow>
                    <boxGeometry args={[1.8, 1.0, 0.05]} />
                    <primitive object={screenBodyMat} attach="material" />
                </mesh>
                {/* Glowing Screen */}
                <mesh position={[0, 0, 0.03]}>
                    <planeGeometry args={[1.7, 0.9]} />
                    <primitive object={screenOnMat} attach="material" />
                </mesh>
            </group>
            
            {/* Monitor Stand */}
            <mesh position={[0, 0.3, -0.4]}>
                <cylinderGeometry args={[0.08, 0.12, 0.6]} />
                <primitive object={monitorStandMat} attach="material" />
            </mesh>
            <mesh position={[0, 0.05, -0.4]}>
                <boxGeometry args={[0.4, 0.1, 0.3]} />
                <primitive object={monitorStandMat} attach="material" />
            </mesh>

            {/* PC Tower */}
            <group position={[1.2, 0.5, 0]}>
                <mesh castShadow>
                    <boxGeometry args={[0.45, 1.0, 0.9]} />
                    <primitive object={towerMat} attach="material" />
                </mesh>
                {/* Internal RGB Glow (Simulated) */}
                <mesh position={[-0.23, 0, 0]} rotation={[0, 0, Math.PI/2]}>
                     <planeGeometry args={[0.8, 0.8]} />
                     <primitive object={glassPanelMat} attach="material" />
                </mesh>
                 <mesh position={[-0.15, -0.4, 0.35]}>
                     <boxGeometry args={[0.1, 0.05, 0.1]} />
                     <primitive object={rgbStripMat} attach="material" />
                </mesh>
                 <mesh position={[-0.15, 0.4, 0.35]}>
                     <boxGeometry args={[0.1, 0.05, 0.1]} />
                     <primitive object={rgbStripMat} attach="material" />
                </mesh>
            </group>

            {/* Keyboard */}
            <group position={[0, 0.08, 0.4]}>
                <mesh receiveShadow>
                    <boxGeometry args={[1.1, 0.04, 0.35]} />
                    <primitive object={keyboardMat} attach="material" />
                </mesh>
                {/* Backlight Plane */}
                <mesh position={[0, 0.021, 0]} rotation={[-Math.PI/2, 0, 0]}>
                    <planeGeometry args={[1.0, 0.25]} />
                    <primitive object={keyLightMat} attach="material" />
                </mesh>
            </group>

            {/* Router */}
            <group position={[-1.2, 0.15, 0.1]}>
                <mesh>
                    <boxGeometry args={[0.4, 0.08, 0.3]} />
                    <primitive object={routerMat} attach="material" />
                </mesh>
                {/* Status Lights */}
                <mesh position={[-0.1, 0.05, 0.12]}>
                     <sphereGeometry args={[0.015]} />
                     <primitive object={routerLightMat} attach="material" />
                </mesh>
                 <mesh position={[0, 0.05, 0.12]}>
                     <sphereGeometry args={[0.015]} />
                     <primitive object={routerLightMat} attach="material" />
                </mesh>
                 <mesh position={[0.1, 0.05, 0.12]}>
                     <sphereGeometry args={[0.015]} />
                     <primitive object={routerLightMat} attach="material" />
                </mesh>
                 {/* Antennas */}
                <mesh position={[-0.15, 0.15, -0.1]}>
                    <cylinderGeometry args={[0.01, 0.015, 0.3]} />
                    <meshStandardMaterial color="#0f172a" />
                </mesh>
                <mesh position={[0.15, 0.15, -0.1]}>
                    <cylinderGeometry args={[0.01, 0.015, 0.3]} />
                    <meshStandardMaterial color="#0f172a" />
                </mesh>
                 <mesh position={[0, 0.15, -0.12]} rotation={[0.2, 0, 0]}>
                    <cylinderGeometry args={[0.01, 0.015, 0.3]} />
                    <meshStandardMaterial color="#0f172a" />
                </mesh>
            </group>
        </group>
    );
};

const GamingScene = ({ onSelectZone }: { onSelectZone: (zone: any) => void }) => {
    const { language, t: tGlobal } = useLanguage();
    const tVis = visualDiscoveryTranslations[language] || visualDiscoveryTranslations['en'];

    const zones = useMemo(() => TECH_ZONES_BASE.map(z => ({
        ...z,
        // @ts-ignore
        name: tVis.techZones[z.id],
        category: tGlobal(z.category) || z.category
    })), [language, tVis, tGlobal]);

    return (
        <>
            <ambientLight intensity={0.2} />
            {/* Dramatic RGB Lighting */}
            <pointLight position={[-3, 2, 2]} intensity={1.5} color="#3b82f6" distance={10} />
            <pointLight position={[3, 2, 2]} intensity={1.5} color="#d946ef" distance={10} />
            
            <spotLight position={[0, 5, 2]} angle={0.5} penumbra={1} intensity={1} castShadow color="#ffffff" />
            
            <group rotation={[0.2, -0.4, 0]}>
                <Float speed={1} rotationIntensity={0.05} floatIntensity={0.1}>
                    <GamingSetupMesh />
                    
                    {zones.map(zone => (
                        <group key={zone.id}>
                            <PulsingHotspot 
                                position={zone.position} 
                                color={zone.color} 
                                onClick={(e: any) => onSelectZone(zone)} 
                            />
                             <Html 
                                position={[zone.position[0], zone.position[1] + 0.3, zone.position[2]]} 
                                distanceFactor={6} 
                                zIndexRange={[100, 0]}
                                style={{ pointerEvents: 'none' }}
                            >
                                <div className="pointer-events-none bg-black/80 text-white px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap border border-white/20">
                                    {zone.name}
                                </div>
                            </Html>
                        </group>
                    ))}
                </Float>
            </group>

            <OrbitControls enablePan={false} minDistance={3} maxDistance={6} maxPolarAngle={Math.PI / 2} />
            <ContactShadows position={[0, -1, 0]} opacity={0.6} scale={15} blur={2.5} far={4} color="#000000" />
        </>
    );
};

export const InteractiveGaming = () => {
    const [selectedZone, setSelectedZone] = useState<any>(null);
    const navigate = useNavigate();
    const { t } = useLanguage();

    return (
        <div className="w-full h-[600px] relative bg-slate-950 overflow-hidden rounded-3xl border border-indigo-500/30 shadow-2xl">
             <div className="absolute top-6 left-6 z-10">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Monitor className="w-6 h-6 text-cyan-400" /> Tech Station
                </h2>
                <p className="text-slate-400 text-xs">Gaming & Developer Tools</p>
            </div>

            <Canvas shadows camera={{ position: [0, 1, 5], fov: 40 }}>
                <GamingScene onSelectZone={setSelectedZone} />
            </Canvas>

            {selectedZone && (
                <div className="absolute bottom-6 right-6 z-20 w-72 animate-in slide-in-from-bottom-5 fade-in duration-300">
                    <div className="bg-slate-900/90 backdrop-blur-xl border border-indigo-500/30 rounded-2xl p-5 shadow-2xl">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="text-lg font-bold text-white">{selectedZone.name}</h3>
                                <span className="text-xs font-bold text-cyan-400 uppercase">{selectedZone.category}</span>
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
                                    className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-800 hover:bg-indigo-600 text-white transition-colors text-sm font-medium group"
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