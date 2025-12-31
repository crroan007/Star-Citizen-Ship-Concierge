"use client";

import React, { useRef, Suspense, useEffect, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, Stage, ContactShadows } from "@react-three/drei";
import { XR, createXRStore, useXR } from "@react-three/xr";
import * as THREE from "three";
import { GLTF } from "three-stdlib";
import { Glasses } from "lucide-react";
import CalloutManager from "./CalloutManager";

interface HoloViewerProps {
    modelPath: string;
}

// XR API v6 Store
const store = createXRStore();

import ComponentBrowser from "./ComponentBrowser";

function Model({
    modelPath,
    setTooltip,
    isMovingRef,
    onLoaded,
    onInteract
}: {
    modelPath: string,
    setTooltip: (data: any) => void,
    isMovingRef: React.MutableRefObject<boolean>,
    onLoaded?: (radius: number) => void,
    onInteract?: (hp: any) => void
}) {
    const gltf = useGLTF(modelPath, true) as GLTF;
    const scene = useMemo(() => gltf.scene.clone(), [gltf.scene]);
    const group = useRef<THREE.Group>(null);
    const [targets, setTargets] = useState<THREE.Object3D[]>([]);
    const [hardpoints, setHardpoints] = useState<any[]>([]);

    // CALCULATE BOUNDS ON LOAD
    useEffect(() => {
        if (scene && onLoaded) {
            const box = new THREE.Box3().setFromObject(scene);
            const sphere = new THREE.Sphere();
            box.getBoundingSphere(sphere);
            onLoaded(sphere.radius);
        }
    }, [scene, onLoaded]);

    // FETCH CONFIG
    useEffect(() => {
        const shipId = modelPath.split('/').pop()?.split('.')[0];
        if (!shipId) return;

        fetch(`/api/ship-config?shipId=${shipId}`)
            .then(res => res.json())
            .then(data => {
                if (data.hardpoints) {
                    setHardpoints(data.hardpoints);
                }
            })
            .catch(err => console.error("Config Fetch Error:", err));
    }, [modelPath]);

    // PROCESS SCENE & FIND TARGETS
    useEffect(() => {
        if (!scene || hardpoints.length === 0) return;

        const foundNodes: THREE.Object3D[] = [];

        scene.traverse((child) => {
            const config = hardpoints.find(h => h.id === child.name);
            if (config) {
                child.userData.friendlyLabel = config.label;
                child.userData.hpType = config.type;
                foundNodes.push(child);
            }

            if ((child as THREE.Mesh).isMesh && !child.name.startsWith('hp_')) {
                const mesh = child as THREE.Mesh;
                mesh.material = new THREE.MeshPhysicalMaterial({
                    color: '#e2e8f0', roughness: 0.4, metalness: 0.1, clearcoat: 0.8, side: THREE.DoubleSide
                });
                mesh.castShadow = true;
                mesh.receiveShadow = true;
            }
        });

        console.log(`[HoloViewer] Found ${foundNodes.length} matching nodes.`);
        setTargets(foundNodes);

    }, [scene, hardpoints]);

    useFrame((state) => {
        if (group.current) {
            group.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
        }
    });

    return (
        <group ref={group}>
            <primitive object={scene} />
            <CalloutManager hardpoints={targets} isMovingRef={isMovingRef} onInteract={onInteract} />
        </group>
    );
}

