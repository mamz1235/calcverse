import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls, Environment, Float, ContactShadows, useCursor } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { ArrowRight, X, Camera } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { visualDiscoveryTranslations } from '../../utils/visualDiscoveryTranslations';
import '../../types';

const MEDIA_ZONES_BASE = [
  { id: 'camera', category: 'Photography', color: '#f43f5e', position: [0, 1.2, 1.5], tools: ['dof', 'exposure', 'crop'] },
  { id: 'light', category: 'Studio', color: '#f59e0b', position: [-1.8, 1.7, 1], tools: ['light', 'wb'] },
  { id: 'data', category: 'Post-Production', color: '#3b82f6', position: [1.6, 0.9, 0.2], tools: ['backup', 'vid-bit', 'timelapse'] },
  { id: 'print', category: 'Media', color: '#10b981', position: [0, 2.2, -2.5], tools: ['print', 'dpi'] } // Note: dpi might map to print
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
                <octahedronGeometry args={[0.15, 0]} />
                <meshStandardMaterial color="white" emissive={color} emissiveIntensity={2} toneMapped={false} />
            </mesh>
            {/* Invisible Click Target */}
            <mesh 
                onClick={(e) => { e.stopPropagation(); onClick(e); }}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
                visible={false}
            >
                <sphereGeometry args={[0.4, 16, 16]} />
                <meshBasicMaterial transparent opacity={0.1} />
            </mesh>
        </group>
    );
}

// Materials moved outside to prevent re-instantiation
const cameraBodyMat = new THREE.MeshStandardMaterial({ color: '#111827', roughness: 0.2, metalness: 0.8 });
const lensMat = new THREE.MeshStandardMaterial({ color: '#000000', roughness: 0.1, metalness: 0.5 });
const glassMat = new THREE.MeshPhysicalMaterial({ color: '#1f2937', transmission: 0.2, roughness: 0, reflectivity: 1 });
const standMat = new THREE.MeshStandardMaterial({ color: '#374151', roughness: 0.5, metalness: 0.7 });
const lightBoxMat = new THREE.MeshStandardMaterial({ color: '#000000' });
const diffuserMat = new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#ffffff', emissiveIntensity: 0.8, transparent: true, opacity: 0.9 });
const backdropMat = new THREE.MeshStandardMaterial({ color: '#e2e8f0', side: THREE.DoubleSide });
const deskMat = new THREE.MeshStandardMaterial({ color: '#d1d5db' });
const laptopMat = new THREE.MeshStandardMaterial({ color: '#94a3b8', metalness: 0.6, roughness: 0.3 });
const screenMat = new THREE.MeshStandardMaterial({ color: '#000000', emissive: '#3b82f6', emissiveIntensity: 0.5 });

const StudioMesh = () => {
    return (
        <group>
            {/* Camera Setup */}
            <group position={[0, 0, 1.2]} rotation={[0, 0, 0]}>
                {/* Tripod Legs */}
                <mesh position={[0, 0.5, 0]} castShadow>
                     <cylinderGeometry args={[0.05, 0.3, 1.2]} />
                     <primitive object={standMat} attach="material" />
                </mesh>
                {/* Body */}
                <mesh position={[0, 1.2, 0]} castShadow>
                     <boxGeometry args={[0.4, 0.3, 0.2]} />
                     <primitive object={cameraBodyMat} attach="material" />
                </mesh>
                {/* Lens */}
                <mesh position={[0, 1.2, 0.2]} rotation={[Math.PI/2, 0, 0]} castShadow>
                     <cylinderGeometry args={[0.12, 0.12, 0.3]} />
                     <primitive object={lensMat} attach="material" />
                </mesh>
                {/* Lens Glass */}
                <mesh position={[0, 1.2, 0.36]} rotation={[Math.PI/2, 0, 0]}>
                     <cylinderGeometry args={[0.1, 0.1, 0.02]} />
                     <primitive object={glassMat} attach="material" />
                </mesh>
            </group>

            {/* Softbox Light */}
            <group position={[-1.8, 0, 0.8]} rotation={[0, 0.5, 0]}>
                <mesh position={[0, 0.9, 0]}>
                    <cylinderGeometry args={[0.04, 0.2, 1.8]} />
                    <primitive object={standMat} attach="material" />
                </mesh>
                <group position={[0, 1.7, 0]} rotation={[0.2, 0, 0]}>
                     <mesh castShadow>
                        <boxGeometry args={[0.8, 1, 0.3]} />
                        <primitive object={lightBoxMat} attach="material" />
                     </mesh>
                     <mesh position={[0, 0, 0.16]}>
                        <planeGeometry args={[0.75, 0.95]} />
                        <primitive object={diffuserMat} attach="material" />
                     </mesh>
                </group>
            </group>

            {/* Workstation */}
            <group position={[1.6, 0, 0]}>
                <mesh position={[0, 0.4, 0]} receiveShadow castShadow>
                    <boxGeometry args={[1, 0.8, 0.6]} />
                    <primitive object={deskMat} attach="material" />
                </mesh>
                {/* Laptop Base */}
                <mesh position={[0, 0.81, 0]}>
                     <boxGeometry args={[0.5, 0.02, 0.35]} />
                     <primitive object={laptopMat} attach="material" />
                </mesh>
                {/* Laptop Screen */}
                <group position={[0, 0.82, -0.17]} rotation={[-0.2, 0, 0]}>
                     <mesh>
                         <boxGeometry args={[0.5, 0.3, 0.02]} />
                         <primitive object={laptopMat} attach="material" />
                     </mesh>
                     <mesh position={[0, 0, 0.015]}>
                         <planeGeometry args={[0.46, 0.26]} />
                         <primitive object={screenMat} attach="material" />
                     </mesh>
                </group>
            </group>

            {/* Backdrop */}
            <group position={[0, 1.5, -3]}>
                {/* Curved Wall approximation */}
                <mesh receiveShadow rotation={[0, 0, 0]}>
                    <planeGeometry args={[6, 4]} />
                    <primitive object={backdropMat} attach="material" />
                </mesh>
                <mesh position={[0, -2, 1]} rotation={[-Math.PI/2, 0, 0]} receiveShadow>
                     <planeGeometry args={[6, 2]} />
                     <primitive object={backdropMat} attach="material" />
                </mesh>
                {/* Curve Segment */}
                <mesh position={[0, -2, 0]} rotation={[0, Math.PI/2, 0]}>
                    <cylinderGeometry args={[0.5, 0.5, 6, 16, 1, false, 0, Math.PI/2]} />
                    <primitive object={backdropMat} attach="material" />
                </mesh>
            </group>
        </group>
    );
};

