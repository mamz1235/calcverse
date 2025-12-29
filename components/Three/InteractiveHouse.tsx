import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, useCursor, OrbitControls, Environment, Float, ContactShadows } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { ArrowRight, Calculator, X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { visualDiscoveryTranslations } from '../../utils/visualDiscoveryTranslations';
import '../../types';

// Room Data
const ROOMS_BASE = [
  { id: 'finance', category: 'Finance & Money', color: '#6366f1', position: [-2, 0, -2], size: [2, 1.5, 2], tools: ['mortgage', 'budget', 'roi'] },
  { id: 'kitchen', category: 'Nutrition & Food', color: '#f59e0b', position: [2, 0, -2], size: [2, 1.5, 2], tools: ['recipe-scale', 'macros', 'cal-lookup'] },
  { id: 'living', category: 'Home & DIY', color: '#10b981', position: [-2, 0, 2], size: [2, 1.5, 2], tools: ['paint', 'flooring', 'tv-size'] }, 
  { id: 'garage', category: 'Automotive', color: '#f43f5e', position: [2, 0, 2], size: [2, 1.5, 2], tools: ['car-loan', 'mpg', 'tire'] },
  { id: 'garden', category: 'Ecology', color: '#8b5cf6', position: [4, -0.5, 0], size: [1.5, 0.2, 4], tools: ['soil', 'plants', 'sun'] }
];

const PulsingHotspot = ({ position, color, onClick }: any) => {
    const mesh = useRef<THREE.Mesh>(null);
    useFrame((state) => {
        if(mesh.current) {
            const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
            mesh.current.scale.set(scale, scale, scale);
        }
    });

    return (
        <mesh ref={mesh} position={[position[0], position[1] + 1, position[2]]} onClick={onClick}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial color="white" emissive={color} emissiveIntensity={2} toneMapped={false} />
        </mesh>
    );
}

const RoomBlock = ({ room, active, onClick, onHover }: any) => {
  const [hovered, setHover] = useState(false);
  useCursor(hovered);
  
  return (
    <group 
        onPointerOver={() => { setHover(true); onHover(room); }} 
        onPointerOut={() => { setHover(false); onHover(null); }}
        onClick={(e) => { e.stopPropagation(); onClick(room); }}
    >
      {/* Room Volume */}
      <mesh position={room.position} castShadow receiveShadow>
        <boxGeometry args={room.size} />
        <meshStandardMaterial 
            color={room.color} 
            transparent 
            opacity={active ? 0.8 : 0.4} 
            metalness={0.1}
            roughness={0.2}
        />
        {/* Rim Light Highlight on Hover */}
        {(hovered || active) && (
            <lineSegments>
                <edgesGeometry args={[new THREE.BoxGeometry(...room.size)]} />
                <lineBasicMaterial color="white" linewidth={2} />
            </lineSegments>
        )}
      </mesh>
      
      {/* Hotspot */}
      <PulsingHotspot position={room.position} color={room.color} onClick={(e: any) => { e.stopPropagation(); onClick(room); }} />

      {/* Floating Label */}
      <Html position={[room.position[0], room.position[1] + 1.5, room.position[2]]} center distanceFactor={10} zIndexRange={[100, 0]}>
        <div className={`transition-opacity duration-300 ${hovered || active ? 'opacity-100' : 'opacity-0'} pointer-events-none`}>
            <div className="bg-black/70 text-white px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap backdrop-blur-md border border-white/20">
                {room.name}
            </div>
        </div>
      </Html>
    </group>
  );
};

interface HouseProps {
    onSelectRoom: (room: any) => void;
}

const HouseScene = ({ onSelectRoom }: HouseProps) => {
    const [activeRoom, setActiveRoom] = useState<any>(null);
    const { language, t: tGlobal } = useLanguage();
    const tVis = visualDiscoveryTranslations[language] || visualDiscoveryTranslations['en'];

    // Memoize translated rooms
    const translatedRooms = useMemo(() => {
        return ROOMS_BASE.map(r => ({
            ...r,
            // @ts-ignore
            name: tVis.rooms[r.id],
            category: tGlobal(r.category) || r.category
        }));
    }, [language, tVis, tGlobal]);

    const handleRoomClick = (room: any) => {
        setActiveRoom(room);
        onSelectRoom(room);
    };

    return (
        <>
            <ambientLight intensity={0.5} />
            <directionalLight 
                position={[10, 20, 10]} 
                intensity={1} 
                castShadow 
                shadow-mapSize={[1024, 1024]}
            >
                <orthographicCamera attach="shadow-camera" args={[-10, 10, 10, -10]} />
            </directionalLight>
            
            <Environment preset="city" />

            <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
                <group rotation={[0, Math.PI / 4, 0]}>
                    {translatedRooms.map(room => (
                        <RoomBlock 
                            key={room.id} 
                            room={room} 
                            active={activeRoom?.id === room.id}
                            onClick={handleRoomClick}
                            onHover={() => {}}
                        />
                    ))}
                    {/* Base Platform */}
                    <mesh position={[0, -0.85, 0]} receiveShadow>
                        <cylinderGeometry args={[5, 5, 0.2, 64]} />
                        <meshStandardMaterial color="#1e293b" />
                    </mesh>
                </group>
            </Float>

            <OrbitControls 
                enablePan={false} 
                minPolarAngle={Math.PI / 4} 
                maxPolarAngle={Math.PI / 2.2}
                minDistance={5}
                maxDistance={15}
            />
            <ContactShadows position={[0, -1.8, 0]} opacity={0.5} scale={20} blur={2} far={4.5} />
        </>
    );
};

export const InteractiveHouse = () => {
    const [selectedRoom, setSelectedRoom] = useState<any>(null);
    const [showOnboarding, setShowOnboarding] = useState(true);
    const navigate = useNavigate();
    const { t, language } = useLanguage();
    const tVis = visualDiscoveryTranslations[language] || visualDiscoveryTranslations['en'];

    return (
        <div className="w-full h-[85vh] relative bg-gradient-to-b from-slate-50 to-slate-200 dark:from-slate-900 dark:to-slate-950 overflow-hidden rounded-3xl border border-border shadow-2xl">
            {/* Header / Legend */}
            <div className="absolute top-6 left-6 z-10">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">CalcVerse</span> House
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{tVis.title}</p>
            </div>

            {/* Canvas */}
            <Canvas shadows camera={{ position: [0, 5, 10], fov: 45 }}>
                <HouseScene onSelectRoom={(room) => { setSelectedRoom(room); setShowOnboarding(false); }} />
            </Canvas>

            {/* Contextual Card (Glassmorphism) */}
            {selectedRoom && (
                <div className="absolute bottom-8 right-8 z-20 w-80 animate-in slide-in-from-bottom-10 fade-in duration-300">
                    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl p-6 shadow-2xl">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{selectedRoom.name}</h2>
                                <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">{selectedRoom.category}</span>
                            </div>
                            <button onClick={() => setSelectedRoom(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="space-y-2 mb-6">
                            {selectedRoom.tools.map((toolId: string) => (
                                <button 
                                    key={toolId}
                                    onClick={() => navigate(`/calculator/${toolId}`)}
                                    className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-500 transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-1.5 bg-white dark:bg-slate-700 rounded-lg text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors">
                                            <Calculator className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm font-bold capitalize">{t(getToolName(toolId))}</span>
                                    </div>
                                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Onboarding Tooltip */}
            {showOnboarding && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none animate-bounce">
                    <div className="bg-indigo-600 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-indigo-500/30 flex items-center gap-2">
                        <span>Click a room to explore!</span>
                        <div className="w-3 h-3 bg-white rotate-45 transform translate-y-4 absolute left-1/2 -translate-x-1/2 bottom-1"></div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper to get tool name from ID (should ideally come from registry but kept simple here)
const getToolName = (id: string) => {
    // In a real app import this from registry
    return id.replace(/-/g, ' '); 
};