const SceneContent = ({
    modelPath,
    setTooltip,
    isMovingRef,
    onInteract
}: {
    modelPath: string,
    setTooltip: any,
    isMovingRef: any,
    onInteract: (hp: any) => void
}) => {
    const { isPresenting } = useXR();
    const [optimalDistance, setOptimalDistance] = useState(15); // Default fallback

    // VR: Position ship based on its calculated size to fill 25% of FOV
    // Desktop: Keep at 0,0,0
    const scenePosition = isPresenting ? new THREE.Vector3(0, 0, -optimalDistance) : new THREE.Vector3(0, 0, 0);

    return (
        <group position={scenePosition}>
            <Stage environment="city" intensity={0.6} shadows={false}>
                <Suspense fallback={null}>
                    <Model
                        modelPath={modelPath}
                        setTooltip={setTooltip}
                        isMovingRef={isMovingRef}
                        onLoaded={(size) => {
                            // Calculate distance for 25% FOV coverage
                            // Formula: Distance = Radius / sin(FOV_Angle / 2)
                            // Target 25 degrees (approx 25% of ~100 deg FOV)
                            const targetAngle = 25 * (Math.PI / 180);
                            const dist = size / Math.sin(targetAngle / 2);
                            setOptimalDistance(dist);
                            console.log(`[Auto-Scale] Ship Radius: ${size.toFixed(2)}m, Optimal Dist: ${dist.toFixed(2)}m`);
                        }}
                        onInteract={onInteract}
                    />
                </Suspense>
            </Stage>
            <ContactShadows position={[0, -0.5, 0]} opacity={0.4} scale={10} blur={2.5} far={4} color="#0b1622" />

            {/* ONLY enable OrbitControls on Desktop. In VR, it hijacks the controller inputs. */}
            {!isPresenting && (
                <OrbitControls
                    autoRotate={false}
                    makeDefault
                    minDistance={5}
                    maxDistance={20}
                    onStart={() => { isMovingRef.current = true; }}
                    onEnd={() => { isMovingRef.current = false; }}
                />
            )}
        </group>
    );
};

export default function HoloViewer({ modelPath }: HoloViewerProps) {
    const [tooltip, setTooltip] = useState({ visible: false, text: '' });
    const tooltipRef = useRef<HTMLDivElement>(null);

    // Performance: Use Ref instead of State to prevent Canvas re-renders during interaction
    const isMovingRef = useRef(false);

    // SELECTION STATE
    const [selectedHardpoint, setSelectedHardpoint] = useState<any>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (tooltipRef.current) {
            tooltipRef.current.style.transform = `translate(${e.clientX + 15}px, ${e.clientY + 15}px)`;
        }
    };

    return (
        <div
            className="w-full h-[600px] relative rounded-xl overflow-hidden bg-gradient-to-br from-[#0b1622] to-black"
            onMouseMove={handleMouseMove}
        >
            <div className="absolute top-4 left-4 z-10 text-[10px] tracking-widest text-white/50 font-mono pointer-events-none">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-[#ff6600] animate-pulse rounded-full" />
                    <span>SYSTEM_READY // TARGETING_ASSIST_ACTIVE</span>
                </div>
            </div>

            {/* COMPONENT BROWSER OVERLAY */}
            <ComponentBrowser
                isOpen={!!selectedHardpoint}
                targetHardpoint={selectedHardpoint}
                onClose={() => setSelectedHardpoint(null)}
                onEquip={(component) => {
                    console.log("Equipping:", component.name);
                    setSelectedHardpoint(null); // Close on equip for now
                }}
            />

            {/* v6 XR Button (Custom UI triggering store) */}
            <div className="absolute bottom-4 right-4 z-50">
                <button
                    onClick={() => store.enterVR()}
                    className="bg-black/50 text-sc-blue border border-sc-blue/30 rounded-full p-3 hover:bg-sc-blue/20 transition-all backdrop-blur-md"
                >
                    <Glasses className="w-6 h-6" />
                </button>
            </div>

            <Canvas shadows dpr={[1, 2]} camera={{ position: [12, 6, 12], fov: 40 }}>
                {/* v6 XR Provider */}
                <XR store={store}>
                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} shadow-mapSize={2048} castShadow />

                    <SceneContent
                        modelPath={modelPath}
                        setTooltip={setTooltip}
                        isMovingRef={isMovingRef}
                        onInteract={(hp) => {
                            console.log("Hardpoint Selected:", hp);
                            setSelectedHardpoint(hp);
                        }}
                    />
                </XR>
            </Canvas>
        </div>
    );
}