const MediaScene = ({ onSelectZone }: { onSelectZone: (zone: any) => void }) => {
    const { language, t: tGlobal } = useLanguage();
    const tVis = visualDiscoveryTranslations[language] || visualDiscoveryTranslations['en'];

    const zones = useMemo(() => MEDIA_ZONES_BASE.map(z => ({
        ...z,
        // @ts-ignore
        name: tVis.mediaZones[z.id],
        category: tGlobal(z.category) || z.category
    })), [language, tVis, tGlobal]);

    return (
        <>
            <ambientLight intensity={0.4} />
            <spotLight position={[5, 8, 5]} angle={0.4} penumbra={0.5} intensity={0.8} castShadow />
            {/* Key Light from Softbox */}
            <rectAreaLight width={1} height={1} intensity={5} color="#ffffff" position={[-1.8, 1.7, 0.9]} lookAt={new THREE.Vector3(0, 1, 0)} />
            
            <Environment preset="studio" />
            
            <group rotation={[0, -0.2, 0]}>
                <Float speed={0.5} rotationIntensity={0.05} floatIntensity={0.1}>
                    <StudioMesh />
                    
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
                                <div className="pointer-events-none bg-black/70 text-white px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap border border-white/10 backdrop-blur-sm">
                                    {zone.name}
                                </div>
                            </Html>
                        </group>
                    ))}
                </Float>
            </group>

            <OrbitControls enablePan={false} minDistance={4} maxDistance={8} maxPolarAngle={Math.PI / 2} target={[0, 1, 0]} />
            <ContactShadows position={[0, -0.1, 0]} opacity={0.4} scale={15} blur={2.5} far={4} color="#000000" />
        </>
    );
};

export const InteractiveMedia = () => {
    const [selectedZone, setSelectedZone] = useState<any>(null);
    const navigate = useNavigate();
    const { t } = useLanguage();

    return (
        <div className="w-full h-[600px] relative bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden rounded-3xl border border-slate-700 shadow-2xl">
             <div className="absolute top-6 left-6 z-10">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Camera className="w-6 h-6 text-rose-500" /> The Studio
                </h2>
                <p className="text-slate-400 text-xs">Photography & Media Tools</p>
            </div>

            <Canvas shadows camera={{ position: [3, 2, 5], fov: 45 }}>
                <MediaScene onSelectZone={setSelectedZone} />
            </Canvas>

            {selectedZone && (
                <div className="absolute bottom-6 right-6 z-20 w-72 animate-in slide-in-from-bottom-5 fade-in duration-300">
                    <div className="bg-slate-900/90 backdrop-blur-xl border border-rose-500/30 rounded-2xl p-5 shadow-2xl">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="text-lg font-bold text-white">{selectedZone.name}</h3>
                                <span className="text-xs font-bold text-rose-400 uppercase">{selectedZone.category}</span>
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
                                    className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-white transition-colors text-sm font-medium group"
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