"use client";

import { Html } from "@react-three/drei";
import { useState } from "react";

interface HardpointMarkerProps {
    position: [number, number, number];
    label?: string;
    type?: string;
    selected?: boolean;
    onClick?: () => void;
}

export default function HardpointMarker({
    position,
    label = "HP",
    type = "weapon",
    selected = false,
    onClick
}: HardpointMarkerProps) {
    const [hovered, setHovered] = useState(false);

    // Type-based aesthetic map
    const TYPE_COLORS: Record<string, string> = {
        'weapon': '#ff6600',   // Orange
        'missile': '#00e5ff',  // Cyan/Blue
        'turret': '#ffcc00',   // Yellow
        'utility': '#999999'   // Grey
    };

    const baseColor = TYPE_COLORS[type] || TYPE_COLORS['weapon'];

    // Visual styles based on state
    // Selected = Bright White/Cyan Pulse
    // Hovered = Type Color (Bright)
    // Default = Type Color (Dim)
    const color = selected ? '#ffffff' : (hovered ? baseColor : baseColor);
    const opacity = selected ? 1 : (hovered ? 1 : 0.8); // Make them always fairly visible
    const scale = selected || hovered ? 1.2 : 1;

    return (
        <group position={position}>
            {/* 3D Click Target (Invisible sphere for easier clicking) */}
            <mesh
                onClick={(e) => {
                    e.stopPropagation();
                    onClick?.();
                }}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                visible={false}
            >
                <sphereGeometry args={[0.5, 16, 16]} />
                <meshBasicMaterial transparent opacity={0.5} color="red" />
            </mesh>

            {/* Visual Indicator (Drifting HTML Label) */}
            <Html center distanceFactor={10} zIndexRange={[100, 0]}>
                <div
                    className={`
                        pointer-events-none transition-all duration-200 flex flex-col items-center
                        ${selected ? 'scale-110 z-50' : ''}
                    `}
                    style={{
                        opacity: opacity,
                        transform: `scale(${scale * 1.5})` // Global 1.5x Base Scale
                    }}
                >
                    {/* The Bracket/Target Reticle (Doubled Size + Thick Borders) */}
                    <div className="relative flex items-center justify-center w-16 h-16">
                        {/* TL Corner */}
                        <div className="absolute top-0 left-0 w-4 h-4 border-l-4 border-t-4" style={{ borderColor: color }} />
                        {/* TR Corner */}
                        <div className="absolute top-0 right-0 w-4 h-4 border-r-4 border-t-4" style={{ borderColor: color }} />
                        {/* BL Corner */}
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-l-4 border-b-4" style={{ borderColor: color }} />
                        {/* BR Corner */}
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-r-4 border-b-4" style={{ borderColor: color }} />

                        {/* Center Dot */}
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                    </div>

                    {/* Label (Larger Font) */}
                    {(hovered || selected) && (
                        <div className="mt-2 px-3 py-1 bg-black/80 border border-white/10 backdrop-blur rounded text-xs font-mono font-bold text-white whitespace-nowrap shadow-lg">
                            {type.toUpperCase()}: <span style={{ color }}>{label}</span>
                        </div>
                    )}
                </div>
            </Html>

            {/* Connecting Line to model (optional aesthetic) */}
            {(hovered || selected) && (
                <mesh position={[0, -0.5, 0]}>
                    <cylinderGeometry args={[0.02, 0.02, 1, 4]} />
                    <meshBasicMaterial color={color} transparent opacity={0.4} />
                </mesh>
            )}
        </group>
    );
}
