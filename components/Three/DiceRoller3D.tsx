import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, OrbitControls, Environment, PerspectiveCamera, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { RefreshCw, Trash2, Plus } from 'lucide-react';
import '../../types';

// --- GEOMETRY COMPONENT ---

const DiceGeometry = ({ type, color }: { type: string, color: string }) => {
    const geometry = useMemo(() => {
        switch (type) {
            case 'd4': return new THREE.TetrahedronGeometry(0.8);
            case 'd6': return new THREE.BoxGeometry(0.8, 0.8, 0.8);
            case 'd8': return new THREE.OctahedronGeometry(0.7);
            case 'd12': return new THREE.DodecahedronGeometry(0.65);
            case 'd20': return new THREE.IcosahedronGeometry(0.65);
            default: return new THREE.BoxGeometry(0.8, 0.8, 0.8);
        }
    }, [type]);

    return (
        <mesh castShadow receiveShadow geometry={geometry}>
            <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
            <lineSegments>
                <edgesGeometry args={[geometry]} />
                <lineBasicMaterial color="white" linewidth={2} opacity={0.5} transparent />
            </lineSegments>
        </mesh>
    );
};

// --- SINGLE DIE COMPONENT ---

interface DieProps {
    type: 'd4' | 'd6' | 'd8' | 'd12' | 'd20';
    isRolling: boolean;
    result: number | null;
    position: [number, number, number];
    onRollComplete: () => void;
}

const Die: React.FC<DieProps> = ({ type, isRolling, result, position, onRollComplete }) => {
    const group = useRef<THREE.Group>(null);
    const [rotationSpeed, setRotationSpeed] = useState([0, 0, 0]);
    const [localResult, setLocalResult] = useState<number | null>(null);

    // Color mapping
    const colorMap = {
        d4: '#ef4444',
        d6: '#3b82f6',
        d8: '#10b981',
        d12: '#f59e0b',
        d20: '#8b5cf6'
    };

    useEffect(() => {
        if (isRolling) {
            // Start spinning
            setRotationSpeed([
                Math.random() * 20 - 10,
                Math.random() * 20 - 10,
                Math.random() * 20 - 10
            ]);
            setLocalResult(null);
        } else if (result !== null) {
            // Stop spinning and set result
            setRotationSpeed([0, 0, 0]);
            setLocalResult(result);
            if (group.current) {
                // Reset rotation to neutral for display
                group.current.rotation.set(0, 0, 0); 
            }
            onRollComplete();
        }
    }, [isRolling, result]);

    useFrame((state, delta) => {
        if (group.current && isRolling) {
            group.current.rotation.x += rotationSpeed[0] * delta;
            group.current.rotation.y += rotationSpeed[1] * delta;
            group.current.rotation.z += rotationSpeed[2] * delta;
            
            // Bounce effect
            group.current.position.y = position[1] + Math.abs(Math.sin(state.clock.elapsedTime * 10)) * 2;
        } else if (group.current && !isRolling) {
             // Settle on ground
             group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, position[1], 0.1);
        }
    });

    return (
        <group ref={group} position={position}>
            <DiceGeometry type={type} color={colorMap[type]} />
            {!isRolling && localResult !== null && (
                <Text
                    position={[0, 1.2, 0]}
                    fontSize={0.5}
                    color="white"
                    outlineColor="black"
                    outlineWidth={0.05}
                >
                    {localResult}
                </Text>
            )}
        </group>
    );
};

// --- MAIN ROLLER SCENE ---

export const DiceRoller3D: React.FC = () => {
    const [dice, setDice] = useState<{ id: string, type: 'd4' | 'd6' | 'd8' | 'd12' | 'd20', result: number | null }[]>([
        { id: '1', type: 'd20', result: null }
    ]);
    const [isRolling, setIsRolling] = useState(false);
    const [total, setTotal] = useState<number | null>(null);

    const rollDice = () => {
        setIsRolling(true);
        setTotal(null);
        
        // Simulate roll delay
        setTimeout(() => {
            const newDice = dice.map(d => {
                const sides = parseInt(d.type.substring(1));
                return { ...d, result: Math.floor(Math.random() * sides) + 1 };
            });
            setDice(newDice);
            setIsRolling(false);
            setTotal(newDice.reduce((acc, curr) => acc + (curr.result || 0), 0));
        }, 1000);
    };

    const addDie = (type: 'd4' | 'd6' | 'd8' | 'd12' | 'd20') => {
        setDice([...dice, { id: crypto.randomUUID(), type, result: null }]);
    };

    const clearDice = () => {
        setDice([]);
        setTotal(null);
    };

    // Calculate positions to spread them out
    const getPosition = (index: number, total: number): [number, number, number] => {
        const spacing = 2.5;
        const rowSize = 4;
        const x = ((index % rowSize) - (Math.min(total, rowSize) - 1) / 2) * spacing;
        const z = Math.floor(index / rowSize) * spacing - 2;
        return [x, 0, z];
    };

    return (
        <div className="flex flex-col h-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
            <div className="relative flex-1 min-h-[400px]">
                <Canvas shadows dpr={[1, 2]}>
                    <PerspectiveCamera makeDefault position={[0, 8, 10]} fov={50} />
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} castShadow />
                    <spotLight position={[-10, 15, -5]} angle={0.3} penumbra={1} intensity={1} castShadow />
                    
                    <Environment preset="night" />
                    
                    <group>
                        {dice.map((die, index) => (
                            <Die 
                                key={die.id}
                                type={die.type}
                                isRolling={isRolling}
                                result={die.result}
                                position={getPosition(index, dice.length)}
                                onRollComplete={() => {}}
                            />
                        ))}
                    </group>

                    <ContactShadows position={[0, -1, 0]} opacity={0.5} scale={40} blur={2} far={4.5} />
                    <OrbitControls enablePan={false} minPolarAngle={0} maxPolarAngle={Math.PI / 2.2} />
                </Canvas>
                
                {total !== null && !isRolling && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                        <div className="bg-black/70 backdrop-blur-md text-white text-6xl font-black px-8 py-4 rounded-3xl border-2 border-white/20 shadow-[0_0_50px_rgba(255,255,255,0.2)] animate-in zoom-in duration-300">
                            {total}
                        </div>
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="bg-slate-800 p-4 border-t border-slate-700">
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                    {(['d4', 'd6', 'd8', 'd10', 'd12', 'd20'] as const).map(type => (
                        <button
                            key={type}
                            onClick={() => addDie(type === 'd10' ? 'd12' : type as any)} // Fallback for d10 visual
                            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-bold uppercase transition-colors border border-slate-600"
                        >
                            + {type}
                        </button>
                    ))}
                </div>
                
                <div className="flex gap-3">
                    <button 
                        onClick={clearDice}
                        className="p-3 bg-slate-700 hover:bg-rose-600 text-white rounded-xl transition-colors"
                        title="Clear All"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={rollDice}
                        disabled={isRolling || dice.length === 0}
                        className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <RefreshCw className={`w-5 h-5 ${isRolling ? 'animate-spin' : ''}`} />
                        {isRolling ? 'Rolling...' : 'ROLL'}
                    </button>
                </div>
            </div>
        </div>
    );
};