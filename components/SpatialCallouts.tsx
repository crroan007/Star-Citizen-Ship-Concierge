"use client";

import { Text, Billboard, Line } from "@react-three/drei";
import * as THREE from "three";
import { useMemo } from "react";

interface SpatialCalloutsProps {
    hardpoints: THREE.Object3D[];
}

export default function SpatialCallouts({ hardpoints }: SpatialCalloutsProps) {
    const TYPE_COLORS: Record<string, string> = {
        'weapon': '#ff6600',
        'missile': '#00e5ff',
        'turret': '#ffcc00',
        'utility': '#999999'
    };

    return (
        <group>
            {hardpoints.map((hp) => {
                const pos = new THREE.Vector3();
                hp.getWorldPosition(pos);

                const type = hp.userData.hpType || 'weapon';
                const color = TYPE_COLORS[type] || '#ffffff';
                const label = hp.userData.friendlyLabel || "HP";

                const endPos = pos.clone().add(new THREE.Vector3(0, 2.5, 0)); // Higher offset

                return (
                    <group key={hp.uuid}>
                        <Line
                            points={[pos, endPos]}
                            color={color}
                            lineWidth={4} // Thicker lines
                            transparent
                            opacity={0.8}
                        />

                        {/* GIANT Billboards for VR readability */}
                        <Billboard position={endPos}>
                            <group position={[0, 0.5, 0]}>
                                <mesh position={[0, 0, -0.01]}>
                                    <planeGeometry args={[4, 1.2]} />
                                    <meshBasicMaterial color="#000000" transparent opacity={0.85} />
                                </mesh>
                                <Text
                                    fontSize={0.6} // Huge text
                                    color="white"
                                    anchorX="center"
                                    anchorY="middle"
                                    font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
                                >
                                    {label}
                                </Text>
                                <Text
                                    position={[0, -0.4, 0]}
                                    fontSize={0.3}
                                    color={color}
                                    anchorX="center"
                                    anchorY="middle"
                                >
                                    {type.toUpperCase()}
                                </Text>
                            </group>
                        </Billboard>
                    </group>
                );
            })}
        </group>
    );
}
