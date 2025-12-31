"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Center, Resize } from "@react-three/drei";
import * as THREE from "three";

function Model({ url }: { url: string }) {
    const { scene } = useGLTF(url);
    const meshRef = useRef<THREE.Group>(null);

    // Auto-rotate slightly for a "live" feel
    useFrame((state, delta) => {
        if (meshRef.current) {
            // Gentle rocking or slow rotation
            meshRef.current.rotation.y += delta * 0.2;
        }
    });

    // Clone to avoid mutation of cached GLTF
    const clone = React.useMemo(() => {
        const clonedScene = scene.clone();

        // Apply White Box Holographic Material
        clonedScene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                // Reset and apply custom material
                mesh.material = new THREE.MeshBasicMaterial({
                    color: '#00e5ff', // Cyan/Holo Blue
                    wireframe: true,
                    transparent: true,
                    opacity: 0.4,
                });
            }
        });
        return clonedScene;
    }, [scene]);

    return (
        <group ref={meshRef}>
            <Resize scale={4.5}>
                <primitive object={clone} />
            </Resize>
        </group>
    );
}

export default function MiniShipPreview({ modelPath, active }: { modelPath: string; active: boolean }) {
    return (
        <div className={`w-16 h-16 rounded-lg border ${active ? 'border-sc-blue bg-sc-blue/20' : 'border-white/10 bg-white/5 hover:border-white/30'} transition-all duration-300 relative overflow-hidden backdrop-blur-sm`}>
            {/* Reduced FOV for orthographic-like top-down feel */}
            <Canvas camera={{ position: [0, 20, 0], fov: 25 }}>
                <pointLight position={[10, 10, 10]} intensity={1} />
                <Center>
                    <Model url={modelPath} />
                </Center>
            </Canvas>
        </div>
    );
}
